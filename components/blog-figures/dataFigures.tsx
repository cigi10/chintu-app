import type { ReactNode } from "react";

// Data-interpretation charts for the General Aptitude pages. Each chart
// draws exactly the numbers its page's worked example uses, so the reader
// can read every answer straight off the figure.

type BarSpec = {
  title: string;
  unit: string;
  yMax: number;
  yStep: number;
  bars: { label: string; value: number }[];
};

function BarChart({ spec, id }: { spec: BarSpec; id: string }) {
  const w = 460, h = 260, left = 48, right = 16, top = 24, bottom = 40;
  const plotW = w - left - right, plotH = h - top - bottom;
  const slot = plotW / spec.bars.length;
  const barW = slot * 0.56;
  const y = (v: number) => top + plotH - (v / spec.yMax) * plotH;
  const ticks: number[] = [];
  for (let t = 0; t <= spec.yMax; t += spec.yStep) ticks.push(t);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby={`${id}-t`} className="blog-fig-svg blog-fig-narrow">
      <title id={`${id}-t`}>{spec.title}</title>
      {ticks.map(t => (
        <g key={t}>
          <line x1={left} x2={w - right} y1={y(t)} y2={y(t)} className="blog-fig-axis" strokeOpacity={t === 0 ? 1 : 0.35} />
          <text x={left - 8} y={y(t) + 3} textAnchor="end" className="blog-fig-tick">{t}</text>
        </g>
      ))}
      {spec.bars.map((b, i) => {
        const x = left + slot * i + (slot - barW) / 2;
        return (
          <g key={b.label}>
            <rect x={x} y={y(b.value)} width={barW} height={y(0) - y(b.value)} className="blog-fig-bar" rx={2} />
            <text x={x + barW / 2} y={y(b.value) - 6} textAnchor="middle" className="blog-fig-label">{b.value}</text>
            <text x={x + barW / 2} y={h - bottom + 16} textAnchor="middle" className="blog-fig-tick">{b.label}</text>
          </g>
        );
      })}
      <text x={left} y={14} className="blog-fig-note">{spec.unit}</text>
    </svg>
  );
}

const SPECS: Record<string, BarSpec> = {
  // data-interpretation-bar-graphs: a factory's yearly output.
  "factory-output-bars": {
    title: "Bar graph of a factory's output in thousands of units: 2021, 120; 2022, 150; 2023, 135; 2024, 180; 2025, 210.",
    unit: "Output (thousand units)",
    yMax: 240,
    yStep: 60,
    bars: [
      { label: "2021", value: 120 },
      { label: "2022", value: 150 },
      { label: "2023", value: 135 },
      { label: "2024", value: 180 },
      { label: "2025", value: 210 },
    ],
  },
};

export const DATA_FIGURES: Record<string, (id: string) => ReactNode> = Object.fromEntries(
  Object.entries(SPECS).map(([name, spec]) => [name, (id: string) => <BarChart spec={spec} id={id} />])
);
