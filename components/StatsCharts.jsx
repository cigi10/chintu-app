"use client";
import { getSubjectColor } from "@/lib/subjectColors";

// Deliberately no charting library: these are all plain SVG/CSS, matching
// the app's existing lightweight aesthetic (see the timer's own SVG ring
// in components/StudyTimer.jsx). Reuses lib/subjectColors.js so a subject
// renders in the same color here as it does on Timetable/Goals, falling
// back to a small fixed palette for subjects that were only ever typed
// into the timer's free-text field and never assigned a color.
const FALLBACK_PALETTE = ["#9B6FD4", "#4FACE5", "#7EC8A0", "#F9C060", "#F2619C", "#B98CD9", "#6FBF9B", "#E88BAB"];

function colorForSubject(subject, index) {
  return getSubjectColor(subject, FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]);
}

/** Percentage-of-total-time pie chart, built from real subjectMinutes totals. */
export function SubjectPieChart({ subjectMinutes, totalMinutes }) {
  const entries = Object.entries(subjectMinutes).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0 || totalMinutes === 0) return null;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="stats-pie-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140" className="stats-pie-svg">
        <g transform="rotate(-90 70 70)">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="24" />
          {entries.map(([subject, mins], i) => {
            const pct = mins / totalMinutes;
            const dash = pct * circumference;
            const offset = -cumulative * circumference;
            cumulative += pct;
            return (
              <circle
                key={subject}
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={colorForSubject(subject, i)}
                strokeWidth="24"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </g>
      </svg>
      <div className="stats-pie-legend">
        {entries.map(([subject, mins], i) => (
          <div key={subject} className="stats-pie-legend-item">
            <span className="stats-pie-swatch" style={{ background: colorForSubject(subject, i) }} />
            <span className="stats-pie-legend-label">{subject}</span>
            <span className="stats-pie-legend-pct">{Math.round((mins / totalMinutes) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Subject (rows) x day (columns) grid, cell intensity = minutes studied. */
export function DaySubjectGrid({ log, days, dayLabels }) {
  const subjectTotals = {};
  const matrix = {};

  log.forEach(s => {
    if (!days.includes(s.date)) return;
    const subject = s.subject || "General";
    const mins = Number(s.durationMinutes) || 0;
    subjectTotals[subject] = (subjectTotals[subject] || 0) + mins;
    matrix[subject] = matrix[subject] || {};
    matrix[subject][s.date] = (matrix[subject][s.date] || 0) + mins;
  });

  const subjects = Object.entries(subjectTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([subject]) => subject);

  if (subjects.length === 0) return null;

  const maxCell = Math.max(1, ...subjects.flatMap(subject => days.map(d => matrix[subject]?.[d] || 0)));

  return (
    <div className="stats-heatgrid">
      <div className="stats-heatgrid-row stats-heatgrid-row--header">
        <span className="stats-heatgrid-subject" />
        {days.map((d, i) => (
          <span key={d} className="stats-heatgrid-day-label">{dayLabels[i]}</span>
        ))}
      </div>
      {subjects.map(subject => (
        <div key={subject} className="stats-heatgrid-row">
          <span className="stats-heatgrid-subject">{subject}</span>
          {days.map(d => {
            const mins = matrix[subject]?.[d] || 0;
            return (
              <span
                key={d}
                className="stats-heatgrid-cell"
                style={{ opacity: mins > 0 ? 0.2 + (mins / maxCell) * 0.8 : 0 }}
                title={mins > 0 ? `${subject}: ${Math.round(mins)} min` : `${subject}: no study time`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** GitHub-style consistency calendar: one cell per day, intensity = minutes studied. */
export function ConsistencyHeatmap({ log, weeks = 10 }) {
  const minutesByDate = {};
  log.forEach(s => {
    minutesByDate[s.date] = (minutesByDate[s.date] || 0) + (Number(s.durationMinutes) || 0);
  });

  const totalDays = weeks * 7;
  const today = new Date();
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (totalDays - 1 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return { date: dateStr, mins: minutesByDate[dateStr] || 0 };
  });

  const maxMins = Math.max(1, ...cells.map(c => c.mins));
  const columns = [];
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7));

  return (
    <div className="stats-calendar-heatmap">
      {columns.map((week, wi) => (
        <div key={wi} className="stats-calendar-col">
          {week.map(cell => (
            <span
              key={cell.date}
              className="stats-calendar-cell"
              style={{ opacity: cell.mins > 0 ? 0.2 + (cell.mins / maxMins) * 0.8 : 0 }}
              title={`${cell.date}: ${cell.mins > 0 ? Math.round(cell.mins) + " min" : "no study time"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
