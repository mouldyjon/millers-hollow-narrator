import { useState } from "react";
import { User, Skull, Eye, Users, Moon, Heart } from "lucide-react";
import { RoleRevealModal } from "./RoleRevealModal";
import { EliminationAlert } from "./EliminationAlert";
import type { RoleId } from "../types/game";
import { roles } from "../data/roles";

type PlayerFilter = "all" | "alive" | "dead" | "revealed";

interface Player {
  number: number;
  isAlive: boolean;
  revealedRole?: string;
  actualRole?: RoleId;
  notes?: string;
  wolfHoundTeam?: "village" | "werewolf";
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
  onSetWolfHoundTeam?: (
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
}

export const PlayerList = ({
  playerCount,
  players,
  selectedRoles,
  onToggleAlive,
  onSetRevealedRole,
  onUpdateNotes,
  onSetWolfHoundTeam,
  onCheckEliminationConsequences,
  onAddGameEvent,
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
  const [awaitingRoleReveal, setAwaitingRoleReveal] = useState<number | null>(
    null,
  );
  const [filter, setFilter] = useState<PlayerFilter>("all");

  // Calculate counts
  const aliveCount = players.filter((p) => p.isAlive).length;
  const deadCount = players.filter((p) => !p.isAlive).length;
  const revealedCount = players.filter((p) => p.revealedRole).length;

  // Filter players
  const filteredPlayers = players.filter((player) => {
    if (filter === "alive") return player.isAlive;
    if (filter === "dead") return !player.isAlive;
    if (filter === "revealed") return player.revealedRole;
    return true; // "all"
  });

  // Get team colour for revealed roles
  const getTeamColour = (roleId?: RoleId) => {
    if (!roleId) return null;
    const role = roles[roleId];
    if (!role) return null;

    if (role.team === "village") return "border-blue-500 bg-blue-900/20";
    if (role.team === "werewolf") return "border-red-500 bg-red-900/20";
    if (role.team === "solo") return "border-purple-500 bg-purple-900/20";
    return null;
  };

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
    setAwaitingRoleReveal(null);

    // Log the elimination
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
    }
  };

  const handleAlertConfirm = () => {
    if (!eliminationAlert) return;

    // Handle chain eliminations - need to reveal role first
    if (
      eliminationAlert.type === "lovers" ||
      eliminationAlert.type === "knight-rusty-sword"
    ) {
      // Show role reveal modal for the first affected player
      if (eliminationAlert.affectedPlayers.length > 0) {
        setAwaitingRoleReveal(eliminationAlert.affectedPlayers[0]);
        // Clear the alert so the modal can be seen
        setEliminationAlert(null);
        return;
      }
    }

    setEliminationAlert(null);
  };

  const handleHunterTargetSelect = (targetPlayer: number) => {
    if (!eliminationAlert) return;

    // Show role reveal modal for the hunter's target
    setAwaitingRoleReveal(targetPlayer);
    // Clear the alert so the modal can be seen
    setEliminationAlert(null);
  };

  return (
    <>
      {(eliminatingPlayer !== null || awaitingRoleReveal !== null) && (
        <RoleRevealModal
          playerNumber={eliminatingPlayer || awaitingRoleReveal || 0}
          selectedRoles={selectedRoles}
          onConfirm={handleRoleReveal}
          onCancel={() => {
            setEliminatingPlayer(null);
            setAwaitingRoleReveal(null);
            setEliminationAlert(null);
          }}
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
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <User className="w-5 h-5" />
          Players
        </h3>

        {/* Player Count Summary */}
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <Heart className="w-4 h-4" />
              <span className="font-semibold">{aliveCount} Alive</span>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <Skull className="w-4 h-4" />
              <span className="font-semibold">{deadCount} Dead</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Eye className="w-4 h-4" />
              <span className="font-semibold">{revealedCount} Revealed</span>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-3 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-slate-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            All ({playerCount})
          </button>
          <button
            onClick={() => setFilter("alive")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === "alive"
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Alive ({aliveCount})
          </button>
          <button
            onClick={() => setFilter("dead")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === "dead"
                ? "bg-red-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Dead ({deadCount})
          </button>
          <button
            onClick={() => setFilter("revealed")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === "revealed"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Revealed ({revealedCount})
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredPlayers.map((player) => {
            const teamColour = getTeamColour(player.actualRole);
            return (
              <div
                key={player.number}
                className={`p-3 rounded-lg border-2 transition-all ${
                  teamColour ||
                  (player.isAlive
                    ? "bg-slate-700 border-slate-600"
                    : "bg-slate-900 border-red-900 opacity-60")
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Status Icons */}
                    {player.isAlive ? (
                      <Heart className="w-4 h-4 text-green-400" />
                    ) : (
                      <Skull className="w-4 h-4 text-red-400" />
                    )}

                    <span className="font-bold text-lg">
                      Player {player.number}
                    </span>

                    {player.revealedRole && (
                      <Eye className="w-4 h-4 text-blue-400" />
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

                {/* Wolf-Hound Team Toggle - only show if Wolf-Hound is in the game */}
                {selectedRoles.includes("wolf-hound") && onSetWolfHoundTeam && (
                  <div className="mb-2">
                    <label className="text-xs text-slate-400 mb-1 block">
                      Wolf-Hound Allegiance:
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          onSetWolfHoundTeam(player.number, "village")
                        }
                        className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                          player.wolfHoundTeam === "village"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        Village
                      </button>
                      <button
                        onClick={() =>
                          onSetWolfHoundTeam(player.number, "werewolf")
                        }
                        className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                          player.wolfHoundTeam === "werewolf"
                            ? "bg-red-600 text-white"
                            : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        Werewolf
                      </button>
                    </div>
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
            );
          })}
        </div>
      </div>
    </>
  );
};
