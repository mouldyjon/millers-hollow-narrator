import type { GameState, RoleId } from "../types/game";

export interface EliminationConsequenceResult {
  type:
    | "none"
    | "lovers"
    | "knight-rusty-sword"
    | "hunter"
    | "siblings"
    | "wild-child-transform";
  affectedPlayers: number[];
  message: string;
  requiresPlayerSelection: boolean;
}

/**
 * Pure function to check what happens when a player is eliminated
 * Handles cascade effects like: lovers dying, hunter's last shot, wild child transformation, etc.
 */
export const checkEliminationConsequences = (
  gameState: GameState,
  playerNumber: number,
  roleId?: RoleId,
): EliminationConsequenceResult => {
  // Check if eliminated player is a lover
  if (gameState.cupidLovers && gameState.cupidLovers.includes(playerNumber)) {
    const otherLover = gameState.cupidLovers.find((p) => p !== playerNumber);
    if (otherLover) {
      const otherPlayer = gameState.players.find(
        (p) => p.number === otherLover,
      );
      if (otherPlayer?.isAlive) {
        return {
          type: "lovers",
          affectedPlayers: [otherLover],
          message: `Player ${otherLover} was in love with Player ${playerNumber} and dies of heartbreak!`,
          requiresPlayerSelection: false,
        };
      }
    }
  }

  // Check if eliminated player is Wild Child's role model
  if (gameState.wildChildRoleModel === playerNumber) {
    const wildChild = gameState.players.find(
      (p) => p.actualRole === "wild-child" && p.isAlive,
    );
    if (wildChild) {
      return {
        type: "wild-child-transform",
        affectedPlayers: [wildChild.number],
        message: `Player ${wildChild.number} (Wild Child) loses their role model and transforms into a werewolf!`,
        requiresPlayerSelection: false,
      };
    }
  }

  // Check role-specific consequences
  if (roleId === "knight-rusty-sword") {
    // Find right-hand neighbour (next player number, wrapping around)
    const rightNeighbour =
      playerNumber === gameState.setup.playerCount ? 1 : playerNumber + 1;
    const neighbour = gameState.players.find(
      (p) => p.number === rightNeighbour,
    );
    if (neighbour?.isAlive) {
      return {
        type: "knight-rusty-sword",
        affectedPlayers: [rightNeighbour],
        message: `The Knight's rusty sword breaks and strikes Player ${rightNeighbour} (right-hand neighbour)!`,
        requiresPlayerSelection: false,
      };
    }
  }

  if (roleId === "hunter") {
    const alivePlayers = gameState.players
      .filter((p) => p.isAlive && p.number !== playerNumber)
      .map((p) => p.number);
    if (alivePlayers.length > 0) {
      return {
        type: "hunter",
        affectedPlayers: [],
        message: `The Hunter fires their dying shot! Choose who to eliminate:`,
        requiresPlayerSelection: true,
      };
    }
  }

  // Check for siblings (informational only)
  if (roleId === "two-sisters" || roleId === "three-brothers") {
    const siblingsAlive = gameState.players.filter(
      (p) =>
        p.actualRole === roleId && p.isAlive && p.number !== playerNumber,
    );
    if (siblingsAlive.length > 0) {
      const siblingNumbers = siblingsAlive.map((p) => p.number);
      const siblingWord = roleId === "two-sisters" ? "sister" : "brother";
      return {
        type: "siblings",
        affectedPlayers: siblingNumbers,
        message: `Player ${playerNumber}'s ${siblingWord}(s) (${siblingNumbers.join(", ")}) should be informed of this death.`,
        requiresPlayerSelection: false,
      };
    }
  }

  return {
    type: "none",
    affectedPlayers: [],
    message: "",
    requiresPlayerSelection: false,
  };
};
