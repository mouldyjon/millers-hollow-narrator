import { User, Skull, Eye, EyeOff } from 'lucide-react';

interface Player {
  number: number;
  isAlive: boolean;
  revealedRole?: string;
  notes?: string;
}

interface PlayerListProps {
  playerCount: number;
  players: Player[];
  onToggleAlive: (playerNumber: number) => void;
  onSetRevealedRole: (playerNumber: number, role: string) => void;
  onUpdateNotes: (playerNumber: number, notes: string) => void;
}

export const PlayerList = ({
  playerCount,
  players,
  onToggleAlive,
  onSetRevealedRole,
  onUpdateNotes,
}: PlayerListProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Players ({players.filter(p => p.isAlive).length} / {playerCount} alive)
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {players.map((player) => (
          <div
            key={player.number}
            className={`p-3 rounded-lg border-2 transition-all ${
              player.isAlive
                ? 'bg-slate-700 border-slate-600'
                : 'bg-slate-900 border-red-900 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">Player {player.number}</span>
                {!player.isAlive && (
                  <Skull className="w-4 h-4 text-red-400" />
                )}
              </div>

              <button
                onClick={() => onToggleAlive(player.number)}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  player.isAlive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {player.isAlive ? 'Eliminate' : 'Revive'}
              </button>
            </div>

            {player.revealedRole && (
              <div className="mb-2 px-2 py-1 bg-blue-900 rounded text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Role: {player.revealedRole}</span>
              </div>
            )}

            <input
              type="text"
              placeholder="Notes (e.g., suspected werewolf, claims seer...)"
              value={player.notes || ''}
              onChange={(e) => onUpdateNotes(player.number, e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
