import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import type { RoleId } from "../types/game";

interface ActionStep {
  text: string;
  important?: boolean;
}

interface RoleActionGuideProps {
  roleId: RoleId;
  completedActions?: boolean[];
  onStepComplete?: (stepIndex: number) => void;
}

const roleActions: Record<string, ActionStep[]> = {
  thief: [
    { text: "Show the Thief the two unused role cards", important: true },
    { text: "Ask if they want to swap their card with one of them" },
    { text: "If they swap, remember the new role they took" },
  ],
  cupid: [
    { text: "Ask Cupid to choose two players to be lovers", important: true },
    { text: "Record which two players are lovers (they die together)" },
    {
      text: "Remember: If one lover is werewolf and one is villager, they have a new win condition",
    },
  ],
  lovers: [
    { text: "Wake the two lovers", important: true },
    { text: "Let them see each other and recognise who their partner is" },
    { text: "Remind them they win or lose together" },
  ],
  "wolf-hound": [
    { text: "Ask Wolf-Hound to choose their allegiance", important: true },
    { text: "Thumbs up for Village team, thumbs down for Werewolf team" },
    { text: "Record their choice - this determines which team they play for" },
  ],
  "wild-child": [
    { text: "Ask Wild Child to choose their role model", important: true },
    { text: "Record which player is the role model" },
    { text: "Remember: If role model dies, Wild Child becomes a werewolf" },
  ],
  "two-sisters": [
    { text: "Wake the Two Sisters", important: true },
    { text: "Let them see each other and recognise each other" },
    { text: "They go back to sleep" },
  ],
  "three-brothers": [
    { text: "Wake the Three Brothers", important: true },
    { text: "Let them see each other and recognise each other" },
    { text: "They go back to sleep" },
  ],
  seer: [
    { text: "Ask the Seer to point at one player", important: true },
    { text: "Show thumbs up if that player is a villager" },
    { text: "Show thumbs down if that player is a werewolf" },
  ],
  "simple-werewolf": [
    { text: "Wake all werewolves", important: true },
    { text: "Let them see each other and recognise fellow werewolves" },
    { text: "Ask them to agree on one victim to eliminate" },
    { text: "Record which player the werewolves chose" },
    { text: "Note: Little Girl can peek during this phase" },
  ],
  "white-werewolf": [
    {
      text: "Wake the White Werewolf alone (every other night)",
      important: true,
    },
    { text: "Ask if they want to kill another werewolf" },
    { text: "Record if they eliminated a werewolf" },
    { text: "Remember: White Werewolf wins alone if all others die" },
  ],
  "big-bad-wolf": [
    { text: "Wake Big Bad Wolf after regular werewolf turn", important: true },
    { text: "Ask if they want to devour a second victim" },
    { text: "Record the second victim if chosen" },
    { text: "Note: Only works if no werewolves have been eliminated yet" },
  ],
  "cursed-wolf-father": [
    { text: "Wake Cursed Wolf-Father (once per game)", important: true },
    { text: "Ask if they want to infect this night's victim" },
    { text: "If yes, that victim becomes a werewolf instead of dying" },
    { text: "Mark infection as used - can only be done once" },
  ],
  witch: [
    {
      text: "Show the Witch who the werewolves chose as victim",
      important: true,
    },
    { text: "Ask if they want to use healing potion (if available)" },
    { text: "Ask if they want to use death potion on someone (if available)" },
    { text: "Record which potions were used and on whom" },
    { text: "Note: Each potion can only be used once per game" },
  ],
  fox: [
    {
      text: "Ask the Fox to point at a player and their two neighbours",
      important: true,
    },
    { text: "If at least one of these three is a werewolf, nod yes" },
    { text: "If none are werewolves, shake head no" },
    { text: "Note: Fox loses power if they investigate a werewolf-free group" },
  ],
  "bear-tamer": [
    { text: "Check if Bear Tamer is adjacent to a werewolf", important: true },
    { text: 'If yes, make growling sound: "Grrrr! The bear is growling!"' },
    { text: 'If no, say: "The bear is calm and quiet"' },
  ],
};

export const RoleActionGuide = ({
  roleId,
  completedActions = [],
  onStepComplete,
}: RoleActionGuideProps) => {
  const actions = roleActions[roleId] || [];

  if (actions.length === 0) {
    return (
      <div className="bg-slate-700 rounded-lg p-4 mt-4">
        <p className="text-sm text-slate-300">
          No special actions required for this role during night phase.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 rounded-lg p-4 mt-4">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-400" />
        Narrator Actions
      </h4>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const isCompleted = completedActions[index] || false;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-2 rounded ${
                action.important ? "bg-yellow-900/30" : "bg-slate-800/50"
              }`}
            >
              <button
                onClick={() => onStepComplete?.(index)}
                className="mt-0.5 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                )}
              </button>
              <p
                className={`text-sm ${isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}
              >
                {action.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
