import { X, Heart } from "lucide-react";
import type { Player } from "../types/game";
import { useState } from "react";

interface CupidLoversModalProps {
  players: Player[];
  currentLovers?: [number, number];
  onConfirm: (lover1: number, lover2: number) => void;
  onCancel: () => void;
}

export const CupidLoversModal = ({
  players,
  currentLovers,
  onConfirm,
  onCancel,
}: CupidLoversModalProps) => {
  const [lover1, setLover1] = useState<number | null>(
    currentLovers?.[0] ?? null,
  );
  const [lover2, setLover2] = useState<number | null>(
    currentLovers?.[1] ?? null,
  );

  const handlePlayerClick = (playerNumber: number) => {
    // If this player is already selected, deselect them
    if (lover1 === playerNumber) {
      setLover1(null);
    } else if (lover2 === playerNumber) {
      setLover2(null);
    }
    // If neither lover is selected, set as lover1
    else if (lover1 === null) {
      setLover1(playerNumber);
    }
    // If only lover1 is selected, set as lover2
    else if (lover2 === null) {
      setLover2(playerNumber);
    }
    // If both are selected, replace lover1
    else {
      setLover1(playerNumber);
      setLover2(null);
    }
  };

  const handleConfirm = () => {
    if (lover1 !== null && lover2 !== null) {
      onConfirm(lover1, lover2);
    }
  };

  const alivePlayers = players.filter((p) => p.isAlive);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-bold">Cupid's Lovers</h2>
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
            Select two players to become lovers:
          </p>

          <div className="mb-4 flex items-center justify-center gap-3 text-sm">
            <div
              className={`px-4 py-2 rounded-lg ${
                lover1 !== null
                  ? "bg-pink-600 text-white font-semibold"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {lover1 !== null ? `Player ${lover1}` : "Lover 1"}
            </div>
            <Heart className="w-5 h-5 text-pink-400" />
            <div
              className={`px-4 py-2 rounded-lg ${
                lover2 !== null
                  ? "bg-pink-600 text-white font-semibold"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {lover2 !== null ? `Player ${lover2}` : "Lover 2"}
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alivePlayers.map((player) => {
              const isSelected =
                lover1 === player.number || lover2 === player.number;

              return (
                <button
                  key={player.number}
                  onClick={() => handlePlayerClick(player.number)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-pink-600 border-2 border-pink-400"
                      : "bg-slate-700 border-2 border-slate-600 hover:border-pink-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Player {player.number}</span>
                    {isSelected && <Heart className="w-4 h-4 text-pink-200" />}
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
            onClick={handleConfirm}
            disabled={lover1 === null || lover2 === null}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
              lover1 !== null && lover2 !== null
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-slate-600 cursor-not-allowed text-slate-400"
            }`}
          >
            Confirm Lovers
          </button>
        </div>
      </div>
    </div>
  );
};
