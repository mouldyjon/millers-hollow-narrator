import { X, Sparkles } from "lucide-react";
import { roles } from "../data/roles";
import type { RoleId } from "../types/game";
import { Button } from "./ui";
import { useState } from "react";

interface ThiefSwapModalProps {
  unusedRoles: [RoleId, RoleId];
  onConfirm: (chosenRole: RoleId | null) => void;
  onCancel: () => void;
}

export const ThiefSwapModal = ({
  unusedRoles,
  onConfirm,
  onCancel,
}: ThiefSwapModalProps) => {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  const handleKeepThief = () => {
    onConfirm(null); // null means keep Thief role
  };

  const handleSwap = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold font-header text-amber-100">
              Thief - Choose Your Role
            </h2>
          </div>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
            <p className="text-sm text-slate-300">
              <strong className="text-purple-200">Narrator Instructions:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-2 text-sm text-slate-300">
              <li>Show the Thief player these two unused role cards</li>
              <li>Ask if they want to swap their Thief card with one of them</li>
              <li>If they swap, they become that role for the rest of the game</li>
              <li>If they keep Thief, they remain a simple villager</li>
            </ol>
          </div>

          <p className="text-slate-300 mb-4 font-semibold">
            The Thief can choose one of these roles or keep their Thief card:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {unusedRoles.map((roleId) => {
              const role = roles[roleId];
              const isSelected = selectedRole === roleId;

              return (
                <button
                  key={roleId}
                  onClick={() => setSelectedRole(roleId)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-purple-600 border-2 border-purple-400"
                      : "bg-slate-700 border-2 border-slate-600 hover:border-purple-400"
                  }`}
                >
                  <div className="font-semibold text-lg mb-1">{role.name}</div>
                  <div className="text-sm text-slate-300 mb-2">
                    Team: {role.team}
                  </div>
                  <div className="text-sm text-slate-400">
                    {role.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg mb-4">
            <p className="text-sm text-slate-300">
              <strong>Or keep Thief role:</strong> Acts as a simple villager with no special powers
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <Button
            onClick={handleKeepThief}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Keep Thief (No Swap)
          </Button>
          <Button
            onClick={handleSwap}
            disabled={!selectedRole}
            variant="primary"
            size="md"
            className="flex-1"
          >
            Swap to {selectedRole ? roles[selectedRole].name : "Selected Role"}
          </Button>
        </div>
      </div>
    </div>
  );
};
