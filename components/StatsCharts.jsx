// StatsCharts.jsx — presentational-only chart components for Stats.jsx.
// Every chart here is plain SVG/CSS (stroke-dasharray for the pie, CSS
// grid + opacity for the heatmaps) — no charting library. Each component
// takes already-aggregated data and renders it; Stats.jsx owns turning
// the real session log into these shapes, so nothing in here invents a
// number that wasn't actually tracked.
import { BASKET_DAYS } from "@/lib/breadBasket";

const CHART_PALETTE = ["#9B6FD4", "#E8A445", "#4FA8D8", "#5FBF8F", "#E06C8C", "#7C6CE8", "#C97B4A"];

/** Donut chart of minutes-by-subject, built from stacked stroke-dasharray arcs. */
export function SubjectPieChart({ subjectMinutes }) {
  const entries = Object.entries(subjectMinutes).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, mins]) => sum + mins, 0);

  if (total === 0) {
    return <p className="stats-chart__empty">No study time logged yet.</p>;
  }

  const RADIUS = 60;
  const STROKE = 26;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let cumulative = 0;
  const arcs = entries.map(([subject, mins], i) => {
    const fraction = mins / total;
    const arcLength = fraction * CIRCUMFERENCE;
    const offset = cumulative;
    cumulative += arcLength;
    return {
      subject,
      mins,
      fraction,
      color: CHART_PALETTE[i % CHART_PALETTE.length],
      dasharray: `${arcLength} ${CIRCUMFERENCE - arcLength}`,
      dashoffset: -offset,
    };
  });

  return (
    <div className="stats-chart__pie-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160" className="stats-chart__pie">
        <g transform="rotate(-90 80 80)">
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth={STROKE} />
          {arcs.map((arc) => (
            <circle
              key={arc.subject}
              cx="80" cy="80" r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={STROKE}
              strokeDasharray={arc.dasharray}
              strokeDashoffset={arc.dashoffset}
            />
          ))}
        </g>
      </svg>
      <div className="stats-chart__pie-legend">
        {arcs.map((arc) => (
          <div key={arc.subject} className="stats-chart__legend-row">
            <span className="stats-chart__legend-swatch" style={{ background: arc.color }} />
            <span className="stats-chart__legend-name">{arc.subject}</span>
            <span className="stats-chart__legend-pct">{Math.round(arc.fraction * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Grid of subject (row) x last-7-days (column), cell opacity = minutes that day. */
export function DaySubjectGrid({ subjects, days, minutesFor }) {
  if (subjects.length === 0) {
    return <p className="stats-chart__empty">No study time logged yet.</p>;
  }

  const maxCell = Math.max(1, ...subjects.flatMap((s) => days.map((d) => minutesFor(s, d.key))));

  return (
    <div className="stats-chart__grid-wrap">
      <div className="stats-chart__grid" style={{ gridTemplateColumns: `auto repeat(${days.length}, 1fr)` }}>
        <div className="stats-chart__grid-corner" />
        {days.map((d) => (
          <div key={d.key} className="stats-chart__grid-day-label">{d.label}</div>
        ))}
        {subjects.map((subject) => (
          <div key={subject} className="stats-chart__grid-row" style={{ display: "contents" }}>
            <div className="stats-chart__grid-subject-label">{subject}</div>
            {days.map((d) => {
              const mins = minutesFor(subject, d.key);
              const opacity = mins > 0 ? Math.max(0.15, mins / maxCell) : 0;
              return (
                <div
                  key={d.key}
                  className="stats-chart__grid-cell"
                  title={`${subject} · ${d.label}: ${mins > 0 ? `${mins}m` : "no time logged"}`}
                >
                  <div className="stats-chart__grid-cell-fill" style={{ opacity }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Simple SVG polyline of total minutes per week, over the last N weeks. */
export function WeeklyTrendLine({ weeks }) {
  const hasData = weeks.some((w) => w.mins > 0);
  if (!hasData) {
    return <p className="stats-chart__empty">Not enough history yet for a trend.</p>;
  }

  const WIDTH = 320;
  const HEIGHT = 100;
  const PAD = 10;
  const max = Math.max(1, ...weeks.map((w) => w.mins));
  const stepX = weeks.length > 1 ? (WIDTH - PAD * 2) / (weeks.length - 1) : 0;

  const points = weeks.map((w, i) => {
    const x = PAD + i * stepX;
    const y = HEIGHT - PAD - (w.mins / max) * (HEIGHT - PAD * 2);
    return { x, y, w };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="stats-chart__trend-wrap">
      <svg width="100%" height={HEIGHT + 24} viewBox={`0 0 ${WIDTH} ${HEIGHT + 24}`} className="stats-chart__trend" preserveAspectRatio="none">
        <path d={pathD} fill="none" stroke="var(--color-accent-strong)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {points.map((p) => (
          <circle key={p.w.label} cx={p.x} cy={p.y} r="3" fill="var(--color-accent-strong)">
            <title>{`${p.w.label}: ${Math.round((p.w.mins / 60) * 10) / 10}h`}</title>
          </circle>
        ))}
      </svg>
      <div className="stats-chart__trend-labels">
        {weeks.map((w) => (
          <span key={w.label}>{w.label}</span>
        ))}
      </div>
    </div>
  );
}

/** GitHub-style consistency heatmap: weeks as columns, Mon-Sun as rows. */
export function ConsistencyHeatmap({ weeks }) {
  const hasData = weeks.some((week) => BASKET_DAYS.some((day) => week.minutesByDay[day] > 0));
  if (!hasData) {
    return <p className="stats-chart__empty">No study days logged yet.</p>;
  }

  const maxDay = Math.max(1, ...weeks.flatMap((week) => BASKET_DAYS.map((day) => week.minutesByDay[day] || 0)));

  return (
    <div className="stats-chart__heatmap-wrap">
      <div className="stats-chart__heatmap" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week) => (
          <div key={week.weekStart} className="stats-chart__heatmap-col">
            {BASKET_DAYS.map((day) => {
              const mins = week.minutesByDay[day] || 0;
              const opacity = mins > 0 ? Math.max(0.15, mins / maxDay) : 0;
              return (
                <div
                  key={day}
                  className="stats-chart__heatmap-cell"
                  title={`${day}, week of ${week.weekStart}: ${mins > 0 ? `${mins}m` : "no study time"}`}
                >
                  <div className="stats-chart__heatmap-cell-fill" style={{ opacity }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Overall mock score trend across every logged attempt, oldest to newest. */
export function MockScoreTrend({ scores }) {
  if (scores.length === 0) {
    return <p className="stats-chart__empty">No mock scores logged yet.</p>;
  }

  const sorted = [...scores].sort((a, b) => a.date.localeCompare(b.date)).slice(-15);
  const WIDTH = 320;
  const HEIGHT = 100;
  const PAD = 10;
  const max = Math.max(1, ...sorted.map((s) => s.score));
  const stepX = sorted.length > 1 ? (WIDTH - PAD * 2) / (sorted.length - 1) : 0;

  const points = sorted.map((s, i) => {
    const x = PAD + i * stepX;
    const y = HEIGHT - PAD - (s.score / max) * (HEIGHT - PAD * 2);
    return { x, y, s };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="stats-chart__trend-wrap">
      <svg width="100%" height={HEIGHT + 24} viewBox={`0 0 ${WIDTH} ${HEIGHT + 24}`} className="stats-chart__trend" preserveAspectRatio="none">
        <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-primary)">
            <title>{`${p.s.subject} · ${p.s.date}: ${p.s.score}${p.s.scoreType === "percentile" ? "%" : " pts"}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
