import { Users, Play } from "lucide-react";
import { roles } from "../data/roles";
import type { RoleId } from "../types/game";

interface SetupScreenProps {
  playerCount: number;
  selectedRoles: RoleId[];
  onPlayerCountChange: (count: number) => void;
  onToggleRole: (roleId: RoleId) => void;
  onStartGame: () => void;
}

export const SetupScreen = ({
  playerCount,
  selectedRoles,
  onPlayerCountChange,
  onToggleRole,
  onStartGame,
}: SetupScreenProps) => {
  const isValidSetup = selectedRoles.length === playerCount && playerCount >= 8;

  const getRoleCount = (roleId: RoleId): number => {
    if (roleId === "two-sisters") return 2;
    if (roleId === "three-brothers") return 3;
    return 1;
  };

  const totalRoleSlots = selectedRoles.reduce((sum, roleId) => {
    return sum + getRoleCount(roleId);
  }, 0);

  const villageTeamRoles = Object.values(roles).filter(
    (r) => r.team === "village",
  );
  const werewolfTeamRoles = Object.values(roles).filter(
    (r) => r.team === "werewolf",
  );
  const soloTeamRoles = Object.values(roles).filter((r) => r.team === "solo");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Miller's Hollow Narrator
        </h1>

        {/* Player Count Selector */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-semibold">Player Count</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlayerCountChange(Math.max(8, playerCount - 1))}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
            >
              -
            </button>
            <span className="text-3xl font-bold w-16 text-center">
              {playerCount}
            </span>
            <button
              onClick={() => onPlayerCountChange(Math.min(30, playerCount + 1))}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
            >
              +
            </button>
            <div className="ml-auto text-sm">
              <span
                className={
                  totalRoleSlots === playerCount
                    ? "text-green-400"
                    : "text-orange-400"
                }
              >
                {totalRoleSlots} / {playerCount} roles selected
              </span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-6">
          {/* Village Team */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Village Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {villageTeamRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onToggleRole(role.id)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedRoles.includes(role.id)
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {role.name}
                    {getRoleCount(role.id) > 1 && (
                      <span className="ml-2 text-xs bg-slate-900 px-2 py-1 rounded">
                        ×{getRoleCount(role.id)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Werewolf Team */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-400">
              Werewolf Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {werewolfTeamRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onToggleRole(role.id)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedRoles.includes(role.id)
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <div className="font-semibold mb-1">{role.name}</div>
                  <div className="text-xs text-slate-300">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Solo Team */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">
              Special Roles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {soloTeamRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onToggleRole(role.id)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedRoles.includes(role.id)
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <div className="font-semibold mb-1">{role.name}</div>
                  <div className="text-xs text-slate-300">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartGame}
            disabled={!isValidSetup}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg text-xl font-semibold transition-colors ${
              isValidSetup
                ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                : "bg-slate-700 cursor-not-allowed opacity-50"
            }`}
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>

        {!isValidSetup && totalRoleSlots !== playerCount && (
          <p className="text-center mt-4 text-orange-400">
            Please select exactly {playerCount} role slots to start the game
          </p>
        )}
      </div>
    </div>
  );
};
