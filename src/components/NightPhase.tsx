import { useState, useEffect, useRef } from "react";
import {
  Pause,
  SkipForward,
  Volume2,
  Sun,
  PanelLeftOpen,
  PanelLeftClose,
  AlertCircle,
  Play,
  VolumeX,
} from "lucide-react";
import { rolesByNightOrder } from "../data/roles";
import type { RoleId, NightState, Player, GameEvent } from "../types/game";
import { RoleActionGuide } from "./RoleActionGuide";
import { PlayerList } from "./PlayerList";
import { EventLog } from "./EventLog";
import { RoleReference } from "./RoleReference";
import { WitchPotionModal } from "./WitchPotionModal";
import { CupidLoversModal } from "./CupidLoversModal";
import { WerewolfVictimModal } from "./WerewolfVictimModal";
import { WildChildRoleModelModal } from "./WildChildRoleModelModal";
import { CursedWolfFatherModal } from "./CursedWolfFatherModal";
import { Button } from "./ui";
import { useNarrationAudio } from "../hooks/useNarrationAudio";
import { getNarrationFile } from "../data/narrationFiles";

interface NightPhaseProps {
  selectedRoles: RoleId[];
  nightState: NightState;
  currentNightStep: number;
  players: Player[];
  gameEvents: GameEvent[];
  cupidLovers?: [number, number];
  wildChildRoleModel?: number;
  cursedWolfFatherInfectedPlayer?: number;
  onNextStep: () => void;
  onEndNight: () => void;
  onUseWitchHealingPotion: (playerNumber: number) => void;
  onUseWitchDeathPotion: (playerNumber: number) => void;
  onUseCursedWolfFatherInfection: (playerNumber: number) => void;
  onSetCupidLovers?: (lover1: number, lover2: number) => void;
  onSetWildChildRoleModel?: (playerNumber: number) => void;
  onSelectWerewolfVictim?: (
    playerNumber: number,
    werewolfType: "simple" | "big-bad" | "white",
  ) => void;
  onTogglePlayerAlive: (playerNumber: number) => void;
  onUpdatePlayerNotes: (playerNumber: number, notes: string) => void;
  onSetPlayerRevealedRole: (
    playerNumber: number,
    role: string,
    roleId?: RoleId,
  ) => void;
  onSetPlayerWolfHoundTeam?: (
    playerNumber: number,
    team: "village" | "werewolf",
  ) => void;
  onToggleActionComplete: (roleId: RoleId, stepIndex: number) => void;
  onCheckEliminationConsequences: (
    playerNumber: number,
    roleId?: RoleId,
  ) => {
    type:
      | "none"
      | "lovers"
      | "knight-rusty-sword"
      | "hunter"
      | "siblings"
      | "wild-child-transform";
    affectedPlayers: number[];
    message: string;
    requiresPlayerSelection: boolean;
  };
  onAddGameEvent: (
    type: "elimination" | "role_action" | "day_vote" | "special",
    description: string,
  ) => void;
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

export const NightPhase = ({
  selectedRoles,
  nightState,
  currentNightStep,
  players,
  gameEvents,
  cupidLovers,
  wildChildRoleModel,
  cursedWolfFatherInfectedPlayer,
  onNextStep,
  onEndNight,
  onUseWitchHealingPotion,
  onUseWitchDeathPotion,
  onUseCursedWolfFatherInfection,
  onSetCupidLovers,
  onSetWildChildRoleModel,
  onSelectWerewolfVictim,
  onTogglePlayerAlive,
  onUpdatePlayerNotes,
  onSetPlayerRevealedRole,
  onSetPlayerWolfHoundTeam,
  onToggleActionComplete,
  onCheckEliminationConsequences,
  onAddGameEvent,
}: NightPhaseProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"players" | "events" | "roles">(
    "players",
  );
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Audio narration hook
  const {
    play: playAudio,
    stop: stopAudio,
    isPlaying: isAudioPlaying,
  } = useNarrationAudio({
    volume: 0.8,
    onEnded: () => {
      // When night-begins audio ends, hide intro
      if (showIntro && currentNightStep === 0) {
        setShowIntro(false);
      }
    },
  });
  const [witchPotionModal, setWitchPotionModal] = useState<
    "healing" | "death" | null
  >(null);
  const [showCupidModal, setShowCupidModal] = useState(false);
  const [showWildChildModal, setShowWildChildModal] = useState(false);
  const [werewolfVictimModal, setWerewolfVictimModal] = useState<
    "simple" | "big-bad" | "white" | null
  >(null);
  const [showCursedWolfFatherModal, setShowCursedWolfFatherModal] =
    useState(false);

  const isFirstNight = nightState.currentNightNumber === 1;

  // Get roles that should wake up this night
  const nightRoles = rolesByNightOrder(isFirstNight).filter((role) =>
    selectedRoles.includes(role.id),
  );

  // Filter for active roles (considering alive players and special conditions)
  const activeRoles = nightRoles.filter((role) => {
    // Check if any player with this role is still alive (for revealed roles)
    const playersWithRole = players.filter(
      (player) => player.actualRole === role.id,
    );

    // If role has been revealed to anyone
    if (playersWithRole.length > 0) {
      // Check if at least one player with this role is still alive AND not infected
      const hasActivePlayer = playersWithRole.some(
        (player) =>
          player.isAlive &&
          // Infected players lose their original role abilities (except werewolf roles)
          (role.team === "werewolf" ||
            player.number !== cursedWolfFatherInfectedPlayer),
      );

      // If all players with this role are dead or infected, skip it
      if (!hasActivePlayer) {
        return false;
      }
    }
    // If role hasn't been revealed yet, assume it's active (first night case)
    // BUT if this is the infected player's role and they're the only one, skip it
    if (
      cursedWolfFatherInfectedPlayer &&
      role.team !== "werewolf" &&
      playersWithRole.length === 1 &&
      playersWithRole[0]?.number === cursedWolfFatherInfectedPlayer
    ) {
      return false;
    }

    // White werewolf only wakes every other night
    if (role.id === "white-werewolf") {
      return nightState.whiteWerewolfNight;
    }
    // Cursed wolf father only if not used
    if (role.id === "cursed-wolf-father") {
      return !nightState.cursedWolfFatherInfectionUsed;
    }
    return true;
  });

  const currentRole = activeRoles[currentNightStep];
  const isLastStep = currentNightStep >= activeRoles.length;

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any existing speech first
      window.speechSynthesis.cancel();

      // Small delay to ensure cancellation completed
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Try to auto-play night begins audio when entering night phase
  // Note: May be blocked by browser auto-play policy
  const hasAttemptedAutoPlay = useRef(false);
  useEffect(() => {
    if (
      currentNightStep === 0 &&
      showIntro &&
      audioEnabled &&
      !hasAttemptedAutoPlay.current
    ) {
      hasAttemptedAutoPlay.current = true;
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        playAudio("night-begins.mp3");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentNightStep, showIntro, audioEnabled, playAudio]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const getNarrationText = (role: typeof currentRole): string => {
    if (!role) return "";

    // Special handling for werewolves if there's an infected player
    if (role.id === "simple-werewolf" && cursedWolfFatherInfectedPlayer) {
      return `Werewolves, wake up and choose a victim. Player ${cursedWolfFatherInfectedPlayer}, you have been infected - wake with the werewolves. Little Girl, you may peek.`;
    }

    const baseTexts: Record<string, string> = {
      thief:
        "Thief, wake up. You may exchange your card with one of the unused role cards.",
      cupid: "Cupid, wake up. Choose two players to be lovers.",
      lovers:
        "Lovers, wake up and recognise each other. Then go back to sleep.",
      "wolf-hound":
        "Wolf-Hound, wake up. Choose whether you will play for the village or the werewolves.",
      "wild-child":
        "Wild Child, wake up. Choose your role model. If they die, you will become a werewolf.",
      "two-sisters":
        "Two Sisters, wake up and recognise each other. Then go back to sleep.",
      "three-brothers":
        "Three Brothers, wake up and recognise each other. Then go back to sleep.",
      seer: "Seer, wake up. You may look at one player's card.",
      "simple-werewolf":
        "Werewolves, wake up and choose a victim. Little Girl, you may peek.",
      "white-werewolf":
        "White Werewolf, wake up. You may eliminate another werewolf.",
      "big-bad-wolf":
        "Big Bad Wolf, wake up. You may devour an additional victim.",
      "cursed-wolf-father":
        "Cursed Wolf-Father, wake up. You may infect a victim to turn them into a werewolf.",
      witch: `Witch, wake up. ${nightState.witchHealingPotionUsed ? "Your healing potion has been used." : "You may use your healing potion."} ${nightState.witchDeathPotionUsed ? "Your death potion has been used." : "You may use your death potion."}`,
      fox: "Fox, wake up. Point to three adjacent players to learn if at least one is a werewolf.",
      "bear-tamer":
        "If the Bear Tamer is adjacent to a werewolf, the bear grunts.",
      actor: "Actor, wake up. Use one of your three available role powers.",
    };

    return baseTexts[role.id] || `${role.name}, wake up.`;
  };

  const handlePlayPause = () => {
    // On intro screen, play/pause night-begins audio
    if (showIntro && currentNightStep === 0) {
      if (isAudioPlaying) {
        stopAudio();
      } else if (audioEnabled) {
        playAudio("night-begins.mp3");
      }
      return;
    }

    // For roles, try audio first, fall back to speech synthesis
    if (currentRole) {
      const audioFile = getNarrationFile(currentRole.id, "wake");
      if (audioFile && audioEnabled) {
        if (isAudioPlaying) {
          stopAudio();
        } else {
          playAudio(audioFile);
        }
      } else {
        // Fall back to speech synthesis if no audio file
        if (isSpeaking) {
          stopSpeaking();
        } else {
          const text = getNarrationText(currentRole);
          speak(text);
        }
      }
    }
  };

  const handleNext = () => {
    stopSpeaking();

    // If we're on the intro screen, just hide it and show first role
    if (showIntro && currentNightStep === 0) {
      stopAudio(); // Stop night-begins audio if still playing
      setShowIntro(false);
      return;
    }

    if (isLastStep) {
      onEndNight();
    } else {
      onNextStep();
    }
  };

  const moonPhase = getMoonPhase(nightState.currentNightNumber);

  return (
    <div
      className="min-h-screen text-slate-100 p-6 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at top, rgba(30, 41, 59, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse at bottom, rgba(15, 23, 42, 0.8) 0%, transparent 60%),
          linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `,
      }}
    >
      {/* Atmospheric fog effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 800px 600px at 20% 40%, rgba(100, 116, 139, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 600px 400px at 80% 60%, rgba(71, 85, 105, 0.15) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="flex gap-6 max-w-7xl mx-auto relative z-10">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
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
                  Night {nightState.currentNightNumber}
                </h1>
                <p className="text-sm text-indigo-300 italic">
                  {moonPhase.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Audio toggle */}
              <button
                onClick={() => {
                  setAudioEnabled(!audioEnabled);
                  if (isAudioPlaying) {
                    stopAudio();
                  }
                }}
                className={`p-2 rounded-full transition-colors ${
                  audioEnabled
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
                title={
                  audioEnabled
                    ? "Disable audio narration"
                    : "Enable audio narration"
                }
              >
                {audioEnabled ? (
                  <Volume2 className="w-5 h-5 text-white" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                Step {currentNightStep + 1} of {activeRoles.length}
              </div>
            </div>
          </div>

          {/* Current Role Card - with vintage texture */}
          <div
            className="bg-slate-800 rounded-lg p-8 mb-6 min-h-64 flex flex-col items-center justify-center relative overflow-hidden border-2 border-slate-700 shadow-2xl"
            style={{
              background: `
                linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)
              `,
              boxShadow: `
                0 0 60px rgba(0, 0, 0, 0.5),
                inset 0 0 20px rgba(0, 0, 0, 0.3),
                0 4px 6px -1px rgba(0, 0, 0, 0.5)
              `,
            }}
          >
            {/* Decorative corner ornaments */}
            <div className="absolute top-2 left-2 text-slate-600 text-2xl opacity-50">
              ◆
            </div>
            <div className="absolute top-2 right-2 text-slate-600 text-2xl opacity-50">
              ◆
            </div>
            <div className="absolute bottom-2 left-2 text-slate-600 text-2xl opacity-50">
              ◆
            </div>
            <div className="absolute bottom-2 right-2 text-slate-600 text-2xl opacity-50">
              ◆
            </div>
            {showIntro && currentNightStep === 0 ? (
              <div className="text-center">
                <div className="text-6xl mb-6">{moonPhase.emoji}</div>
                <h2 className="text-4xl font-bold mb-4 font-header text-[var(--color-text-gold)]">
                  Night Falls
                </h2>
                <p className="text-lg text-slate-300 mb-6 italic">
                  The village sleeps as darkness descends...
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  {isAudioPlaying ? (
                    <>
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span>Playing narration...</span>
                    </>
                  ) : audioEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Click Play below to hear narration</span>
                    </>
                  ) : (
                    <span>Click Next to begin</span>
                  )}
                </div>
              </div>
            ) : isLastStep ? (
              <div className="text-center">
                <Sun className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 font-header text-[var(--color-text-gold)]">
                  Night is Over
                </h2>
                <p className="text-slate-300 mb-4">
                  The night ends. Prepare for dawn announcements...
                </p>
                <button
                  onClick={() => {
                    if (isAudioPlaying) {
                      stopAudio();
                    } else if (audioEnabled) {
                      playAudio("night-ending.mp3");
                    }
                  }}
                  className={`mx-auto px-6 py-3 rounded-lg transition-colors ${
                    isAudioPlaying
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  } text-white font-semibold flex items-center gap-2`}
                  title={
                    isAudioPlaying ? "Stop narration" : "Play night ending"
                  }
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Play Night Ending
                    </>
                  )}
                </button>
              </div>
            ) : currentRole ? (
              <div className="text-center w-full">
                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm mb-4 ${
                    currentRole.team === "village"
                      ? "bg-blue-600"
                      : currentRole.team === "werewolf"
                        ? "bg-red-600"
                        : "bg-purple-600"
                  }`}
                >
                  {currentRole.team === "village"
                    ? "Village"
                    : currentRole.team === "werewolf"
                      ? "Werewolf"
                      : "Special"}
                </div>
                <h2 className="text-4xl font-bold mb-4 font-header text-[var(--color-text-gold)]">
                  {currentRole.name}
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  {currentRole.description}
                </p>
                <div className="bg-slate-700 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <p className="text-sm italic text-slate-300 flex-1">
                      {getNarrationText(currentRole)}
                    </p>
                    {/* Audio narration button */}
                    {audioEnabled &&
                      getNarrationFile(currentRole.id, "wake") && (
                        <button
                          onClick={() => {
                            const filename = getNarrationFile(
                              currentRole.id,
                              "wake",
                            );
                            if (filename) {
                              playAudio(filename);
                            }
                          }}
                          className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                            isAudioPlaying
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          title="Play narration"
                        >
                          {isAudioPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </button>
                      )}
                  </div>
                </div>

                {/* Role-specific actions */}
                {currentRole.id === "cupid" && onSetCupidLovers && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowCupidModal(true)}
                      variant="primary"
                      size="md"
                      fullWidth
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <span>
                        {cupidLovers
                          ? `Lovers: Player ${cupidLovers[0]} & Player ${cupidLovers[1]}`
                          : "Select Lovers"}
                      </span>
                    </Button>
                  </div>
                )}

                {currentRole.id === "wild-child" && onSetWildChildRoleModel && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowWildChildModal(true)}
                      variant="primary"
                      size="md"
                      fullWidth
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <span>
                        {wildChildRoleModel
                          ? `Role Model: Player ${wildChildRoleModel}`
                          : "Select Role Model"}
                      </span>
                    </Button>
                  </div>
                )}

                {currentRole.id === "simple-werewolf" && (
                  <div className="mt-6 space-y-4">
                    {/* Infected Player Notification */}
                    {cursedWolfFatherInfectedPlayer && (
                      <div className="bg-orange-900/40 border-2 border-orange-500 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-bold text-orange-200 mb-2">
                              ⚠️ INFECTED PLAYER ALERT
                            </p>
                            <p className="text-orange-100 mb-2">
                              <strong>
                                Player {cursedWolfFatherInfectedPlayer}
                              </strong>{" "}
                              has been infected by the Cursed Wolf-Father and is
                              now secretly a werewolf.
                            </p>
                            <p className="text-orange-100 mb-2">
                              They have <strong>lost all abilities</strong> from
                              their original role and now act as a regular
                              werewolf.
                            </p>
                            <p className="text-orange-100 font-semibold">
                              You must discreetly signal this player to wake
                              with the werewolves (tap shoulder, whisper, etc.)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => setWerewolfVictimModal("simple")}
                      disabled={nightState.werewolfVictimSelectedThisNight}
                      variant="danger"
                      size="md"
                      fullWidth
                    >
                      {nightState.werewolfVictimSelectedThisNight
                        ? "Victim Selected"
                        : "Select Victim"}
                    </Button>
                  </div>
                )}

                {currentRole.id === "big-bad-wolf" && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setWerewolfVictimModal("big-bad")}
                      disabled={nightState.bigBadWolfVictimSelectedThisNight}
                      variant="danger"
                      size="md"
                      fullWidth
                    >
                      {nightState.bigBadWolfVictimSelectedThisNight
                        ? "Victim Selected"
                        : "Select Additional Victim"}
                    </Button>
                  </div>
                )}

                {currentRole.id === "white-werewolf" && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setWerewolfVictimModal("white")}
                      disabled={nightState.whiteWerewolfVictimSelectedThisNight}
                      variant="danger"
                      size="md"
                      fullWidth
                    >
                      {nightState.whiteWerewolfVictimSelectedThisNight
                        ? "Victim Selected"
                        : "Eliminate Werewolf (Optional)"}
                    </Button>
                  </div>
                )}

                {currentRole.id === "cursed-wolf-father" && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowCursedWolfFatherModal(true)}
                      disabled={nightState.cursedWolfFatherInfectionUsed}
                      variant="primary"
                      size="md"
                      fullWidth
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {nightState.cursedWolfFatherInfectionUsed
                        ? "Infection Already Used"
                        : "Select Victim to Infect"}
                    </Button>
                  </div>
                )}

                {currentRole.id === "witch" && (
                  <div className="mt-6 space-y-2">
                    <Button
                      onClick={() => setWitchPotionModal("healing")}
                      disabled={
                        nightState.witchHealingPotionUsed ||
                        nightState.witchPotionUsedThisNight
                      }
                      variant="success"
                      size="md"
                      fullWidth
                    >
                      {nightState.witchHealingPotionUsed
                        ? "Healing Potion Used"
                        : nightState.witchPotionUsedThisNight
                          ? "Potion Already Used This Night"
                          : "Use Healing Potion"}
                    </Button>
                    <Button
                      onClick={() => setWitchPotionModal("death")}
                      disabled={
                        nightState.witchDeathPotionUsed ||
                        nightState.witchPotionUsedThisNight
                      }
                      variant="danger"
                      size="md"
                      fullWidth
                    >
                      {nightState.witchDeathPotionUsed
                        ? "Death Potion Used"
                        : nightState.witchPotionUsedThisNight
                          ? "Potion Already Used This Night"
                          : "Use Death Potion"}
                    </Button>
                  </div>
                )}

                {/* Role Action Guide */}
                {currentRole && (
                  <RoleActionGuide
                    roleId={currentRole.id}
                    completedActions={
                      nightState.completedActions[
                        `${currentRole.id}-${nightState.currentNightNumber}`
                      ] || []
                    }
                    onStepComplete={(stepIndex) =>
                      onToggleActionComplete(currentRole.id, stepIndex)
                    }
                  />
                )}
              </div>
            ) : null}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handlePlayPause}
              disabled={isLastStep}
              variant="primary"
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isAudioPlaying || isSpeaking ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  Play
                </>
              )}
            </Button>

            <Button
              onClick={handleNext}
              variant={isLastStep ? "gold" : "success"}
              size="lg"
            >
              {isLastStep ? (
                <>
                  <Sun className="w-5 h-5" />
                  Start Day
                </>
              ) : (
                <>
                  <SkipForward className="w-5 h-5" />
                  Next
                </>
              )}
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{
                  width: `${((currentNightStep + 1) / (activeRoles.length + 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${showSidebar ? "w-96" : "w-0 overflow-hidden"}`}
        >
          {showSidebar && (
            <div className="sticky top-6">
              {/* Sidebar Tabs */}
              <div className="flex gap-2 mb-4 bg-slate-800 p-2 rounded-lg">
                <button
                  onClick={() => setSidebarTab("players")}
                  className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                    sidebarTab === "players"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Players
                </button>
                <button
                  onClick={() => setSidebarTab("events")}
                  className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                    sidebarTab === "events"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setSidebarTab("roles")}
                  className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                    sidebarTab === "roles"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Roles
                </button>
              </div>

              {/* Sidebar Content */}
              {sidebarTab === "players" && (
                <PlayerList
                  playerCount={players.length}
                  players={players}
                  selectedRoles={selectedRoles}
                  cursedWolfFatherInfectedPlayer={
                    cursedWolfFatherInfectedPlayer
                  }
                  onToggleAlive={onTogglePlayerAlive}
                  onSetRevealedRole={onSetPlayerRevealedRole}
                  onUpdateNotes={onUpdatePlayerNotes}
                  onSetWolfHoundTeam={onSetPlayerWolfHoundTeam}
                  onCheckEliminationConsequences={
                    onCheckEliminationConsequences
                  }
                  onAddGameEvent={onAddGameEvent}
                />
              )}
              {sidebarTab === "events" && <EventLog events={gameEvents} />}
              {sidebarTab === "roles" && (
                <RoleReference selectedRoles={selectedRoles} />
              )}
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          variant="ghost"
          size="md"
          className="fixed right-6 top-6 bg-slate-800 hover:bg-slate-700 shadow-lg z-10"
          title={showSidebar ? "Hide sidebar" : "Show sidebar"}
        >
          {showSidebar ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Witch Potion Modal */}
      {witchPotionModal && (
        <WitchPotionModal
          potionType={witchPotionModal}
          players={players}
          onConfirm={(playerNumber) => {
            if (witchPotionModal === "healing") {
              onUseWitchHealingPotion(playerNumber);
              onAddGameEvent(
                "role_action",
                `Witch used healing potion on Player ${playerNumber}`,
              );
            } else {
              onUseWitchDeathPotion(playerNumber);
              onAddGameEvent(
                "role_action",
                `Witch used death potion on Player ${playerNumber}`,
              );
            }
            setWitchPotionModal(null);
          }}
          onCancel={() => setWitchPotionModal(null)}
        />
      )}

      {/* Cupid Lovers Modal */}
      {showCupidModal && onSetCupidLovers && (
        <CupidLoversModal
          players={players}
          currentLovers={cupidLovers}
          onConfirm={(lover1, lover2) => {
            onSetCupidLovers(lover1, lover2);
            onAddGameEvent(
              "role_action",
              `Cupid selected Player ${lover1} and Player ${lover2} as lovers`,
            );
            setShowCupidModal(false);
          }}
          onCancel={() => setShowCupidModal(false)}
        />
      )}

      {/* Wild Child Role Model Modal */}
      {showWildChildModal && onSetWildChildRoleModel && (
        <WildChildRoleModelModal
          players={players}
          currentRoleModel={wildChildRoleModel}
          onConfirm={(roleModelNumber) => {
            onSetWildChildRoleModel(roleModelNumber);
            onAddGameEvent(
              "role_action",
              `Wild Child selected Player ${roleModelNumber} as role model`,
            );
            setShowWildChildModal(false);
          }}
          onCancel={() => setShowWildChildModal(false)}
        />
      )}

      {/* Werewolf Victim Modal */}
      {werewolfVictimModal && onSelectWerewolfVictim && (
        <WerewolfVictimModal
          players={players}
          werewolfType={werewolfVictimModal}
          onConfirm={(playerNumber) => {
            // Eliminate the player and mark as selected
            onSelectWerewolfVictim(playerNumber, werewolfVictimModal);

            const werewolfTypeNames = {
              simple: "Werewolves",
              "big-bad": "Big Bad Wolf",
              white: "White Werewolf",
            };
            onAddGameEvent(
              "role_action",
              `${werewolfTypeNames[werewolfVictimModal]} eliminated Player ${playerNumber}`,
            );
            setWerewolfVictimModal(null);
          }}
          onCancel={() => setWerewolfVictimModal(null)}
        />
      )}

      {/* Cursed Wolf-Father Infection Modal */}
      {showCursedWolfFatherModal && (
        <CursedWolfFatherModal
          players={players}
          onConfirm={(playerNumber) => {
            onUseCursedWolfFatherInfection(playerNumber);
            onAddGameEvent(
              "role_action",
              `Cursed Wolf-Father infected Player ${playerNumber} - DISCREETLY NOTIFY PLAYER`,
            );
            setShowCursedWolfFatherModal(false);
          }}
          onCancel={() => setShowCursedWolfFatherModal(false)}
        />
      )}
    </div>
  );
};
