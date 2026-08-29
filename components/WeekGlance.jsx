"use client";
import { WEEK_DAYS } from "@/lib/goals";

export default function WeekGlance({ goalsByDay }) {
  return (
    <div className="goals__week-glance">
      <p className="goals__week-glance-title">This week at a glance</p>
      <div className="goals__week-glance-grid">
        {WEEK_DAYS.map(day => (
          <div key={day} className="goals__week-glance-day">
            <span className="goals__week-glance-day-label">{day}</span>
            <div className="goals__week-glance-dots">
              {(goalsByDay[day] || []).length === 0 ? (
                <span className="goals__week-glance-empty">·</span>
              ) : (
                goalsByDay[day].map(g => (
                  <span
                    key={g.id}
                    className="goals__week-glance-dot"
                    style={{ backgroundColor: g.color }}
                    title={`${g.subject} · ${g.durationMinutes}m`}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}