// A small, generic graph-of-a-function figure for resource pages: axes,
// optional grid ticks, sampled curves, shaded regions, segments, marked
// points and text labels, all in maths coordinates. Drawn from theme
// tokens (.blog-fig-* in blog.css) like the other figures, so it reads in
// every colour theme, and server-rendered as plain SVG.
//
// Curves are sampled, and a path breaks wherever the function is undefined
// or shoots off the plot (e.g. at a vertical asymptote), so 1/x or tan x
// draw correctly without special-casing.

export type Pt = [number, number];
type LineStyle = "main" | "alt" | "dashed";
type Anchor = "start" | "middle" | "end";

export type PlotSpec = {
  // Accessible description of what the graph shows (the SVG <title>).
  title: string;
  x: [number, number];
  y: [number, number];
  xTicks?: number[];
  yTicks?: number[];
  // Custom tick text, e.g. { 3.1416: "π" }. Keys are matched loosely.
  xTickLabels?: Record<string, string>;
  yTickLabels?: Record<string, string>;
  xLabel?: string;
  yLabel?: string;
  // Filled regions between `upper` and `lower` (default the x-axis).
  shade?: { upper: (x: number) => number; lower?: (x: number) => number; from: number; to: number }[];
  // Filled polygons, e.g. a linear-programming feasible region.
  polygons?: Pt[][];
  curves?: { f: (x: number) => number; domain?: [number, number]; style?: LineStyle }[];
  // Parametric curves (circles, ellipses): t runs over `range`.
  parametric?: { p: (t: number) => Pt; range: [number, number]; style?: LineStyle }[];
  lines?: { from: Pt; to: Pt; style?: LineStyle }[];
  points?: { at: Pt; hollow?: boolean }[];
  labels?: { at: Pt; text: string; anchor?: Anchor; small?: boolean }[];
  // Height as a fraction of width (default 0.6), or "equal" for one unit
  // the same length on both axes (so perpendicular lines look it).
  aspect?: number | "equal";
};

const W = 520;
const PAD = { l: 34, r: 16, t: 14, b: 30 };
const SAMPLES = 400;

const fmt = (n: number) => n.toFixed(1);

export default function FunctionPlot({ spec, id }: { spec: PlotSpec; id: string }) {
  const [x0, x1] = spec.x;
  const [y0, y1] = spec.y;
  const H = Math.round(
    spec.aspect === "equal"
      ? ((W - PAD.l - PAD.r) * (y1 - y0)) / (x1 - x0) + PAD.t + PAD.b
      : W * (spec.aspect ?? 0.6)
  );
  const px = (x: number) => PAD.l + ((x - x0) * (W - PAD.l - PAD.r)) / (x1 - x0);
  const py = (y: number) => PAD.t + ((y1 - y) * (H - PAD.t - PAD.b)) / (y1 - y0);
  const clipId = `${id}-clip`;
  const titleId = `${id}-t`;

  // Axes sit on x = 0 / y = 0 when visible, else along the plot edge.
  const axisY = y0 <= 0 && y1 >= 0 ? py(0) : py(y0);
  const axisX = x0 <= 0 && x1 >= 0 ? px(0) : px(x0);
  const span = y1 - y0;

  const curvePath = (f: (x: number) => number, a: number, b: number) => {
    let d = "";
    let pen = false;
    for (let k = 0; k <= SAMPLES; k++) {
      const x = a + ((b - a) * k) / SAMPLES;
      const y = f(x);
      if (!Number.isFinite(y) || y > y1 + span || y < y0 - span) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${fmt(px(x))},${fmt(py(y))} `;
      pen = true;
    }
    return d.trim();
  };

  const shadePath = (s: NonNullable<PlotSpec["shade"]>[number]) => {
    const lower = s.lower ?? (() => 0);
    const top: string[] = [];
    const bottom: string[] = [];
    for (let k = 0; k <= SAMPLES; k++) {
      const x = s.from + ((s.to - s.from) * k) / SAMPLES;
      top.push(`${fmt(px(x))},${fmt(py(s.upper(x)))}`);
      bottom.unshift(`${fmt(px(x))},${fmt(py(lower(x)))}`);
    }
    return `M${top.join(" L")} L${bottom.join(" L")} Z`;
  };

  const tickText = (labels: Record<string, string> | undefined, v: number) => {
    if (labels) {
      const hit = Object.keys(labels).find(k => Math.abs(Number(k) - v) < 1e-3);
      if (hit !== undefined) return labels[hit];
    }
    return String(v).replace("-", "−");
  };

  const lineClass = (style: LineStyle = "main") =>
    style === "main" ? "blog-fig-line" : style === "alt" ? "blog-fig-line blog-fig-line--alt" : "blog-fig-trendline";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={titleId} className="blog-fig-svg blog-fig-plot">
      <title id={titleId}>{spec.title}</title>
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} />
        </clipPath>
      </defs>

      {spec.xTicks?.map(v => (
        <line key={`gx${v}`} x1={px(v)} y1={PAD.t} x2={px(v)} y2={H - PAD.b} className="blog-fig-grid" />
      ))}
      {spec.yTicks?.map(v => (
        <line key={`gy${v}`} x1={PAD.l} y1={py(v)} x2={W - PAD.r} y2={py(v)} className="blog-fig-grid" />
      ))}

      <g clipPath={`url(#${clipId})`}>
        {spec.shade?.map((s, i) => <path key={`s${i}`} d={shadePath(s)} className="blog-fig-shade" />)}
        {spec.polygons?.map((poly, i) => (
          <polygon key={`p${i}`} points={poly.map(([x, y]) => `${fmt(px(x))},${fmt(py(y))}`).join(" ")} className="blog-fig-shade" />
        ))}
      </g>

      <line x1={PAD.l} y1={axisY} x2={W - PAD.r} y2={axisY} className="blog-fig-axis blog-fig-axis--strong" />
      <line x1={axisX} y1={PAD.t} x2={axisX} y2={H - PAD.b} className="blog-fig-axis blog-fig-axis--strong" />


      <g clipPath={`url(#${clipId})`}>
        {spec.lines?.map((l, i) => (
          <line key={`l${i}`} x1={px(l.from[0])} y1={py(l.from[1])} x2={px(l.to[0])} y2={py(l.to[1])} className={lineClass(l.style)} />
        ))}
        {spec.curves?.map((c, i) => (
          <path key={`c${i}`} d={curvePath(c.f, c.domain?.[0] ?? x0, c.domain?.[1] ?? x1)} className={lineClass(c.style)} />
        ))}
        {spec.parametric?.map((c, i) => {
          const [a, b] = c.range;
          const d = Array.from({ length: SAMPLES + 1 }, (_, k) => {
            const [x, y] = c.p(a + ((b - a) * k) / SAMPLES);
            return `${k ? "L" : "M"}${fmt(px(x))},${fmt(py(y))}`;
          }).join(" ");
          return <path key={`pc${i}`} d={d} className={lineClass(c.style)} />;
        })}
      </g>

      {/* Text goes last so its halo (blog.css) sits over any line it crosses. */}
      {spec.xTicks?.filter(v => v !== 0 || axisX !== px(0)).map(v => (
        <text key={`tx${v}`} x={px(v)} y={axisY + 13} className="blog-fig-tick" textAnchor="middle">{tickText(spec.xTickLabels, v)}</text>
      ))}
      {spec.yTicks?.filter(v => v !== 0 || axisY !== py(0)).map(v => (
        <text key={`ty${v}`} x={axisX - 5} y={py(v) + 3} className="blog-fig-tick" textAnchor="end">{tickText(spec.yTickLabels, v)}</text>
      ))}
      {spec.xLabel && <text x={W - PAD.r} y={axisY - 6} className="blog-fig-note" textAnchor="end">{spec.xLabel}</text>}
      {spec.yLabel && <text x={axisX + 6} y={PAD.t + 9} className="blog-fig-note">{spec.yLabel}</text>}
      {spec.points?.map((p, i) => (
        <circle key={`pt${i}`} cx={px(p.at[0])} cy={py(p.at[1])} r={4} className={p.hollow ? "blog-fig-dot--hollow" : "blog-fig-dot"} />
      ))}
      {spec.labels?.map((l, i) => (
        <text key={`lb${i}`} x={px(l.at[0])} y={py(l.at[1])} className={l.small ? "blog-fig-note" : "blog-fig-plotlabel"} textAnchor={l.anchor ?? "start"}>
          {l.text}
        </text>
      ))}
    </svg>
  );
}
