import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Play,
  Pause,
  RotateCcw,
  Moon,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  Volume2,
  AlertCircle,
  Users,
  Shield,
} from "lucide-react";
import { PlayerList } from "./PlayerList";
import { EventLog } from "./EventLog";
import { RoleReference } from "./RoleReference";
import { VictoryAnnouncement } from "./VictoryAnnouncement";
import { DayVotingModal } from "./DayVotingModal";
import { SheriffElectionModal } from "./SheriffElectionModal";
import { SheriffSuccessorModal } from "./SheriffSuccessorModal";
import { Button } from "./ui";
import { useNarrationAudio } from "../hooks/useNarrationAudio";
import { useGameContext } from "../contexts/GameStateContext";
import { RoleAssignmentReference } from "./RoleAssignmentReference";

interface DayPhaseProps {
  onStartNight?: () => void;
}

export const DayPhase = ({ onStartNight }: DayPhaseProps = {}) => {
  const {
    gameState,
    startNight,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    setPlayerWolfHoundTeam,
    checkEliminationConsequences,
    addGameEvent,
    checkWinCondition,
    activateStutteringJudgeDoubleVote,
    setSheriff,
  } = useGameContext();

  const { selectedRoles } = gameState.setup;
  const { players, gameEvents, cursedWolfFatherInfectedPlayer, cupidLovers } =
    gameState;

  const handleStartNight = onStartNight || startNight;
  const [timerDuration, setTimerDuration] = useState(5 * 60); // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [isSecondVote, setIsSecondVote] = useState(false);
  const [showSheriffElection, setShowSheriffElection] = useState(false);
  const [showSuccessorSelection, setShowSuccessorSelection] = useState(false);
  const [deadSheriffNumber, setDeadSheriffNumber] = useState<number | null>(
    null,
  );

  // Audio narration
  const { play: playAudio } = useNarrationAudio({
    volume: 0.8,
  });
  const hasAttemptedAutoPlay = useRef(false);
  const [sidebarTab, setSidebarTab] = useState<"players" | "events" | "roles">(
    "players",
  );
  const [victoryState, setVictoryState] = useState<{
    winner: "village" | "werewolves" | "solo";
    message: string;
  } | null>(null);

  // Auto-play day begins audio on mount
  useEffect(() => {
    if (!hasAttemptedAutoPlay.current) {
      hasAttemptedAutoPlay.current = true;
      const timer = setTimeout(() => {
        playAudio("day-begins.mp3");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [playAudio]);

  // Check win condition on mount and when players change
  useEffect(() => {
    const result = checkWinCondition();
    if (result.hasWinner && result.winner && result.message) {
      // Show victory for all teams including solo
      if (
        result.winner === "village" ||
        result.winner === "werewolves" ||
        result.winner === "solo"
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVictoryState({
          winner: result.winner,
          message: result.message,
        });
      }
    }
  }, [players, checkWinCondition]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const interval = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play a sound or notification when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(timerDuration);
  };

  const handleDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setTimerDuration(newDuration);
    setTimeRemaining(newDuration);
    setIsRunning(false);
  };

  const progressPercentage =
    ((timerDuration - timeRemaining) / timerDuration) * 100;

  const handleActivateDoubleVote = () => {
    activateStutteringJudgeDoubleVote();
    addGameEvent(
      "special",
      "Stuttering Judge activated double elimination - TWO consecutive votes will happen (no debate between votes)",
    );
    // Start the first vote
    handleStartVoting();
  };

  const handleStartVoting = () => {
    setIsRunning(false); // Stop the timer
    setShowVotingModal(true);
    playAudio("voting-time.mp3");
  };

  const handleElimination = (playerNumber: number) => {
    const eliminatedPlayer = players.find((p) => p.number === playerNumber);

    // Mark player as eliminated
    togglePlayerAlive(playerNumber);

    // Log the elimination
    addGameEvent(
      "day_vote",
      `Player ${playerNumber}${eliminatedPlayer?.name ? ` (${eliminatedPlayer.name})` : ""} eliminated by village vote on Day ${gameState.dayState.currentDayNumber}${isSecondVote ? " (Second Vote)" : ""}`,
    );

    // Check if eliminated player was the Sheriff
    if (playerNumber === gameState.sheriff) {
      addGameEvent(
        "special",
        `Sheriff (Player ${playerNumber}) has been eliminated!`,
      );
      playAudio("sheriff-died.mp3");
      setDeadSheriffNumber(playerNumber);
      setShowSuccessorSelection(true);
    }

    // Check for elimination consequences
    checkEliminationConsequences(playerNumber);

    // Close the modal
    setShowVotingModal(false);

    // If Stuttering Judge is active and this was the first vote, trigger second vote
    if (!isSecondVote && gameState.nightState.stutteringJudgeDoubleVoteUsed) {
      setIsSecondVote(true);
      // Brief pause before second vote
      setTimeout(() => {
        setShowVotingModal(true);
      }, 1500);
    } else if (isSecondVote) {
      // Second vote complete, reset flag
      setIsSecondVote(false);
    }
  };

  const handleNoElimination = () => {
    addGameEvent(
      "day_vote",
      `Village voted for no elimination on Day ${gameState.dayState.currentDayNumber}`,
    );
    setShowVotingModal(false);
    setIsSecondVote(false);
  };

  const handleElectSheriff = (playerNumber: number) => {
    setSheriff(playerNumber);
    addGameEvent(
      "special",
      `Player ${playerNumber} elected as Sheriff (vote counts as 2)`,
    );
    setShowSheriffElection(false);
    playAudio("sheriff-elected.mp3");
  };

  const handleSkipElection = () => {
    addGameEvent("special", "Village decided not to elect a Sheriff");
    setShowSheriffElection(false);
  };

  const needsSheriffElection =
    selectedRoles.includes("sheriff") &&
    gameState.dayState.currentDayNumber === 1 &&
    !gameState.sheriff;

  const handleNameSuccessor = (successorNumber: number) => {
    setSheriff(successorNumber);
    addGameEvent(
      "special",
      `Player ${deadSheriffNumber} named Player ${successorNumber} as the new Sheriff`,
    );
    setShowSuccessorSelection(false);
    setDeadSheriffNumber(null);
  };

  const handleNoSuccessor = () => {
    setSheriff(undefined as any); // Clear sheriff
    addGameEvent(
      "special",
      `Sheriff (Player ${deadSheriffNumber}) died without naming a successor`,
    );
    setShowSuccessorSelection(false);
    setDeadSheriffNumber(null);
  };

  return (
    <>
      {/* Victory Announcement */}
      {victoryState && (
        <VictoryAnnouncement
          winner={victoryState.winner}
          message={victoryState.message}
          onDismiss={() => setVictoryState(null)}
        />
      )}

      <div className="min-h-screen bg-amber-50 text-slate-900 p-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 min-w-0 pb-48">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-500" />
                <h1 className="text-3xl font-bold text-slate-800 font-header">
                  Day Phase
                </h1>
              </div>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="md"
                className="bg-slate-200 hover:bg-slate-300"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 font-header">
                  Timer Duration
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[3, 5, 7, 10].map((minutes) => (
                    <Button
                      key={minutes}
                      onClick={() => handleDurationChange(minutes)}
                      variant={
                        timerDuration === minutes * 60 ? "gold" : "secondary"
                      }
                      size="md"
                    >
                      {minutes} min
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Timer Display - ONUW Style */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-12 mb-8 border-4 border-slate-700">
              <div className="text-center">
                {/* Header Text */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold tracking-wider text-amber-400 font-header uppercase">
                    {timeRemaining === 0
                      ? "VOTE NOW"
                      : isRunning
                        ? "TIME REMAINING"
                        : "READY TO START"}
                  </h2>
                  <p className="text-sm text-slate-400 tracking-wide uppercase mt-1">
                    {timeRemaining === 0
                      ? "Proceed to voting"
                      : "Before voting begins"}
                  </p>
                </div>

                {/* Massive Timer Numbers */}
                <div
                  className={`my-8 ${
                    timeRemaining <= 30 && timeRemaining > 0 && isRunning
                      ? "animate-pulse"
                      : ""
                  }`}
                >
                  <div
                    className={`text-9xl font-bold tracking-wider transition-colors duration-300 ${
                      timeRemaining <= 30 && timeRemaining > 0
                        ? "text-red-500"
                        : timeRemaining === 0
                          ? "text-red-600"
                          : "text-white"
                    }`}
                    style={{ fontFamily: "monospace" }}
                  >
                    {formatTime(timeRemaining)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-8">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${
                      timeRemaining <= 30 && timeRemaining > 0
                        ? "bg-red-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handlePlayPause}
                    variant={isRunning ? "danger" : "success"}
                    size="lg"
                    className="text-lg min-w-[140px]"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-6 h-6" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6" />
                        Start
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant="secondary"
                    size="lg"
                    className="text-lg min-w-[140px]"
                  >
                    <RotateCcw className="w-6 h-6" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Game Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 font-header">
                Day Phase Actions
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <p className="text-sm text-slate-700">
                    <strong>1. Discussion:</strong> Players discuss and share
                    information
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <p className="text-sm text-slate-700">
                    <strong>2. Voting:</strong> Vote to eliminate a suspected
                    werewolf
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <p className="text-sm text-slate-700">
                    <strong>3. Special Powers:</strong> Hunter shoots if
                    eliminated, Stuttering Judge can force double vote
                  </p>
                </div>
              </div>

              {/* Sheriff Election Button (Day 1 only) */}
              {needsSheriffElection && (
                <div className="mt-6">
                  <Button
                    onClick={() => setShowSheriffElection(true)}
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="bg-yellow-600 hover:bg-yellow-700 text-xl py-4"
                  >
                    <Shield className="w-6 h-6" />
                    Elect Village Sheriff
                  </Button>
                </div>
              )}

              {/* Start Voting Button */}
              <div className="mt-6">
                <Button
                  onClick={handleStartVoting}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="bg-amber-600 hover:bg-amber-700 text-xl py-4"
                >
                  <Users className="w-6 h-6" />
                  Start Village Voting
                </Button>
              </div>
            </div>

            {/* Stuttering Judge Special Power */}
            {selectedRoles.includes("stuttering-judge") && (
              <div className="bg-purple-50 rounded-lg shadow-lg p-6 border-2 border-purple-300 mt-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-900 font-header">
                  Stuttering Judge - Double Elimination
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  Once per game, the Stuttering Judge can force{" "}
                  <strong>two consecutive votes</strong> in a single day,
                  resulting in <strong>two eliminations</strong>. The second
                  vote happens immediately after the first, with no debate.
                </p>
                {gameState.nightState.stutteringJudgeDoubleVoteUsed ? (
                  <div className="p-3 bg-slate-200 rounded-lg text-slate-600 text-sm">
                    ✓ Double elimination ability has been used
                  </div>
                ) : (
                  <Button
                    onClick={handleActivateDoubleVote}
                    variant="primary"
                    size="md"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Activate Double Elimination
                  </Button>
                )}
              </div>
            )}

            {/* Narrator Guidance */}
            <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Narrator Guide - Day Phase Order
              </h3>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>
                  <strong>Day Begins:</strong> Plays automatically when phase
                  starts
                </li>
                <li>
                  <strong>Discussion:</strong> Announce discussion period and
                  start timer
                </li>
                <li>
                  <strong>Voting:</strong> When discussion ends, announce voting
                  time
                </li>
                <li>
                  <strong>Result:</strong> Play "Elimination" or "No
                  Elimination" based on vote outcome
                </li>
              </ol>
            </div>

            {/* Day Phase Announcements */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 font-header">
                Narration Controls
              </h3>

              {/* Phase Start */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">
                  Phase Start
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => playAudio("day-begins.mp3")}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    Day Begins
                  </button>
                  <button
                    onClick={() => playAudio("discussion-begins.mp3")}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    Discussion Begins
                  </button>
                </div>
              </div>

              {/* Voting */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">
                  Voting
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => playAudio("voting-time.mp3")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    Voting Time
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-2">
                  Vote Result
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => playAudio("elimination.mp3")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    Elimination
                  </button>
                  <button
                    onClick={() => playAudio("no-elimination.mp3")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    No Elimination
                  </button>
                </div>
              </div>
            </div>

            {/* End Day Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleStartNight}
                variant="primary"
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-xl"
              >
                <Moon className="w-6 h-6" />
                End Day & Start Night
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${showSidebar ? "w-96" : "w-0 overflow-hidden"}`}
          >
            {showSidebar && (
              <div className="sticky top-6">
                {/* Sidebar Tabs */}
                <div className="flex gap-2 mb-4 bg-white p-2 rounded-lg shadow-md">
                  <button
                    onClick={() => setSidebarTab("players")}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                      sidebarTab === "players"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Players
                  </button>
                  <button
                    onClick={() => setSidebarTab("events")}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                      sidebarTab === "events"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Events
                  </button>
                  <button
                    onClick={() => setSidebarTab("roles")}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                      sidebarTab === "roles"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Roles
                  </button>
                </div>

                {/* Sidebar Content */}
                {sidebarTab === "players" && (
                  <PlayerList
                    playerCount={players.length}
                    players={players}
                    selectedRoles={selectedRoles}
                    cursedWolfFatherInfectedPlayer={
                      cursedWolfFatherInfectedPlayer
                    }
                    cupidLovers={cupidLovers}
                    sheriff={gameState.sheriff}
                    theme="day"
                    onToggleAlive={togglePlayerAlive}
                    onSetRevealedRole={setPlayerRevealedRole}
                    onUpdateNotes={updatePlayerNotes}
                    onSetWolfHoundTeam={setPlayerWolfHoundTeam}
                    onCheckEliminationConsequences={
                      checkEliminationConsequences
                    }
                    onAddGameEvent={addGameEvent}
                  />
                )}
                {sidebarTab === "events" && (
                  <EventLog events={gameEvents} theme="day" />
                )}
                {sidebarTab === "roles" && (
                  <RoleReference
                    selectedRoles={selectedRoles}
                    isDayPhase={true}
                  />
                )}
              </div>
            )}
          </div>

          {/* Sidebar Toggle Button */}
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            variant="ghost"
            size="md"
            className="fixed right-6 top-6 bg-slate-800 hover:bg-slate-700 shadow-lg z-10"
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            {showSidebar ? (
              <PanelLeftClose className="w-5 h-5 text-white" />
            ) : (
              <PanelLeftOpen className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Role Assignment Reference Panel */}
      <RoleAssignmentReference players={players} />

      {/* Day Voting Modal */}
      {showVotingModal && (
        <DayVotingModal
          players={players}
          sheriff={gameState.sheriff}
          isSecondVote={isSecondVote}
          onEliminate={handleElimination}
          onNoElimination={handleNoElimination}
          onCancel={() => setShowVotingModal(false)}
        />
      )}

      {/* Sheriff Election Modal */}
      {showSheriffElection && (
        <SheriffElectionModal
          players={players}
          onElectSheriff={handleElectSheriff}
          onSkipElection={handleSkipElection}
        />
      )}

      {/* Sheriff Successor Modal */}
      {showSuccessorSelection && deadSheriffNumber !== null && (
        <SheriffSuccessorModal
          players={players}
          deadSheriffNumber={deadSheriffNumber}
          onNameSuccessor={handleNameSuccessor}
          onNoSuccessor={handleNoSuccessor}
        />
      )}
    </>
  );
};
