// Illustrates the normalization post's worked example: Asha scores fewer
// raw marks than Rohan but a higher percentile, because her shift's paper
// was harder. The axis is zoomed to 95-100 so the gap is visible.
const ROWS = [
  { name: "Asha", shift: "Shift A (harder paper)", marks: 190, percentile: 98.5 },
  { name: "Rohan", shift: "Shift B (easier paper)", marks: 215, percentile: 98.0 },
];

const W = 360, X0 = 20, X1 = 340, AXIS_MIN = 95, AXIS_MAX = 100;
const x = (p: number) => X0 + ((p - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (X1 - X0);

export default function PercentileShifts() {
  const rowH = 64, top = 8, axisY = top + ROWS.length * rowH + 4;
  return (
    <svg viewBox={`0 0 ${W} ${axisY + 36}`} role="img" aria-labelledby="pct-shifts-t" className="blog-fig-svg blog-fig-narrow">
      <title id="pct-shifts-t">Asha scores 190 marks in a harder shift and gets 98.5 percentile; Rohan scores 215 in an easier shift and gets 98.0. Asha ranks higher.</title>
      {ROWS.map((row, i) => {
        const y = top + i * rowH;
        return (
          <g key={row.name}>
            <text x={X0} y={y + 14} className="blog-fig-label">{`${row.name}: ${row.marks}/300 raw`}</text>
            <text x={X1} y={y + 14} textAnchor="end" className="blog-fig-note">{row.shift}</text>
            <rect x={X0} y={y + 24} width={X1 - X0} height={16} rx={8} className="blog-fig-track" />
            <rect x={X0} y={y + 24} width={x(row.percentile) - X0} height={16} rx={8} className={i === 0 ? "blog-fig-bar" : "blog-fig-bar blog-fig-bar--alt"} />
            <text x={x(row.percentile) + 6} y={y + 36} className="blog-fig-barlabel">{`${row.percentile.toFixed(1)} percentile`}</text>
          </g>
        );
      })}
      <line x1={X0} y1={axisY} x2={X1} y2={axisY} className="blog-fig-axis" />
      {[95, 96, 97, 98, 99, 100].map(t => (
        <g key={t}>
          <line x1={x(t)} y1={axisY} x2={x(t)} y2={axisY + 4} className="blog-fig-axis" />
          <text x={x(t)} y={axisY + 16} textAnchor="middle" className="blog-fig-tick">{t}</text>
        </g>
      ))}
      <text x={(X0 + X1) / 2} y={axisY + 31} textAnchor="middle" className="blog-fig-note">NTA Score (percentile within own shift), zoomed to 95 to 100</text>
    </svg>
  );
}
