import { ScrollText, Moon, Sun, AlertTriangle } from 'lucide-react';
import type { GameEvent } from '../types/game';

interface EventLogProps {
  events: GameEvent[];
}

const getEventIcon = (type: GameEvent['type']) => {
  switch (type) {
    case 'elimination':
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case 'role_action':
      return <Moon className="w-4 h-4 text-indigo-400" />;
    case 'day_vote':
      return <Sun className="w-4 h-4 text-amber-400" />;
    case 'special':
      return <ScrollText className="w-4 h-4 text-purple-400" />;
  }
};

export const EventLog = ({ events }: EventLogProps) => {
  const sortedEvents = [...events].reverse(); // Show most recent first

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ScrollText className="w-5 h-5" />
        Game Log ({events.length} events)
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No events yet. The game will log important actions here.</p>
        ) : (
          sortedEvents.map((event, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-slate-700 border-l-4 border-slate-600 hover:bg-slate-650"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">
                      Night {event.night}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{event.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
