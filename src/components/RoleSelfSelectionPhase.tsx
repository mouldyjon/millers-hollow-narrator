import { useState, useEffect } from "react";
import { Hand, ArrowRight } from "lucide-react";
import { Button } from "./ui";
import { SleepScreen } from "./SleepScreen";
import { useGameContext } from "../contexts/GameStateContext";
import { roles } from "../data/roles";
import type { RoleId, Role } from "../types/game";
import { getRoleSlotCount } from "../logic/roleSlotCalculations";

interface RoleSelfSelectionPhaseProps {
  onComplete: () => void;
}

/**
 * Role Self-Selection Phase - Auto Narrator Mode
 * Each player privately selects their own role from the available pool
 * Similar to dealing cards in physical game, but digital
 */
export const RoleSelfSelectionPhase = ({
  onComplete,
}: RoleSelfSelectionPhaseProps) => {
  const { gameState, setPlayerAssignedRole } = useGameContext();
  const { players, setup } = gameState;
  const { selectedRoles } = setup;

  // Build available roles pool
  const [availableRoles, setAvailableRoles] = useState<RoleId[]>(() => {
    const rolePool: RoleId[] = [];
    selectedRoles.forEach((roleId) => {
      const count = getRoleSlotCount(roleId);
      for (let i = 0; i < count; i++) {
        rolePool.push(roleId);
      }
    });
    return rolePool;
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [showPlayerPrompt, setShowPlayerPrompt] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  const [showSleepScreen, setShowSleepScreen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  const currentPlayer = players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === players.length - 1;
  const nextPlayer = !isLastPlayer ? players[currentPlayerIndex + 1] : null;

  const startRoleSelection = () => {
    setShowWelcomeScreen(false);
    setShowPlayerPrompt(true);
  };

  const handlePlayerReady = () => {
    setShowPlayerPrompt(false);
    setShowRoleSelection(true);
  };

  const handleRoleSelect = (roleId: RoleId) => {
    // Check if this role is still available (hasn't been taken yet)
    if (!availableRoles.includes(roleId)) {
      // Role already taken - show error and don't proceed
      alert("This role has already been entered by another player. Please select your actual role.");
      return;
    }
    setSelectedRole(roleId);
    setShowRoleSelection(false);
    setShowRoleConfirmation(true);
  };

  const handleConfirmRole = () => {
    if (!selectedRole) return;

    // Assign role to current player
    setPlayerAssignedRole(currentPlayer.number, selectedRole);

    // Remove role from available pool
    const roleIndex = availableRoles.indexOf(selectedRole);
    if (roleIndex > -1) {
      setAvailableRoles((prev) => prev.filter((_, i) => i !== roleIndex));
    }

    // Move to sleep screen
    setShowRoleConfirmation(false);
    setSelectedRole(null);
    setShowSleepScreen(true);
  };

  // Auto-advance after sleep screen
  useEffect(() => {
    if (showSleepScreen) {
      const timer = setTimeout(() => {
        if (isLastPlayer) {
          // All players have selected roles
          onComplete();
        } else {
          // Move to next player
          setShowSleepScreen(false);
          setCurrentPlayerIndex((prev) => prev + 1);
          setShowPlayerPrompt(true);
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSleepScreen, isLastPlayer, onComplete]);

  // Team-specific colours
  const getTeamColours = (role: Role) => {
    const teamColourMap = {
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
    return teamColourMap[role.team];
  };

  // Welcome Screen
  if (showWelcomeScreen) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl font-bold text-[var(--color-text-gold)] font-header">
            Role Entry
          </h1>
          <p className="text-2xl text-slate-300">
            Each player will privately enter their assigned role
          </p>
          <p className="text-lg text-slate-400">
            Pass the device around. When it's your turn, pick up the device and
            select the role you were dealt. Keep your eyes closed when
            it's not your turn.
          </p>
          <div className="pt-4">
            <Button onClick={startRoleSelection} size="lg">
              Begin Role Entry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Player Prompt
  if (showPlayerPrompt && currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-2xl p-12 max-w-2xl w-full text-center space-y-8 shadow-2xl">
          <div className="flex justify-center">
            <div className="relative">
              <Hand className="w-32 h-32 text-purple-400" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Hand className="w-32 h-32 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-purple-400 font-header">
              Player {currentPlayer.number}
              {currentPlayer.name && (
                <span className="block text-3xl mt-2">{currentPlayer.name}</span>
              )}
            </h1>
            <p className="text-2xl text-slate-300">
              Pick up the device and tap below
            </p>
            <p className="text-lg text-slate-400">
              {availableRoles.length} roles remaining
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handlePlayerReady}
              variant="primary"
              size="lg"
              className="text-2xl px-12 py-6"
            >
              <Hand className="w-8 h-8" />
              Enter Your Role
            </Button>
          </div>

          <p className="text-sm text-slate-500 italic pt-4">
            Keep your eyes closed if this is not you
          </p>
        </div>
      </div>
    );
  }

  // Role Selection Screen
  if (showRoleSelection) {
    // Always show ALL roles from setup to maintain privacy
    // Every player sees the same enabled list - no visual indication of what's been taken
    const allUniqueRoles = Array.from(new Set(selectedRoles));

    return (
      <div className="min-h-screen bg-slate-900 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-gold)] font-header mb-2">
              Select Your Assigned Role
            </h1>
            <p className="text-slate-400">
              Find and select the role you were dealt
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allUniqueRoles.map((roleId) => {
              const role = roles[roleId];
              const colours = getTeamColours(role);

              return (
                <button
                  key={roleId}
                  onClick={() => handleRoleSelect(roleId)}
                  className={`bg-gradient-to-br ${colours.bg} border ${colours.border} rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3 border-2 border-white/20">
                    <img
                      src={`/millers-hollow-narrator/images/roles/${roleId}.png`}
                      alt={role.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className={`text-sm font-bold ${colours.text} mb-1 font-header`}>
                    {role.name}
                  </h3>

                  <div
                    className={`text-xs ${colours.badge} rounded-full px-2 py-1 mt-2 inline-block`}
                  >
                    {role.team === "village"
                      ? "Village"
                      : role.team === "werewolf"
                        ? "Werewolf"
                        : "Solo"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Role Confirmation Screen
  if (showRoleConfirmation && selectedRole) {
    const role = roles[selectedRole];
    const colours = getTeamColours(role);

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div
          className={`bg-gradient-to-br ${colours.bg} border ${colours.border} rounded-2xl p-12 max-w-3xl w-full space-y-6 shadow-2xl`}
        >
          <div className="w-64 h-64 mx-auto rounded-lg overflow-hidden border-4 border-white/20 shadow-xl">
            <img
              src={`/millers-hollow-narrator/images/roles/${selectedRole}.png`}
              alt={role.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className={`text-6xl font-bold text-center ${colours.text} font-header`}>
            {role.name}
          </h1>

          <div className="text-center">
            <span
              className={`px-6 py-2 rounded-full ${colours.badge} text-xl font-bold inline-block`}
            >
              {role.team === "village"
                ? "Village Team"
                : role.team === "werewolf"
                  ? "Werewolf Team"
                  : "Solo Player"}
            </span>
          </div>

          <p className="text-xl text-slate-200 text-center leading-relaxed">
            {role.description}
          </p>

          <div className="pt-6 text-center">
            <Button onClick={handleConfirmRole} variant="success" size="lg">
              <ArrowRight className="w-6 h-6" />
              Confirm Role
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Sleep Screen
  if (showSleepScreen) {
    const message = isLastPlayer
      ? "All roles selected. Game begins soon..."
      : nextPlayer
        ? `Pass device to Player ${nextPlayer.number}${nextPlayer.name ? ` (${nextPlayer.name})` : ""}. Keep your eyes closed.`
        : "Keep your eyes closed.";

    return <SleepScreen message={message} countdown={4} />;
  }

  return null;
};
