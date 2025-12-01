import { X } from "lucide-react";
import { roles } from "../data/roles";
import type { RoleId, Player } from "../types/game";
import { Button } from "./ui";

interface RoleRevealModalProps {
  playerNumber: number;
  selectedRoles: RoleId[];
  players: Player[];
  onConfirm: (playerNumber: number, roleName: string, roleId: RoleId) => void;
  onCancel: () => void;
}

export const RoleRevealModal = ({
  playerNumber,
  selectedRoles,
  players,
  onConfirm,
  onCancel,
}: RoleRevealModalProps) => {
  const handleRoleSelect = (roleId: RoleId) => {
    const role = roles[roleId];
    onConfirm(playerNumber, role.name, roleId);
  };

  // Count how many times each role has been revealed
  // Only count dead players (not alive) to handle revive scenarios correctly
  const revealedRoleCounts = players.reduce(
    (counts, p) => {
      // Only count if they have a revealed role AND are currently dead
      if (p.actualRole && !p.isAlive) {
        counts[p.actualRole] = (counts[p.actualRole] || 0) + 1;
      }
      return counts;
    },
    {} as Record<RoleId, number>,
  );

  // Count how many times each role appears in selectedRoles
  // Account for multi-player roles (Two Sisters = 2 players, Three Brothers = 3 players)
  const totalRoleCounts = selectedRoles.reduce(
    (counts, roleId) => {
      let multiplier = 1;
      if (roleId === "two-sisters") multiplier = 2;
      if (roleId === "three-brothers") multiplier = 3;

      counts[roleId] = (counts[roleId] || 0) + multiplier;
      return counts;
    },
    {} as Record<RoleId, number>,
  );

  // Get unique role IDs from selectedRoles
  const uniqueRoleIds = Array.from(new Set(selectedRoles));

  // Filter available roles: keep roles where revealed count < total count
  const availableRoles = uniqueRoleIds.filter((roleId) => {
    const revealed = revealedRoleCounts[roleId] || 0;
    const total = totalRoleCounts[roleId] || 0;
    return revealed < total;
  });

  // Group available roles by team
  const villageRoles = availableRoles
    .filter((roleId) => roles[roleId].team === "village")
    .map((roleId) => roles[roleId]);
  const werewolfRoles = availableRoles
    .filter((roleId) => roles[roleId].team === "werewolf")
    .map((roleId) => roles[roleId]);
  const soloRoles = availableRoles
    .filter((roleId) => roles[roleId].team === "solo")
    .map((roleId) => roles[roleId]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-header text-amber-100">
            Reveal Role - Player {playerNumber}
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-slate-300">
            Select the role that was revealed when Player {playerNumber} was
            eliminated:
          </p>

          {/* Village Team */}
          {villageRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400 font-header">
                Village Team
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {villageRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="p-4 bg-slate-700 hover:bg-blue-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold">{role.name}</div>
                    <div className="text-sm text-slate-400 mt-1 line-clamp-2">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Werewolf Team */}
          {werewolfRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-400 font-header">
                Werewolf Team
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {werewolfRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="p-4 bg-slate-700 hover:bg-red-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold">{role.name}</div>
                    <div className="text-sm text-slate-400 mt-1 line-clamp-2">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Solo Team */}
          {soloRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-400 font-header">
                Special Roles
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {soloRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="p-4 bg-slate-700 hover:bg-purple-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold">{role.name}</div>
                    <div className="text-sm text-slate-400 mt-1 line-clamp-2">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-700">
            <Button onClick={onCancel} variant="secondary" size="md" fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
