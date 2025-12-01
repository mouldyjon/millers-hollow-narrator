import { useState } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { roles } from "../data/roles";
import type { Player } from "../types/game";

interface RoleAssignmentReferenceProps {
  players: Player[];
}

export const RoleAssignmentReference = ({
  players,
}: RoleAssignmentReferenceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get players with assigned roles
  const assignedPlayers = players.filter((p) => p.assignedRole);

  // If no roles assigned, don't show the panel
  if (assignedPlayers.length === 0) {
    return null;
  }

  // Group by team
  const villageTeam = assignedPlayers.filter(
    (p) => p.assignedRole && roles[p.assignedRole].team === "village",
  );
  const werewolfTeam = assignedPlayers.filter(
    (p) => p.assignedRole && roles[p.assignedRole].team === "werewolf",
  );
  const soloTeam = assignedPlayers.filter(
    (p) => p.assignedRole && roles[p.assignedRole].team === "solo",
  );

  return (
    <div className="fixed bottom-20 left-4 z-50 max-w-[280px]">
      <div className="bg-slate-800 rounded-lg shadow-xl border-2 border-green-600/30">
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors rounded-t-lg"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-100">
              Role Assignments
            </span>
            <span className="text-sm text-slate-400">
              ({assignedPlayers.length} assigned)
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Expandable content */}
        {isExpanded && (
          <div className="p-4 pt-0 max-h-96 overflow-y-auto">
            <div className="text-xs text-slate-400 mb-3 italic">
              Narrator reference - keep this information secret!
            </div>

            {/* Village Team */}
            {villageTeam.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-blue-400 mb-2">
                  Village Team
                </h3>
                <div className="space-y-1">
                  {villageTeam.map((player) => (
                    <div
                      key={player.number}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        player.isAlive
                          ? "bg-slate-700/50"
                          : "bg-slate-700/20 opacity-50"
                      }`}
                    >
                      <span className="font-medium">
                        {player.name || `Player ${player.number}`}
                      </span>
                      <span className="text-blue-300">
                        {player.assignedRole && roles[player.assignedRole].name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Werewolf Team */}
            {werewolfTeam.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2">
                  Werewolf Team
                </h3>
                <div className="space-y-1">
                  {werewolfTeam.map((player) => (
                    <div
                      key={player.number}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        player.isAlive
                          ? "bg-slate-700/50"
                          : "bg-slate-700/20 opacity-50"
                      }`}
                    >
                      <span className="font-medium">
                        {player.name || `Player ${player.number}`}
                      </span>
                      <span className="text-red-300">
                        {player.assignedRole && roles[player.assignedRole].name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solo Team */}
            {soloTeam.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-purple-400 mb-2">
                  Special Roles
                </h3>
                <div className="space-y-1">
                  {soloTeam.map((player) => (
                    <div
                      key={player.number}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        player.isAlive
                          ? "bg-slate-700/50"
                          : "bg-slate-700/20 opacity-50"
                      }`}
                    >
                      <span className="font-medium">
                        {player.name || `Player ${player.number}`}
                      </span>
                      <span className="text-purple-300">
                        {player.assignedRole && roles[player.assignedRole].name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
