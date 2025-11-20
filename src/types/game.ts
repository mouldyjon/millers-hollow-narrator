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

export type GamePhase = "setup" | "night" | "day" | "ended";

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
}

export interface NightState {
  witchHealingPotionUsed: boolean;
  witchDeathPotionUsed: boolean;
  cursedWolfFatherInfectionUsed: boolean;
  stutteringJudgeDoubleVoteUsed: boolean;
  currentNightNumber: number;
  whiteWerewolfNight: boolean;
  completedActions: Record<string, boolean[]>;
}

export interface Player {
  number: number;
  isAlive: boolean;
  revealedRole?: string;
  actualRole?: RoleId;
  notes?: string;
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
  cupidLovers?: [number, number];
  wildChildRoleModel?: number;
  wolfHoundTeam?: "village" | "werewolf";
  thiefChosenRole?: RoleId;
  sheriff?: number;
  currentNightStep: number;
  gameEvents: GameEvent[];
}
