import type { Dispatch, SetStateAction } from "react";
import type { GameState, RoleId } from "../types/game";
import { saveCachedPlayerNames } from "./useGamePersistence";

/**
 * Hook that provides player management operations
 * Handles all player-related state mutations
 */
export const usePlayerManager = (
  _gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
) => {
  const setPlayerCount = (count: number) => {
    setGameState((prev) => {
      // Preserve existing player names when changing count
      const createInitialPlayers = (playerCount: number) => {
        return Array.from({ length: playerCount }, (_, i) => ({
          number: i + 1,
          isAlive: true,
          revealedRole: undefined,
          notes: undefined,
          name: undefined,
        }));
      };

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

  return {
    setPlayerCount,
    setPlayerName,
    setPlayerAssignedRole,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    setPlayerWolfHoundTeam,
    setPlayerPrejudicedManipulatorGroup,
  };
};
