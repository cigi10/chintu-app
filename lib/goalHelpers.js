export function newGoalId() {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// "once" goals aren't a recurring weekly commitment, so they don't count
// toward the "planned per week" stat — only daily/weekly ones do.
export function weeklyMinutesFor(goal) {
  if (goal.repeat?.type === "daily") return goal.durationMinutes * 7;
  if (goal.repeat?.type === "weekly") return goal.durationMinutes * (goal.repeat.days?.length || 0);
  return 0;
}

export function fmtWeeklyMinutes(mins) {
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? " " + m + "m" : ""}` : `${m}m`;
}

export function moodFromGoalCount(count) {
  if (count === 0) return "waiting";
  if (count >= 4) return "happy";
  return "studying";
}