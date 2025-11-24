import { X, Users, AlertCircle } from "lucide-react";
import type { Player } from "../types/game";
import { useState } from "react";
import { Button } from "./ui";

interface CursedWolfFatherModalProps {
  players: Player[];
  onConfirm: (playerNumber: number) => void;
  onCancel: () => void;
}

export const CursedWolfFatherModal = ({
  players,
  onConfirm,
  onCancel,
}: CursedWolfFatherModalProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold font-header text-amber-100">
              Select Victim to Infect
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
          {/* Guidance Section */}
          <div className="mb-4 p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-200">
                  Cursed Wolf-Father Infection:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Can infect one victim once per game</li>
                  <li>The victim is secretly converted to become a werewolf</li>
                  <li>
                    After confirming, you must{" "}
                    <strong>discreetly notify</strong> the infected player (tap
                    their shoulder, whisper, etc.)
                  </li>
                  <li>
                    The infected player keeps their original role card but now
                    wakes with the werewolves
                  </li>
                  <li>
                    They <strong>lose all abilities</strong> from their original
                    role and become a regular werewolf
                  </li>
                  <li>Other villagers must not know about the conversion</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-slate-300 mb-4 font-semibold">
            Select the victim to infect:
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
                  className={`w-full p-3 rounded-lg text-left transition-colours ${
                    selectedPlayer === player.number
                      ? "bg-orange-600 border-2 border-orange-400"
                      : "bg-slate-700 border-2 border-slate-600 hover:border-orange-400"
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
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedPlayer && onConfirm(selectedPlayer)}
            disabled={selectedPlayer === null}
            variant="primary"
            size="md"
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            Infect Player
          </Button>
        </div>
      </div>
    </div>
  );
};
