import { Hand } from "lucide-react";
import { Button } from "./ui";

interface WakeUpPromptProps {
  roleName: string;
  team: "village" | "werewolf" | "solo";
  onWakeUp: () => void;
}

/**
 * Wake Up Prompt - Shows when it's a role's turn in auto-narrator mode
 * Players tap this to see their role-specific action screen
 */
export const WakeUpPrompt = ({
  roleName,
  team,
  onWakeUp,
}: WakeUpPromptProps) => {
  // Team-specific colours
  const teamColours = {
    village: {
      bg: "from-blue-900/40 to-blue-800/40",
      border: "border-blue-700/50",
      text: "text-blue-400",
      button: "primary",
    },
    werewolf: {
      bg: "from-red-900/40 to-red-800/40",
      border: "border-red-700/50",
      text: "text-red-400",
      button: "danger",
    },
    solo: {
      bg: "from-purple-900/40 to-purple-800/40",
      border: "border-purple-700/50",
      text: "text-purple-400",
      button: "secondary",
    },
  };

  const colours = teamColours[team];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `
          radial-gradient(ellipse at top, rgba(30, 41, 59, 0.3) 0%, transparent 60%),
          radial-gradient(ellipse at bottom, rgba(15, 23, 42, 0.6) 0%, transparent 60%),
          linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `,
      }}
    >
      <div
        className={`bg-gradient-to-br ${colours.bg} border ${colours.border} rounded-2xl p-12 max-w-2xl w-full text-center space-y-8 shadow-2xl`}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Hand className={`w-32 h-32 ${colours.text}`} />
            <div className="absolute inset-0 animate-ping opacity-20">
              <Hand className={`w-32 h-32 ${colours.text}`} />
            </div>
          </div>
        </div>

        {/* Role name */}
        <div className="space-y-3">
          <h1 className={`text-5xl font-bold ${colours.text} font-header`}>
            {roleName}
          </h1>
          <p className="text-2xl text-slate-300">Wake up!</p>
        </div>

        {/* Instructions */}
        <p className="text-lg text-slate-400">
          If you are the <span className={`font-semibold ${colours.text}`}>{roleName}</span>,
          pick up the device and tap below to begin your turn.
        </p>

        {/* Wake up button */}
        <div className="pt-4">
          <Button
            onClick={onWakeUp}
            variant={colours.button as "primary" | "danger" | "secondary"}
            size="lg"
            className="text-2xl px-12 py-6"
          >
            <Hand className="w-8 h-8" />
            Tap to Continue
          </Button>
        </div>

        {/* Warning */}
        <p className="text-sm text-slate-500 italic pt-4">
          Keep your eyes closed if this is not your role
        </p>
      </div>
    </div>
  );
};
