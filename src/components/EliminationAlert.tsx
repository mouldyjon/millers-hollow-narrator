import { AlertTriangle, Heart, Skull, Swords, Users } from "lucide-react";

interface EliminationAlertProps {
  type:
    | "lovers"
    | "knight-rusty-sword"
    | "hunter"
    | "siblings"
    | "wild-child-transform";
  message: string;
  affectedPlayers?: number[];
  onConfirm: () => void;
  onSelectPlayer?: (playerNumber: number) => void;
  requiresPlayerSelection?: boolean;
  availablePlayers?: number[];
}

export const EliminationAlert = ({
  type,
  message,
  affectedPlayers = [],
  onConfirm,
  onSelectPlayer,
  requiresPlayerSelection = false,
  availablePlayers = [],
}: EliminationAlertProps) => {
  const getIcon = () => {
    switch (type) {
      case "lovers":
        return <Heart className="w-12 h-12 text-red-400" />;
      case "knight-rusty-sword":
        return <Swords className="w-12 h-12 text-yellow-400" />;
      case "hunter":
        return <Swords className="w-12 h-12 text-orange-400" />;
      case "siblings":
        return <Users className="w-12 h-12 text-blue-400" />;
      case "wild-child-transform":
        return <AlertTriangle className="w-12 h-12 text-purple-400" />;
      default:
        return <Skull className="w-12 h-12 text-slate-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "lovers":
        return "Lovers Die Together";
      case "knight-rusty-sword":
        return "Knight's Rusty Sword Strikes!";
      case "hunter":
        return "Hunter's Dying Shot!";
      case "siblings":
        return "Sibling Alert";
      case "wild-child-transform":
        return "Wild Child Transformation!";
      default:
        return "Special Event";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-lg w-full p-8 border-2 border-yellow-500">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{getIcon()}</div>
          <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
          <p className="text-lg text-slate-300 mb-6">{message}</p>

          {affectedPlayers.length > 0 && (
            <div className="mb-6 p-4 bg-slate-700 rounded-lg w-full">
              <p className="text-sm text-slate-400 mb-2">Affected Players:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {affectedPlayers.map((playerNum) => (
                  <span
                    key={playerNum}
                    className="px-3 py-1 bg-red-900 rounded-full font-semibold"
                  >
                    Player {playerNum}
                  </span>
                ))}
              </div>
            </div>
          )}

          {requiresPlayerSelection && availablePlayers.length > 0 && (
            <div className="mb-6 w-full">
              <p className="text-sm text-slate-400 mb-3">
                Select a player to eliminate:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {availablePlayers.map((playerNum) => (
                  <button
                    key={playerNum}
                    onClick={() => onSelectPlayer?.(playerNum)}
                    className="px-4 py-3 bg-slate-700 hover:bg-red-600 rounded-lg font-semibold transition-colors"
                  >
                    {playerNum}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!requiresPlayerSelection && (
            <button
              onClick={onConfirm}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-colors"
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
