import type { GameState, RoleId } from "../types/game";
import { checkWinCondition as checkWinConditionPure } from "../logic/winConditions";
import { checkEliminationConsequences as checkEliminationConsequencesPure } from "../logic/eliminationConsequences";
import {
  useGamePersistence,
  loadCachedPlayerNames,
} from "./useGamePersistence";
import { usePlayerManager } from "./usePlayerManager";
import { useNightActions } from "./useNightActions";
import { useRoleManager } from "./useRoleManager";

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

export const useGameState = () => {
  const [gameState, setGameState] = useGamePersistence(initialGameState);

  // Player management operations
  const playerManager = usePlayerManager(gameState, setGameState);

  // Night action operations
  const nightActions = useNightActions(gameState, setGameState);

  // Role management operations
  const roleManager = useRoleManager(gameState, setGameState);

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
    // Note: State will be automatically saved to localStorage by useGamePersistence
  };

  const setPhase = (phase: "setup" | "night" | "day" | "ended") => {
    setGameState((prev) => ({
      ...prev,
      phase,
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
    // Player management (from usePlayerManager)
    setPlayerCount: playerManager.setPlayerCount,
    setPlayerName: playerManager.setPlayerName,
    setPlayerAssignedRole: playerManager.setPlayerAssignedRole,
    togglePlayerAlive: playerManager.togglePlayerAlive,
    updatePlayerNotes: playerManager.updatePlayerNotes,
    setPlayerRevealedRole: playerManager.setPlayerRevealedRole,
    setPlayerWolfHoundTeam: playerManager.setPlayerWolfHoundTeam,
    setPlayerPrejudicedManipulatorGroup:
      playerManager.setPlayerPrejudicedManipulatorGroup,
    // Role management (from useRoleManager)
    toggleRole: roleManager.toggleRole,
    removeRole: roleManager.removeRole,
    setSelectedRoles: roleManager.setSelectedRoles,
    setUnusedRoles: roleManager.setUnusedRoles,
    // Phase management
    startGame,
    startDawn,
    startDay,
    startNight,
    nextNightStep,
    setPhase,
    resetGame,
    // Night actions (from useNightActions)
    useWitchHealingPotion: nightActions.useWitchHealingPotion,
    useWitchDeathPotion: nightActions.useWitchDeathPotion,
    useCursedWolfFatherInfection: nightActions.useCursedWolfFatherInfection,
    setCupidLovers: nightActions.setCupidLovers,
    setWildChildRoleModel: nightActions.setWildChildRoleModel,
    setWolfHoundTeam: nightActions.setWolfHoundTeam,
    selectWerewolfVictim: nightActions.selectWerewolfVictim,
    setThiefChosenRole: nightActions.setThiefChosenRole,
    setSheriff: nightActions.setSheriff,
    useStutteringJudgeDoubleVote: nightActions.useStutteringJudgeDoubleVote,
    toggleActionComplete: nightActions.toggleActionComplete,
    setPrejudicedManipulatorTargetGroup,
    // Events and game logic
    addGameEvent,
    clearPendingRoleReveals,
    checkEliminationConsequences,
    checkWinCondition,
  };
};
