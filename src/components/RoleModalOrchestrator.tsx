import { useState } from "react";
import type { Player } from "../types/game";
import { WitchPotionModal } from "./WitchPotionModal";
import { CupidLoversModal } from "./CupidLoversModal";
import { WerewolfVictimModal } from "./WerewolfVictimModal";
import { WildChildRoleModelModal } from "./WildChildRoleModelModal";
import { CursedWolfFatherModal } from "./CursedWolfFatherModal";

interface RoleModalOrchestratorProps {
  players: Player[];
  cupidLovers: [number, number] | null | undefined;
  wildChildRoleModel: number | null | undefined;
  onUseWitchHealingPotion: (playerNumber: number) => void;
  onUseWitchDeathPotion: (playerNumber: number) => void;
  onSetCupidLovers: (lover1: number, lover2: number) => void;
  onSetWildChildRoleModel: (roleModelNumber: number) => void;
  onSelectWerewolfVictim: (
    playerNumber: number,
    werewolfType: "simple" | "big-bad" | "white",
  ) => void;
  onUseCursedWolfFatherInfection: (playerNumber: number) => void;
  onAddGameEvent: (
    type: "elimination" | "role_action" | "day_vote" | "special",
    description: string,
  ) => void;
}

export const RoleModalOrchestrator = ({
  players,
  cupidLovers,
  wildChildRoleModel,
  onUseWitchHealingPotion,
  onUseWitchDeathPotion,
  onSetCupidLovers,
  onSetWildChildRoleModel,
  onSelectWerewolfVictim,
  onUseCursedWolfFatherInfection,
  onAddGameEvent,
}: RoleModalOrchestratorProps) => {
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

  return {
    // Modal state setters for RoleNarratorGuide
    setShowCupidModal,
    setShowWildChildModal,
    setWerewolfVictimModal,
    setShowCursedWolfFatherModal,
    setWitchPotionModal,

    // Render all modals
    renderModals: () => (
      <>
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
        {showCupidModal && (
          <CupidLoversModal
            players={players}
            currentLovers={cupidLovers || undefined}
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
        {showWildChildModal && (
          <WildChildRoleModelModal
            players={players}
            currentRoleModel={wildChildRoleModel ?? undefined}
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
        {werewolfVictimModal && (
          <WerewolfVictimModal
            players={players}
            werewolfType={werewolfVictimModal}
            onConfirm={(playerNumber) => {
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
      </>
    ),
  };
};
