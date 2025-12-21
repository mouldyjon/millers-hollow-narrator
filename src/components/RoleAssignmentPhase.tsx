import { useState, useEffect } from "react";
import { Hand } from "lucide-react";
import { Button } from "./ui";
import { SleepScreen } from "./SleepScreen";
import { useGameContext } from "../contexts/GameStateContext";
import { roles } from "../data/roles";
import type { Role } from "../types/game";

interface RoleAssignmentPhaseProps {
  onComplete: () => void;
}

/**
 * Role Assignment Phase - Auto Narrator Mode Only
 * Shows each player their assigned role privately in sequence
 * Uses similar UX pattern to WakeUpPrompt during night phase
 */
export const RoleAssignmentPhase = ({
  onComplete,
}: RoleAssignmentPhaseProps) => {
  const { gameState } = useGameContext();
  const { players } = gameState;
  const alivePlayers = players.filter((p) => p.isAlive);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [showPlayerPrompt, setShowPlayerPrompt] = useState(false);
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [showSleepScreen, setShowSleepScreen] = useState(false);

  const currentPlayer = alivePlayers[currentPlayerIndex];
  const currentRole = currentPlayer?.assignedRole
    ? roles[currentPlayer.assignedRole]
    : null;
  const isLastPlayer = currentPlayerIndex === alivePlayers.length - 1;
  const nextPlayer = !isLastPlayer
    ? alivePlayers[currentPlayerIndex + 1]
    : null;

  const startRoleAssignment = () => {
    setShowWelcomeScreen(false);
    setShowPlayerPrompt(true);
  };

  const revealRole = () => {
    setShowPlayerPrompt(false);
    setShowRoleReveal(true);
  };

  const handleContinue = () => {
    setShowRoleReveal(false);
    setShowSleepScreen(true);
  };

  // Auto-advance after sleep screen countdown
  useEffect(() => {
    if (showSleepScreen) {
      const timer = setTimeout(() => {
        if (isLastPlayer) {
          // All players have seen their roles - transition to night
          onComplete();
        } else {
          // Move to next player
          setShowSleepScreen(false);
          setCurrentPlayerIndex((prev) => prev + 1);
          setShowPlayerPrompt(true);
        }
      }, 4000); // Match the countdown duration

      return () => clearTimeout(timer);
    }
  }, [showSleepScreen, isLastPlayer, onComplete]);

  // Team-specific colours
  const getTeamColors = (role: Role) => {
    const teamColorMap = {
      village: {
        bg: "from-blue-900/40 to-blue-800/40",
        border: "border-blue-700/50",
        text: "text-blue-400",
        badge: "bg-blue-600 text-white",
      },
      werewolf: {
        bg: "from-red-900/40 to-red-800/40",
        border: "border-red-700/50",
        text: "text-red-400",
        badge: "bg-red-600 text-white",
      },
      solo: {
        bg: "from-purple-900/40 to-purple-800/40",
        border: "border-purple-700/50",
        text: "text-purple-400",
        badge: "bg-purple-600 text-white",
      },
    };
    return teamColorMap[role.team];
  };

  // Welcome Screen (shown once at start)
  if (showWelcomeScreen) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl font-bold text-[var(--color-text-gold)] font-header">
            Role Distribution
          </h1>
          <p className="text-2xl text-slate-300">
            Each player will privately view their role
          </p>
          <p className="text-lg text-slate-400">
            Pass the device around. When it's your turn, tap to reveal your
            role. Keep your eyes closed when it's not your turn.
          </p>
          <div className="pt-4">
            <Button onClick={startRoleAssignment} size="lg">
              Begin Role Distribution
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Player Prompt (similar to WakeUpPrompt pattern)
  if (showPlayerPrompt && currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-2xl p-12 max-w-2xl w-full text-center space-y-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Hand className="w-32 h-32 text-purple-400" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Hand className="w-32 h-32 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Player Name */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-purple-400 font-header">
              Player {currentPlayer.number}
              {currentPlayer.name && (
                <span className="block text-3xl mt-2">
                  {currentPlayer.name}
                </span>
              )}
            </h1>
            <p className="text-2xl text-slate-300">
              Pick up the device and tap below
            </p>
          </div>

          {/* Tap to Reveal Button */}
          <div className="pt-4">
            <Button
              onClick={revealRole}
              variant="primary"
              size="lg"
              className="text-2xl px-12 py-6"
            >
              <Hand className="w-8 h-8" />
              Tap to See Your Role
            </Button>
          </div>

          {/* Warning */}
          <p className="text-sm text-slate-500 italic pt-4">
            Keep your eyes closed if this is not you
          </p>
        </div>
      </div>
    );
  }

  // Role Reveal Screen
  if (showRoleReveal && currentRole) {
    const colors = getTeamColors(currentRole);

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div
          className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-12 max-w-3xl w-full space-y-6 shadow-2xl`}
        >
          {/* Role Image */}
          <div className="w-64 h-64 mx-auto rounded-lg overflow-hidden border-4 border-white/20 shadow-xl">
            <img
              src={`/millers-hollow-narrator/images/roles/${currentRole.id}.png`}
              alt={currentRole.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Role Name */}
          <h1
            className={`text-6xl font-bold text-center ${colors.text} font-header`}
          >
            {currentRole.name}
          </h1>

          {/* Team Badge */}
          <div className="text-center">
            <span
              className={`px-6 py-2 rounded-full ${colors.badge} text-xl font-bold inline-block`}
            >
              {currentRole.team === "village"
                ? "Village Team"
                : currentRole.team === "werewolf"
                  ? "Werewolf Team"
                  : "Solo Player"}
            </span>
          </div>

          {/* Role Description */}
          <p className="text-xl text-slate-200 text-center leading-relaxed">
            {currentRole.description}
          </p>

          {/* Continue Button */}
          <div className="pt-6 text-center">
            <Button onClick={handleContinue} variant="success" size="lg">
              I've Memorised My Role
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Sleep Screen Between Players
  if (showSleepScreen) {
    const message = isLastPlayer
      ? "All roles assigned. Game begins soon..."
      : nextPlayer
        ? `Pass device to Player ${nextPlayer.number}${nextPlayer.name ? ` (${nextPlayer.name})` : ""}. Keep your eyes closed.`
        : "Keep your eyes closed.";

    return <SleepScreen message={message} countdown={4} />;
  }

  return null;
};
