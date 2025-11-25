import { roles } from "../data/roles";
import type { RoleId } from "../types/game";

interface RoleReferenceProps {
  selectedRoles: RoleId[];
  isDayPhase?: boolean;
}

export const RoleReference = ({
  selectedRoles,
  isDayPhase = false,
}: RoleReferenceProps) => {
  // Get unique role IDs and their data
  const uniqueRoleIds = Array.from(new Set(selectedRoles));

  // Count occurrences of each role
  const roleCounts = selectedRoles.reduce(
    (counts, roleId) => {
      counts[roleId] = (counts[roleId] || 0) + 1;
      return counts;
    },
    {} as Record<RoleId, number>,
  );

  // Group roles by team
  const villageRoles = uniqueRoleIds
    .filter((id) => roles[id].team === "village")
    .map((id) => ({ ...roles[id], count: roleCounts[id] }));

  const werewolfRoles = uniqueRoleIds
    .filter((id) => roles[id].team === "werewolf")
    .map((id) => ({ ...roles[id], count: roleCounts[id] }));

  const soloRoles = uniqueRoleIds
    .filter((id) => roles[id].team === "solo")
    .map((id) => ({ ...roles[id], count: roleCounts[id] }));

  const getTeamColor = (team: string) => {
    switch (team) {
      case "village":
        return isDayPhase
          ? "text-blue-600 border-blue-300"
          : "text-blue-400 border-blue-600";
      case "werewolf":
        return isDayPhase
          ? "text-red-600 border-red-300"
          : "text-red-400 border-red-600";
      case "solo":
        return isDayPhase
          ? "text-purple-600 border-purple-300"
          : "text-purple-400 border-purple-600";
      default:
        return isDayPhase
          ? "text-slate-600 border-slate-300"
          : "text-slate-400 border-slate-600";
    }
  };

  const RoleList = ({
    roleList,
    team,
  }: {
    roleList: Array<{ id: RoleId; name: string; description: string; team: string; count: number }>;
    team: string;
  }) => {
    if (roleList.length === 0) return null;

    return (
      <div className="mb-4">
        <h4
          className={`text-sm font-bold mb-2 font-header ${getTeamColor(team).split(" ")[0]}`}
        >
          {team === "village"
            ? "Village Team"
            : team === "werewolf"
              ? "Werewolf Team"
              : "Special Roles"}
        </h4>
        <div className="space-y-2">
          {roleList.map((role) => (
            <div
              key={role.id}
              className={`p-2 rounded border ${isDayPhase ? "bg-white/50" : "bg-slate-700/50"} ${getTeamColor(team).split(" ")[1]}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">
                  {role.name}
                </span>
                {role.count > 1 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600 text-white">
                    ×{role.count}
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDayPhase ? "text-slate-700" : "text-slate-400"}`}>
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3
          className={`text-lg font-bold mb-4 font-header ${isDayPhase ? "text-amber-700" : "text-amber-100"}`}
        >
          Roles in Game
        </h3>

        <RoleList roleList={villageRoles} team="village" />
        <RoleList roleList={werewolfRoles} team="werewolf" />
        <RoleList roleList={soloRoles} team="solo" />

        <div
          className={`mt-4 pt-4 border-t ${isDayPhase ? "border-slate-300" : "border-slate-700"}`}
        >
          <p className={`text-xs ${isDayPhase ? "text-slate-600" : "text-slate-400"}`}>
            Total: {selectedRoles.length} role{selectedRoles.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};
