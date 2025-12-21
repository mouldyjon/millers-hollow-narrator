import { useState, useEffect } from "react";
import { Users, X, Shield } from "lucide-react";
import { Button } from "./ui";
import type { Player } from "../types/game";

interface DayVotingModalProps {
  players: Player[];
  sheriff?: number;
  isSecondVote?: boolean;
  onEliminate: (playerNumber: number) => void;
  onNoElimination: () => void;
  onCancel: () => void;
}

export const DayVotingModal = ({
  players,
  sheriff,
  isSecondVote = false,
  onEliminate,
  onNoElimination,
  onCancel,
}: DayVotingModalProps) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive);
  const sheriffPlayer = players.find((p) => p.number === sheriff);

  const handleStartCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) {
      return;
    }

    if (countdown === 0) {
      // Countdown finished, show player selection after a brief delay
      const timer = setTimeout(() => {
        setShowPlayerSelection(true);
        setCountdown(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleConfirmElimination = () => {
    if (selectedPlayer !== null) {
      onEliminate(selectedPlayer);
    }
  };

  if (showPlayerSelection) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold font-header text-amber-100">
                {isSecondVote ? "Second Elimination" : "Mark Eliminated Player"}
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
            {/* Sheriff Reminder */}
            {sheriff && sheriffPlayer?.isAlive && (
              <div className="bg-blue-900/50 border border-blue-400 rounded p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-bold">
                    Player {sheriff} is the Sheriff - their vote counts as 2
                    votes
                  </span>
                </div>
              </div>
            )}

            <p className="text-slate-300 mb-6">
              {isSecondVote
                ? "Mark the second player eliminated by the village vote:"
                : "Review the votes and mark the player who was eliminated:"}
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
                        ? "bg-red-600/30 border-2 border-red-400"
                        : "bg-slate-700 border-2 border-slate-600 hover:border-red-400"
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
                        <span className="text-red-400 font-bold">
                          ELIMINATED
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleConfirmElimination}
                disabled={selectedPlayer === null}
                variant="primary"
                size="lg"
                fullWidth
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Elimination
              </Button>
              <Button
                onClick={onNoElimination}
                variant="secondary"
                size="lg"
                fullWidth
              >
                No Elimination
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-900 to-slate-900 rounded-lg shadow-xl max-w-2xl w-full p-12 text-center">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1" />
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Users className="w-20 h-20 text-amber-400 mx-auto mb-6" />

        <h2 className="text-4xl font-bold font-header text-amber-100 mb-4">
          {isSecondVote ? "Second Vote" : "Village Voting"}
        </h2>

        <p className="text-2xl text-slate-200 mb-8">
          {isSecondVote
            ? "Stuttering Judge has called for a second elimination"
            : "It's time for the village to vote"}
        </p>

        {countdown === null ? (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <p className="text-lg text-slate-300 mb-4">
                <strong>Instructions:</strong>
              </p>
              <p className="text-slate-300">
                On the count of 3, everyone point at who you want to eliminate.
                The narrator will then mark the eliminated player.
              </p>
            </div>

            <Button
              onClick={handleStartCountdown}
              variant="primary"
              size="lg"
              className="text-2xl px-12 py-8"
            >
              Start Countdown
            </Button>
          </div>
        ) : (
          <div className="py-12">
            <div
              className={`text-9xl font-bold font-header transition-all duration-300 ${
                countdown === 3
                  ? "text-amber-400 scale-100"
                  : countdown === 2
                    ? "text-amber-300 scale-110"
                    : "text-green-400 scale-125"
              }`}
            >
              {countdown === 0 ? "VOTE!" : countdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
