import { useState, useEffect } from "react";
import type { GameState, RoleId } from "../types/game";
import { roles } from "../data/roles";

const STORAGE_KEY = "millers-hollow-game-state";

const createInitialPlayers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    isAlive: true,
    revealedRole: undefined,
    notes: undefined,
  }));
};

const initialGameState: GameState = {
  setup: {
    playerCount: 8,
    selectedRoles: [],
  },
  phase: "setup",
  nightState: {
    witchHealingPotionUsed: false,
    witchDeathPotionUsed: false,
    witchPotionUsedThisNight: false,
    cursedWolfFatherInfectionUsed: false,
    stutteringJudgeDoubleVoteUsed: false,
    currentNightNumber: 0,
    whiteWerewolfNight: false,
    completedActions: {},
    werewolfVictimSelectedThisNight: false,
    bigBadWolfVictimSelectedThisNight: false,
    whiteWerewolfVictimSelectedThisNight: false,
  },
  players: createInitialPlayers(8),
  eliminatedPlayers: [],
  pendingRoleReveals: [],
  currentNightStep: 0,
  gameEvents: [],
};

// Load saved state from localStorage
const loadSavedState = (): GameState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Restore Date objects for gameEvents
      if (parsed.gameEvents) {
        parsed.gameEvents = parsed.gameEvents.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
  return initialGameState;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(loadSavedState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  }, [gameState]);

  const setPlayerCount = (count: number) => {
    setGameState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        playerCount: count,
      },
      players: createInitialPlayers(count),
    }));
  };

  const toggleRole = (roleId: RoleId) => {
    setGameState((prev) => {
      // Roles that can have multiple instances
      const multiSelectRoles: RoleId[] = ["villager", "simple-werewolf"];

      // Helper to calculate total role slots
      const getRoleSlots = (roleId: RoleId): number => {
        if (roleId === "two-sisters") return 2;
        if (roleId === "three-brothers") return 3;
        return 1;
      };

      const calculateTotalSlots = (roles: RoleId[]): number => {
        return roles.reduce((sum, id) => sum + getRoleSlots(id), 0);
      };

      if (multiSelectRoles.includes(roleId)) {
        // Check current count of this role
        const currentCount = prev.setup.selectedRoles.filter(
          (id) => id === roleId,
        ).length;

        // Check maximum limits
        const maxLimits: Record<string, number> = {
          villager: 9,
          "simple-werewolf": 4,
        };
        const maxLimit = maxLimits[roleId];

        if (maxLimit && currentCount >= maxLimit) {
          // Already at maximum, don't add more
          return prev;
        }

        // Check if adding this role would exceed player count
        const currentTotalSlots = calculateTotalSlots(prev.setup.selectedRoles);
        if (currentTotalSlots + 1 > prev.setup.playerCount) {
          // Would exceed player count
          return prev;
        }

        // For multi-select roles, add another instance
        const selectedRoles = [...prev.setup.selectedRoles, roleId];
        return {
          ...prev,
          setup: {
            ...prev.setup,
            selectedRoles,
          },
        };
      } else {
        // For single-instance roles, toggle on/off
        const isCurrentlySelected = prev.setup.selectedRoles.includes(roleId);

        if (isCurrentlySelected) {
          // Remove the role
          const selectedRoles = prev.setup.selectedRoles.filter(
            (id) => id !== roleId,
          );
          return {
            ...prev,
            setup: {
              ...prev.setup,
              selectedRoles,
            },
          };
        } else {
          // Check if adding this role would exceed player count
          const currentTotalSlots = calculateTotalSlots(
            prev.setup.selectedRoles,
          );
          const newRoleSlots = getRoleSlots(roleId);
          if (currentTotalSlots + newRoleSlots > prev.setup.playerCount) {
            // Would exceed player count
            return prev;
          }

          // Add the role
          const selectedRoles = [...prev.setup.selectedRoles, roleId];
          return {
            ...prev,
            setup: {
              ...prev.setup,
              selectedRoles,
            },
          };
        }
      }
    });
  };

  const removeRole = (roleId: RoleId, index?: number) => {
    setGameState((prev) => {
      let selectedRoles;
      if (index !== undefined) {
        // Remove specific instance at index
        selectedRoles = prev.setup.selectedRoles.filter((_, i) => i !== index);
      } else {
        // Remove first instance of this role
        const roleIndex = prev.setup.selectedRoles.indexOf(roleId);
        if (roleIndex >= 0) {
          selectedRoles = prev.setup.selectedRoles.filter(
            (_, i) => i !== roleIndex,
          );
        } else {
          selectedRoles = prev.setup.selectedRoles;
        }
      }

      return {
        ...prev,
        setup: {
          ...prev.setup,
          selectedRoles,
        },
      };
    });
  };

  const setSelectedRoles = (roles: RoleId[]) => {
    setGameState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        selectedRoles: roles,
      },
    }));
  };

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "night",
      nightState: {
        ...prev.nightState,
        currentNightNumber: 1,
      },
    }));
  };

  const startDawn = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "dawn",
    }));
  };

  const startDay = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "day",
    }));
  };

  const startNight = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "night",
      currentNightStep: 0,
      nightState: {
        ...prev.nightState,
        currentNightNumber: prev.nightState.currentNightNumber + 1,
        whiteWerewolfNight: (prev.nightState.currentNightNumber + 1) % 2 === 0,
        witchPotionUsedThisNight: false, // Reset per-night flag
        werewolfVictimSelectedThisNight: false,
        bigBadWolfVictimSelectedThisNight: false,
        whiteWerewolfVictimSelectedThisNight: false,
      },
    }));
  };

  const nextNightStep = () => {
    setGameState((prev) => ({
      ...prev,
      currentNightStep: prev.currentNightStep + 1,
    }));
  };

  const useWitchHealingPotion = (playerNumber: number) => {
    setGameState((prev) => {
      // Revive the player
      const updatedPlayers = prev.players.map((p) =>
        p.number === playerNumber ? { ...p, isAlive: true } : p,
      );

      // Remove from pending role reveals since they're not dead anymore
      const pendingRoleReveals = prev.pendingRoleReveals.filter(
        (p) => p !== playerNumber,
      );

      return {
        ...prev,
        players: updatedPlayers,
        pendingRoleReveals,
        nightState: {
          ...prev.nightState,
          witchHealingPotionUsed: true,
          witchPotionUsedThisNight: true,
        },
      };
    });
  };

  const useWitchDeathPotion = (playerNumber: number) => {
    setGameState((prev) => {
      // Kill the player
      const updatedPlayers = prev.players.map((p) =>
        p.number === playerNumber ? { ...p, isAlive: false } : p,
      );

      // Add to pending role reveals
      const pendingRoleReveals = prev.pendingRoleReveals.includes(playerNumber)
        ? prev.pendingRoleReveals
        : [...prev.pendingRoleReveals, playerNumber];

      return {
        ...prev,
        players: updatedPlayers,
        pendingRoleReveals,
        nightState: {
          ...prev.nightState,
          witchDeathPotionUsed: true,
          witchPotionUsedThisNight: true,
        },
      };
    });
  };

  const useCursedWolfFatherInfection = (playerNumber: number) => {
    setGameState((prev) => ({
      ...prev,
      cursedWolfFatherInfectedPlayer: playerNumber,
      nightState: {
        ...prev.nightState,
        cursedWolfFatherInfectionUsed: true,
      },
    }));
  };

  const setCupidLovers = (lover1: number, lover2: number) => {
    setGameState((prev) => ({
      ...prev,
      cupidLovers: [lover1, lover2],
    }));
  };

  const setWildChildRoleModel = (playerNumber: number) => {
    setGameState((prev) => ({
      ...prev,
      wildChildRoleModel: playerNumber,
    }));
  };

  const setSheriff = (playerNumber: number) => {
    setGameState((prev) => ({
      ...prev,
      sheriff: playerNumber,
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const setPhase = (phase: "setup" | "night" | "day" | "ended") => {
    setGameState((prev) => ({
      ...prev,
      phase,
    }));
  };

  const togglePlayerAlive = (playerNumber: number) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber ? { ...p, isAlive: !p.isAlive } : p,
      ),
    }));
  };

  const updatePlayerNotes = (playerNumber: number, notes: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber ? { ...p, notes } : p,
      ),
    }));
  };

  const setPlayerRevealedRole = (
    playerNumber: number,
    role: string,
    roleId?: RoleId,
  ) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber
          ? { ...p, revealedRole: role, actualRole: roleId }
          : p,
      ),
    }));
  };

  const addGameEvent = (
    type: "elimination" | "role_action" | "day_vote" | "special",
    description: string,
  ) => {
    setGameState((prev) => ({
      ...prev,
      gameEvents: [
        ...prev.gameEvents,
        {
          night: prev.nightState.currentNightNumber,
          type,
          description,
          timestamp: new Date(),
        },
      ],
    }));
  };

  const clearPendingRoleReveals = () => {
    setGameState((prev) => ({
      ...prev,
      pendingRoleReveals: [],
    }));
  };

  const setWolfHoundTeam = (team: "village" | "werewolf") => {
    setGameState((prev) => ({
      ...prev,
      wolfHoundTeam: team,
    }));
  };

  const setPlayerWolfHoundTeam = (
    playerNumber: number,
    team: "village" | "werewolf",
  ) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber ? { ...p, wolfHoundTeam: team } : p,
      ),
    }));
  };

  const selectWerewolfVictim = (
    playerNumber: number,
    werewolfType: "simple" | "big-bad" | "white",
  ) => {
    setGameState((prev) => {
      // Mark player as dead
      const updatedPlayers = prev.players.map((p) =>
        p.number === playerNumber ? { ...p, isAlive: false } : p,
      );

      // Add to pending role reveals (will be revealed at dawn)
      const pendingRoleReveals = prev.pendingRoleReveals.includes(playerNumber)
        ? prev.pendingRoleReveals
        : [...prev.pendingRoleReveals, playerNumber];

      // Set the appropriate flag based on werewolf type
      const flagUpdates = {
        simple: { werewolfVictimSelectedThisNight: true },
        "big-bad": { bigBadWolfVictimSelectedThisNight: true },
        white: { whiteWerewolfVictimSelectedThisNight: true },
      };

      return {
        ...prev,
        players: updatedPlayers,
        pendingRoleReveals,
        nightState: {
          ...prev.nightState,
          ...flagUpdates[werewolfType],
        },
      };
    });
  };

  const setThiefChosenRole = (roleId: RoleId) => {
    setGameState((prev) => ({
      ...prev,
      thiefChosenRole: roleId,
    }));
  };

  const toggleActionComplete = (roleId: RoleId, stepIndex: number) => {
    setGameState((prev) => {
      const key = `${roleId}-${prev.nightState.currentNightNumber}`;
      const currentActions = prev.nightState.completedActions[key] || [];
      const newActions = [...currentActions];
      newActions[stepIndex] = !newActions[stepIndex];

      return {
        ...prev,
        nightState: {
          ...prev.nightState,
          completedActions: {
            ...prev.nightState.completedActions,
            [key]: newActions,
          },
        },
      };
    });
  };

  const checkEliminationConsequences = (
    playerNumber: number,
    roleId?: RoleId,
  ): {
    type:
      | "none"
      | "lovers"
      | "knight-rusty-sword"
      | "hunter"
      | "siblings"
      | "wild-child-transform";
    affectedPlayers: number[];
    message: string;
    requiresPlayerSelection: boolean;
  } => {
    const state = gameState;

    // Check if eliminated player is a lover
    if (state.cupidLovers && state.cupidLovers.includes(playerNumber)) {
      const otherLover = state.cupidLovers.find((p) => p !== playerNumber);
      if (otherLover) {
        const otherPlayer = state.players.find((p) => p.number === otherLover);
        if (otherPlayer?.isAlive) {
          return {
            type: "lovers",
            affectedPlayers: [otherLover],
            message: `Player ${otherLover} was in love with Player ${playerNumber} and dies of heartbreak!`,
            requiresPlayerSelection: false,
          };
        }
      }
    }

    // Check if eliminated player is Wild Child's role model
    if (state.wildChildRoleModel === playerNumber) {
      const wildChild = state.players.find(
        (p) => p.actualRole === "wild-child" && p.isAlive,
      );
      if (wildChild) {
        return {
          type: "wild-child-transform",
          affectedPlayers: [wildChild.number],
          message: `Player ${wildChild.number} (Wild Child) loses their role model and transforms into a werewolf!`,
          requiresPlayerSelection: false,
        };
      }
    }

    // Check role-specific consequences
    if (roleId === "knight-rusty-sword") {
      // Find right-hand neighbour (next player number, wrapping around)
      const rightNeighbour =
        playerNumber === state.setup.playerCount ? 1 : playerNumber + 1;
      const neighbour = state.players.find((p) => p.number === rightNeighbour);
      if (neighbour?.isAlive) {
        return {
          type: "knight-rusty-sword",
          affectedPlayers: [rightNeighbour],
          message: `The Knight's rusty sword breaks and strikes Player ${rightNeighbour} (right-hand neighbour)!`,
          requiresPlayerSelection: false,
        };
      }
    }

    if (roleId === "hunter") {
      const alivePlayers = state.players
        .filter((p) => p.isAlive && p.number !== playerNumber)
        .map((p) => p.number);
      if (alivePlayers.length > 0) {
        return {
          type: "hunter",
          affectedPlayers: [],
          message: `The Hunter fires their dying shot! Choose who to eliminate:`,
          requiresPlayerSelection: true,
        };
      }
    }

    // Check for siblings (informational only)
    if (roleId === "two-sisters" || roleId === "three-brothers") {
      const siblingsAlive = state.players.filter(
        (p) =>
          p.actualRole === roleId && p.isAlive && p.number !== playerNumber,
      );
      if (siblingsAlive.length > 0) {
        const siblingNumbers = siblingsAlive.map((p) => p.number);
        const siblingWord = roleId === "two-sisters" ? "sister" : "brother";
        return {
          type: "siblings",
          affectedPlayers: siblingNumbers,
          message: `Player ${playerNumber}'s ${siblingWord}(s) (${siblingNumbers.join(", ")}) should be informed of this death.`,
          requiresPlayerSelection: false,
        };
      }
    }

    return {
      type: "none",
      affectedPlayers: [],
      message: "",
      requiresPlayerSelection: false,
    };
  };

  const checkWinCondition = (): {
    hasWinner: boolean;
    winner?: "village" | "werewolves" | "solo";
    message?: string;
  } => {
    // Count total werewolf and village roles in the game
    let totalWerewolves = 0;
    let totalVillagers = 0;

    gameState.setup.selectedRoles.forEach((roleId) => {
      const roleData = roles[roleId];
      if (!roleData) return;

      let multiplier = 1;
      if (roleId === "two-sisters") multiplier = 2;
      if (roleId === "three-brothers") multiplier = 3;

      if (roleData.team === "werewolf") {
        totalWerewolves += multiplier;
      } else if (roleData.team === "village") {
        totalVillagers += multiplier;
      }
    });

    // Check if Wolf-Hound has chosen a team
    const wolfHoundPlayer = gameState.players.find(
      (p) => p.actualRole === "wolf-hound",
    );
    if (wolfHoundPlayer?.wolfHoundTeam) {
      // Wolf-Hound starts as village, so adjust counts based on their choice
      if (wolfHoundPlayer.wolfHoundTeam === "werewolf") {
        // They chose werewolves, so subtract from village and add to werewolves
        totalVillagers -= 1;
        totalWerewolves += 1;
      }
      // If they chose village, no adjustment needed as they're already counted as village
    }

    // If a player has been infected by Cursed Wolf-Father, they become a werewolf
    if (gameState.cursedWolfFatherInfectedPlayer) {
      totalWerewolves += 1;
      // The infected player was originally a villager, so subtract from villagers
      totalVillagers -= 1;
    }

    // Count revealed dead players by team
    let deadWerewolves = 0;
    let deadVillagers = 0;

    gameState.players.forEach((player) => {
      if (!player.isAlive && player.actualRole) {
        // Check if this player was infected by Cursed Wolf-Father
        if (player.number === gameState.cursedWolfFatherInfectedPlayer) {
          // They're now a werewolf regardless of their original role
          deadWerewolves++;
          return;
        }

        const roleData = roles[player.actualRole];
        if (!roleData) return;

        // Handle Wolf-Hound team choice
        if (player.actualRole === "wolf-hound" && player.wolfHoundTeam) {
          if (player.wolfHoundTeam === "werewolf") {
            deadWerewolves++;
          } else {
            deadVillagers++;
          }
          return;
        }

        if (roleData.team === "werewolf") {
          deadWerewolves++;
        } else if (roleData.team === "village") {
          deadVillagers++;
        }
      }
    });

    // Check win conditions
    // Village wins if all werewolves are dead (and at least one has been revealed)
    if (deadWerewolves > 0 && deadWerewolves >= totalWerewolves) {
      return {
        hasWinner: true,
        winner: "village",
        message: "All werewolves have been eliminated. The Village wins!",
      };
    }

    // Werewolves win if all villagers are dead (and at least one has been revealed)
    if (deadVillagers > 0 && deadVillagers >= totalVillagers) {
      return {
        hasWinner: true,
        winner: "werewolves",
        message: "All villagers have been eliminated. The Werewolves win!",
      };
    }

    // Note: Solo roles (like White Werewolf) have their own win conditions
    // For now, we'll just detect the main win conditions

    return { hasWinner: false };
  };

  return {
    gameState,
    setPlayerCount,
    toggleRole,
    removeRole,
    setSelectedRoles,
    startGame,
    startDawn,
    startDay,
    startNight,
    nextNightStep,
    useWitchHealingPotion,
    useWitchDeathPotion,
    useCursedWolfFatherInfection,
    setCupidLovers,
    setWildChildRoleModel,
    setWolfHoundTeam,
    setPlayerWolfHoundTeam,
    selectWerewolfVictim,
    setThiefChosenRole,
    setSheriff,
    resetGame,
    setPhase,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    addGameEvent,
    clearPendingRoleReveals,
    toggleActionComplete,
    checkEliminationConsequences,
    checkWinCondition,
  };
};
