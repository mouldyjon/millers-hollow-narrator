import { X, Heart, Skull, Ban } from "lucide-react";
import { Button } from "./ui";

interface WitchActionChoiceModalProps {
  healingPotionUsed: boolean;
  deathPotionUsed: boolean;
  onChooseHealing: () => void;
  onChooseDeath: () => void;
  onChooseNothing: () => void;
  onCancel: () => void;
}

export const WitchActionChoiceModal = ({
  healingPotionUsed,
  deathPotionUsed,
  onChooseHealing,
  onChooseDeath,
  onChooseNothing,
  onCancel,
}: WitchActionChoiceModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold font-header text-amber-100">
            Witch Action
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-slate-300 mb-6">
            Choose an action for this night:
          </p>

          <div className="space-y-3">
            {/* Healing Potion Option */}
            <button
              onClick={onChooseHealing}
              disabled={healingPotionUsed}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                healingPotionUsed
                  ? "bg-slate-700/50 border border-slate-600/50 opacity-50 cursor-not-allowed"
                  : "bg-green-600/20 hover:bg-green-600/30 border border-green-600/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-medium text-slate-100">
                    Use Healing Potion
                  </div>
                  <div className="text-sm text-slate-400">
                    {healingPotionUsed ? "Already used" : "Revive a dead player"}
                  </div>
                </div>
              </div>
            </button>

            {/* Death Potion Option */}
            <button
              onClick={onChooseDeath}
              disabled={deathPotionUsed}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                deathPotionUsed
                  ? "bg-slate-700/50 border border-slate-600/50 opacity-50 cursor-not-allowed"
                  : "bg-red-600/20 hover:bg-red-600/30 border border-red-600/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Skull className="w-6 h-6 text-red-400" />
                <div>
                  <div className="font-medium text-slate-100">
                    Use Death Potion
                  </div>
                  <div className="text-sm text-slate-400">
                    {deathPotionUsed ? "Already used" : "Eliminate a player"}
                  </div>
                </div>
              </div>
            </button>

            {/* Do Nothing Option */}
            <button
              onClick={onChooseNothing}
              className="w-full p-4 rounded-lg text-left transition-colors bg-slate-700/20 hover:bg-slate-700/30 border border-slate-600/50"
            >
              <div className="flex items-center gap-3">
                <Ban className="w-6 h-6 text-slate-400" />
                <div>
                  <div className="font-medium text-slate-100">
                    Do Nothing
                  </div>
                  <div className="text-sm text-slate-400">
                    Save your potions for later
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700">
          <Button onClick={onCancel} variant="secondary" size="md" fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
