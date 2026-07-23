"use client";

export default function GoalStatsRow({ goalCount, weeklyTotalLabel }) {
  return (
    <div className="goals__stats-row">
      <div className="goals__stat-card">
        <span className="goals__stat-value">{goalCount}</span>
        <span className="goals__stat-label">Active goal{goalCount === 1 ? "" : "s"}</span>
      </div>
      <div className="goals__stat-card">
        <span className="goals__stat-value">{weeklyTotalLabel}</span>
        <span className="goals__stat-label">Planned / week</span>
      </div>
    </div>
  );
}