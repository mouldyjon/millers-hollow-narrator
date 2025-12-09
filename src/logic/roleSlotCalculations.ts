import type { RoleId } from "../types/game";

/**
 * Get the number of player slots a role occupies
 * Most roles = 1 slot, but some roles require multiple players
 */
export const getRoleSlotCount = (roleId: RoleId): number => {
  if (roleId === "two-sisters") return 2;
  if (roleId === "three-brothers") return 3;
  return 1;
};

/**
 * Calculate total player slots from an array of roles
 * Handles multi-player roles correctly (Two Sisters, Three Brothers)
 */
export const calculateTotalSlots = (roles: RoleId[]): number => {
  return roles.reduce((sum, roleId) => sum + getRoleSlotCount(roleId), 0);
};
