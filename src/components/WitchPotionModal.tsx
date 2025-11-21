import { X, Heart, Skull } from "lucide-react";
import type { Player } from "../types/game";

interface WitchPotionModalProps {
  potionType: "healing" | "death";
  players: Player[];
  onConfirm: (playerNumber: number) => void;
  onCancel: () => void;
}

export const WitchPotionModal = ({
  potionType,
  players,
  onConfirm,
  onCancel,
}: WitchPotionModalProps) => {
  const isHealing = potionType === "healing";

  // For healing potion, only show dead players
  // For death potion, only show alive players
  const eligiblePlayers = players.filter((p) =>
    isHealing ? !p.isAlive : p.isAlive,
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {isHealing ? (
              <Heart className="w-6 h-6 text-green-400" />
            ) : (
              <Skull className="w-6 h-6 text-red-400" />
            )}
            <h2 className="text-xl font-bold">
              {isHealing ? "Healing Potion" : "Death Potion"}
            </h2>
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
            {isHealing
              ? "Select a player to revive:"
              : "Select a player to eliminate:"}
          </p>

          {eligiblePlayers.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              No eligible players available
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {eligiblePlayers.map((player) => (
                <button
                  key={player.number}
                  onClick={() => onConfirm(player.number)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isHealing
                      ? "bg-green-600/20 hover:bg-green-600/30 border border-green-600/50"
                      : "bg-red-600/20 hover:bg-red-600/30 border border-red-600/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Player {player.number}</span>
                    {player.revealedRole && (
                      <span className="text-sm text-slate-400">
                        {player.revealedRole}
                      </span>
                    )}
                  </div>
                  {player.notes && (
                    <p className="text-sm text-slate-400 mt-1">
                      {player.notes}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
