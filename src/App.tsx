import { useState } from "react";
import { GameStateProvider, useGameContext } from "./contexts/GameStateContext";
import { SetupScreen } from "./components/SetupScreen";
import { NightPhase } from "./components/NightPhase";
import { DawnPhase } from "./components/DawnPhase";
import { DayPhase } from "./components/DayPhase";
import { PhaseTransition } from "./components/PhaseTransition";

function AppContent() {
  const {
    gameState,
    startGame,
    startDawn,
    startDay,
    startNight,
    nextNightStep,
    useWitchHealingPotion,
    useWitchDeathPotion,
    useCursedWolfFatherInfection,
    setCupidLovers,
    setWildChildRoleModel,
    selectWerewolfVictim,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    setPlayerWolfHoundTeam,
    clearPendingRoleReveals,
    toggleActionComplete,
    checkEliminationConsequences,
    checkWinCondition,
    addGameEvent,
    resetGame,
  } = useGameContext();

  // Note: DayPhase now gets most functions from context directly
  // We only keep these in AppContent for NightPhase and DawnPhase (for now)

  const [transitionType, setTransitionType] = useState<"night" | "dawn" | null>(
    null,
  );

  // Wrapper functions to trigger transitions
  const handleStartGame = () => {
    // Special case: starting from setup, we need to change phase first
    startGame();
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

      {gameState.phase === "night" && (
        <NightPhase
          selectedRoles={gameState.setup.selectedRoles}
          nightState={gameState.nightState}
          currentNightStep={gameState.currentNightStep}
          players={gameState.players}
          gameEvents={gameState.gameEvents}
          cupidLovers={gameState.cupidLovers}
          wildChildRoleModel={gameState.wildChildRoleModel}
          cursedWolfFatherInfectedPlayer={
            gameState.cursedWolfFatherInfectedPlayer
          }
          onNextStep={nextNightStep}
          onEndNight={handleStartDawn}
          onUseWitchHealingPotion={useWitchHealingPotion}
          onUseWitchDeathPotion={useWitchDeathPotion}
          onUseCursedWolfFatherInfection={useCursedWolfFatherInfection}
          onSetCupidLovers={setCupidLovers}
          onSetWildChildRoleModel={setWildChildRoleModel}
          onSelectWerewolfVictim={selectWerewolfVictim}
          onTogglePlayerAlive={togglePlayerAlive}
          onUpdatePlayerNotes={updatePlayerNotes}
          onSetPlayerRevealedRole={setPlayerRevealedRole}
          onSetPlayerWolfHoundTeam={setPlayerWolfHoundTeam}
          onToggleActionComplete={toggleActionComplete}
          onCheckEliminationConsequences={checkEliminationConsequences}
          onAddGameEvent={addGameEvent}
        />
      )}

      {gameState.phase === "dawn" && (
        <DawnPhase
          selectedRoles={gameState.setup.selectedRoles}
          players={gameState.players}
          pendingRoleReveals={gameState.pendingRoleReveals}
          sheriff={gameState.sheriff}
          onStartDay={handleStartDay}
          onSetPlayerRevealedRole={setPlayerRevealedRole}
          onTogglePlayerAlive={togglePlayerAlive}
          onClearPendingReveals={clearPendingRoleReveals}
          onCheckEliminationConsequences={checkEliminationConsequences}
          onCheckWinCondition={checkWinCondition}
          onAddGameEvent={addGameEvent}
        />
      )}

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
