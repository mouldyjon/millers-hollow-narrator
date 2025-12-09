import type { GameState } from "../types/game";
import { roles } from "../data/roles";

export interface WinConditionResult {
  hasWinner: boolean;
  winner?: "village" | "werewolves" | "solo";
  message?: string;
}

/**
 * Pure function to check if any team has won the game
 * Checks in priority order: Angel > Prejudiced Manipulator > White Werewolf > Village > Werewolves
 */
export const checkWinCondition = (gameState: GameState): WinConditionResult => {
  // Count total werewolf and village roles in the game
  let totalWerewolves = 0;
  let totalVillagers = 0;

  gameState.setup.selectedRoles.forEach((roleId) => {
    const roleData = roles[roleId];
    if (!roleData) return;

    let multiplier = 1;
    if (roleId === "two-sisters") multiplier = 2;
    if (roleId === "three-brothers") multiplier = 3;

    if (roleData.team === "werewolf") {
      totalWerewolves += multiplier;
    } else if (roleData.team === "village") {
      totalVillagers += multiplier;
    }
  });

  // Check if Wolf-Hound has chosen a team
  const wolfHoundPlayer = gameState.players.find(
    (p) => p.actualRole === "wolf-hound",
  );
  if (wolfHoundPlayer?.wolfHoundTeam) {
    // Wolf-Hound starts as village, so adjust counts based on their choice
    if (wolfHoundPlayer.wolfHoundTeam === "werewolf") {
      // They chose werewolves, so subtract from village and add to werewolves
      totalVillagers -= 1;
      totalWerewolves += 1;
    }
    // If they chose village, no adjustment needed as they're already counted as village
  }

  // If a player has been infected by Cursed Wolf-Father, they become a werewolf
  if (gameState.cursedWolfFatherInfectedPlayer) {
    totalWerewolves += 1;
    // The infected player was originally a villager, so subtract from villagers
    totalVillagers -= 1;
  }

  // Count revealed dead players by team
  let deadWerewolves = 0;
  let deadVillagers = 0;

  gameState.players.forEach((player) => {
    if (!player.isAlive && player.actualRole) {
      // Check if this player was infected by Cursed Wolf-Father
      if (player.number === gameState.cursedWolfFatherInfectedPlayer) {
        // They're now a werewolf regardless of their original role
        deadWerewolves++;
        return;
      }

      const roleData = roles[player.actualRole];
      if (!roleData) return;

      // Handle Wolf-Hound team choice
      if (player.actualRole === "wolf-hound" && player.wolfHoundTeam) {
        if (player.wolfHoundTeam === "werewolf") {
          deadWerewolves++;
        } else {
          deadVillagers++;
        }
        return;
      }

      if (roleData.team === "werewolf") {
        deadWerewolves++;
      } else if (roleData.team === "village") {
        deadVillagers++;
      }
    }
  });

  // Check win conditions
  // Check solo roles first (highest priority)

  // Check for Angel solo victory (if eliminated on first day/night)
  if (gameState.setup.selectedRoles.includes("angel")) {
    const angelPlayer = gameState.players.find(
      (p) => p.actualRole === "angel",
    );

    // Angel wins if they were eliminated during night 1 or the first day
    if (
      angelPlayer &&
      !angelPlayer.isAlive &&
      gameState.nightState.currentNightNumber <= 2
    ) {
      return {
        hasWinner: true,
        winner: "solo",
        message:
          "The Angel was eliminated first and wins! They now join the village.",
      };
    }
  }

  // Check for Prejudiced Manipulator solo victory
  if (gameState.setup.selectedRoles.includes("prejudiced-manipulator")) {
    const manipulatorPlayer = gameState.players.find(
      (p) => p.actualRole === "prejudiced-manipulator",
    );

    // Only check if Manipulator is alive and has set a target group
    if (
      manipulatorPlayer?.isAlive &&
      gameState.prejudicedManipulatorTargetGroup
    ) {
      const targetGroup = gameState.prejudicedManipulatorTargetGroup;

      // Check if all players in the target group are dead
      const targetGroupPlayers = gameState.players.filter(
        (p) => p.prejudicedManipulatorGroup === targetGroup,
      );
      const allTargetsDead =
        targetGroupPlayers.length > 0 &&
        targetGroupPlayers.every((p) => !p.isAlive);

      if (allTargetsDead) {
        return {
          hasWinner: true,
          winner: "solo",
          message: `The Prejudiced Manipulator has eliminated all of Group ${targetGroup} and wins!`,
        };
      }
    }
  }

  // Check for White Werewolf solo victory
  if (gameState.setup.selectedRoles.includes("white-werewolf")) {
    // Calculate alive counts using totals minus dead (works even if roles not revealed)
    // Exclude White Werewolf from werewolf count (they count as 1 werewolf in total)
    const totalOtherWerewolves = totalWerewolves - 1;
    const aliveOtherWerewolves = totalOtherWerewolves - deadWerewolves;
    const aliveVillagers = totalVillagers - deadVillagers;

    // Check if White Werewolf is alive
    // First try to find them by actualRole (if revealed)
    const whiteWolfPlayer = gameState.players.find(
      (p) => p.actualRole === "white-werewolf",
    );

    // If not found by actualRole, they must be alive (not revealed yet)
    // If found, check their isAlive status
    const isWhiteWolfAlive = whiteWolfPlayer
      ? whiteWolfPlayer.isAlive
      : deadWerewolves < totalWerewolves; // If fewer werewolves dead than total, White Wolf is alive

    // White Werewolf wins if they're alive, all other werewolves are dead, and at least one villager is alive
    if (
      isWhiteWolfAlive &&
      aliveOtherWerewolves === 0 &&
      aliveVillagers > 0
    ) {
      return {
        hasWinner: true,
        winner: "solo",
        message:
          "The White Werewolf has eliminated all other werewolves and wins alone!",
      };
    }
  }

  // Village wins if all werewolves are dead (and at least one has been revealed)
  if (deadWerewolves > 0 && deadWerewolves >= totalWerewolves) {
    return {
      hasWinner: true,
      winner: "village",
      message: "All werewolves have been eliminated. The Village wins!",
    };
  }

  // Werewolves win if all villagers are dead (and at least one has been revealed)
  if (deadVillagers > 0 && deadVillagers >= totalVillagers) {
    return {
      hasWinner: true,
      winner: "werewolves",
      message: "All villagers have been eliminated. The Werewolves win!",
    };
  }

  return { hasWinner: false };
};
