import type { Dispatch, SetStateAction } from "react";
import type { GameState, RoleId } from "../types/game";

/**
 * Hook that provides night phase action operations
 * Handles all role-specific night actions and state mutations
 */
export const useNightActions = (
  _gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
) => {
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

  const setWolfHoundTeam = (team: "village" | "werewolf") => {
    setGameState((prev) => ({
      ...prev,
      wolfHoundTeam: team,
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

  return {
    useWitchHealingPotion,
    useWitchDeathPotion,
    useCursedWolfFatherInfection,
    setCupidLovers,
    setWildChildRoleModel,
    setSheriff,
    useStutteringJudgeDoubleVote,
    setWolfHoundTeam,
    selectWerewolfVictim,
    setThiefChosenRole,
    toggleActionComplete,
  };
};
