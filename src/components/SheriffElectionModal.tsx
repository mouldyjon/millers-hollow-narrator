import { useState } from "react";
import { Shield, X } from "lucide-react";
import { Button } from "./ui";
import type { Player } from "../types/game";

interface SheriffElectionModalProps {
  players: Player[];
  onElectSheriff: (playerNumber: number) => void;
  onSkipElection: () => void;
}

export const SheriffElectionModal = ({
  players,
  onElectSheriff,
  onSkipElection,
}: SheriffElectionModalProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive);

  const handleConfirmElection = () => {
    if (selectedPlayer !== null) {
      onElectSheriff(selectedPlayer);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold font-header text-amber-100">
              Elect the Sheriff
            </h2>
          </div>
          <Button
            onClick={onSkipElection}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4 mb-6">
            <p className="text-blue-200 font-medium mb-2">
              <strong>Sheriff Election:</strong>
            </p>
            <p className="text-blue-100 text-sm">
              Time to elect a Sheriff! Candidates can nominate themselves.
              Everyone votes for their preferred candidate. The Sheriff's vote
              counts as 2 votes during village voting.
            </p>
          </div>

          <p className="text-slate-300 mb-6">
            Mark the player who was elected as Sheriff:
          </p>

          {alivePlayers.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No alive players remaining
            </p>
          ) : (
            <div className="space-y-2 mb-6">
              {alivePlayers.map((player) => (
                <button
                  key={player.number}
                  onClick={() => setSelectedPlayer(player.number)}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    selectedPlayer === player.number
                      ? "bg-yellow-600/30 border-2 border-yellow-400"
                      : "bg-slate-700 border-2 border-slate-600 hover:border-yellow-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium text-lg">
                        {player.name || `Player ${player.number}`}
                      </span>
                      {player.name && (
                        <span className="text-sm text-slate-400">
                          Player {player.number}
                        </span>
                      )}
                    </div>
                    {selectedPlayer === player.number && (
                      <Shield className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleConfirmElection}
              disabled={selectedPlayer === null}
              variant="primary"
              size="lg"
              fullWidth
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Shield className="w-5 h-5" />
              Elect Sheriff
            </Button>
            <Button
              onClick={onSkipElection}
              variant="secondary"
              size="lg"
              fullWidth
            >
              Skip Election
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
