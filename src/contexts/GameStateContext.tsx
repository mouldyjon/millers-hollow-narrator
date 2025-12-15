import { useContext, type ReactNode } from "react";
import { useGameState } from "../hooks/useGameState";
import { GameStateContext } from "./createGameStateContext";

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
// eslint-disable-next-line react-refresh/only-export-components
export const useGameContext = () => {
  const context = useContext(GameStateContext);

  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameStateProvider");
  }

  return context;
};
