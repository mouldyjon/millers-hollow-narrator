import { Sunrise, AlertTriangle, Shield, Skull } from "lucide-react";
import type { RoleId, Player } from "../types/game";

interface DawnPhaseProps {
  selectedRoles: RoleId[];
  players: Player[];
  sheriff?: number;
  onStartDay: () => void;
}

export const DawnPhase = ({
  selectedRoles,
  players,
  sheriff,
  onStartDay,
}: DawnPhaseProps) => {
  const announcements: {
    icon: React.ReactNode;
    title: string;
    message: string;
    type: "info" | "warning" | "danger";
  }[] = [];

  // Check for Bear Tamer
  if (selectedRoles.includes("bear-tamer")) {
    const bearTamerPlayer = players.find((p) => p.actualRole === "bear-tamer");
    if (bearTamerPlayer?.isAlive) {
      // Check if any werewolf is adjacent (player number +/- 1, wrapping around)
      const playerCount = players.length;
      const bearTamerNum = bearTamerPlayer.number;
      const leftNeighbour =
        bearTamerNum === 1 ? playerCount : bearTamerNum - 1;
      const rightNeighbour =
        bearTamerNum === playerCount ? 1 : bearTamerNum + 1;

      const leftPlayer = players.find((p) => p.number === leftNeighbour);
      const rightPlayer = players.find((p) => p.number === rightNeighbour);

      const isWerewolf = (player?: Player) => {
        if (!player?.isAlive) return false;
        return (
          player.actualRole === "simple-werewolf" ||
          player.actualRole === "big-bad-wolf" ||
          player.actualRole === "white-werewolf" ||
          player.actualRole === "cursed-wolf-father"
        );
      };

      if (isWerewolf(leftPlayer) || isWerewolf(rightPlayer)) {
        announcements.push({
          icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
          title: "The Bear Growls!",
          message: `Grrrrr! The Bear Tamer's bear is growling. A werewolf is adjacent to Player ${bearTamerNum}!`,
          type: "warning",
        });
      } else {
        announcements.push({
          icon: <AlertTriangle className="w-12 h-12 text-green-400" />,
          title: "The Bear is Calm",
          message: `The Bear Tamer's bear is quiet and peaceful. No werewolves are adjacent to Player ${bearTamerNum}.`,
          type: "info",
        });
      }
    }
  }

  // Check for Sheriff death
  if (sheriff) {
    const sheriffPlayer = players.find((p) => p.number === sheriff);
    if (sheriffPlayer && !sheriffPlayer.isAlive) {
      announcements.push({
        icon: <Shield className="w-12 h-12 text-blue-400" />,
        title: "The Sheriff Has Died",
        message: `Player ${sheriff} was the Sheriff. The village must elect a new Sheriff during the day phase.`,
        type: "info",
      });
    }
  }

  // Check for Knight with Rusty Sword infection
  // Note: This would require tracking who was infected during the night
  // For now, we'll add a reminder if the role is in play
  if (selectedRoles.includes("knight-rusty-sword")) {
    const knightPlayer = players.find(
      (p) => p.actualRole === "knight-rusty-sword",
    );
    if (knightPlayer && !knightPlayer.isAlive) {
      announcements.push({
        icon: <Skull className="w-12 h-12 text-red-400" />,
        title: "Knight with Rusty Sword Reminder",
        message:
          "The Knight with Rusty Sword has died. If they struck a player, that player should now reveal their role and be eliminated (they become a werewolf at death).",
        type: "danger",
      });
    }
  }

  // If no announcements, add a generic dawn message
  if (announcements.length === 0) {
    announcements.push({
      icon: <Sunrise className="w-12 h-12 text-orange-400" />,
      title: "Dawn Breaks",
      message:
        "The sun rises over Miller's Hollow. The village prepares for the day ahead.",
      type: "info",
    });
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-900/20";
      case "danger":
        return "bg-red-900/20";
      default:
        return "bg-blue-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-slate-900 text-slate-100 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <Sunrise className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Dawn</h1>
          <p className="text-slate-300">
            The night ends and the sun begins to rise...
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className={`${getBackgroundColor(announcement.type)} rounded-lg p-6 border-2 ${
                announcement.type === "warning"
                  ? "border-yellow-600"
                  : announcement.type === "danger"
                    ? "border-red-600"
                    : "border-blue-600"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{announcement.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {announcement.title}
                  </h2>
                  <p className="text-lg text-slate-200">{announcement.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onStartDay}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
          >
            Start Day Phase
          </button>
        </div>
      </div>
    </div>
  );
};
