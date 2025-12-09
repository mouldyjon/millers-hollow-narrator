import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import type { GameState } from "../types/game";

const STORAGE_KEY = "millers-hollow-game-state";
const PLAYER_NAMES_CACHE_KEY = "millers-hollow-player-names-cache";

/**
 * Load cached player names from localStorage
 */
export const loadCachedPlayerNames = (): Record<number, string> => {
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

/**
 * Save player names to localStorage cache
 */
export const saveCachedPlayerNames = (
  players: { number: number; name?: string }[],
): void => {
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

/**
 * Load saved game state from localStorage
 */
const loadSavedState = (initialState: GameState): GameState => {
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
  return initialState;
};

/**
 * Hook that manages game state persistence to localStorage
 * Automatically saves state on every change and loads on mount
 */
export const useGamePersistence = (
  initialState: GameState,
): [GameState, Dispatch<SetStateAction<GameState>>] => {
  const [state, setState] = useState<GameState>(() =>
    loadSavedState(initialState),
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  }, [state]);

  return [state, setState];
};
