import { describe, it, expect } from "vitest";
import { getRoleSlotCount, calculateTotalSlots } from "./roleSlotCalculations";
import type { RoleId } from "../types/game";

describe("Role Slot Calculations", () => {
  describe("getRoleSlotCount", () => {
    it("should return 2 for two-sisters", () => {
      expect(getRoleSlotCount("two-sisters")).toBe(2);
    });

    it("should return 3 for three-brothers", () => {
      expect(getRoleSlotCount("three-brothers")).toBe(3);
    });

    it("should return 1 for single-player roles", () => {
      const singlePlayerRoles: RoleId[] = [
        "villager",
        "seer",
        "witch",
        "hunter",
        "little-girl",
        "cupid",
        "knight-rusty-sword",
        "stuttering-judge",
        "fox",
        "bear-tamer",
        "devoted-servant",
        "actor",
        "simple-werewolf",
        "big-bad-wolf",
        "white-werewolf",
        "cursed-wolf-father",
        "angel",
        "prejudiced-manipulator",
        "wild-child",
        "wolf-hound",
        "thief",
        "sheriff",
      ];

      singlePlayerRoles.forEach((roleId) => {
        expect(getRoleSlotCount(roleId)).toBe(1);
      });
    });
  });

  describe("calculateTotalSlots", () => {
    it("should calculate correct total for simple roles", () => {
      const roles: RoleId[] = [
        "seer",
        "witch",
        "hunter",
        "villager",
        "simple-werewolf",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      expect(calculateTotalSlots(roles)).toBe(7);
    });

    it("should count two-sisters as 2 slots", () => {
      const roles: RoleId[] = [
        "two-sisters",
        "seer",
        "witch",
        "villager",
        "simple-werewolf",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      expect(calculateTotalSlots(roles)).toBe(8);
    });

    it("should count three-brothers as 3 slots", () => {
      const roles: RoleId[] = [
        "three-brothers",
        "seer",
        "witch",
        "villager",
        "simple-werewolf",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      expect(calculateTotalSlots(roles)).toBe(9);
    });

    it("should handle multiple multi-player roles", () => {
      const roles: RoleId[] = [
        "two-sisters",
        "three-brothers",
        "seer",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      // 2 + 3 + 1 + 1 + 1 = 8
      expect(calculateTotalSlots(roles)).toBe(8);
    });

    it("should return 0 for empty array", () => {
      expect(calculateTotalSlots([])).toBe(0);
    });

    it("should handle array with only villagers", () => {
      const roles: RoleId[] = [
        "villager",
        "villager",
        "villager",
        "villager",
      ];

      expect(calculateTotalSlots(roles)).toBe(4);
    });

    it("should handle array with only werewolves", () => {
      const roles: RoleId[] = [
        "simple-werewolf",
        "simple-werewolf",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      expect(calculateTotalSlots(roles)).toBe(4);
    });

    it("should correctly calculate a typical 12-player game", () => {
      const roles: RoleId[] = [
        "seer",
        "witch",
        "hunter",
        "cupid",
        "two-sisters",
        "villager",
        "villager",
        "simple-werewolf",
        "simple-werewolf",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      // 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1 + 1 + 1 = 12
      expect(calculateTotalSlots(roles)).toBe(12);
    });

    it("should correctly calculate with both multi-player roles", () => {
      const roles: RoleId[] = [
        "two-sisters",
        "three-brothers",
        "seer",
        "witch",
        "hunter",
        "villager",
        "simple-werewolf",
        "simple-werewolf",
        "big-bad-wolf",
      ];

      // 2 + 3 + 1 + 1 + 1 + 1 + 1 + 1 + 1 = 12
      expect(calculateTotalSlots(roles)).toBe(12);
    });
  });
});
