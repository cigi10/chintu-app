// lib/achievements.js
// Pure data + calculation layer for the Achievements page.
// Reads from the same localStorage keys used by the Timer, Portion Tracker,
// and Goals features — no writes happen here, this is read-only aggregation.

import { getStreakInfo } from "./streakLogic";

const SESSION_LOG_KEY = "chintu-session-log";
const SUBJECTS_KEY    = "chintu-subjects";
const EXAM_PACK_KEY   = "chintu-exam-pack";

function loadSessionLog() {
  try { return JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || "[]"); } catch { return []; }
}
function loadSubjects() {
  try { return JSON.parse(localStorage.getItem(SUBJECTS_KEY) || "{}"); } catch { return {}; }
}
function loadExamPack() {
  try { return localStorage.getItem(EXAM_PACK_KEY) || null; } catch { return null; }
}

// Goal-done state is stored per-date under "chintu-goal-done-<date>", so there's
// no single key to read — we have to walk all localStorage keys once.
function countGoalsDone() {
  let count = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("chintu-goal-done-")) {
        const map = JSON.parse(localStorage.getItem(key) || "{}");
        count += Object.values(map).filter(Boolean).length;
      }
    }
  } catch {}
  return count;
}

// Builds the full snapshot the achievement cards are computed from.
// Called once on mount by the component — cheap enough that it doesn't
// need memoizing across renders of a single page view.
export function getAchievementsContext() {
  const log      = loadSessionLog();
  const subjects = loadSubjects();
  const allTopics = Object.values(subjects).flat();
  const streak   = getStreakInfo();

  const distinctSubjectSet = new Set(
    log.map(s => (s.subject || "").trim().toLowerCase()).filter(Boolean)
  );

  const subjectGroups   = Object.values(subjects);
  const subjectsFullyDone = subjectGroups.filter(
    topics => topics.length > 0 && topics.every(t => t.status === "done")
  ).length;

  return {
    sessions:          log.length,
    focusMinutes:      log.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
    lifetimeCoins:     log.reduce((sum, s) => sum + (s.coinsEarned || 0), 0),
    streakCount:       streak.streakCount,
    distinctSubjects:  distinctSubjectSet.size,
    topicsDone:        allTopics.filter(t => t.status === "done").length,
    subjectsFullyDone,
    hasExamPack:       !!loadExamPack(),
    goalsDone:         countGoalsDone(),
  };
}

// Every achievement definition. Add a new milestone by adding an entry here —
// the component renders whatever's in this list automatically.
export const ACHIEVEMENTS = [
  {
    id: "sessions",
    category: "Sessions",
    title: "Session Streak",
    description: "Complete study or custom timer sessions.",
    valueKey: "sessions",
    unitSingular: "session",
    unitPlural: "sessions",
    tiers: [
      { threshold: 1,   name: "First Step" },
      { threshold: 10,  name: "Getting Going" },
      { threshold: 25,  name: "Warmed Up" },
      { threshold: 50,  name: "Committed" },
      { threshold: 100, name: "Centurion" },
      { threshold: 250, name: "Unstoppable" },
    ],
  },
  {
    id: "streak",
    category: "Streak",
    title: "Daily Streak",
    description: "Study on consecutive days without missing one.",
    valueKey: "streakCount",
    unitSingular: "day",
    unitPlural: "days",
    tiers: [
      { threshold: 3,  name: "Spark" },
      { threshold: 7,  name: "One Week" },
      { threshold: 14, name: "Two Weeks" },
      { threshold: 30, name: "One Month" },
      { threshold: 60, name: "Iron Will" },
    ],
  },
  {
    id: "focusTime",
    category: "Focus Time",
    title: "Focus Hours",
    description: "Total time logged across all session types.",
    valueKey: "focusMinutes",
    isMinutes: true,
    unitSingular: "hour",
    unitPlural: "hours",
    tiers: [
      { threshold: 300,  name: "5 Hours In" },
      { threshold: 600,  name: "10 Hours In" },
      { threshold: 1500, name: "25 Hours In" },
      { threshold: 3000, name: "50 Hours In" },
      { threshold: 6000, name: "100 Hours In" },
    ],
  },
  {
    id: "coins",
    category: "Coins Earned",
    title: "Coin Collector",
    description: "Lifetime coins earned from sessions and bonuses (spending doesn't reset this).",
    valueKey: "lifetimeCoins",
    unitSingular: "coin",
    unitPlural: "coins",
    tiers: [
      { threshold: 100,  name: "Pocket Change" },
      { threshold: 500,  name: "Saver" },
      { threshold: 1000, name: "Stacked" },
      { threshold: 2500, name: "Vault" },
      { threshold: 5000, name: "Treasury" },
    ],
  },
  {
    id: "subjects",
    category: "Subjects",
    title: "Subject Explorer",
    description: "Distinct subjects logged during study sessions.",
    valueKey: "distinctSubjects",
    unitSingular: "subject",
    unitPlural: "subjects",
    tiers: [
      { threshold: 1, name: "Focused" },
      { threshold: 3, name: "Well Rounded" },
      { threshold: 5, name: "Multi-Tasker" },
      { threshold: 8, name: "All-Rounder" },
    ],
  },
  {
    id: "topicsDone",
    category: "Portions",
    title: "Topics Cleared",
    description: "Topics marked done in your Portion Tracker.",
    valueKey: "topicsDone",
    unitSingular: "topic",
    unitPlural: "topics",
    tiers: [
      { threshold: 5,   name: "Warming Up" },
      { threshold: 15,  name: "Making Progress" },
      { threshold: 30,  name: "Steady Climb" },
      { threshold: 60,  name: "Deep Dive" },
      { threshold: 100, name: "Syllabus Slayer" },
    ],
  },
  {
    id: "subjectsFullyDone",
    category: "Portions",
    title: "Subjects Completed",
    description: "Entire subjects finished — every topic marked done.",
    valueKey: "subjectsFullyDone",
    unitSingular: "subject",
    unitPlural: "subjects",
    tiers: [
      { threshold: 1, name: "One Down" },
      { threshold: 2, name: "Halfway Hero" },
      { threshold: 3, name: "Nearly There" },
      { threshold: 5, name: "Portion Master" },
    ],
  },
  {
    id: "goals",
    category: "Goals",
    title: "Goal Getter",
    description: "Daily goals marked complete from your goal planner.",
    valueKey: "goalsDone",
    unitSingular: "goal",
    unitPlural: "goals",
    tiers: [
      { threshold: 1,  name: "First Goal" },
      { threshold: 5,  name: "On Track" },
      { threshold: 15, name: "Goal Getter" },
      { threshold: 30, name: "Habit Builder" },
      { threshold: 60, name: "Goal Machine" },
    ],
  },
];

// Given an achievement def and the context snapshot, works out where the
// user currently sits: which tier they've hit, how far to the next one, etc.
export function computeProgress(achievement, ctx) {
  const rawValue = ctx[achievement.valueKey] || 0;
  const displayValue = achievement.isMinutes
    ? +(rawValue / 60).toFixed(1)
    : rawValue;

  let currentTierIndex = -1;
  for (let i = 0; i < achievement.tiers.length; i++) {
    if (rawValue >= achievement.tiers[i].threshold) currentTierIndex = i;
    else break;
  }
  const currentTier = currentTierIndex >= 0 ? achievement.tiers[currentTierIndex] : null;
  const nextTier    = achievement.tiers[currentTierIndex + 1] || null;
  const isMaxed     = !nextTier;

  const prevThreshold = currentTierIndex >= 0 ? achievement.tiers[currentTierIndex].threshold : 0;
  const progressToNext = nextTier
    ? Math.min(1, (rawValue - prevThreshold) / (nextTier.threshold - prevThreshold))
    : 1;

  const remaining = nextTier ? nextTier.threshold - rawValue : 0;
  const remainingDisplay = achievement.isMinutes ? Math.ceil(remaining / 60) : remaining;

  return {
    rawValue, displayValue, currentTier, currentTierIndex, nextTier,
    isMaxed, progressToNext, remaining, remainingDisplay,
  };
}

// "You've hit X — Y more to unlock Z" style line for each card.
export function getMotivationalLine(achievement, progress) {
  if (progress.isMaxed) {
    return `You've maxed out ${achievement.title} — incredible consistency.`;
  }
  const unit = progress.remainingDisplay === 1 ? achievement.unitSingular : achievement.unitPlural;
  if (progress.currentTier) {
    return `You've hit "${progress.currentTier.name}" — just ${progress.remainingDisplay} more ${unit} to reach "${progress.nextTier.name}".`;
  }
  return `Log ${progress.remainingDisplay} ${unit} to unlock your first milestone: "${progress.nextTier.name}".`;
}

// Overall unlocked-tier count across every achievement, for the hero banner.
export function getOverallStats(ctx) {
  let totalTiers = 0, unlockedTiers = 0;
  ACHIEVEMENTS.forEach(a => {
    totalTiers += a.tiers.length;
    const p = computeProgress(a, ctx);
    unlockedTiers += p.currentTierIndex + 1;
  });
  return { totalTiers, unlockedTiers };
}

export function moodFromUnlockRatio(ratio) {
  if (ratio >= 0.75) return "proud";
  if (ratio >= 0.4)  return "celebrating2";
  if (ratio > 0)     return "studying";
  return "waiting";
}