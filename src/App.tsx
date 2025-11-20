import { useGameState } from "./hooks/useGameState";
import { SetupScreen } from "./components/SetupScreen";
import { NightPhase } from "./components/NightPhase";
import { DayPhase } from "./components/DayPhase";

function App() {
  const {
    gameState,
    setPlayerCount,
    toggleRole,
    removeRole,
    startGame,
    startDay,
    startNight,
    nextNightStep,
    useWitchHealingPotion,
    useWitchDeathPotion,
    useCursedWolfFatherInfection,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    resetGame,
  } = useGameState();

  return (
    <>
      {gameState.phase === "setup" && (
        <SetupScreen
          playerCount={gameState.setup.playerCount}
          selectedRoles={gameState.setup.selectedRoles}
          onPlayerCountChange={setPlayerCount}
          onToggleRole={toggleRole}
          onRemoveRole={removeRole}
          onStartGame={startGame}
        />
      )}

      {gameState.phase === "night" && (
        <NightPhase
          selectedRoles={gameState.setup.selectedRoles}
          nightState={gameState.nightState}
          currentNightStep={gameState.currentNightStep}
          players={gameState.players}
          gameEvents={gameState.gameEvents}
          onNextStep={nextNightStep}
          onEndNight={startDay}
          onUseWitchHealingPotion={useWitchHealingPotion}
          onUseWitchDeathPotion={useWitchDeathPotion}
          onUseCursedWolfFatherInfection={useCursedWolfFatherInfection}
          onTogglePlayerAlive={togglePlayerAlive}
          onUpdatePlayerNotes={updatePlayerNotes}
          onSetPlayerRevealedRole={setPlayerRevealedRole}
        />
      )}

      {gameState.phase === "day" && <DayPhase onStartNight={startNight} />}

      {/* Floating Reset Button */}
      {gameState.phase !== "setup" && (
        <button
          onClick={resetGame}
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
        >
          Reset Game
        </button>
      )}
    </>
  );
}

export default App;
