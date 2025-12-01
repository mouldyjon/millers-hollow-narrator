import { Volume2, VolumeX } from "lucide-react";

interface NightProgressTrackerProps {
  nightNumber: number;
  currentStep: number;
  totalSteps: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

// Helper function to get moon phase emoji based on night number
const getMoonPhase = (nightNumber: number) => {
  const phases = [
    { emoji: "🌑", name: "New Moon" },
    { emoji: "🌒", name: "Waxing Crescent" },
    { emoji: "🌓", name: "First Quarter" },
    { emoji: "🌔", name: "Waxing Gibbous" },
    { emoji: "🌕", name: "Full Moon" },
    { emoji: "🌖", name: "Waning Gibbous" },
    { emoji: "🌗", name: "Last Quarter" },
    { emoji: "🌘", name: "Waning Crescent" },
  ];
  // Cycle through phases based on night number
  const phaseIndex = (nightNumber - 1) % phases.length;
  return phases[phaseIndex];
};

export const NightProgressTracker = ({
  nightNumber,
  currentStep,
  totalSteps,
  audioEnabled,
  onToggleAudio,
}: NightProgressTrackerProps) => {
  const moonPhase = getMoonPhase(nightNumber);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Moon phase indicator */}
        <div className="relative">
          <div
            className="text-6xl leading-none filter drop-shadow-lg"
            title={moonPhase.name}
          >
            {moonPhase.emoji}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold font-header text-[var(--color-text-gold)] filter drop-shadow-lg">
            Night {nightNumber}
          </h1>
          <p className="text-sm text-indigo-300 italic">{moonPhase.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Audio toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-full transition-colors ${
            audioEnabled
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
          title={
            audioEnabled ? "Disable audio narration" : "Enable audio narration"
          }
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5 text-white" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>

        <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    </div>
  );
};
