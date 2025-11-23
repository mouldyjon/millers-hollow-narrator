import { useEffect, useState } from "react";
import { Moon, Sunrise } from "lucide-react";

interface PhaseTransitionProps {
  type: "night" | "dawn";
  onComplete: () => void;
  canSkip?: boolean;
}

export const PhaseTransition = ({
  type,
  onComplete,
  canSkip = true,
}: PhaseTransitionProps) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) {
      onComplete();
      return;
    }

    const duration = 3500; // 3.5 seconds total - gives narrator time to read
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete, skipped]);

  const handleSkip = () => {
    setSkipped(true);
  };

  // Keyboard shortcut for skip
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };

    if (canSkip) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [canSkip]);

  const transitionConfig = {
    night: {
      icon: Moon,
      title: "Night Falls...",
      subtitle: "The village sleeps as darkness descends",
      bgFrom: "#0f172a",
      bgTo: "#1e1b4b",
      iconColour: "text-indigo-200",
      glowColour: "rgba(165, 180, 252, 0.5)",
    },
    dawn: {
      icon: Sunrise,
      title: "Dawn Breaks...",
      subtitle: "The village awakens to discover what happened",
      bgFrom: "#7c2d12",
      bgTo: "#92400e",
      iconColour: "text-orange-200",
      glowColour: "rgba(251, 146, 60, 0.5)",
    },
  };

  const config = transitionConfig[type];
  const Icon = config.icon;

  // Calculate animation values based on progress with easing
  // Fade in from 0 to 0.3, hold from 0.3 to 0.7, fade out from 0.7 to 1
  const easeInOut = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const overlayOpacity =
    progress < 0.3
      ? easeInOut(progress / 0.3)
      : progress > 0.7
        ? 1 - easeInOut((progress - 0.7) / 0.3)
        : 1;

  // Content appears slightly after overlay starts
  const contentOpacity =
    progress < 0.2
      ? 0
      : progress < 0.4
        ? easeInOut((progress - 0.2) / 0.2)
        : progress > 0.6
          ? 1 - easeInOut((progress - 0.6) / 0.4)
          : 1;

  // Icon scale animation - gentle pulse
  const iconScale = 0.85 + Math.sin(progress * Math.PI) * 0.15;

  // Icon rotation for subtle movement
  const iconRotate = Math.sin(progress * Math.PI * 2) * 3;

  // Glow pulse
  const glowIntensity = 0.4 + Math.sin(progress * Math.PI * 3) * 0.2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${config.bgFrom}, ${config.bgTo})`,
        opacity: overlayOpacity,
        pointerEvents: progress >= 0.95 ? "none" : "auto",
      }}
      onClick={canSkip ? handleSkip : undefined}
    >
      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)`,
          opacity: contentOpacity,
        }}
      />

      {/* Animated content */}
      <div
        className="flex flex-col items-center justify-center space-y-6 relative z-10"
        style={{ opacity: contentOpacity }}
      >
        {/* Animated icon with glow */}
        <div
          className={`${config.iconColour} relative`}
          style={{
            transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
            filter: `drop-shadow(0 0 40px ${config.glowColour}) drop-shadow(0 0 20px ${config.glowColour})`,
            transition: "filter 0.3s ease-out",
          }}
        >
          <Icon size={140} strokeWidth={1.5} />
          {/* Pulsing glow effect behind icon */}
          <div
            className="absolute inset-0 blur-3xl -z-10"
            style={{
              background: config.glowColour,
              opacity: glowIntensity,
              transform: `scale(${1.5 + Math.sin(progress * Math.PI * 2) * 0.2})`,
            }}
          />
        </div>

        {/* Title with fade and slide up */}
        <h1
          className="text-5xl md:text-6xl font-bold text-slate-50 tracking-wide drop-shadow-lg"
          style={{
            transform: `translateY(${(1 - contentOpacity) * 20}px)`,
            transition: "transform 0.5s ease-out",
          }}
        >
          {config.title}
        </h1>

        {/* Subtitle with fade and slide up */}
        <p
          className="text-lg md:text-xl text-slate-200 italic max-w-md text-center px-4 drop-shadow-md"
          style={{
            transform: `translateY(${(1 - contentOpacity) * 30}px)`,
            transition: "transform 0.5s ease-out",
            transitionDelay: "0.1s",
          }}
        >
          {config.subtitle}
        </p>

        {/* Skip button */}
        {canSkip && progress < 0.9 && (
          <button
            onClick={handleSkip}
            className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-slate-100 rounded-full text-sm font-semibold transition-all duration-200 backdrop-blur-md border border-white/20 hover:border-white/30 shadow-lg"
            style={{ opacity: contentOpacity * 0.8 }}
          >
            Skip (Space/Enter/Click)
          </button>
        )}
      </div>

      {/* Floating particles for atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const particleProgress = (progress * 2 + i * 0.033) % 1;
          const x = 10 + (i % 9) * 10 + Math.sin(i * 0.5 + progress * 2) * 5;
          const y = particleProgress * 110 - 10;
          const size = 1 + (i % 3);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.sin(particleProgress * Math.PI) * 0.4,
                transform: `scale(${0.5 + Math.sin(particleProgress * Math.PI) * 0.5})`,
                boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.5)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
