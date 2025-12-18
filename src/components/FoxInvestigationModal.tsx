import { X, Search } from "lucide-react";
import type { Player } from "../types/game";
import { useState } from "react";
import { Button } from "./ui";

interface FoxInvestigationModalProps {
  players: Player[];
  cursedWolfFatherInfectedPlayer?: number;
  onConfirm: (playerNumbers: [number, number, number]) => void;
  onCancel: () => void;
}

export const FoxInvestigationModal = ({
  players,
  cursedWolfFatherInfectedPlayer,
  onConfirm,
  onCancel,
}: FoxInvestigationModalProps) => {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [hasWerewolf, setHasWerewolf] = useState(false);

  const handlePlayerClick = (playerNumber: number) => {
    if (selectedPlayers.includes(playerNumber)) {
      // Deselect
      setSelectedPlayers(selectedPlayers.filter((p) => p !== playerNumber));
    } else if (selectedPlayers.length < 3) {
      // Select (max 3)
      setSelectedPlayers([...selectedPlayers, playerNumber]);
    }
  };

  const handleInvestigate = () => {
    if (selectedPlayers.length !== 3) return;

    // Check if any of the selected players are werewolves
    const foundWerewolf = selectedPlayers.some((playerNum) => {
      const player = players.find((p) => p.number === playerNum);
      if (!player?.actualRole) return false;

      // Check if player is a werewolf OR infected by Cursed Wolf-Father
      const isWerewolf = player.actualRole.includes("werewolf");
      const isInfected = playerNum === cursedWolfFatherInfectedPlayer;

      return isWerewolf || isInfected;
    });

    setHasWerewolf(foundWerewolf);
    setShowResult(true);
  };

  const handleDone = () => {
    if (selectedPlayers.length === 3) {
      onConfirm(selectedPlayers as [number, number, number]);
    }
  };

  const alivePlayers = players.filter((p) => p.isAlive);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold font-header text-amber-100">
              Fox Investigation
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
          {!showResult ? (
            <>
              <p className="text-slate-300 mb-4">
                Select three adjacent players to investigate:
              </p>

              <div className="mb-4 flex items-center justify-center gap-2 text-sm">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-lg ${
                      selectedPlayers[index]
                        ? "bg-purple-600 text-white font-semibold"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {selectedPlayers[index]
                      ? `Player ${selectedPlayers[index]}`
                      : `Player ${index + 1}`}
                  </div>
                ))}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {alivePlayers.map((player) => {
                  const isSelected = selectedPlayers.includes(player.number);
                  const selectionOrder = selectedPlayers.indexOf(player.number);

                  return (
                    <button
                      key={player.number}
                      onClick={() => handlePlayerClick(player.number)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        isSelected
                          ? "bg-purple-600 border-2 border-purple-400"
                          : "bg-slate-700 border-2 border-slate-600 hover:border-purple-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {player.name || `Player ${player.number}`}
                          </span>
                          {player.name && (
                            <span className="text-xs text-slate-400">
                              Player {player.number}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-purple-700 px-2 py-1 rounded">
                              #{selectionOrder + 1}
                            </span>
                            <Search className="w-4 h-4 text-purple-200" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleInvestigate}
                disabled={selectedPlayers.length !== 3}
                variant="primary"
                size="md"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Investigate
              </Button>
            </>
          ) : (
            <>
              <div className="text-center space-y-6 py-6">
                <div
                  className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                    hasWerewolf
                      ? "bg-red-600/20 border-4 border-red-600"
                      : "bg-green-600/20 border-4 border-green-600"
                  }`}
                >
                  <span className="text-5xl">
                    {hasWerewolf ? "⚠️" : "✓"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2 text-amber-100 font-header">
                    Investigation Result
                  </h3>
                  <p className="text-lg text-slate-300">
                    {hasWerewolf ? (
                      <>
                        <span className="text-red-400 font-semibold">
                          At least one werewolf
                        </span>{" "}
                        is among the selected players
                      </>
                    ) : (
                      <>
                        <span className="text-green-400 font-semibold">
                          No werewolves
                        </span>{" "}
                        among the selected players
                      </>
                    )}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400">
                    Selected: Players {selectedPlayers.join(", ")}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleDone}
                variant="primary"
                size="md"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Done - Continue
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
