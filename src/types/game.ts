export type RoleId =
  | "villager"
  | "two-sisters"
  | "three-brothers"
  | "seer"
  | "witch"
  | "hunter"
  | "little-girl"
  | "cupid"
  | "knight-rusty-sword"
  | "stuttering-judge"
  | "fox"
  | "bear-tamer"
  | "devoted-servant"
  | "actor"
  | "simple-werewolf"
  | "big-bad-wolf"
  | "white-werewolf"
  | "cursed-wolf-father"
  | "angel"
  | "prejudiced-manipulator"
  | "wild-child"
  | "wolf-hound"
  | "thief"
  | "sheriff";

export type Team = "village" | "werewolf" | "solo";

export type GamePhase = "setup" | "night" | "dawn" | "day" | "ended";

export interface Role {
  id: RoleId;
  name: string;
  team: Team;
  description: string;
  nightOrder: number;
  nightOrderFirstNight?: number;
  wakeEveryNight: boolean;
  wakeFirstNightOnly: boolean;
  hasLimitedUse: boolean;
  allowMultiple?: boolean;
  maxQuantity?: number;
}

export interface GameSetup {
  playerCount: number;
  selectedRoles: RoleId[];
  unusedRoles?: [RoleId, RoleId]; // Two unused roles for the Thief
}

export interface NightState {
  witchHealingPotionUsed: boolean;
  witchDeathPotionUsed: boolean;
  witchPotionUsedThisNight: boolean; // Track if any potion was used this night
  cursedWolfFatherInfectionUsed: boolean;
  stutteringJudgeDoubleVoteUsed: boolean;
  currentNightNumber: number;
  whiteWerewolfNight: boolean;
  completedActions: Record<string, boolean[]>;
  werewolfVictimSelectedThisNight: boolean;
  bigBadWolfVictimSelectedThisNight: boolean;
  whiteWerewolfVictimSelectedThisNight: boolean;
}

export interface Player {
  number: number;
  name?: string; // Optional player name
  isAlive: boolean;
  revealedRole?: string;
  actualRole?: RoleId;
  assignedRole?: RoleId; // Secret role assigned by narrator during setup
  notes?: string;
  wolfHoundTeam?: "village" | "werewolf";
  prejudicedManipulatorGroup?: "A" | "B"; // For Prejudiced Manipulator role
}

export interface GameEvent {
  night: number;
  type: "elimination" | "role_action" | "day_vote" | "special";
  description: string;
  timestamp: Date;
}

export interface GameState {
  setup: GameSetup;
  phase: GamePhase;
  nightState: NightState;
  players: Player[];
  eliminatedPlayers: number[];
  pendingRoleReveals: number[]; // Players who died this night and need role revealed at dawn
  cupidLovers?: [number, number];
  wildChildRoleModel?: number;
  wolfHoundTeam?: "village" | "werewolf";
  thiefChosenRole?: RoleId;
  sheriff?: number;
  cursedWolfFatherInfectedPlayer?: number; // Player who has been secretly converted to werewolf
  prejudicedManipulatorTargetGroup?: "A" | "B"; // Which group the Prejudiced Manipulator wants to eliminate
  currentNightStep: number;
  gameEvents: GameEvent[];
}
