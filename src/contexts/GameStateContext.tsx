import { createContext, useContext, type ReactNode } from "react";
import { useGameState } from "../hooks/useGameState";

// Create the context type based on the return type of useGameState
type GameStateContextType = ReturnType<typeof useGameState>;

// Create the context with undefined as default (will be provided by the provider)
const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined,
);

// Provider component that wraps the app and provides game state to all children
interface GameStateProviderProps {
  children: ReactNode;
}

export const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const gameState = useGameState();

  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to consume the game state context
export const useGameContext = () => {
  const context = useContext(GameStateContext);

  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameStateProvider");
  }

  return context;
};
