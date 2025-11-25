import type { RoleId } from "../types/game";

/**
 * Maps role IDs to their narration audio filenames
 * Files should be in /public/audio/narration/
 */

export const narrationFiles = {
  // Phase transitions
  nightBegins: "night-begins.mp3",
  dawnBreaks: "dawn-breaks.mp3",
  dayBegins: "day-begins.mp3",

  // Role-specific narration (wake/sleep pairs)
  roles: {
    "simple-werewolf": {
      wake: "werewolves-wake.mp3",
      sleep: "werewolves-sleep.mp3",
    },
    "big-bad-wolf": {
      wake: "big-bad-wolf-wake.mp3",
      sleep: "big-bad-wolf-sleep.mp3",
    },
    "white-werewolf": {
      wake: "white-werewolf-wake.mp3",
      sleep: "white-werewolf-sleep.mp3",
    },
    seer: {
      wake: "seer-wake.mp3",
      sleep: "seer-sleep.mp3",
    },
    witch: {
      wake: "witch-wake.mp3",
      sleep: "witch-sleep.mp3",
    },
    hunter: {
      wake: "hunter-wake.mp3",
      sleep: "hunter-sleep.mp3",
    },
    "little-girl": {
      wake: "little-girl-reminder.mp3",
      sleep: "role-sleep.mp3",
    },
    cupid: {
      wake: "cupid-wake.mp3",
      sleep: "cupid-sleep.mp3",
    },
    lovers: {
      wake: "lovers-wake.mp3",
      sleep: "lovers-sleep.mp3",
    },
    fox: {
      wake: "fox-wake.mp3",
      sleep: "fox-sleep.mp3",
    },
    "bear-tamer": {
      wake: "bear-tamer-dawn.mp3",
      sleep: "role-sleep.mp3",
    },
    "knight-rusty-sword": {
      wake: "knight-rusty-sword-wake.mp3",
      sleep: "knight-rusty-sword-sleep.mp3",
    },
    "stuttering-judge": {
      wake: "stuttering-judge-wake.mp3",
      sleep: "stuttering-judge-sleep.mp3",
    },
    "devoted-servant": {
      wake: "devoted-servant-wake.mp3",
      sleep: "devoted-servant-sleep.mp3",
    },
    "wild-child": {
      wake: "wild-child-first-night.mp3",
      sleep: "wild-child-sleep.mp3",
    },
    "wolf-hound": {
      wake: "wolf-hound-first-night.mp3",
      sleep: "wolf-hound-sleep.mp3",
    },
    actor: {
      wake: "actor-wake.mp3",
      sleep: "actor-sleep.mp3",
    },
    thief: {
      wake: "thief-first-night.mp3",
      sleep: "thief-sleep.mp3",
    },
    "cursed-wolf-father": {
      wake: "cursed-wolf-father-wake.mp3",
      sleep: "cursed-wolf-father-sleep.mp3",
    },
    angel: {
      wake: "angel-first-night.mp3",
      sleep: "angel-sleep.mp3",
    },
    "prejudiced-manipulator": {
      wake: "prejudiced-manipulator-wake.mp3",
      sleep: "prejudiced-manipulator-sleep.mp3",
    },
    sheriff: {
      wake: "role-wake.mp3",
      sleep: "role-sleep.mp3",
    },
    villager: {
      wake: "role-wake.mp3",
      sleep: "role-sleep.mp3",
    },
    "two-sisters": {
      wake: "two-sisters-wake.mp3",
      sleep: "two-sisters-sleep.mp3",
    },
    "three-brothers": {
      wake: "three-brothers-wake.mp3",
      sleep: "three-brothers-sleep.mp3",
    },
  } as Record<RoleId, { wake: string; sleep: string }>,

  // Announcements
  announcements: {
    victimAnnouncement: "victim-announcement.mp3",
    noDeath: "no-death.mp3",
    bearGrowls: "bear-growls.mp3",
    bearCalm: "bear-calm.mp3",
    sheriffDied: "sheriff-died.mp3",
    discussionBegins: "discussion-begins.mp3",
    votingTime: "voting-time.mp3",
    elimination: "elimination.mp3",
    noElimination: "no-elimination.mp3",
  },

  // Victory
  victory: {
    village: "village-victory.mp3",
    werewolves: "werewolf-victory.mp3",
    solo: "white-werewolf-victory.mp3",
    lovers: "lovers-victory.mp3",
  },
};

/**
 * Check if an audio file exists for a role
 */
export const hasNarrationFile = (
  roleId: RoleId,
  type: "wake" | "sleep",
): boolean => {
  return !!narrationFiles.roles[roleId]?.[type];
};

/**
 * Get narration filename for a role
 */
export const getNarrationFile = (
  roleId: RoleId,
  type: "wake" | "sleep",
): string | null => {
  return narrationFiles.roles[roleId]?.[type] || null;
};
