import { useState } from "react";
import type { GameState, RoleId } from "../types/game";

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
    cursedWolfFatherInfectionUsed: false,
    stutteringJudgeDoubleVoteUsed: false,
    currentNightNumber: 0,
    whiteWerewolfNight: false,
    completedActions: {},
  },
  players: createInitialPlayers(8),
  eliminatedPlayers: [],
  currentNightStep: 0,
  gameEvents: [],
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

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
        if (currentTotalSlots >= prev.setup.playerCount) {
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
        whiteWerewolfNight: prev.nightState.currentNightNumber % 2 === 0,
      },
    }));
  };

  const nextNightStep = () => {
    setGameState((prev) => ({
      ...prev,
      currentNightStep: prev.currentNightStep + 1,
    }));
  };

  const useWitchHealingPotion = () => {
    setGameState((prev) => ({
      ...prev,
      nightState: {
        ...prev.nightState,
        witchHealingPotionUsed: true,
      },
    }));
  };

  const useWitchDeathPotion = () => {
    setGameState((prev) => ({
      ...prev,
      nightState: {
        ...prev.nightState,
        witchDeathPotionUsed: true,
      },
    }));
  };

  const useCursedWolfFatherInfection = () => {
    setGameState((prev) => ({
      ...prev,
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

  const setWolfHoundTeam = (team: "village" | "werewolf") => {
    setGameState((prev) => ({
      ...prev,
      wolfHoundTeam: team,
    }));
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
    if (
      state.cupidLovers &&
      state.cupidLovers.includes(playerNumber as 1 | 2)
    ) {
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

  return {
    gameState,
    setPlayerCount,
    toggleRole,
    removeRole,
    setSelectedRoles,
    startGame,
    startDay,
    startNight,
    nextNightStep,
    useWitchHealingPotion,
    useWitchDeathPotion,
    useCursedWolfFatherInfection,
    setCupidLovers,
    setWildChildRoleModel,
    setWolfHoundTeam,
    setThiefChosenRole,
    setSheriff,
    resetGame,
    setPhase,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    addGameEvent,
    toggleActionComplete,
    checkEliminationConsequences,
  };
};
