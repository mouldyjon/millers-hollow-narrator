import { ScrollText, Moon, Sun, AlertTriangle } from "lucide-react";
import type { GameEvent } from "../types/game";

interface EventLogProps {
  events: GameEvent[];
  theme?: "night" | "day";
}

const getEventIcon = (type: GameEvent["type"]) => {
  switch (type) {
    case "elimination":
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case "role_action":
      return <Moon className="w-4 h-4 text-indigo-400" />;
    case "day_vote":
      return <Sun className="w-4 h-4 text-amber-400" />;
    case "special":
      return <ScrollText className="w-4 h-4 text-purple-400" />;
  }
};

export const EventLog = ({ events, theme = "night" }: EventLogProps) => {
  const sortedEvents = [...events].reverse(); // Show most recent first

  // Theme-based styling
  const isDayTheme = theme === "day";
  const containerBg = isDayTheme ? "bg-white" : "bg-slate-800";
  const eventCardBg = isDayTheme ? "bg-slate-50" : "bg-slate-700";
  const eventCardBorder = isDayTheme ? "border-slate-300" : "border-slate-600";
  const eventCardHover = isDayTheme
    ? "hover:bg-slate-100"
    : "hover:bg-slate-650";
  const textPrimary = isDayTheme ? "text-slate-900" : "text-slate-100";
  const textSecondary = isDayTheme ? "text-slate-600" : "text-slate-400";
  const textTertiary = isDayTheme ? "text-slate-500" : "text-slate-500";
  const emptyText = isDayTheme ? "text-slate-500" : "text-slate-400";

  return (
    <div className={`${containerBg} rounded-lg p-4 shadow-lg`}>
      <h3
        className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textPrimary}`}
      >
        <ScrollText className="w-5 h-5" />
        Game Log ({events.length} events)
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <p className={`text-sm ${emptyText} italic`}>
            No events yet. The game will log important actions here.
          </p>
        ) : (
          sortedEvents.map((event, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${eventCardBg} border-l-4 ${eventCardBorder} ${eventCardHover}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${textSecondary}`}>
                      Night {event.night}
                    </span>
                    <span className={`text-xs ${textTertiary}`}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-sm ${textPrimary}`}>
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
