// Three small mock-score trend charts (rising, flat, declining) for the
// drop-year post, which tells readers to plot their last 6-8 mocks.
// Illustrative shapes only, not real data.
const TRENDS = [
  { label: "Rising", note: "Still improving", points: [142, 150, 147, 161, 166, 172, 178, 185] },
  { label: "Flat", note: "No movement for 2+ months", points: [158, 164, 155, 161, 157, 163, 156, 160] },
  { label: "Declining", note: "Often fatigue, not knowledge", points: [176, 181, 174, 170, 166, 159, 161, 152] },
];

const W = 200, H = 120, PAD_L = 26, PAD_R = 8, PAD_T = 10, PAD_B = 22;
const MIN = 130, MAX = 200;

function path(points: number[]) {
  const x = (i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / (points.length - 1);
  const y = (v: number) => PAD_T + ((MAX - v) * (H - PAD_T - PAD_B)) / (MAX - MIN);
  return {
    d: points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" "),
    dots: points.map((v, i) => ({ cx: x(i), cy: y(v) })),
    first: { x: x(0), y: y(points[0]) },
    last: { x: x(points.length - 1), y: y(points[points.length - 1]) },
  };
}

export default function ScoreTrends() {
  return (
    <div className="blog-fig-trends">
      {TRENDS.map(trend => {
        const p = path(trend.points);
        const id = `trend-${trend.label.toLowerCase()}`;
        return (
          <svg key={trend.label} viewBox={`0 0 ${W} ${H + 26}`} role="img" aria-labelledby={`${id}-t`} className="blog-fig-svg">
            <title id={`${id}-t`}>{`${trend.label} trend: mock scores ${trend.points.join(", ")}`}</title>
            <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} className="blog-fig-axis" />
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} className="blog-fig-axis" />
            <text x={PAD_L - 4} y={PAD_T + 4} className="blog-fig-tick" textAnchor="end">{MAX}</text>
            <text x={PAD_L - 4} y={H - PAD_B} className="blog-fig-tick" textAnchor="end">{MIN}</text>
            <text x={(W + PAD_L) / 2} y={H - 6} className="blog-fig-tick" textAnchor="middle">mocks 1 to 8</text>
            <line x1={p.first.x} y1={p.first.y} x2={p.last.x} y2={p.last.y} className="blog-fig-trendline" />
            <path d={p.d} className="blog-fig-line" />
            {p.dots.map((dot, i) => <circle key={i} cx={dot.cx} cy={dot.cy} r={2.6} className="blog-fig-dot" />)}
            <text x={W / 2} y={H + 10} className="blog-fig-label" textAnchor="middle">{trend.label}</text>
            <text x={W / 2} y={H + 23} className="blog-fig-note" textAnchor="middle">{trend.note}</text>
          </svg>
        );
      })}
    </div>
  );
}
