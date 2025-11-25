import { Trophy, Users, Moon, Crown } from "lucide-react";

interface VictoryAnnouncementProps {
  winner: "village" | "werewolves" | "solo";
  message: string;
  onDismiss: () => void;
}

export const VictoryAnnouncement = ({
  winner,
  message,
  onDismiss,
}: VictoryAnnouncementProps) => {
  const config = {
    village: {
      icon: Users,
      title: "Village Victory!",
      bgGradient: "from-blue-900 via-blue-700 to-blue-900",
      iconColour: "text-blue-200",
      borderColour: "border-blue-400",
    },
    werewolves: {
      icon: Moon,
      title: "Werewolves Victory!",
      bgGradient: "from-red-900 via-red-700 to-red-900",
      iconColour: "text-red-200",
      borderColour: "border-red-400",
    },
    solo: {
      icon: Crown,
      title: "Solo Victory!",
      bgGradient: "from-purple-900 via-purple-700 to-purple-900",
      iconColour: "text-purple-200",
      borderColour: "border-purple-400",
    },
  };

  const {
    icon: Icon,
    title,
    bgGradient,
    iconColour,
    borderColour,
  } = config[winner];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`bg-gradient-to-br ${bgGradient} rounded-2xl border-4 ${borderColour} shadow-2xl max-w-lg w-full overflow-hidden`}
      >
        {/* Trophy banner */}
        <div className="relative bg-black/20 py-8 flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-transparent" />
          <Trophy className="w-20 h-20 text-yellow-300 mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-white drop-shadow-lg relative z-10">
            {title}
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={`${iconColour} p-6 bg-white/10 rounded-full`}
              style={{
                filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
              }}
            >
              <Icon size={80} strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <p className="text-xl text-white text-center font-medium leading-relaxed">
            {message}
          </p>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="w-full px-6 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-lg transition-all duration-200 backdrop-blur-sm border-2 border-white/30 hover:border-white/50"
          >
            Continue Game
          </button>
        </div>
      </div>
    </div>
  );
};
