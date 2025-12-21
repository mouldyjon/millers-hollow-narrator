import type { RoleId } from "../types/game";
import { roles } from "../data/roles";
import { getRoleSlotCount } from "../logic/roleSlotCalculations";

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationMessage {
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
}

const INVESTIGATIVE_ROLES: RoleId[] = ["seer", "fox", "bear-tamer"];
const PROTECTIVE_ROLES: RoleId[] = ["witch", "hunter", "knight-rusty-sword"];

/**
 * Validate role setup and return warnings/errors
 */
export const validateSetup = (
  selectedRoles: RoleId[],
  playerCount: number,
): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  // Count roles by team
  const werewolfRoles = selectedRoles.filter(
    (roleId) => roles[roleId]?.team === "werewolf",
  );
  const soloRoles = selectedRoles.filter(
    (roleId) => roles[roleId]?.team === "solo",
  );

  // Calculate role slots (accounting for multi-card roles and game modifiers like Sheriff)
  const totalSlots = selectedRoles.reduce((sum, roleId) => {
    return sum + getRoleSlotCount(roleId);
  }, 0);

  // Error: No werewolves
  if (werewolfRoles.length === 0) {
    messages.push({
      severity: "error",
      message: "No werewolves selected",
      suggestion: "Add at least one werewolf role to start the game",
    });
  }

  // Error: Role count mismatch
  if (totalSlots !== playerCount && selectedRoles.length > 0) {
    const diff = playerCount - totalSlots;
    messages.push({
      severity: "error",
      message: `${Math.abs(diff)} ${diff > 0 ? "more" : "fewer"} role${Math.abs(diff) !== 1 ? "s" : ""} needed`,
      suggestion:
        diff > 0
          ? "Add more roles to match player count"
          : "Remove roles or increase player count",
    });
  }

  // Calculate werewolf percentage
  if (playerCount > 0 && werewolfRoles.length > 0) {
    const werewolfPercentage = (werewolfRoles.length / playerCount) * 100;

    // Warning: Too many werewolves
    if (werewolfPercentage > 35) {
      messages.push({
        severity: "warning",
        message: `${Math.round(werewolfPercentage)}% werewolves - too many`,
        suggestion:
          "Game may be unbalanced in favour of werewolves. Aim for 25-30%",
      });
    }

    // Warning: Too few werewolves
    if (werewolfPercentage < 20 && playerCount >= 6) {
      messages.push({
        severity: "warning",
        message: `${Math.round(werewolfPercentage)}% werewolves - too few`,
        suggestion: "Village may dominate. Consider adding more werewolves",
      });
    }
  }

  // Warning: No investigative roles
  const hasInvestigative = selectedRoles.some((roleId) =>
    INVESTIGATIVE_ROLES.includes(roleId),
  );
  if (!hasInvestigative && playerCount >= 6) {
    messages.push({
      severity: "warning",
      message: "No investigative roles",
      suggestion:
        "Village will struggle to find werewolves. Add Seer, Fox, or Bear Tamer",
    });
  }

  // Info: No protective roles for larger games
  const hasProtective = selectedRoles.some((roleId) =>
    PROTECTIVE_ROLES.includes(roleId),
  );
  if (!hasProtective && playerCount >= 8) {
    messages.push({
      severity: "info",
      message: "No protective roles",
      suggestion: "Consider adding Witch, Hunter, or Knight for more strategy",
    });
  }

  // Info: Solo roles in small games
  if (soloRoles.length > 0 && playerCount < 10) {
    messages.push({
      severity: "info",
      message: "Solo role in small game",
      suggestion:
        "Solo roles (Angel, Prejudiced Manipulator) work better with 10+ players",
    });
  }

  // Warning: Too many special roles
  const specialRoles = selectedRoles.filter(
    (roleId) =>
      roleId !== "villager" &&
      roleId !== "simple-werewolf" &&
      roleId !== "two-sisters" &&
      roleId !== "three-brothers",
  );
  if (specialRoles.length > playerCount * 0.6) {
    messages.push({
      severity: "info",
      message: "Many complex roles",
      suggestion:
        "Lots of special powers - great for experienced players, may overwhelm beginners",
    });
  }

  // Info: Missing villagers makes game complex
  const villagerCount = selectedRoles.filter((r) => r === "villager").length;
  if (villagerCount === 0 && playerCount >= 8) {
    messages.push({
      severity: "info",
      message: "No simple villagers",
      suggestion: "Every player has a special role - intense game!",
    });
  }

  return messages;
};

/**
 * Get recommended roles based on current setup
 */
export const getRecommendedRoles = (
  selectedRoles: RoleId[],
  playerCount: number,
): RoleId[] => {
  const recommended: RoleId[] = [];

  const hasInvestigative = selectedRoles.some((roleId) =>
    INVESTIGATIVE_ROLES.includes(roleId),
  );
  const hasProtective = selectedRoles.some((roleId) =>
    PROTECTIVE_ROLES.includes(roleId),
  );
  const werewolfCount = selectedRoles.filter(
    (roleId) => roles[roleId]?.team === "werewolf",
  ).length;

  // Recommend investigative role
  if (!hasInvestigative && playerCount >= 6) {
    recommended.push("seer");
  }

  // Recommend protective role
  if (!hasProtective && playerCount >= 8) {
    recommended.push("witch");
  }

  // Recommend werewolves based on ratio
  const targetWerewolves = Math.ceil(playerCount * 0.27); // 27%
  if (werewolfCount < targetWerewolves) {
    recommended.push("simple-werewolf");
  }

  return recommended;
};

/**
 * Check if setup is ready to start game
 */
export const canStartGame = (
  selectedRoles: RoleId[],
  playerCount: number,
): boolean => {
  const messages = validateSetup(selectedRoles, playerCount);
  const hasErrors = messages.some((m) => m.severity === "error");

  // In auto-narrator mode, players self-select roles during the game
  // So we don't require pre-assignment
  return !hasErrors && playerCount >= 5;
};
