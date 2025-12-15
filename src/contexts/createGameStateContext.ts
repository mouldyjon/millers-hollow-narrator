import { createContext } from "react";
import type { useGameState } from "../hooks/useGameState";

// Create the context type based on the return type of useGameState
export type GameStateContextType = ReturnType<typeof useGameState>;

// Create the context with undefined as default (will be provided by the provider)
export const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined,
);
