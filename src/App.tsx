import { useState } from "react";
import { GameStateProvider, useGameContext } from "./contexts/GameStateContext";
import { SetupScreen } from "./components/SetupScreen";
import { RoleSelfSelectionPhase } from "./components/RoleSelfSelectionPhase";
import { NightPhase } from "./components/NightPhase";
import { DawnPhase } from "./components/DawnPhase";
import { DayPhase } from "./components/DayPhase";
import { PhaseTransition } from "./components/PhaseTransition";

function AppContent() {
  const {
    gameState,
    startGame,
    startNightFromRoleAssignment,
    startDawn,
    startDay,
    startNight,
    resetGame,
  } = useGameContext();

  // Note: All phase components now get their functions from context directly
  // AppContent only needs phase transition functions

  const [transitionType, setTransitionType] = useState<"night" | "dawn" | null>(
    null,
  );

  // Wrapper functions to trigger transitions
  const handleStartGame = () => {
    // Special case: starting from setup
    // Check auto-narrator mode BEFORE calling startGame (state is current)
    const isAutoNarrator = gameState.setup.autoNarratorMode || false;

    startGame();

    // If NOT auto-narrator mode, show transition to night
    // (Auto-narrator mode goes to role-assignment with no transition)
    if (!isAutoNarrator) {
      setTransitionType("night");
    }
  };

  const handleRoleAssignmentComplete = () => {
    // Transition from role-assignment to night
    startNightFromRoleAssignment();
    setTransitionType("night");
  };

  const handleStartDawn = () => {
    setTransitionType("dawn");
  };

  const handleStartDay = () => {
    // No transition for dawn->day, just change phase directly
    startDay();
  };

  const handleStartNight = () => {
    setTransitionType("night");
  };

  // Called when transition animation completes
  const handleTransitionComplete = () => {
    // Only change phase if we're not already in the target phase (for setup->night case)
    if (transitionType === "dawn" && gameState.phase !== "dawn") {
      startDawn();
    } else if (transitionType === "night" && gameState.phase !== "night") {
      startNight();
    }
    setTransitionType(null);
  };

  return (
    <>
      {gameState.phase === "setup" && (
        <SetupScreen onStartGame={handleStartGame} />
      )}

      {/* Role Assignment Phase (auto-narrator only) */}
      {gameState.phase === "role-assignment" && (
        <RoleSelfSelectionPhase onComplete={handleRoleAssignmentComplete} />
      )}

      {gameState.phase === "night" && (
        <NightPhase onEndNight={handleStartDawn} />
      )}

      {gameState.phase === "dawn" && <DawnPhase onStartDay={handleStartDay} />}

      {gameState.phase === "day" && (
        <DayPhase onStartNight={handleStartNight} />
      )}

      {/* Floating Reset Button */}
      {gameState.phase !== "setup" && (
        <button
          onClick={resetGame}
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg z-40"
        >
          Reset Game
        </button>
      )}

      {/* Phase Transition Overlay */}
      {transitionType && (
        <PhaseTransition
          type={transitionType}
          onComplete={handleTransitionComplete}
        />
      )}
    </>
  );
}

function App() {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}

export default App;
