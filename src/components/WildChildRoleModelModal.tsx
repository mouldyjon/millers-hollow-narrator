import { X, UserCircle } from "lucide-react";
import type { Player } from "../types/game";
import { useState } from "react";

interface WildChildRoleModelModalProps {
  players: Player[];
  currentRoleModel?: number;
  onConfirm: (roleModelNumber: number) => void;
  onCancel: () => void;
}

export const WildChildRoleModelModal = ({
  players,
  currentRoleModel,
  onConfirm,
  onCancel,
}: WildChildRoleModelModalProps) => {
  const [selectedRoleModel, setSelectedRoleModel] = useState<number | null>(
    currentRoleModel ?? null,
  );

  const alivePlayers = players.filter((p) => p.isAlive);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">Wild Child's Role Model</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-300 mb-4">
            Select the Wild Child's role model. If this player dies, the Wild
            Child will become a werewolf.
          </p>

          {currentRoleModel && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-600/50">
              <p className="text-sm text-purple-200">
                Current Role Model: Player {currentRoleModel}
              </p>
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alivePlayers.map((player) => {
              const isSelected = selectedRoleModel === player.number;

              return (
                <button
                  key={player.number}
                  onClick={() => setSelectedRoleModel(player.number)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-purple-600 border-2 border-purple-400"
                      : "bg-slate-700 border-2 border-slate-600 hover:border-purple-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Player {player.number}</span>
                    {isSelected && (
                      <UserCircle className="w-4 h-4 text-purple-200" />
                    )}
                  </div>
                  {player.notes && (
                    <p className="text-sm text-slate-300 mt-1">
                      {player.notes}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedRoleModel && onConfirm(selectedRoleModel)}
            disabled={selectedRoleModel === null}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
              selectedRoleModel !== null
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-slate-600 cursor-not-allowed text-slate-400"
            }`}
          >
            Confirm Role Model
          </button>
        </div>
      </div>
    </div>
  );
};
