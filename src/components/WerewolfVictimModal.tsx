import { X, Moon, AlertCircle } from "lucide-react";
import type { Player } from "../types/game";
import { useState } from "react";

interface WerewolfVictimModalProps {
  players: Player[];
  werewolfType: "simple" | "big-bad" | "white";
  onConfirm: (playerNumber: number) => void;
  onCancel: () => void;
}

export const WerewolfVictimModal = ({
  players,
  werewolfType,
  onConfirm,
  onCancel,
}: WerewolfVictimModalProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive);

  const getTitle = () => {
    switch (werewolfType) {
      case "simple":
        return "Werewolves Choose Victim";
      case "big-bad":
        return "Big Bad Wolf's Additional Victim";
      case "white":
        return "White Werewolf Eliminates Werewolf";
      default:
        return "Choose Victim";
    }
  };

  const getGuidance = () => {
    switch (werewolfType) {
      case "simple":
        return (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-200">
              How werewolf elimination works:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>All werewolves must agree on one victim</li>
              <li>
                They vote by pointing at their chosen victim when you call for
                it
              </li>
              <li>
                The victim with the most werewolf votes is selected (if tied,
                no one dies)
              </li>
              <li>The Little Girl may peek but risks being caught</li>
              <li>
                Once selected, mark the victim here (they will be revealed at
                dawn)
              </li>
            </ul>
          </div>
        );
      case "big-bad":
        return (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-200">Big Bad Wolf rules:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                Can only attack if the regular werewolves successfully killed
                someone
              </li>
              <li>Must choose a different victim than the werewolves</li>
              <li>This is an additional elimination</li>
            </ul>
          </div>
        );
      case "white":
        return (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-200">
              White Werewolf rules:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Only wakes every other night</li>
              <li>Must choose another werewolf to eliminate</li>
              <li>This is optional - can choose not to kill</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Moon className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold">{getTitle()}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Guidance Section */}
          <div className="mb-4 p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>{getGuidance()}</div>
            </div>
          </div>

          <p className="text-slate-300 mb-4 font-semibold">
            Select the victim:
          </p>

          {alivePlayers.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              No players available
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alivePlayers.map((player) => (
                <button
                  key={player.number}
                  onClick={() => setSelectedPlayer(player.number)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedPlayer === player.number
                      ? "bg-red-600 border-2 border-red-400"
                      : "bg-slate-700 border-2 border-slate-600 hover:border-red-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Player {player.number}</span>
                    {player.revealedRole && (
                      <span className="text-sm text-slate-300">
                        {player.revealedRole}
                      </span>
                    )}
                  </div>
                  {player.notes && (
                    <p className="text-sm text-slate-300 mt-1">
                      {player.notes}
                    </p>
                  )}
                  {player.wolfHoundTeam && (
                    <span className="text-xs text-slate-400 mt-1 block">
                      Wolf-Hound: {player.wolfHoundTeam}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedPlayer && onConfirm(selectedPlayer)}
            disabled={selectedPlayer === null}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
              selectedPlayer !== null
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-slate-600 cursor-not-allowed text-slate-400"
            }`}
          >
            Confirm Victim
          </button>
        </div>
      </div>
    </div>
  );
};
