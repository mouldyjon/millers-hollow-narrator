import { AlertCircle } from "lucide-react";
import type { RoleId } from "../types/game";
import { Button } from "./ui";
import { RoleActionGuide } from "./RoleActionGuide";
import { roles } from "../data/roles";

interface RoleNarratorGuideProps {
  roleId: RoleId;
  nightNumber: number;
  cursedWolfFatherInfectedPlayer: number | null | undefined;
  cupidLovers: [number, number] | null | undefined;
  wildChildRoleModel: number | null | undefined;
  thiefChosenRole: RoleId | undefined;
  nightState: {
    werewolfVictimSelectedThisNight: boolean;
    bigBadWolfVictimSelectedThisNight: boolean;
    whiteWerewolfVictimSelectedThisNight: boolean;
    cursedWolfFatherInfectionUsed: boolean;
    witchHealingPotionUsed: boolean;
    witchDeathPotionUsed: boolean;
    witchPotionUsedThisNight: boolean;
    completedActions: Record<string, boolean[]>;
  };
  onSetCupidModal: (show: boolean) => void;
  onSetWildChildModal: (show: boolean) => void;
  onSetWerewolfVictimModal: (
    type: "simple" | "big-bad" | "white" | null,
  ) => void;
  onSetCursedWolfFatherModal: (show: boolean) => void;
  onSetWitchPotionModal: (type: "healing" | "death" | null) => void;
  onSetThiefModal: (show: boolean) => void;
  onToggleActionComplete: (roleId: RoleId, stepIndex: number) => void;
}

export const RoleNarratorGuide = ({
  roleId,
  nightNumber,
  cursedWolfFatherInfectedPlayer,
  cupidLovers,
  wildChildRoleModel,
  thiefChosenRole,
  nightState,
  onSetCupidModal,
  onSetWildChildModal,
  onSetWerewolfVictimModal,
  onSetCursedWolfFatherModal,
  onSetWitchPotionModal,
  onSetThiefModal,
  onToggleActionComplete,
}: RoleNarratorGuideProps) => {
  return (
    <>
      {/* Role-specific actions */}
      {roleId === "thief" && (
        <div className="mt-6">
          <Button
            onClick={() => onSetThiefModal(true)}
            variant="primary"
            size="md"
            fullWidth
            className="bg-purple-600 hover:bg-purple-700"
          >
            <span>
              {thiefChosenRole
                ? `Thief chose: ${roles[thiefChosenRole].name}`
                : "Choose Role"}
            </span>
          </Button>
        </div>
      )}

      {roleId === "cupid" && (
        <div className="mt-6">
          <Button
            onClick={() => onSetCupidModal(true)}
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

      {roleId === "wild-child" && (
        <div className="mt-6">
          <Button
            onClick={() => onSetWildChildModal(true)}
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

      {roleId === "simple-werewolf" && (
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
                    <strong>Player {cursedWolfFatherInfectedPlayer}</strong> has
                    been infected by the Cursed Wolf-Father and is now secretly
                    a werewolf.
                  </p>
                  <p className="text-orange-100 mb-2">
                    They have <strong>lost all abilities</strong> from their
                    original role and now act as a regular werewolf.
                  </p>
                  <p className="text-orange-100 font-semibold">
                    You must discreetly signal this player to wake with the
                    werewolves (tap shoulder, whisper, etc.)
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={() => onSetWerewolfVictimModal("simple")}
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

      {roleId === "big-bad-wolf" && (
        <div className="mt-6">
          <Button
            onClick={() => onSetWerewolfVictimModal("big-bad")}
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

      {roleId === "white-werewolf" && (
        <div className="mt-6">
          <Button
            onClick={() => onSetWerewolfVictimModal("white")}
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

      {roleId === "cursed-wolf-father" && (
        <div className="mt-6">
          <Button
            onClick={() => onSetCursedWolfFatherModal(true)}
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

      {roleId === "witch" && (
        <div className="mt-6 space-y-2">
          <Button
            onClick={() => onSetWitchPotionModal("healing")}
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
            onClick={() => onSetWitchPotionModal("death")}
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
      <RoleActionGuide
        roleId={roleId}
        completedActions={
          nightState.completedActions[`${roleId}-${nightNumber}`] || []
        }
        onStepComplete={(stepIndex) =>
          onToggleActionComplete(roleId, stepIndex)
        }
      />
    </>
  );
};
