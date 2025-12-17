import type { RoleId } from "../types/game";
import { roles } from "../data/roles";
import { calculateTotalSlots } from "../logic/roleSlotCalculations";

export interface RoleDistribution {
  villageRoles: RoleId[];
  werewolfRoles: RoleId[];
  soloRoles: RoleId[];
  totalCount: number;
  werewolfPercentage: number;
}

// Categorise roles by their importance and utility
const INVESTIGATIVE_ROLES: RoleId[] = ["seer", "fox", "bear-tamer"];
const PROTECTIVE_ROLES: RoleId[] = ["witch", "hunter", "knight-rusty-sword"];
const SOCIAL_ROLES: RoleId[] = [
  "two-sisters",
  "three-brothers",
  "cupid",
  "little-girl",
];
const SPECIAL_VILLAGE_ROLES: RoleId[] = [
  "stuttering-judge",
  "devoted-servant",
  "actor",
  "wild-child",
  "wolf-hound",
  "thief",
];
const SOLO_ROLES: RoleId[] = ["angel", "prejudiced-manipulator"];
const SPECIAL_WEREWOLF_ROLES: RoleId[] = [
  "big-bad-wolf",
  "white-werewolf",
  "cursed-wolf-father",
];

// Note: getRoleSlotCount and calculateTotalSlots are now imported from logic/roleSlotCalculations

/**
 * Calculate recommended number of werewolves based on player count
 * Target ratio: 25-30% werewolves
 */
export const calculateWerewolfCount = (playerCount: number): number => {
  if (playerCount <= 5) return 1;
  if (playerCount <= 8) return 2;
  if (playerCount <= 12) return 3;
  if (playerCount <= 16) return 4;
  return 5;
};

/**
 * Generate a balanced role setup based on player count
 */
export const generateBalancedRoles = (
  playerCount: number,
  includeOptionalRoles = true,
): RoleId[] => {
  if (playerCount < 5) {
    throw new Error("Minimum 5 players required");
  }
  if (playerCount > 20) {
    throw new Error("Maximum 20 players supported");
  }

  // Helper to filter optional roles if needed
  const filterOptional = <T extends RoleId>(roleArray: T[]): T[] => {
    if (includeOptionalRoles) return roleArray;
    return roleArray.filter((roleId) => !roles[roleId].isOptional);
  };

  const selectedRoles: RoleId[] = [];
  const werewolfCount = calculateWerewolfCount(playerCount);

  // Step 1: Add werewolves
  let werewolvesAdded = 0;

  // Add 1-2 simple werewolves first
  const simpleWerewolfCount = Math.min(
    Math.max(1, werewolfCount - 1),
    werewolfCount,
  );
  for (let i = 0; i < simpleWerewolfCount; i++) {
    selectedRoles.push("simple-werewolf");
    werewolvesAdded++;
  }

  // Optionally add a special werewolf for variety (if we need more werewolves)
  if (werewolvesAdded < werewolfCount && playerCount >= 8) {
    const availableSpecialWerewolves = filterOptional(SPECIAL_WEREWOLF_ROLES);
    if (availableSpecialWerewolves.length > 0) {
      const specialWerewolf = getRandomElement(availableSpecialWerewolves);
      selectedRoles.push(specialWerewolf);
      werewolvesAdded++;
    }
  }

  // Fill remaining werewolf slots with simple werewolves
  while (werewolvesAdded < werewolfCount) {
    selectedRoles.push("simple-werewolf");
    werewolvesAdded++;
  }

  // Step 2: Add at least one investigative role
  const availableInvestigative = filterOptional(INVESTIGATIVE_ROLES);
  if (availableInvestigative.length > 0) {
    const investigativeRole = getRandomElement(availableInvestigative);
    selectedRoles.push(investigativeRole);
  }

  // Step 3: Add protective/action roles based on player count
  if (playerCount >= 7) {
    const availableProtective = filterOptional(PROTECTIVE_ROLES);
    if (availableProtective.length > 0) {
      const protectiveRole = getRandomElement(availableProtective);
      selectedRoles.push(protectiveRole);
    }
  }

  // Step 4: Add social roles for more players
  if (playerCount >= 8) {
    const availableSocial = filterOptional(SOCIAL_ROLES).filter((r) => {
      // Don't add two-sisters or three-brothers if we don't have space
      const currentSlots = calculateTotalSlots(selectedRoles);
      if (r === "two-sisters" && currentSlots + 2 > playerCount) return false;
      if (r === "three-brothers" && currentSlots + 3 > playerCount)
        return false;
      return true;
    });

    if (availableSocial.length > 0) {
      const socialRole = getRandomElement(availableSocial);
      // All roles are added only once - getRoleSlotCount() handles multi-player slots
      selectedRoles.push(socialRole);
    }
  }

  // Step 5: Add special roles for larger games
  if (playerCount >= 10 && Math.random() > 0.5) {
    const availableSpecial = filterOptional(SPECIAL_VILLAGE_ROLES);
    if (
      availableSpecial.length > 0 &&
      calculateTotalSlots(selectedRoles) < playerCount
    ) {
      const specialRole = getRandomElement(availableSpecial);
      selectedRoles.push(specialRole);
    }
  }

  // Step 6: Optionally add a solo role for experienced games (10+ players)
  if (playerCount >= 10 && Math.random() > 0.7) {
    const availableSolo = filterOptional(SOLO_ROLES);
    if (
      availableSolo.length > 0 &&
      calculateTotalSlots(selectedRoles) < playerCount
    ) {
      const soloRole = getRandomElement(availableSolo);
      selectedRoles.push(soloRole);
    }
  }

  // Step 7: Fill remaining slots with villagers
  while (calculateTotalSlots(selectedRoles) < playerCount) {
    selectedRoles.push("villager");
  }

  return selectedRoles;
};

/**
 * Analyse role distribution for display purposes
 */
export const analyseRoleDistribution = (
  selectedRoles: RoleId[],
): RoleDistribution => {
  const villageRoles: RoleId[] = [];
  const werewolfRoles: RoleId[] = [];
  const soloRoles: RoleId[] = [];

  selectedRoles.forEach((roleId) => {
    const role = roles[roleId];
    if (role.team === "village") {
      villageRoles.push(roleId);
    } else if (role.team === "werewolf") {
      werewolfRoles.push(roleId);
    } else if (role.team === "solo") {
      soloRoles.push(roleId);
    }
  });

  const totalCount = selectedRoles.length;
  const werewolfPercentage =
    totalCount > 0 ? (werewolfRoles.length / totalCount) * 100 : 0;

  return {
    villageRoles,
    werewolfRoles,
    soloRoles,
    totalCount,
    werewolfPercentage,
  };
};

/**
 * Validate that a role setup is balanced
 */
export const validateRoleBalance = (
  selectedRoles: RoleId[],
  playerCount: number,
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  const distribution = analyseRoleDistribution(selectedRoles);

  // Check total role slots matches player count (accounting for multi-player roles)
  const totalSlots = calculateTotalSlots(selectedRoles);
  if (totalSlots !== playerCount) {
    warnings.push(
      `Total role slots (${totalSlots}) doesn't match player count (${playerCount})`,
    );
  }

  // Check werewolf ratio
  if (distribution.werewolfPercentage < 20) {
    warnings.push(
      "Too few werewolves - game may be unbalanced in favour of village",
    );
  } else if (distribution.werewolfPercentage > 35) {
    warnings.push(
      "Too many werewolves - game may be unbalanced in favour of werewolves",
    );
  }

  // Check for at least one investigative role
  const hasInvestigative = selectedRoles.some((roleId) =>
    INVESTIGATIVE_ROLES.includes(roleId),
  );
  if (!hasInvestigative && playerCount >= 6) {
    warnings.push(
      "No investigative roles - village will have difficulty finding werewolves",
    );
  }

  // Check for werewolves
  if (distribution.werewolfRoles.length === 0) {
    warnings.push("No werewolves selected - game cannot proceed");
  }

  return {
    valid: warnings.length === 0 || distribution.werewolfRoles.length > 0,
    warnings,
  };
};

/**
 * Helper to get random element from array
 */
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
