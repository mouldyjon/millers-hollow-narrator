import { useGameState } from "./hooks/useGameState";
import { SetupScreen } from "./components/SetupScreen";
import { NightPhase } from "./components/NightPhase";
import { DawnPhase } from "./components/DawnPhase";
import { DayPhase } from "./components/DayPhase";

function App() {
  const {
    gameState,
    setPlayerCount,
    toggleRole,
    removeRole,
    setSelectedRoles,
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
    addGameEvent,
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
          onSetRoles={setSelectedRoles}
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
          cupidLovers={gameState.cupidLovers}
          wildChildRoleModel={gameState.wildChildRoleModel}
          onNextStep={nextNightStep}
          onEndNight={startDawn}
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
          onStartDay={startDay}
          onSetPlayerRevealedRole={setPlayerRevealedRole}
          onTogglePlayerAlive={togglePlayerAlive}
          onClearPendingReveals={clearPendingRoleReveals}
          onCheckEliminationConsequences={checkEliminationConsequences}
          onAddGameEvent={addGameEvent}
        />
      )}

      {gameState.phase === "day" && (
        <DayPhase
          selectedRoles={gameState.setup.selectedRoles}
          players={gameState.players}
          gameEvents={gameState.gameEvents}
          onStartNight={startNight}
          onTogglePlayerAlive={togglePlayerAlive}
          onUpdatePlayerNotes={updatePlayerNotes}
          onSetPlayerRevealedRole={setPlayerRevealedRole}
          onSetPlayerWolfHoundTeam={setPlayerWolfHoundTeam}
          onCheckEliminationConsequences={checkEliminationConsequences}
          onAddGameEvent={addGameEvent}
        />
      )}

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
