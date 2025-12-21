import { Moon } from "lucide-react";
import { useState, useEffect } from "react";

interface SleepScreenProps {
  message?: string;
  countdown?: number; // Countdown duration in seconds
}

/**
 * Sleep Screen - Dark screen shown between roles in auto-narrator mode
 * Players should keep their eyes closed when this is displayed
 */
export const SleepScreen = ({
  message = "Keep your eyes closed",
  countdown,
}: SleepScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(
    countdown,
  );

  useEffect(() => {
    if (!countdown) {
      // Use setTimeout to make this asynchronous
      const timer = setTimeout(() => setTimeRemaining(undefined), 0);
      return () => clearTimeout(timer);
    }

    // Reset time remaining when countdown prop changes (asynchronously)
    const resetTimer = setTimeout(() => setTimeRemaining(countdown), 0);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === undefined || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(interval);
    };
  }, [countdown]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(to bottom, #000000 0%, #0a0a0a 100%)",
      }}
    >
      <div className="text-center space-y-8">
        {/* Moon icon */}
        <div className="flex justify-center">
          <Moon className="w-24 h-24 text-slate-700 opacity-30" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-600 font-header">
            {message}
          </h2>
          <p className="text-slate-700 text-lg">
            Wait for your role to be called...
          </p>
          {countdown !== undefined && timeRemaining !== undefined && (
            <p className="text-slate-600 text-2xl font-mono">
              {timeRemaining}s
            </p>
          )}
        </div>

        {/* Subtle pulsing indicator */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-slate-800 rounded-full animate-pulse" />
          <div
            className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
};
