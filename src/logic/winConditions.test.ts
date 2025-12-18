import { describe, it, expect } from "vitest";
import { checkWinCondition } from "./winConditions";
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
    sheriffElected: false,
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

describe("Win Condition Detection", () => {
  describe("Village Victory", () => {
    it("should detect village victory when all werewolves are dead", () => {
      const players = createPlayers(8);
      players[5].isAlive = false;
      players[5].actualRole = "simple-werewolf";
      players[6].isAlive = false;
      players[6].actualRole = "simple-werewolf";
      players[7].isAlive = false;
      players[7].actualRole = "big-bad-wolf";

      const state = createGameState({ players });
      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("village");
      expect(result.message).toContain("Village wins");
    });

    it("should not detect victory if no werewolves have been revealed", () => {
      const players = createPlayers(8);
      const state = createGameState({ players });
      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(false);
    });

    it("should count infected player as werewolf when checking village victory", () => {
      const players = createPlayers(8);
      // Kill 2 simple werewolves
      players[5].isAlive = false;
      players[5].actualRole = "simple-werewolf";
      players[6].isAlive = false;
      players[6].actualRole = "simple-werewolf";
      // Big Bad Wolf is alive but player 1 is infected
      players[0].isAlive = true;
      players[0].actualRole = "villager";

      const state = createGameState({
        players,
        cursedWolfFatherInfectedPlayer: 1,
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
            "cursed-wolf-father",
          ],
        },
      });

      const result = checkWinCondition(state);

      // Should NOT be village victory because infected player + Cursed Wolf-Father = 2 werewolves still alive
      expect(result.hasWinner).toBe(false);
    });
  });

  describe("Werewolf Victory", () => {
    it("should detect werewolf victory when all villagers are dead", () => {
      const players = createPlayers(8);
      players[0].isAlive = false;
      players[0].actualRole = "seer";
      players[1].isAlive = false;
      players[1].actualRole = "witch";
      players[2].isAlive = false;
      players[2].actualRole = "hunter";
      players[3].isAlive = false;
      players[3].actualRole = "villager";
      players[4].isAlive = false;
      players[4].actualRole = "villager";

      const state = createGameState({ players });
      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("werewolves");
      expect(result.message).toContain("Werewolves win");
    });
  });

  describe("Angel Solo Victory", () => {
    it("should detect angel victory when eliminated on first night", () => {
      const players = createPlayers(8);
      players[0].isAlive = false;
      players[0].actualRole = "angel";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "angel",
            "seer",
            "witch",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
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
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("solo");
      expect(result.message).toContain("Angel");
    });

    it("should detect angel victory when eliminated on first day", () => {
      const players = createPlayers(8);
      players[0].isAlive = false;
      players[0].actualRole = "angel";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "angel",
            "seer",
            "witch",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
        nightState: {
          witchHealingPotionUsed: false,
          witchDeathPotionUsed: false,
          witchPotionUsedThisNight: false,
          cursedWolfFatherInfectionUsed: false,
          stutteringJudgeDoubleVoteUsed: false,
          currentNightNumber: 2,
          whiteWerewolfNight: false,
          completedActions: {},
          werewolfVictimSelectedThisNight: false,
          bigBadWolfVictimSelectedThisNight: false,
          whiteWerewolfVictimSelectedThisNight: false,
        },
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("solo");
      expect(result.message).toContain("Angel");
    });

    it("should not detect angel victory if eliminated after first day", () => {
      const players = createPlayers(8);
      players[0].isAlive = false;
      players[0].actualRole = "angel";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "angel",
            "seer",
            "witch",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
        nightState: {
          witchHealingPotionUsed: false,
          witchDeathPotionUsed: false,
          witchPotionUsedThisNight: false,
          cursedWolfFatherInfectionUsed: false,
          stutteringJudgeDoubleVoteUsed: false,
          currentNightNumber: 3,
          whiteWerewolfNight: false,
          completedActions: {},
          werewolfVictimSelectedThisNight: false,
          bigBadWolfVictimSelectedThisNight: false,
          whiteWerewolfVictimSelectedThisNight: false,
        },
      });

      const result = checkWinCondition(state);

      // Angel becomes village after first day, so no solo victory
      expect(result.hasWinner).toBe(false);
    });
  });

  describe("Prejudiced Manipulator Solo Victory", () => {
    it("should detect manipulator victory when target group is eliminated", () => {
      const players = createPlayers(8);
      players[0].isAlive = true;
      players[0].actualRole = "prejudiced-manipulator";
      players[0].prejudicedManipulatorGroup = "A";

      // Group A players (alive)
      players[1].isAlive = true;
      players[1].prejudicedManipulatorGroup = "A";
      players[2].isAlive = true;
      players[2].prejudicedManipulatorGroup = "A";
      players[3].isAlive = true;
      players[3].prejudicedManipulatorGroup = "A";

      // Group B players (dead - this is the target group)
      players[4].isAlive = false;
      players[4].prejudicedManipulatorGroup = "B";
      players[5].isAlive = false;
      players[5].prejudicedManipulatorGroup = "B";
      players[6].isAlive = false;
      players[6].prejudicedManipulatorGroup = "B";
      players[7].isAlive = false;
      players[7].prejudicedManipulatorGroup = "B";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "prejudiced-manipulator",
            "villager",
            "villager",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
        prejudicedManipulatorTargetGroup: "B",
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("solo");
      expect(result.message).toContain("Prejudiced Manipulator");
      expect(result.message).toContain("Group B");
    });

    it("should not detect manipulator victory if they are dead", () => {
      const players = createPlayers(8);
      players[0].isAlive = false;
      players[0].actualRole = "prejudiced-manipulator";

      // All Group B dead
      players[1].isAlive = false;
      players[1].prejudicedManipulatorGroup = "B";
      players[2].isAlive = false;
      players[2].prejudicedManipulatorGroup = "B";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "prejudiced-manipulator",
            "villager",
            "villager",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
        prejudicedManipulatorTargetGroup: "B",
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(false);
    });
  });

  describe("White Werewolf Solo Victory", () => {
    it("should detect white werewolf victory when all other werewolves dead", () => {
      const players = createPlayers(8);
      // White Werewolf alive (not revealed)
      players[7].isAlive = true;
      players[7].actualRole = "white-werewolf";

      // Other werewolves dead
      players[5].isAlive = false;
      players[5].actualRole = "simple-werewolf";
      players[6].isAlive = false;
      players[6].actualRole = "big-bad-wolf";

      // Some villagers alive
      players[0].isAlive = true;

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "seer",
            "witch",
            "hunter",
            "villager",
            "villager",
            "simple-werewolf",
            "big-bad-wolf",
            "white-werewolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("solo");
      expect(result.message).toContain("White Werewolf");
    });

    it("should not detect white werewolf victory if they are dead", () => {
      const players = createPlayers(8);
      // White Werewolf dead
      players[7].isAlive = false;
      players[7].actualRole = "white-werewolf";

      // Other werewolves dead
      players[5].isAlive = false;
      players[5].actualRole = "simple-werewolf";
      players[6].isAlive = false;
      players[6].actualRole = "big-bad-wolf";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "seer",
            "witch",
            "hunter",
            "villager",
            "villager",
            "simple-werewolf",
            "big-bad-wolf",
            "white-werewolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      // All werewolves dead = village victory
      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("village");
    });

    it("should not detect white werewolf victory if other werewolves still alive", () => {
      const players = createPlayers(8);
      // White Werewolf alive
      players[7].isAlive = true;
      players[7].actualRole = "white-werewolf";

      // One other werewolf still alive
      players[5].isAlive = true;
      players[6].isAlive = false;
      players[6].actualRole = "simple-werewolf";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "seer",
            "witch",
            "hunter",
            "villager",
            "villager",
            "simple-werewolf",
            "big-bad-wolf",
            "white-werewolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(false);
    });
  });

  describe("Wolf-Hound Team Allegiance", () => {
    it("should count wolf-hound as werewolf when they choose werewolf team", () => {
      const players = createPlayers(8);
      // Wolf-Hound chose werewolves
      players[0].isAlive = true;
      players[0].actualRole = "wolf-hound";
      players[0].wolfHoundTeam = "werewolf";

      // Kill all villagers
      players[1].isAlive = false;
      players[1].actualRole = "seer";
      players[2].isAlive = false;
      players[2].actualRole = "witch";
      players[3].isAlive = false;
      players[3].actualRole = "hunter";
      players[4].isAlive = false;
      players[4].actualRole = "villager";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "wolf-hound",
            "seer",
            "witch",
            "hunter",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("werewolves");
    });

    it("should count wolf-hound as villager when they choose village team", () => {
      const players = createPlayers(8);
      // Wolf-Hound chose village
      players[0].isAlive = true;
      players[0].actualRole = "wolf-hound";
      players[0].wolfHoundTeam = "village";

      // Kill all werewolves
      players[5].isAlive = false;
      players[5].actualRole = "simple-werewolf";
      players[6].isAlive = false;
      players[6].actualRole = "simple-werewolf";
      players[7].isAlive = false;
      players[7].actualRole = "big-bad-wolf";

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "wolf-hound",
            "seer",
            "witch",
            "hunter",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe("village");
    });
  });

  describe("Multi-card Roles", () => {
    it("should correctly count two sisters as 2 village players", () => {
      const players = createPlayers(8);
      players[0].isAlive = true;
      players[0].actualRole = "two-sisters";
      players[1].isAlive = true;
      players[1].actualRole = "two-sisters";

      // Kill all other villagers
      players[2].isAlive = false;
      players[2].actualRole = "seer";
      players[3].isAlive = false;
      players[3].actualRole = "witch";
      players[4].isAlive = false;
      players[4].actualRole = "villager";

      // Werewolves alive
      players[5].isAlive = true;
      players[6].isAlive = true;
      players[7].isAlive = true;

      const state = createGameState({
        players,
        setup: {
          playerCount: 8,
          selectedRoles: [
            "two-sisters",
            "seer",
            "witch",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      // Two Sisters still alive, so village hasn't lost
      expect(result.hasWinner).toBe(false);
    });

    it("should correctly count three brothers as 3 village players", () => {
      const players = createPlayers(9);
      players[0].isAlive = true;
      players[0].actualRole = "three-brothers";
      players[1].isAlive = true;
      players[1].actualRole = "three-brothers";
      players[2].isAlive = true;
      players[2].actualRole = "three-brothers";

      // Kill all other villagers
      players[3].isAlive = false;
      players[3].actualRole = "seer";
      players[4].isAlive = false;
      players[4].actualRole = "witch";
      players[5].isAlive = false;
      players[5].actualRole = "villager";

      const state = createGameState({
        players,
        setup: {
          playerCount: 9,
          selectedRoles: [
            "three-brothers",
            "seer",
            "witch",
            "villager",
            "villager",
            "simple-werewolf",
            "simple-werewolf",
            "big-bad-wolf",
          ],
        },
      });

      const result = checkWinCondition(state);

      // Three Brothers still alive, so village hasn't lost
      expect(result.hasWinner).toBe(false);
    });
  });
});
