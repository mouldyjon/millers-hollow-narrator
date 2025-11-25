import { useState, useEffect } from "react";
import { Sunrise, AlertTriangle, Shield, Skull } from "lucide-react";
import type { RoleId, Player } from "../types/game";
import { RoleRevealModal } from "./RoleRevealModal";
import { EliminationAlert } from "./EliminationAlert";
import { VictoryAnnouncement } from "./VictoryAnnouncement";
import { Button } from "./ui";

interface DawnPhaseProps {
  selectedRoles: RoleId[];
  players: Player[];
  pendingRoleReveals: number[];
  sheriff?: number;
  onStartDay: () => void;
  onSetPlayerRevealedRole: (
    playerNumber: number,
    role: string,
    roleId?: RoleId,
  ) => void;
  onTogglePlayerAlive: (playerNumber: number) => void;
  onClearPendingReveals: () => void;
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

export const DawnPhase = ({
  selectedRoles,
  players,
  pendingRoleReveals,
  sheriff,
  onStartDay,
  onSetPlayerRevealedRole,
  onTogglePlayerAlive,
  onClearPendingReveals,
  onCheckEliminationConsequences,
  onAddGameEvent,
  onCheckWinCondition,
}: DawnPhaseProps) => {
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [victoryState, setVictoryState] = useState<{
    winner: "village" | "werewolves";
    message: string;
  } | null>(null);
  const [eliminationAlert, setEliminationAlert] = useState<{
    type:
      | "lovers"
      | "knight-rusty-sword"
      | "hunter"
      | "siblings"
      | "wild-child-transform";
    message: string;
    affectedPlayers: number[];
    requiresPlayerSelection: boolean;
    availablePlayers: number[];
    eliminatedPlayerNumber: number;
    eliminatedRoleId?: RoleId;
  } | null>(null);
  const [awaitingRoleReveal, setAwaitingRoleReveal] = useState<number | null>(
    null,
  );

  // Check win condition when players change (after role reveals)
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

  // Auto-progress to day phase if no announcements or pending reveals
  useEffect(() => {
    // Build announcements to check count
    const hasAnnouncements =
      selectedRoles.includes("bear-tamer") ||
      (sheriff && players.find((p) => p.number === sheriff && !p.isAlive)) ||
      players.find((p) => p.actualRole === "knight-rusty-sword" && !p.isAlive);

    if (
      !hasAnnouncements &&
      pendingRoleReveals.length === 0 &&
      !eliminationAlert &&
      !awaitingRoleReveal &&
      !victoryState
    ) {
      // No announcements and all reveals done - skip directly to day
      const timer = setTimeout(() => {
        onStartDay();
      }, 100); // Small delay to ensure state is settled
      return () => clearTimeout(timer);
    }
  }, [
    selectedRoles,
    sheriff,
    players,
    pendingRoleReveals.length,
    eliminationAlert,
    awaitingRoleReveal,
    victoryState,
    onStartDay,
  ]);

  // Handle role reveal for the current player
  const handleRoleReveal = (
    playerNumber: number,
    role: string,
    roleId: RoleId,
  ) => {
    onSetPlayerRevealedRole(playerNumber, role, roleId);
    onAddGameEvent(
      "elimination",
      `Player ${playerNumber} (${role}) was eliminated`,
    );

    // Check for elimination consequences
    const consequences = onCheckEliminationConsequences(playerNumber, roleId);
    if (consequences.type !== "none") {
      const alivePlayers = players
        .filter((p) => p.isAlive && p.number !== playerNumber)
        .map((p) => p.number);

      setEliminationAlert({
        type: consequences.type as any,
        message: consequences.message,
        affectedPlayers: consequences.affectedPlayers,
        requiresPlayerSelection: consequences.requiresPlayerSelection,
        availablePlayers: alivePlayers,
        eliminatedPlayerNumber: playerNumber,
        eliminatedRoleId: roleId,
      });
      return; // Don't move to next reveal yet
    }

    // Move to next pending reveal or clear if done
    if (currentRevealIndex + 1 < pendingRoleReveals.length) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      // All roles revealed, clear the pending list
      onClearPendingReveals();
    }
  };

  const handleAlertConfirm = () => {
    if (!eliminationAlert) return;

    // Handle chain eliminations - need to kill player then reveal role
    if (
      eliminationAlert.type === "lovers" ||
      eliminationAlert.type === "knight-rusty-sword"
    ) {
      // Show role reveal modal for the first affected player
      if (eliminationAlert.affectedPlayers.length > 0) {
        const affectedPlayerNumber = eliminationAlert.affectedPlayers[0];
        // Kill the player first
        onTogglePlayerAlive(affectedPlayerNumber);
        // Then show role reveal
        setAwaitingRoleReveal(affectedPlayerNumber);
        setEliminationAlert(null);
        return;
      }
    }

    setEliminationAlert(null);

    // Move to next pending reveal or clear if done
    if (currentRevealIndex + 1 < pendingRoleReveals.length) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      onClearPendingReveals();
    }
  };

  const handleHunterTargetSelect = (targetPlayer: number) => {
    if (!eliminationAlert) return;

    // Kill the hunter's target first
    onTogglePlayerAlive(targetPlayer);
    // Then show role reveal modal for the hunter's target
    setAwaitingRoleReveal(targetPlayer);
    setEliminationAlert(null);
  };

  const handleChainRoleReveal = (
    playerNumber: number,
    role: string,
    roleId: RoleId,
  ) => {
    onSetPlayerRevealedRole(playerNumber, role, roleId);
    onAddGameEvent(
      "elimination",
      `Player ${playerNumber} (${role}) was eliminated`,
    );
    setAwaitingRoleReveal(null);

    // Check for more consequences
    const consequences = onCheckEliminationConsequences(playerNumber, roleId);
    if (consequences.type !== "none") {
      const alivePlayers = players
        .filter((p) => p.isAlive && p.number !== playerNumber)
        .map((p) => p.number);

      setEliminationAlert({
        type: consequences.type as any,
        message: consequences.message,
        affectedPlayers: consequences.affectedPlayers,
        requiresPlayerSelection: consequences.requiresPlayerSelection,
        availablePlayers: alivePlayers,
        eliminatedPlayerNumber: playerNumber,
        eliminatedRoleId: roleId,
      });
      return;
    }

    // Continue with next reveal
    if (currentRevealIndex + 1 < pendingRoleReveals.length) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      onClearPendingReveals();
    }
  };

  // Show elimination alert if there is one
  if (eliminationAlert) {
    return (
      <EliminationAlert
        type={eliminationAlert.type}
        message={eliminationAlert.message}
        affectedPlayers={eliminationAlert.affectedPlayers}
        onConfirm={handleAlertConfirm}
        onSelectPlayer={handleHunterTargetSelect}
        requiresPlayerSelection={eliminationAlert.requiresPlayerSelection}
        availablePlayers={eliminationAlert.availablePlayers}
      />
    );
  }

  // Show role reveal for chain eliminations
  if (awaitingRoleReveal !== null) {
    return (
      <RoleRevealModal
        playerNumber={awaitingRoleReveal}
        selectedRoles={selectedRoles}
        players={players}
        onConfirm={handleChainRoleReveal}
        onCancel={() => {
          setAwaitingRoleReveal(null);
          // Continue with next reveal
          if (currentRevealIndex + 1 < pendingRoleReveals.length) {
            setCurrentRevealIndex(currentRevealIndex + 1);
          } else {
            onClearPendingReveals();
          }
        }}
      />
    );
  }

  // Show role reveal modal if there are pending reveals
  if (
    pendingRoleReveals.length > 0 &&
    currentRevealIndex < pendingRoleReveals.length
  ) {
    return (
      <RoleRevealModal
        playerNumber={pendingRoleReveals[currentRevealIndex]}
        selectedRoles={selectedRoles}
        players={players}
        onConfirm={handleRoleReveal}
        onCancel={() => {
          // Skip this reveal and move to next
          if (currentRevealIndex + 1 < pendingRoleReveals.length) {
            setCurrentRevealIndex(currentRevealIndex + 1);
          } else {
            onClearPendingReveals();
          }
        }}
      />
    );
  }
  const announcements: {
    icon: React.ReactNode;
    title: string;
    message: string;
    type: "info" | "warning" | "danger";
  }[] = [];

  // Check for Bear Tamer
  if (selectedRoles.includes("bear-tamer")) {
    // Check if Bear Tamer is still alive (if we know who they are)
    const bearTamerRevealed = players.find(
      (p) => p.actualRole === "bear-tamer" && !p.isAlive,
    );

    if (!bearTamerRevealed) {
      // Bear Tamer hasn't been revealed as dead, so they might be alive
      announcements.push({
        icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
        title: "Bear Tamer Announcement",
        message:
          "NARRATOR: If the Bear Tamer is adjacent to a werewolf, announce: 'Grrrrr! The bear is growling!' Otherwise announce: 'The bear is calm and quiet.'",
        type: "warning",
      });
    }
  }

  // Check for Sheriff death
  if (sheriff) {
    const sheriffPlayer = players.find((p) => p.number === sheriff);
    if (sheriffPlayer && !sheriffPlayer.isAlive) {
      announcements.push({
        icon: <Shield className="w-12 h-12 text-blue-400" />,
        title: "The Sheriff Has Died",
        message: `Player ${sheriff} was the Sheriff. The village must elect a new Sheriff during the day phase.`,
        type: "info",
      });
    }
  }

  // Check for Knight with Rusty Sword
  const knightDiedLastNight = players.find(
    (p) => p.actualRole === "knight-rusty-sword" && !p.isAlive,
  );

  if (knightDiedLastNight) {
    announcements.push({
      icon: <Skull className="w-12 h-12 text-red-400" />,
      title: "Knight with Rusty Sword Effect",
      message: `Player ${knightDiedLastNight.number} was the Knight with Rusty Sword. Their right-hand neighbour (Player ${knightDiedLastNight.number === players.length ? 1 : knightDiedLastNight.number + 1}) should have been eliminated during the night (rusty sword struck them).`,
      type: "danger",
    });
  }

  // If no announcements but haven't auto-progressed yet, show nothing (will auto-progress)
  if (announcements.length === 0) {
    return null;
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-900/20";
      case "danger":
        return "bg-red-900/20";
      default:
        return "bg-blue-900/20";
    }
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

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-slate-900 text-slate-100 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <Sunrise className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2 font-header text-[var(--color-text-gold)]">
              Dawn
            </h1>
            <p className="text-slate-300">
              The night ends and the sun begins to rise...
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className={`${getBackgroundColor(announcement.type)} rounded-lg p-6 border-2 ${
                  announcement.type === "warning"
                    ? "border-yellow-600"
                    : announcement.type === "danger"
                      ? "border-red-600"
                      : "border-blue-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{announcement.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 font-header text-amber-100">
                      {announcement.title}
                    </h2>
                    <p className="text-lg text-slate-200">
                      {announcement.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={onStartDay}
              variant="gold"
              size="lg"
              className="text-xl"
            >
              Start Day Phase
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
