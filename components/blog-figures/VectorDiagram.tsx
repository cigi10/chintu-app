// Vector and 3D-geometry diagrams for resource pages: arrows, segments,
// shaded polygons, points, angle arcs and right-angle marks, in plain 2D
// or in 3D through a fixed oblique projection (x towards the viewer and
// down-left, y to the right, z up, the usual textbook drawing). Like
// FunctionPlot it draws from theme tokens and server-renders as plain SVG.
// The view box is fitted to whatever is drawn, at one scale on both axes.

export type V2 = [number, number];
export type V3 = [number, number, number];
type P = V2 | V3;
type LineStyle = "main" | "alt" | "dashed";
type Anchor = "start" | "middle" | "end";

export type DiagramSpec = {
  title: string;
  // 3D: points are [x, y, z]; 2D: [x, y].
  three?: boolean;
  // Draw axes from the origin to these lengths: [x, y, z] in 3D, [x, y] in 2D.
  axes?: V3 | V2;
  arrows?: { from: P; to: P; style?: LineStyle }[];
  lines?: { from: P; to: P; style?: LineStyle }[];
  polygons?: { points: P[]; light?: boolean }[];
  points?: { at: P; hollow?: boolean }[];
  // An arc at `at` between the directions towards `a` and `b`.
  angles?: { at: P; a: P; b: P; r?: number; label?: string }[];
  rightAngles?: { at: P; a: P; b: P }[];
  // `offset` nudges the text in screen pixels (y down).
  labels?: { at: P; text: string; anchor?: Anchor; offset?: V2; small?: boolean }[];
  // Screen pixels per unit (default 40).
  scale?: number;
};

const PAD = 22;

// Oblique projection to maths-up 2D coordinates.
function project(p: P, three?: boolean): V2 {
  if (!three) return [p[0], p[1]];
  const [x, y, z] = p as V3;
  return [y - 0.55 * x, z - 0.42 * x];
}

export default function VectorDiagram({ spec, id }: { spec: DiagramSpec; id: string }) {
  const k = spec.scale ?? 40;
  const pr = (p: P) => project(p, spec.three);

  const origin: P = spec.three ? [0, 0, 0] : [0, 0];
  const axisEnds: { to: P; name: string }[] = !spec.axes
    ? []
    : spec.three
      ? [
          { to: [spec.axes[0], 0, 0], name: "x" },
          { to: [0, spec.axes[1], 0], name: "y" },
          { to: [0, 0, (spec.axes as V3)[2]], name: "z" },
        ]
      : [
          { to: [spec.axes[0], 0], name: "x" },
          { to: [0, spec.axes[1]], name: "y" },
        ];

  // Fit the view box around everything drawn.
  const all: V2[] = [
    ...(spec.arrows ?? []).flatMap(a => [pr(a.from), pr(a.to)]),
    ...(spec.lines ?? []).flatMap(l => [pr(l.from), pr(l.to)]),
    ...(spec.polygons ?? []).flatMap(p => p.points.map(pr)),
    ...(spec.points ?? []).map(p => pr(p.at)),
    ...(spec.labels ?? []).map(l => pr(l.at)),
    ...axisEnds.map(a => pr(a.to)),
    ...(axisEnds.length ? [pr(origin)] : []),
  ];
  const xs = all.map(p => p[0]);
  const ys = all.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = Math.round((maxX - minX) * k + 2 * PAD + 40);
  const H = Math.round((maxY - minY) * k + 2 * PAD + 16);
  const sx = (p: V2) => PAD + 20 + (p[0] - minX) * k;
  const sy = (p: V2) => PAD + 8 + (maxY - p[1]) * k;
  const s = (p: P) => [sx(pr(p)), sy(pr(p))] as V2;

  const arrowId = `${id}-arrow`;
  const lineClass = (style: LineStyle = "main") =>
    style === "main" ? "blog-fig-line" : style === "alt" ? "blog-fig-line blog-fig-line--alt" : "blog-fig-trendline";
  const fmt = (n: number) => n.toFixed(1);

  const arc = (at: P, a: P, b: P, r: number) => {
    const [cx, cy] = s(at);
    const [ax, ay] = s(a);
    const [bx, by] = s(b);
    const t1 = Math.atan2(ay - cy, ax - cx);
    let t2 = Math.atan2(by - cy, bx - cx);
    let d = t2 - t1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    t2 = t1 + d;
    const p1 = [cx + r * Math.cos(t1), cy + r * Math.sin(t1)];
    const p2 = [cx + r * Math.cos(t2), cy + r * Math.sin(t2)];
    const mid = t1 + d / 2;
    return {
      d: `M${fmt(p1[0])},${fmt(p1[1])} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${fmt(p2[0])},${fmt(p2[1])}`,
      label: [cx + (r + 11) * Math.cos(mid), cy + (r + 11) * Math.sin(mid) + 4] as V2,
    };
  };

  const square = (at: P, a: P, b: P) => {
    const c = s(at);
    const unit = (q: P) => {
      const [qx, qy] = s(q);
      const len = Math.hypot(qx - c[0], qy - c[1]) || 1;
      return [((qx - c[0]) / len) * 9, ((qy - c[1]) / len) * 9];
    };
    const u = unit(a), v = unit(b);
    return `M${fmt(c[0] + u[0])},${fmt(c[1] + u[1])} L${fmt(c[0] + u[0] + v[0])},${fmt(c[1] + u[1] + v[1])} L${fmt(c[0] + v[0])},${fmt(c[1] + v[1])}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-t`} className="blog-fig-svg blog-fig-plot blog-fig-diagram">
      <title id={`${id}-t`}>{spec.title}</title>
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="blog-fig-arrowhead-solid" />
        </marker>
      </defs>

      {spec.polygons?.map((poly, i) => (
        <polygon
          key={`pg${i}`}
          points={poly.points.map(p => s(p).map(fmt).join(",")).join(" ")}
          className={poly.light ? "blog-fig-shade blog-fig-shade--light" : "blog-fig-shade"}
        />
      ))}

      {axisEnds.map(a => {
        const [x1, y1] = s(origin);
        const [x2, y2] = s(a.to);
        return <line key={a.name} x1={x1} y1={y1} x2={x2} y2={y2} className="blog-fig-axis blog-fig-axis--strong" markerEnd={`url(#${arrowId})`} />;
      })}

      {spec.lines?.map((l, i) => {
        const [x1, y1] = s(l.from);
        const [x2, y2] = s(l.to);
        return <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={lineClass(l.style)} />;
      })}
      {spec.arrows?.map((a, i) => {
        const [x1, y1] = s(a.from);
        const [x2, y2] = s(a.to);
        return <line key={`a${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={lineClass(a.style)} markerEnd={`url(#${arrowId})`} />;
      })}
      {spec.rightAngles?.map((r, i) => <path key={`ra${i}`} d={square(r.at, r.a, r.b)} className="blog-fig-trendline blog-fig-mark" />)}
      {spec.angles?.map((g, i) => <path key={`an${i}`} d={arc(g.at, g.a, g.b, g.r ?? 26).d} className="blog-fig-trendline blog-fig-mark" />)}
      {spec.points?.map((p, i) => {
        const [cx, cy] = s(p.at);
        return <circle key={`p${i}`} cx={cx} cy={cy} r={3.8} className={p.hollow ? "blog-fig-dot--hollow" : "blog-fig-dot"} />;
      })}

      {/* Text last, so its halo (blog.css) sits over any line it crosses. */}
      {axisEnds.map(a => {
        const [x, y] = s(a.to);
        const dx = spec.three ? (a.name === "x" ? -10 : a.name === "y" ? 12 : 0) : (a.name === "x" ? 12 : 0);
        const dy = spec.three ? (a.name === "z" ? -8 : a.name === "x" ? 14 : 4) : (a.name === "y" ? -8 : 4);
        return <text key={`t${a.name}`} x={x + dx} y={y + dy} className="blog-fig-note" textAnchor="middle">{a.name}</text>;
      })}
      {spec.angles?.filter(g => g.label).map((g, i) => {
        const [x, y] = arc(g.at, g.a, g.b, g.r ?? 26).label;
        return <text key={`al${i}`} x={x} y={y} className="blog-fig-note" textAnchor="middle">{g.label}</text>;
      })}
      {spec.labels?.map((l, i) => {
        const [x, y] = s(l.at);
        return (
          <text key={`lb${i}`} x={x + (l.offset?.[0] ?? 0)} y={y + (l.offset?.[1] ?? 0)} className={l.small ? "blog-fig-note" : "blog-fig-plotlabel"} textAnchor={l.anchor ?? "middle"}>
            {l.text}
          </text>
        );
      })}
    </svg>
  );
}
