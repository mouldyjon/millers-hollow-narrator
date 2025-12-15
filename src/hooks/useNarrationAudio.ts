import { useState, useEffect, useRef } from "react";

interface UseNarrationAudioOptions {
  autoPlay?: boolean;
  volume?: number;
  onEnded?: () => void;
}

export const useNarrationAudio = (options: UseNarrationAudioOptions = {}) => {
  const { volume = 1.0, onEnded } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;

    const handleEnded = () => {
      setIsPlaying(false);
      // Call per-play callback if provided
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
        onEndedCallbackRef.current = null;
      }
      // Then call global callback
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [volume, onEnded]);

  // Play audio file
  const play = (filename: string, onPlayEnded?: () => void) => {
    if (!audioRef.current) {
      console.error("Audio ref not initialized");
      return;
    }

    const audio = audioRef.current;
    // Use import.meta.env.BASE_URL to get the correct base path for both dev and production
    const basePath = import.meta.env.BASE_URL;
    const audioPath = `${basePath}audio/narration/${filename}`;

    console.log("Attempting to play audio:", audioPath);

    // Stop current audio if playing
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Store the per-play callback
    onEndedCallbackRef.current = onPlayEnded || null;

    audio.src = audioPath;
    setCurrentAudio(filename);

    audio
      .play()
      .then(() => {
        console.log("Audio playing successfully:", filename);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Failed to play audio:", error);
        console.error("Audio path:", audioPath);
        setIsPlaying(false);
        // Clear callback on error
        onEndedCallbackRef.current = null;
      });
  };

  // Stop current audio
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      // Clear any pending callback
      onEndedCallbackRef.current = null;
    }
  };

  // Pause audio
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Resume audio
  const resume = () => {
    if (audioRef.current && currentAudio) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Failed to resume audio:", error);
        });
    }
  };

  // Set volume
  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    play,
    stop,
    pause,
    resume,
    setVolume,
    isPlaying,
    currentAudio,
  };
};
