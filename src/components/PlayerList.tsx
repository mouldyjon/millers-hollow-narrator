import { useState } from "react";
import { User, Skull, Eye } from "lucide-react";
import { RoleRevealModal } from "./RoleRevealModal";
import { EliminationAlert } from "./EliminationAlert";
import type { RoleId } from "../types/game";

interface Player {
  number: number;
  isAlive: boolean;
  revealedRole?: string;
  actualRole?: RoleId;
  notes?: string;
}

interface PlayerListProps {
  playerCount: number;
  players: Player[];
  selectedRoles: RoleId[];
  onToggleAlive: (playerNumber: number) => void;
  onSetRevealedRole: (
    playerNumber: number,
    role: string,
    roleId?: RoleId,
  ) => void;
  onUpdateNotes: (playerNumber: number, notes: string) => void;
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
}

export const PlayerList = ({
  playerCount,
  players,
  selectedRoles,
  onToggleAlive,
  onSetRevealedRole,
  onUpdateNotes,
  onCheckEliminationConsequences,
}: PlayerListProps) => {
  const [eliminatingPlayer, setEliminatingPlayer] = useState<number | null>(
    null,
  );
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

  const handleEliminateClick = (playerNumber: number) => {
    const player = players.find((p) => p.number === playerNumber);
    if (player?.isAlive) {
      // Show modal to select role
      setEliminatingPlayer(playerNumber);
    } else {
      // Reviving - just toggle alive
      onToggleAlive(playerNumber);
    }
  };

  const handleRoleReveal = (
    playerNumber: number,
    role: string,
    roleId: RoleId,
  ) => {
    onSetRevealedRole(playerNumber, role, roleId);
    onToggleAlive(playerNumber);
    setEliminatingPlayer(null);

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
    }
  };

  const handleAlertConfirm = () => {
    if (!eliminationAlert) return;

    // Handle chain eliminations
    if (
      eliminationAlert.type === "lovers" ||
      eliminationAlert.type === "knight-rusty-sword"
    ) {
      // Eliminate affected players
      eliminationAlert.affectedPlayers.forEach((playerNum) => {
        onToggleAlive(playerNum);
      });
    }

    setEliminationAlert(null);
  };

  const handleHunterTargetSelect = (targetPlayer: number) => {
    if (!eliminationAlert) return;

    // Eliminate the hunter's target
    onToggleAlive(targetPlayer);

    // Check if the target has consequences too
    const targetPlayerData = players.find((p) => p.number === targetPlayer);
    if (targetPlayerData?.actualRole) {
      const targetConsequences = onCheckEliminationConsequences(
        targetPlayer,
        targetPlayerData.actualRole,
      );
      if (targetConsequences.type !== "none") {
        const alivePlayers = players
          .filter(
            (p) =>
              p.isAlive &&
              p.number !== targetPlayer &&
              p.number !== eliminationAlert.eliminatedPlayerNumber,
          )
          .map((p) => p.number);

        setEliminationAlert({
          type: targetConsequences.type as any,
          message: targetConsequences.message,
          affectedPlayers: targetConsequences.affectedPlayers,
          requiresPlayerSelection: targetConsequences.requiresPlayerSelection,
          availablePlayers: alivePlayers,
          eliminatedPlayerNumber: targetPlayer,
          eliminatedRoleId: targetPlayerData.actualRole,
        });
        return;
      }
    }

    setEliminationAlert(null);
  };

  return (
    <>
      {eliminatingPlayer !== null && (
        <RoleRevealModal
          playerNumber={eliminatingPlayer}
          selectedRoles={selectedRoles}
          onConfirm={handleRoleReveal}
          onCancel={() => setEliminatingPlayer(null)}
        />
      )}

      {eliminationAlert && (
        <EliminationAlert
          type={eliminationAlert.type}
          message={eliminationAlert.message}
          affectedPlayers={eliminationAlert.affectedPlayers}
          onConfirm={handleAlertConfirm}
          onSelectPlayer={handleHunterTargetSelect}
          requiresPlayerSelection={eliminationAlert.requiresPlayerSelection}
          availablePlayers={eliminationAlert.availablePlayers}
        />
      )}

      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Players ({players.filter((p) => p.isAlive).length} / {playerCount}{" "}
          alive)
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {players.map((player) => (
            <div
              key={player.number}
              className={`p-3 rounded-lg border-2 transition-all ${
                player.isAlive
                  ? "bg-slate-700 border-slate-600"
                  : "bg-slate-900 border-red-900 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    Player {player.number}
                  </span>
                  {!player.isAlive && (
                    <Skull className="w-4 h-4 text-red-400" />
                  )}
                </div>

                <button
                  onClick={() => handleEliminateClick(player.number)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    player.isAlive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {player.isAlive ? "Eliminate" : "Revive"}
                </button>
              </div>

              {player.revealedRole && (
                <div className="mb-2 px-2 py-1 bg-blue-900 rounded text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Role: {player.revealedRole}</span>
                </div>
              )}

              <input
                type="text"
                placeholder="Notes (e.g., suspected werewolf, claims seer...)"
                value={player.notes || ""}
                onChange={(e) => onUpdateNotes(player.number, e.target.value)}
                className="w-full px-2 py-1 bg-slate-600 rounded text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
