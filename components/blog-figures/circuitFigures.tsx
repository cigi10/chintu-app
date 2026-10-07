import type { ReactNode } from "react";

// Circuit diagrams for the electronics resource pages. Hand-placed SVG in
// the same theme tokens as the other figures (.blog-fig-* in blog.css).
// Every component is labelled with the value the page's worked example
// uses, so the picture and the arithmetic agree.

type Pt = [number, number];

// A horizontal or vertical zigzag resistor between a and b, with leads.
function resistor(a: Pt, b: Pt): string {
  const horizontal = a[1] === b[1];
  const len = horizontal ? b[0] - a[0] : b[1] - a[1];
  const lead = len * 0.2;
  const body = len - 2 * lead;
  const peaks = 6;
  const step = body / peaks;
  const amp = 7;
  const at = (along: number, across: number): Pt =>
    horizontal ? [a[0] + along, a[1] + across] : [a[0] + across, a[1] + along];
  const pts: Pt[] = [at(0, 0), at(lead, 0)];
  for (let i = 0; i < peaks; i++) pts.push(at(lead + step * (i + 0.5), i % 2 === 0 ? -amp : amp));
  pts.push(at(lead + body, 0), at(len, 0));
  return "M" + pts.map(p => p.join(",")).join(" L");
}

// A cell (voltage source) on a vertical wire at x between y1 (top) and y2,
// long plate (+) on top.
function Battery({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <path d={`M${x},${y1} V${mid - 6} M${x},${mid + 6} V${y2}`} className="blog-fig-wire" />
      <line x1={x - 16} y1={mid - 6} x2={x + 16} y2={mid - 6} className="blog-fig-wire" />
      <line x1={x - 9} y1={mid + 6} x2={x + 9} y2={mid + 6} className="blog-fig-wire blog-fig-wire--thick" />
      <text x={x + 21} y={mid - 10} className="blog-fig-note">+</text>
      <text x={x - 22} y={mid + 4} textAnchor="end" className="blog-fig-label">{label}</text>
    </g>
  );
}

// An ideal current source on a vertical wire, arrow pointing up.
function CurrentSource({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  const mid = (y1 + y2) / 2;
  const r = 15;
  return (
    <g>
      <path d={`M${x},${y1} V${mid - r} M${x},${mid + r} V${y2}`} className="blog-fig-wire" />
      <circle cx={x} cy={mid} r={r} className="blog-fig-wire blog-fig-component" />
      <path d={`M${x},${mid + 9} V${mid - 7}`} className="blog-fig-wire" />
      <path d={`M${x - 5},${mid - 3} L${x},${mid - 10} L${x + 5},${mid - 3} Z`} className="blog-fig-dot" />
      <text x={x - r - 6} y={mid + 4} textAnchor="end" className="blog-fig-label">{label}</text>
    </g>
  );
}

// A current-controlled voltage source (diamond) on a vertical wire at x
// between y1 (top) and y2, + at the top.
function DependentVoltageSource({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  const mid = (y1 + y2) / 2;
  const r = 17;
  return (
    <g>
      <path d={`M${x},${y1} V${mid - r} M${x},${mid + r} V${y2}`} className="blog-fig-wire" />
      <path d={`M${x},${mid - r} L${x + r},${mid} L${x},${mid + r} L${x - r},${mid} Z`} className="blog-fig-wire blog-fig-component" />
      <text x={x} y={mid - 3} textAnchor="middle" className="blog-fig-note">+</text>
      <text x={x} y={mid + 11} textAnchor="middle" className="blog-fig-note">−</text>
      <text x={x + r + 6} y={mid + 4} className="blog-fig-label">{label}</text>
    </g>
  );
}

function Terminal({ at, label }: { at: Pt; label: string }) {
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={4.5} className="blog-fig-terminal" />
      <text x={at[0] + 10} y={at[1] + 4} className="blog-fig-label">{label}</text>
    </g>
  );
}

function Svg({ id, title, w, h, children }: { id: string; title: string; w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby={`${id}-t`} className="blog-fig-svg blog-fig-narrow blog-fig-circuit">
      <title id={`${id}-t`}>{title}</title>
      {children}
    </svg>
  );
}

// The Thevenin/Norton worked example: a 12 V source, a 4 Ω resistor in
// series, then a 6 Ω resistor to the return path. Terminals A and B are
// the two ends of the 6 Ω, where a load would connect.
function TheveninCircuit({ id }: { id: string }) {
  const top = 40, bottom = 160, xs = 60, xn = 250, xt = 330;
  return (
    <Svg
      id={id}
      w={380}
      h={190}
      title="Circuit: a 12 volt source, positive terminal at the top, feeds a 4 ohm resistor in series. After it, a 6 ohm resistor runs down to the return wire. Terminals A (top) and B (bottom) are the two ends of the 6 ohm resistor."
    >
      <Battery x={xs} y1={top} y2={bottom} label="12 V" />
      <path d={`M${xs},${top} H130`} className="blog-fig-wire" />
      <path d={resistor([130, top], [200, top])} className="blog-fig-wire" />
      <text x={165} y={top - 14} textAnchor="middle" className="blog-fig-label">4 Ω</text>
      <path d={`M200,${top} H${xt}`} className="blog-fig-wire" />
      <circle cx={xn} cy={top} r={3} className="blog-fig-dot" />
      <path d={`M${xn},${top} V70`} className="blog-fig-wire" />
      <path d={resistor([xn, 70], [xn, 130])} className="blog-fig-wire" />
      <path d={`M${xn},130 V${bottom}`} className="blog-fig-wire" />
      <text x={xn - 14} y={104} textAnchor="end" className="blog-fig-label">6 Ω</text>
      <circle cx={xn} cy={bottom} r={3} className="blog-fig-dot" />
      <path d={`M${xs},${bottom} H${xt}`} className="blog-fig-wire" />
      <Terminal at={[xt, top]} label="A" />
      <Terminal at={[xt, bottom]} label="B" />
      <text x={xt + 4} y={(top + bottom) / 2 + 4} textAnchor="middle" className="blog-fig-note">load</text>
    </Svg>
  );
}

// Both equivalents of that circuit as seen from A and B.
function TheveninNortonEquivalents({ id }: { id: string }) {
  const top = 40, bottom = 160;
  return (
    <Svg
      id={id}
      w={460}
      h={210}
      title="Left: the Thevenin equivalent, a 7.2 volt source in series with 2.4 ohms between terminals A and B. Right: the Norton equivalent, a 3 amp current source pointing towards A in parallel with 2.4 ohms."
    >
      {/* Thevenin: 7.2 V in series with 2.4 Ω */}
      <Battery x={60} y1={top} y2={bottom} label="7.2 V" />
      <path d={`M60,${top} H100`} className="blog-fig-wire" />
      <path d={resistor([100, top], [170, top])} className="blog-fig-wire" />
      <text x={135} y={top - 14} textAnchor="middle" className="blog-fig-label">2.4 Ω</text>
      <path d={`M170,${top} H200 M60,${bottom} H200`} className="blog-fig-wire" />
      <Terminal at={[200, top]} label="A" />
      <Terminal at={[200, bottom]} label="B" />
      <text x={130} y={bottom + 34} textAnchor="middle" className="blog-fig-note">Thevenin</text>

      {/* Norton: 3 A in parallel with 2.4 Ω */}
      <CurrentSource x={300} y1={top} y2={bottom} label="3 A" />
      <path d={`M300,${top} H410 M300,${bottom} H410`} className="blog-fig-wire" />
      <circle cx={360} cy={top} r={3} className="blog-fig-dot" />
      <circle cx={360} cy={bottom} r={3} className="blog-fig-dot" />
      <path d={`M360,${top} V70`} className="blog-fig-wire" />
      <path d={resistor([360, 70], [360, 130])} className="blog-fig-wire" />
      <path d={`M360,130 V${bottom}`} className="blog-fig-wire" />
      <text x={374} y={104} className="blog-fig-label">2.4 Ω</text>
      <Terminal at={[410, top]} label="A" />
      <Terminal at={[410, bottom]} label="B" />
      <text x={355} y={bottom + 34} textAnchor="middle" className="blog-fig-note">Norton</text>
    </Svg>
  );
}

// GATE Thevenin post, example 1: 10 V with 2 Ω in series to node A, 3 Ω
// from A to the return wire, and a 2 A source pushing current up into A.
function TheveninTwoSources({ id }: { id: string }) {
  const top = 40, bottom = 170, xs = 60, xa = 250, xi = 330, xt = 400;
  return (
    <Svg
      id={id}
      w={450}
      h={200}
      title="Circuit: a 10 volt source, positive at the top, feeds a 2 ohm resistor in series to node A. A 3 ohm resistor runs from node A down to the return wire, and a 2 amp current source, arrow pointing up, also connects the return wire to node A. Terminals A (top) and B (bottom) are at the right."
    >
      <Battery x={xs} y1={top} y2={bottom} label="10 V" />
      <path d={`M${xs},${top} H120`} className="blog-fig-wire" />
      <path d={resistor([120, top], [190, top])} className="blog-fig-wire" />
      <text x={155} y={top - 14} textAnchor="middle" className="blog-fig-label">2 Ω</text>
      <path d={`M190,${top} H${xt}`} className="blog-fig-wire" />
      <circle cx={xa} cy={top} r={3} className="blog-fig-dot" />
      <path d={`M${xa},${top} V75`} className="blog-fig-wire" />
      <path d={resistor([xa, 75], [xa, 135])} className="blog-fig-wire" />
      <path d={`M${xa},135 V${bottom}`} className="blog-fig-wire" />
      <text x={xa - 14} y={109} textAnchor="end" className="blog-fig-label">3 Ω</text>
      <circle cx={xa} cy={bottom} r={3} className="blog-fig-dot" />
      <CurrentSource x={xi} y1={top} y2={bottom} label="2 A" />
      <circle cx={xi} cy={top} r={3} className="blog-fig-dot" />
      <circle cx={xi} cy={bottom} r={3} className="blog-fig-dot" />
      <path d={`M${xs},${bottom} H${xt}`} className="blog-fig-wire" />
      <Terminal at={[xt, top]} label="A" />
      <Terminal at={[xt, bottom]} label="B" />
    </Svg>
  );
}

// GATE Thevenin post, example 2: 12 V with 4 Ω in series (current Ix into
// node A), then from A to the return wire a 2 Ω resistor in series with a
// current-controlled voltage source of 4Ix, + at the top.
function TheveninDependentSource({ id }: { id: string }) {
  const top = 40, bottom = 190, xs = 60, xa = 280, xt = 380;
  return (
    <Svg
      id={id}
      w={440}
      h={220}
      title="Circuit: a 12 volt source, positive at the top, feeds a 4 ohm resistor in series, carrying current I x to the right into node A. From node A to the return wire there is a 2 ohm resistor in series with a dependent voltage source of value 4 I x, positive terminal at the top. Terminals A (top) and B (bottom) are at the right."
    >
      <Battery x={xs} y1={top} y2={bottom} label="12 V" />
      <path d={`M${xs},${top} H120`} className="blog-fig-wire" />
      <path d={resistor([120, top], [190, top])} className="blog-fig-wire" />
      <text x={155} y={top - 14} textAnchor="middle" className="blog-fig-label">4 Ω</text>
      <path d={`M190,${top} H${xt}`} className="blog-fig-wire" />
      <path d={`M226,${top - 9} L240,${top - 9} M234,${top - 13} L240,${top - 9} L234,${top - 5}`} className="blog-fig-wire" />
      <text x={233} y={top - 16} textAnchor="middle" className="blog-fig-note">Iₓ</text>
      <circle cx={xa} cy={top} r={3} className="blog-fig-dot" />
      <path d={`M${xa},${top} V60`} className="blog-fig-wire" />
      <path d={resistor([xa, 60], [xa, 110])} className="blog-fig-wire" />
      <text x={xa - 14} y={89} textAnchor="end" className="blog-fig-label">2 Ω</text>
      <DependentVoltageSource x={xa} y1={110} y2={bottom} label="4Iₓ" />
      <circle cx={xa} cy={bottom} r={3} className="blog-fig-dot" />
      <path d={`M${xs},${bottom} H${xt}`} className="blog-fig-wire" />
      <Terminal at={[xt, top]} label="A" />
      <Terminal at={[xt, bottom]} label="B" />
    </Svg>
  );
}

export const CIRCUIT_FIGURES: Record<string, (id: string) => ReactNode> = {
  "thevenin-circuit": id => <TheveninCircuit id={id} />,
  "thevenin-norton-equivalents": id => <TheveninNortonEquivalents id={id} />,
  "thevenin-gate-two-sources": id => <TheveninTwoSources id={id} />,
  "thevenin-gate-dependent-source": id => <TheveninDependentSource id={id} />,
};
