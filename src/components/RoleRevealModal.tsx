import { X } from "lucide-react";
import { roles } from "../data/roles";
import type { RoleId } from "../types/game";

interface RoleRevealModalProps {
  playerNumber: number;
  selectedRoles: RoleId[];
  onConfirm: (playerNumber: number, roleName: string, roleId: RoleId) => void;
  onCancel: () => void;
}

export const RoleRevealModal = ({
  playerNumber,
  selectedRoles,
  onConfirm,
  onCancel,
}: RoleRevealModalProps) => {
  const handleRoleSelect = (roleId: RoleId) => {
    const role = roles[roleId];
    onConfirm(playerNumber, role.name, roleId);
  };

  // Group roles by team
  const villageRoles = selectedRoles
    .filter((roleId) => roles[roleId].team === "village")
    .map((roleId) => roles[roleId]);
  const werewolfRoles = selectedRoles
    .filter((roleId) => roles[roleId].team === "werewolf")
    .map((roleId) => roles[roleId]);
  const soloRoles = selectedRoles
    .filter((roleId) => roles[roleId].team === "solo")
    .map((roleId) => roles[roleId]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Reveal Role - Player {playerNumber}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-slate-300">
            Select the role that was revealed when Player {playerNumber} was
            eliminated:
          </p>

          {/* Village Team */}
          {villageRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">
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
              <h3 className="text-lg font-semibold mb-3 text-red-400">
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
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
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
            <button
              onClick={onCancel}
              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
