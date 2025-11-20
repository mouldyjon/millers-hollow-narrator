import { useState, useEffect } from "react";
import {
  Moon,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Sun,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { roles, rolesByNightOrder } from "../data/roles";
import type { RoleId, NightState, Player, GameEvent } from "../types/game";
import { RoleActionGuide } from "./RoleActionGuide";
import { PlayerList } from "./PlayerList";
import { EventLog } from "./EventLog";

interface NightPhaseProps {
  selectedRoles: RoleId[];
  nightState: NightState;
  currentNightStep: number;
  players: Player[];
  gameEvents: GameEvent[];
  onNextStep: () => void;
  onEndNight: () => void;
  onUseWitchHealingPotion: () => void;
  onUseWitchDeathPotion: () => void;
  onUseCursedWolfFatherInfection: () => void;
  onTogglePlayerAlive: (playerNumber: number) => void;
  onUpdatePlayerNotes: (playerNumber: number, notes: string) => void;
  onSetPlayerRevealedRole: (playerNumber: number, role: string) => void;
}

export const NightPhase = ({
  selectedRoles,
  nightState,
  currentNightStep,
  players,
  gameEvents,
  onNextStep,
  onEndNight,
  onUseWitchHealingPotion,
  onUseWitchDeathPotion,
  onUseCursedWolfFatherInfection,
  onTogglePlayerAlive,
  onUpdatePlayerNotes,
  onSetPlayerRevealedRole,
}: NightPhaseProps) => {
  const [isPaused, setIsPaused] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const isFirstNight = nightState.currentNightNumber === 1;

  // Get roles that should wake up this night
  const nightRoles = rolesByNightOrder(isFirstNight).filter((role) =>
    selectedRoles.includes(role.id),
  );

  // Add special cases
  const activeRoles = nightRoles.filter((role) => {
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const getNarrationText = (role: typeof currentRole): string => {
    if (!role) return "";

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
    if (isSpeaking) {
      stopSpeaking();
      setIsPaused(true);
    } else if (currentRole) {
      const text = getNarrationText(currentRole);
      speak(text);
      setIsPaused(false);
    }
  };

  const handleNext = () => {
    stopSpeaking();
    if (isLastStep) {
      onEndNight();
    } else {
      onNextStep();
      setIsPaused(true);
    }
  };

  const handleAutoPlay = () => {
    if (currentRole && !isSpeaking) {
      const text = getNarrationText(currentRole);
      speak(text);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Moon className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold">
                Night {nightState.currentNightNumber}
              </h1>
            </div>
            <div className="text-sm text-slate-400">
              Step {currentNightStep + 1} of {activeRoles.length}
            </div>
          </div>

          {/* Current Role Card */}
          <div className="bg-slate-800 rounded-lg p-8 mb-6 min-h-64 flex flex-col items-center justify-center">
            {isLastStep ? (
              <div className="text-center">
                <Sun className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Night is Over</h2>
                <p className="text-slate-300">
                  Click "Start Day" to begin the day phase
                </p>
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
                <h2 className="text-4xl font-bold mb-4">{currentRole.name}</h2>
                <p className="text-lg text-slate-300 mb-6">
                  {currentRole.description}
                </p>
                <div className="bg-slate-700 rounded-lg p-4 text-left">
                  <p className="text-sm italic text-slate-300">
                    {getNarrationText(currentRole)}
                  </p>
                </div>

                {/* Role-specific actions */}
                {currentRole.id === "witch" && (
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={onUseWitchHealingPotion}
                      disabled={nightState.witchHealingPotionUsed}
                      className={`w-full px-4 py-2 rounded-lg ${
                        nightState.witchHealingPotionUsed
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {nightState.witchHealingPotionUsed
                        ? "Healing Potion Used"
                        : "Use Healing Potion"}
                    </button>
                    <button
                      onClick={onUseWitchDeathPotion}
                      disabled={nightState.witchDeathPotionUsed}
                      className={`w-full px-4 py-2 rounded-lg ${
                        nightState.witchDeathPotionUsed
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {nightState.witchDeathPotionUsed
                        ? "Death Potion Used"
                        : "Use Death Potion"}
                    </button>
                  </div>
                )}

                {currentRole.id === "cursed-wolf-father" && (
                  <div className="mt-6">
                    <button
                      onClick={onUseCursedWolfFatherInfection}
                      disabled={nightState.cursedWolfFatherInfectionUsed}
                      className={`w-full px-4 py-2 rounded-lg ${
                        nightState.cursedWolfFatherInfectionUsed
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {nightState.cursedWolfFatherInfectionUsed
                        ? "Infection Used"
                        : "Use Infection"}
                    </button>
                  </div>
                )}

                {/* Role Action Guide */}
                {currentRole && <RoleActionGuide roleId={currentRole.id} />}
              </div>
            ) : null}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePlayPause}
              disabled={isLastStep}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold"
            >
              {isSpeaking ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  Speak
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
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
            </button>
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
            <div className="space-y-6 sticky top-6">
              <PlayerList
                playerCount={players.length}
                players={players}
                onToggleAlive={onTogglePlayerAlive}
                onSetRevealedRole={onSetPlayerRevealedRole}
                onUpdateNotes={onUpdatePlayerNotes}
              />
              <EventLog events={gameEvents} />
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed right-6 top-6 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg shadow-lg z-10"
          title={showSidebar ? "Hide sidebar" : "Show sidebar"}
        >
          {showSidebar ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
