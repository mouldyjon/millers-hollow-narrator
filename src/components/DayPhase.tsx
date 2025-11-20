import { useState, useEffect } from 'react';
import { Sun, Play, Pause, RotateCcw, Moon, Settings } from 'lucide-react';

interface DayPhaseProps {
  onStartNight: () => void;
}

export const DayPhase = ({ onStartNight }: DayPhaseProps) => {
  const [timerDuration, setTimerDuration] = useState(5 * 60); // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play a sound or notification when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(timerDuration);
  };

  const handleDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setTimerDuration(newDuration);
    setTimeRemaining(newDuration);
    setIsRunning(false);
  };

  const progressPercentage = ((timerDuration - timeRemaining) / timerDuration) * 100;

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sun className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-slate-800">Day Phase</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Timer Duration</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[3, 5, 7, 10].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => handleDurationChange(minutes)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    timerDuration === minutes * 60
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="bg-white rounded-lg shadow-2xl p-12 mb-8">
          <div className="text-center">
            {/* Circular Progress */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <svg className="transform -rotate-90" width="280" height="280">
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="#e2e8f0"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-slate-800">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Status Message */}
            <p className="text-xl text-slate-600 mb-8">
              {timeRemaining === 0
                ? 'Time is up! Proceed to voting.'
                : isRunning
                ? 'Discussion in progress...'
                : 'Ready to start discussion'}
            </p>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayPause}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  isRunning
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-6 h-6" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    Start
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg"
              >
                <RotateCcw className="w-6 h-6" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Game Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Day Phase Actions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
              <p className="text-sm text-slate-700">
                <strong>1. Discussion:</strong> Players discuss and share information
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
              <p className="text-sm text-slate-700">
                <strong>2. Voting:</strong> Vote to eliminate a suspected werewolf
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
              <p className="text-sm text-slate-700">
                <strong>3. Special Powers:</strong> Hunter shoots if eliminated, Stuttering Judge can force double vote
              </p>
            </div>
          </div>
        </div>

        {/* End Day Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartNight}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-xl font-semibold"
          >
            <Moon className="w-6 h-6" />
            End Day & Start Night
          </button>
        </div>
      </div>
    </div>
  );
};
