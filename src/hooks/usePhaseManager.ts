import type { Dispatch, SetStateAction } from "react";
import type { GameState } from "../types/game";

/**
 * Hook that provides game phase and flow management operations
 * Handles transitions between setup, night, dawn, day, and ended phases
 */
export const usePhaseManager = (
  _gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
) => {
  const startGame = () => {
    setGameState((prev) => {
      // Check if auto-narrator mode is enabled
      const isAutoNarrator = prev.setup.autoNarratorMode || false;

      if (isAutoNarrator) {
        // Transition to role assignment phase first
        return {
          ...prev,
          phase: "role-assignment",
        };
      } else {
        // Traditional flow: go directly to night
        return {
          ...prev,
          phase: "night",
          nightState: {
            ...prev.nightState,
            currentNightNumber: 1,
          },
        };
      }
    });
  };

  const startNightFromRoleAssignment = () => {
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
      dayState: {
        ...prev.dayState,
        currentDayNumber: prev.dayState.currentDayNumber + 1,
        votingInProgress: false,
        discussionTimerActive: false,
      },
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
      dayState: {
        ...prev.dayState,
        votingInProgress: false,
        discussionTimerActive: false,
      },
    }));
  };

  const nextNightStep = () => {
    setGameState((prev) => ({
      ...prev,
      currentNightStep: prev.currentNightStep + 1,
    }));
  };

  const setPhase = (phase: "setup" | "night" | "day" | "ended") => {
    setGameState((prev) => ({
      ...prev,
      phase,
    }));
  };

  const setPrejudicedManipulatorTargetGroup = (group: "A" | "B") => {
    setGameState((prev) => ({
      ...prev,
      prejudicedManipulatorTargetGroup: group,
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

  return {
    startGame,
    startNightFromRoleAssignment,
    startDawn,
    startDay,
    startNight,
    nextNightStep,
    setPhase,
    setPrejudicedManipulatorTargetGroup,
    addGameEvent,
    clearPendingRoleReveals,
  };
};
