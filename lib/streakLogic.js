// lib/streakLogic.js
// Storage key: "chintu-streak" — { studyDates: [...], resetLog: [...] }

const STREAK_KEY = "chintu-streak";

function todayStr() { return new Date().toISOString().slice(0, 10); }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

function load() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { studyDates: [], resetLog: [] };
  } catch { return { studyDates: [], resetLog: [] }; }
}
function save(data) { try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch {} }

// Call this whenever a study session completes.
export function recordStudySession() {
  const data = load();
  const today = todayStr();
  if (!data.studyDates.includes(today)) data.studyDates.push(today);
  save(data);
  return getStreakInfo();
}

function computeStreak(studyDates) {
  if (!studyDates.length) return 0;
  const today = todayStr();
  const set = new Set(studyDates);
  let cursor = set.has(today) ? today : new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = new Date(new Date(cursor) - 86400000).toISOString().slice(0, 10);
  }
  return streak;
}

export function getStreakInfo() {
  const data = load();
  const today = todayStr();
  const lastDate = data.studyDates.length ? [...data.studyDates].sort().at(-1) : null;
  const daysSinceLastStudy = lastDate ? daysBetween(lastDate, today) : null;
  const streakCount = computeStreak(data.studyDates);

  if (lastDate && daysSinceLastStudy >= 1 && !data.resetLog.includes(today)) {
    data.resetLog.push(today);
    save(data);
  }

  const recentResets = data.resetLog.filter(d => daysBetween(d, today) <= 7);
  const recentSessions = data.studyDates.filter(d => daysBetween(d, today) <= 7);
  const showCheckIn = recentResets.length >= 3 && recentSessions.length === 0;

  let message = null;
  if (daysSinceLastStudy >= 5) message = "Chintu saved your spot! Let's get back to studying!";
  else if (daysSinceLastStudy >= 2) message = "You're back! Want to start with something small today?";

  return { streakCount, daysSinceLastStudy, message, showCheckIn };
}

export function clearCheckIn() {
  const data = load();
  data.resetLog = [];
  save(data);
}