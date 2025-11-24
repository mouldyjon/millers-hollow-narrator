import { useState, useEffect } from "react";
import {
  Sun,
  Play,
  Pause,
  RotateCcw,
  Moon,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import type { RoleId, Player, GameEvent } from "../types/game";
import { PlayerList } from "./PlayerList";
import { EventLog } from "./EventLog";
import { VictoryAnnouncement } from "./VictoryAnnouncement";
import { Button } from "./ui";

interface DayPhaseProps {
  selectedRoles: RoleId[];
  players: Player[];
  gameEvents: GameEvent[];
  cursedWolfFatherInfectedPlayer?: number;
  onStartNight: () => void;
  onTogglePlayerAlive: (playerNumber: number) => void;
  onUpdatePlayerNotes: (playerNumber: number, notes: string) => void;
  onSetPlayerRevealedRole: (
    playerNumber: number,
    role: string,
    roleId?: RoleId,
  ) => void;
  onSetPlayerWolfHoundTeam?: (
    playerNumber: number,
    team: "village" | "werewolf",
  ) => void;
  onCheckEliminationConsequences: (
    playerNumber: number,
    roleId?: RoleId,
  ) => {
    type:
      | "none"
      | "lovers"
      | "knight-rusty-sword"
      | "hunter"
      | "siblings"
      | "wild-child-transform";
    affectedPlayers: number[];
    message: string;
    requiresPlayerSelection: boolean;
  };
  onAddGameEvent: (
    type: "elimination" | "role_action" | "day_vote" | "special",
    description: string,
  ) => void;
  onCheckWinCondition: () => {
    hasWinner: boolean;
    winner?: "village" | "werewolves" | "solo";
    message?: string;
  };
}

export const DayPhase = ({
  selectedRoles,
  players,
  gameEvents,
  cursedWolfFatherInfectedPlayer,
  onStartNight,
  onTogglePlayerAlive,
  onUpdatePlayerNotes,
  onSetPlayerRevealedRole,
  onSetPlayerWolfHoundTeam,
  onCheckEliminationConsequences,
  onAddGameEvent,
  onCheckWinCondition,
}: DayPhaseProps) => {
  const [timerDuration, setTimerDuration] = useState(5 * 60); // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [victoryState, setVictoryState] = useState<{
    winner: "village" | "werewolves";
    message: string;
  } | null>(null);

  // Check win condition on mount and when players change
  useEffect(() => {
    const result = onCheckWinCondition();
    if (result.hasWinner && result.winner && result.message) {
      // Only show victory for main teams (not solo)
      if (result.winner === "village" || result.winner === "werewolves") {
        setVictoryState({
          winner: result.winner,
          message: result.message,
        });
      }
    }
  }, [players, onCheckWinCondition]);

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
          <div className="flex-1 min-w-0">
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
            </div>

            {/* End Day Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={onStartNight}
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
              <div className="space-y-6 sticky top-6">
                <PlayerList
                  playerCount={players.length}
                  players={players}
                  selectedRoles={selectedRoles}
                  cursedWolfFatherInfectedPlayer={
                    cursedWolfFatherInfectedPlayer
                  }
                  theme="day"
                  onToggleAlive={onTogglePlayerAlive}
                  onSetRevealedRole={onSetPlayerRevealedRole}
                  onUpdateNotes={onUpdatePlayerNotes}
                  onSetWolfHoundTeam={onSetPlayerWolfHoundTeam}
                  onCheckEliminationConsequences={
                    onCheckEliminationConsequences
                  }
                  onAddGameEvent={onAddGameEvent}
                />
                <EventLog events={gameEvents} theme="day" />
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
    </>
  );
};
