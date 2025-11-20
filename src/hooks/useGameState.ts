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
      const selectedRoles = prev.setup.selectedRoles.includes(roleId)
        ? prev.setup.selectedRoles.filter((id) => id !== roleId)
        : [...prev.setup.selectedRoles, roleId];

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

  const setPlayerRevealedRole = (playerNumber: number, role: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.number === playerNumber ? { ...p, revealedRole: role } : p,
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

  return {
    gameState,
    setPlayerCount,
    toggleRole,
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
  };
};
