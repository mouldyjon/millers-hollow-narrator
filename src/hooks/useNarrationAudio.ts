import { useState, useRef } from "react";

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

  // Play audio file
  const play = (filename: string, onPlayEnded?: () => void) => {
    // Use import.meta.env.BASE_URL to get the correct base path for both dev and production
    const basePath = import.meta.env.BASE_URL;
    const audioPath = `${basePath}audio/narration/${filename}`;

    console.log("Attempting to play audio:", audioPath);

    // Stop current audio if playing
    if (audioRef.current && isPlaying) {
      console.log("Stopping current audio");
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }

    // Create a fresh Audio element for each play
    const audio = new Audio(audioPath);
    audio.volume = volume;
    audioRef.current = audio;

    // Store the per-play callback
    onEndedCallbackRef.current = onPlayEnded || null;

    // Set up event handlers
    const handleEnded = () => {
      console.log("Audio ended:", filename);
      setIsPlaying(false);
      setCurrentAudio(null);
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
      console.error("Audio error code:", audio.error?.code);
      console.error("Audio error message:", audio.error?.message);
      setIsPlaying(false);
      setCurrentAudio(null);
      onEndedCallbackRef.current = null;
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    setCurrentAudio(filename);

    // Play the audio
    audio
      .play()
      .then(() => {
        console.log("Audio playing successfully:", filename);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Failed to play audio:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Audio path:", audioPath);
        setIsPlaying(false);
        setCurrentAudio(null);
        onEndedCallbackRef.current = null;
      });
  };

  // Stop current audio
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentAudio(null);
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
