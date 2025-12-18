import { describe, it, expect } from "vitest";
import { checkEliminationConsequences } from "./eliminationConsequences";
import type { GameState, Player } from "../types/game";

// Helper to create a basic game state
const createGameState = (overrides?: Partial<GameState>): GameState => ({
  setup: {
    playerCount: 8,
    selectedRoles: [
      "seer",
      "witch",
      "hunter",
      "villager",
      "villager",
      "simple-werewolf",
      "simple-werewolf",
      "big-bad-wolf",
    ],
  },
  phase: "night",
  nightState: {
    witchHealingPotionUsed: false,
    witchDeathPotionUsed: false,
    witchPotionUsedThisNight: false,
    cursedWolfFatherInfectionUsed: false,
    stutteringJudgeDoubleVoteUsed: false,
    currentNightNumber: 1,
    whiteWerewolfNight: false,
    completedActions: {},
    werewolfVictimSelectedThisNight: false,
    bigBadWolfVictimSelectedThisNight: false,
    whiteWerewolfVictimSelectedThisNight: false,
  },
  dayState: {
    currentDayNumber: 0,
    votingInProgress: false,
    discussionTimerActive: false,
  },
  players: [],
  eliminatedPlayers: [],
  pendingRoleReveals: [],
  currentNightStep: 0,
  gameEvents: [],
  ...overrides,
});

// Helper to create players
const createPlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    isAlive: true,
  }));

describe("Elimination Consequences", () => {
  describe("Cupid's Lovers", () => {
    it("should eliminate the other lover when one dies", () => {
      const players = createPlayers(8);
      const state = createGameState({
        players,
        cupidLovers: [1, 5],
      });

      const result = checkEliminationConsequences(state, 1);

      expect(result.type).toBe("lovers");
      expect(result.affectedPlayers).toEqual([5]);
      expect(result.message).toContain("Player 5");
      expect(result.message).toContain("heartbreak");
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should eliminate the first lover when the second dies", () => {
      const players = createPlayers(8);
      const state = createGameState({
        players,
        cupidLovers: [2, 7],
      });

      const result = checkEliminationConsequences(state, 7);

      expect(result.type).toBe("lovers");
      expect(result.affectedPlayers).toEqual([2]);
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should not eliminate lover if they are already dead", () => {
      const players = createPlayers(8);
      players[4].isAlive = false; // Player 5 is already dead

      const state = createGameState({
        players,
        cupidLovers: [1, 5],
      });

      const result = checkEliminationConsequences(state, 1);

      expect(result.type).toBe("none");
      expect(result.affectedPlayers).toEqual([]);
    });

    it("should not trigger if eliminated player is not a lover", () => {
      const players = createPlayers(8);
      const state = createGameState({
        players,
        cupidLovers: [1, 5],
      });

      const result = checkEliminationConsequences(state, 3);

      expect(result.type).toBe("none");
    });
  });

  describe("Knight with Rusty Sword", () => {
    it("should eliminate right-hand neighbour when knight dies", () => {
      const players = createPlayers(8);
      const state = createGameState({ players });

      const result = checkEliminationConsequences(
        state,
        3,
        "knight-rusty-sword",
      );

      expect(result.type).toBe("knight-rusty-sword");
      expect(result.affectedPlayers).toEqual([4]);
      expect(result.message).toContain("Player 4");
      expect(result.message).toContain("right-hand neighbour");
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should wrap around to player 1 when last player is knight", () => {
      const players = createPlayers(8);
      const state = createGameState({ players });

      const result = checkEliminationConsequences(
        state,
        8,
        "knight-rusty-sword",
      );

      expect(result.type).toBe("knight-rusty-sword");
      expect(result.affectedPlayers).toEqual([1]);
      expect(result.message).toContain("Player 1");
    });

    it("should not eliminate neighbour if they are already dead", () => {
      const players = createPlayers(8);
      players[3].isAlive = false; // Player 4 is dead

      const state = createGameState({ players });

      const result = checkEliminationConsequences(
        state,
        3,
        "knight-rusty-sword",
      );

      expect(result.type).toBe("none");
      expect(result.affectedPlayers).toEqual([]);
    });
  });

  describe("Hunter's Dying Shot", () => {
    it("should require player selection when hunter dies", () => {
      const players = createPlayers(8);
      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 3, "hunter");

      expect(result.type).toBe("hunter");
      expect(result.requiresPlayerSelection).toBe(true);
      expect(result.message).toContain("Hunter");
      expect(result.message).toContain("dying shot");
    });

    it("should not trigger if hunter is the last player alive", () => {
      const players = createPlayers(8);
      // Everyone else is dead
      players.forEach((p, i) => {
        if (i !== 2) p.isAlive = false; // Only player 3 alive
      });

      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 3, "hunter");

      expect(result.type).toBe("none");
      expect(result.affectedPlayers).toEqual([]);
    });
  });

  describe("Wild Child Transformation", () => {
    it("should transform wild child when role model dies", () => {
      const players = createPlayers(8);
      players[4].actualRole = "wild-child"; // Player 5 is Wild Child

      const state = createGameState({
        players,
        wildChildRoleModel: 2, // Player 2 is the role model
      });

      const result = checkEliminationConsequences(state, 2);

      expect(result.type).toBe("wild-child-transform");
      expect(result.affectedPlayers).toEqual([5]);
      expect(result.message).toContain("Wild Child");
      expect(result.message).toContain("transforms into a werewolf");
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should not transform if wild child is already dead", () => {
      const players = createPlayers(8);
      players[4].actualRole = "wild-child";
      players[4].isAlive = false; // Wild Child is dead

      const state = createGameState({
        players,
        wildChildRoleModel: 2,
      });

      const result = checkEliminationConsequences(state, 2);

      expect(result.type).toBe("none");
    });

    it("should not transform if someone else dies", () => {
      const players = createPlayers(8);
      players[4].actualRole = "wild-child";

      const state = createGameState({
        players,
        wildChildRoleModel: 2,
      });

      const result = checkEliminationConsequences(state, 7); // Different player

      expect(result.type).toBe("none");
    });
  });

  describe("Sibling Notifications", () => {
    it("should notify remaining two sisters when one dies", () => {
      const players = createPlayers(8);
      players[0].actualRole = "two-sisters";
      players[1].actualRole = "two-sisters";

      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 1, "two-sisters");

      expect(result.type).toBe("siblings");
      expect(result.affectedPlayers).toEqual([2]);
      expect(result.message).toContain("sister");
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should notify remaining three brothers when one dies", () => {
      const players = createPlayers(8);
      players[0].actualRole = "three-brothers";
      players[1].actualRole = "three-brothers";
      players[2].actualRole = "three-brothers";

      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 1, "three-brothers");

      expect(result.type).toBe("siblings");
      expect(result.affectedPlayers).toEqual([2, 3]);
      expect(result.message).toContain("brother");
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should not notify if all siblings are dead", () => {
      const players = createPlayers(8);
      players[0].actualRole = "two-sisters";
      players[1].actualRole = "two-sisters";
      players[1].isAlive = false; // Second sister already dead

      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 1, "two-sisters");

      expect(result.type).toBe("none");
    });
  });

  describe("Consequence Priority", () => {
    it("should prioritize lovers over other consequences", () => {
      const players = createPlayers(8);
      players[2].actualRole = "hunter"; // Player 3 is hunter

      const state = createGameState({
        players,
        cupidLovers: [3, 7], // Player 3 is also a lover
      });

      const result = checkEliminationConsequences(state, 3, "hunter");

      // Lovers should take priority over hunter's dying shot
      expect(result.type).toBe("lovers");
      expect(result.affectedPlayers).toEqual([7]);
    });

    it("should prioritize wild child transformation over knight sword", () => {
      const players = createPlayers(8);
      players[4].actualRole = "wild-child";

      const state = createGameState({
        players,
        wildChildRoleModel: 3,
      });

      const result = checkEliminationConsequences(
        state,
        3,
        "knight-rusty-sword",
      );

      // Wild Child transformation should take priority
      expect(result.type).toBe("wild-child-transform");
      expect(result.affectedPlayers).toEqual([5]);
    });
  });

  describe("No Consequences", () => {
    it("should return none when eliminating regular villager", () => {
      const players = createPlayers(8);
      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 4, "villager");

      expect(result.type).toBe("none");
      expect(result.affectedPlayers).toEqual([]);
      expect(result.message).toBe("");
      expect(result.requiresPlayerSelection).toBe(false);
    });

    it("should return none when eliminating werewolf", () => {
      const players = createPlayers(8);
      const state = createGameState({ players });

      const result = checkEliminationConsequences(state, 6, "simple-werewolf");

      expect(result.type).toBe("none");
    });
  });
});
