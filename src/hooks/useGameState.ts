import { useState, useEffect } from "react";
import type { GameState, RoleId } from "../types/game";
import { checkWinCondition as checkWinConditionPure } from "../logic/winConditions";
import { checkEliminationConsequences as checkEliminationConsequencesPure } from "../logic/eliminationConsequences";
import {
  calculateTotalSlots,
  getRoleSlotCount,
} from "../logic/roleSlotCalculations";

const STORAGE_KEY = "millers-hollow-game-state";
const PLAYER_NAMES_CACHE_KEY = "millers-hollow-player-names-cache";

// Load cached player names
const loadCachedPlayerNames = (): Record<number, string> => {
  try {
    const cached = localStorage.getItem(PLAYER_NAMES_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("Failed to load cached player names:", error);
  }
  return {};
};

// Save player names to cache
const saveCachedPlayerNames = (
  players: { number: number; name?: string }[],
) => {
  try {
    const nameCache: Record<number, string> = {};
    players.forEach((player) => {
      if (player.name && player.name.trim()) {
        nameCache[player.number] = player.name;
      }
    });
    localStorage.setItem(PLAYER_NAMES_CACHE_KEY, JSON.stringify(nameCache));
  } catch (error) {
    console.error("Failed to save cached player names:", error);
  }
};

const createInitialPlayers = (count: number, useCachedNames = false) => {
  const cachedNames = useCachedNames ? loadCachedPlayerNames() : {};
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    isAlive: true,
    revealedRole: undefined,
    notes: undefined,
    name: cachedNames[i + 1],
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
    setGameState((prev) => {
      // Preserve existing player names when changing count
      const newPlayers = createInitialPlayers(count);
      const existingPlayers = prev.players;

      // Copy names from existing players where available
      return {
        ...prev,
        setup: {
          ...prev.setup,
          playerCount: count,
        },
        players: newPlayers.map((newPlayer) => {
          const existingPlayer = existingPlayers.find(
            (p) => p.number === newPlayer.number,
          );
          return existingPlayer
            ? { ...newPlayer, name: existingPlayer.name }
            : newPlayer;
        }),
      };
    });
  };

  const setPlayerName = (playerNumber: number, name: string) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.number === playerNumber
          ? { ...p, name: name.trim() || undefined }
          : p,
      );

      // Save to player names cache
      saveCachedPlayerNames(updatedPlayers);

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  const setPlayerAssignedRole = (
    playerNumber: number,
    roleId: RoleId | undefined,
  ) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber ? { ...p, assignedRole: roleId } : p,
      ),
    }));
  };

  const toggleRole = (roleId: RoleId) => {
    setGameState((prev) => {
      // Roles that can have multiple instances
      const multiSelectRoles: RoleId[] = ["villager", "simple-werewolf"];

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
          const newRoleSlots = getRoleSlotCount(roleId);
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

  const setUnusedRoles = (
    role1: RoleId | undefined,
    role2: RoleId | undefined,
  ) => {
    setGameState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        unusedRoles: role1 && role2 ? [role1, role2] : undefined,
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

  const useStutteringJudgeDoubleVote = () => {
    setGameState((prev) => ({
      ...prev,
      nightState: {
        ...prev.nightState,
        stutteringJudgeDoubleVoteUsed: true,
      },
    }));
  };

  const setPlayerPrejudicedManipulatorGroup = (
    playerNumber: number,
    group: "A" | "B" | undefined,
  ) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber
          ? { ...p, prejudicedManipulatorGroup: group }
          : p,
      ),
    }));
  };

  const setPrejudicedManipulatorTargetGroup = (group: "A" | "B") => {
    setGameState((prev) => ({
      ...prev,
      prejudicedManipulatorTargetGroup: group,
    }));
  };

  const resetGame = () => {
    // Create new game state with cached player names
    const newGameState = {
      ...initialGameState,
      players: createInitialPlayers(initialGameState.setup.playerCount, true),
    };
    setGameState(newGameState);
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

  const setThiefChosenRole = (roleId: RoleId | null) => {
    setGameState((prev) => {
      const thiefPlayer = prev.players.find((p) => p.assignedRole === "thief");

      if (!thiefPlayer) {
        return prev;
      }

      // Update both assigned and actual role
      const newRole = roleId || "thief";
      const updatedPlayers = prev.players.map((p) =>
        p.number === thiefPlayer.number
          ? { ...p, assignedRole: newRole, actualRole: newRole }
          : p,
      );

      return {
        ...prev,
        thiefChosenRole: roleId || undefined,
        players: updatedPlayers,
      };
    });
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
  ) => {
    return checkEliminationConsequencesPure(gameState, playerNumber, roleId);
  };

  const checkWinCondition = () => {
    return checkWinConditionPure(gameState);
  };

  return {
    gameState,
    setPlayerCount,
    setPlayerName,
    setPlayerAssignedRole,
    toggleRole,
    removeRole,
    setSelectedRoles,
    setUnusedRoles,
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
    useStutteringJudgeDoubleVote,
    setPlayerPrejudicedManipulatorGroup,
    setPrejudicedManipulatorTargetGroup,
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
