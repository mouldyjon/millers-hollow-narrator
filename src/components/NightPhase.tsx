import { useState, useEffect } from "react";
import {
  Moon,
  Pause,
  SkipForward,
  Volume2,
  Sun,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { rolesByNightOrder } from "../data/roles";
import type { RoleId, NightState, Player, GameEvent } from "../types/game";
import { RoleActionGuide } from "./RoleActionGuide";
import { PlayerList } from "./PlayerList";
import { EventLog } from "./EventLog";
import { WitchPotionModal } from "./WitchPotionModal";
import { CupidLoversModal } from "./CupidLoversModal";
import { WerewolfVictimModal } from "./WerewolfVictimModal";
import { WildChildRoleModelModal } from "./WildChildRoleModelModal";

interface NightPhaseProps {
  selectedRoles: RoleId[];
  nightState: NightState;
  currentNightStep: number;
  players: Player[];
  gameEvents: GameEvent[];
  cupidLovers?: [number, number];
  wildChildRoleModel?: number;
  onNextStep: () => void;
  onEndNight: () => void;
  onUseWitchHealingPotion: (playerNumber: number) => void;
  onUseWitchDeathPotion: (playerNumber: number) => void;
  onUseCursedWolfFatherInfection: () => void;
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

export const NightPhase = ({
  selectedRoles,
  nightState,
  currentNightStep,
  players,
  gameEvents,
  cupidLovers,
  wildChildRoleModel,
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
  const [witchPotionModal, setWitchPotionModal] = useState<
    "healing" | "death" | null
  >(null);
  const [showCupidModal, setShowCupidModal] = useState(false);
  const [showWildChildModal, setShowWildChildModal] = useState(false);
  const [werewolfVictimModal, setWerewolfVictimModal] = useState<
    "simple" | "big-bad" | "white" | null
  >(null);

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
    } else if (currentRole) {
      const text = getNarrationText(currentRole);
      speak(text);
    }
  };

  const handleNext = () => {
    stopSpeaking();
    if (isLastStep) {
      onEndNight();
    } else {
      onNextStep();
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
                {currentRole.id === "cupid" && onSetCupidLovers && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCupidModal(true)}
                      className="w-full px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 font-semibold flex items-center justify-center gap-2"
                    >
                      <span>
                        {cupidLovers
                          ? `Lovers: Player ${cupidLovers[0]} & Player ${cupidLovers[1]}`
                          : "Select Lovers"}
                      </span>
                    </button>
                  </div>
                )}

                {currentRole.id === "wild-child" && onSetWildChildRoleModel && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowWildChildModal(true)}
                      className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
                    >
                      <span>
                        {wildChildRoleModel
                          ? `Role Model: Player ${wildChildRoleModel}`
                          : "Select Role Model"}
                      </span>
                    </button>
                  </div>
                )}

                {currentRole.id === "simple-werewolf" && (
                  <div className="mt-6">
                    <button
                      onClick={() => setWerewolfVictimModal("simple")}
                      disabled={nightState.werewolfVictimSelectedThisNight}
                      className={`w-full px-4 py-2 rounded-lg font-semibold ${
                        nightState.werewolfVictimSelectedThisNight
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {nightState.werewolfVictimSelectedThisNight
                        ? "Victim Selected"
                        : "Select Victim"}
                    </button>
                  </div>
                )}

                {currentRole.id === "big-bad-wolf" && (
                  <div className="mt-6">
                    <button
                      onClick={() => setWerewolfVictimModal("big-bad")}
                      disabled={nightState.bigBadWolfVictimSelectedThisNight}
                      className={`w-full px-4 py-2 rounded-lg font-semibold ${
                        nightState.bigBadWolfVictimSelectedThisNight
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {nightState.bigBadWolfVictimSelectedThisNight
                        ? "Victim Selected"
                        : "Select Additional Victim"}
                    </button>
                  </div>
                )}

                {currentRole.id === "white-werewolf" && (
                  <div className="mt-6">
                    <button
                      onClick={() => setWerewolfVictimModal("white")}
                      disabled={nightState.whiteWerewolfVictimSelectedThisNight}
                      className={`w-full px-4 py-2 rounded-lg font-semibold ${
                        nightState.whiteWerewolfVictimSelectedThisNight
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {nightState.whiteWerewolfVictimSelectedThisNight
                        ? "Victim Selected"
                        : "Eliminate Werewolf (Optional)"}
                    </button>
                  </div>
                )}

                {currentRole.id === "witch" && (
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => setWitchPotionModal("healing")}
                      disabled={
                        nightState.witchHealingPotionUsed ||
                        nightState.witchPotionUsedThisNight
                      }
                      className={`w-full px-4 py-2 rounded-lg ${
                        nightState.witchHealingPotionUsed ||
                        nightState.witchPotionUsedThisNight
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {nightState.witchHealingPotionUsed
                        ? "Healing Potion Used"
                        : nightState.witchPotionUsedThisNight
                          ? "Potion Already Used This Night"
                          : "Use Healing Potion"}
                    </button>
                    <button
                      onClick={() => setWitchPotionModal("death")}
                      disabled={
                        nightState.witchDeathPotionUsed ||
                        nightState.witchPotionUsedThisNight
                      }
                      className={`w-full px-4 py-2 rounded-lg ${
                        nightState.witchDeathPotionUsed ||
                        nightState.witchPotionUsedThisNight
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {nightState.witchDeathPotionUsed
                        ? "Death Potion Used"
                        : nightState.witchPotionUsedThisNight
                          ? "Potion Already Used This Night"
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
                selectedRoles={selectedRoles}
                onToggleAlive={onTogglePlayerAlive}
                onSetRevealedRole={onSetPlayerRevealedRole}
                onUpdateNotes={onUpdatePlayerNotes}
                onSetWolfHoundTeam={onSetPlayerWolfHoundTeam}
                onCheckEliminationConsequences={onCheckEliminationConsequences}
                onAddGameEvent={onAddGameEvent}
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
    </div>
  );
};
