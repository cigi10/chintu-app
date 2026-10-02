// A small vertical flowchart renderer for blog figures: a column of steps
// with arrows, where a step can have a side branch. Vertical keeps it
// readable on a phone, where a wide diagram would shrink to illegible.
// Lines are pre-split by hand because SVG text doesn't wrap.

export type FlowStep = {
  lines: string[];
  kind?: "step" | "decision" | "end";
  // Label on the arrow coming INTO this step (e.g. "No").
  arrowLabel?: string;
  branch?: { lines: string[]; label?: string; kind?: "step" | "end" | "warn" };
};

const W = 380, MAIN_W = 200, MAIN_X = 6, BRANCH_X = 266, BRANCH_W = 108;
const LINE_H = 15, PAD_Y = 10, GAP = 26;

function boxHeight(lines: string[]) {
  return lines.length * LINE_H + PAD_Y * 2;
}

// Stacks the steps top to bottom; each row is as tall as its taller box.
function layout(steps: FlowStep[]) {
  const laid: { step: FlowStep; top: number; h: number }[] = [];
  let y = 6;
  for (const step of steps) {
    const h = Math.max(boxHeight(step.lines), step.branch ? boxHeight(step.branch.lines) : 0);
    laid.push({ step, top: y, h });
    y += h + GAP;
  }
  return { laid, totalH: y - GAP + 6 };
}

export default function Flowchart({ steps, title }: { steps: FlowStep[]; title: string }) {
  const { laid, totalH } = layout(steps);
  const id = `flow-${title.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} role="img" aria-labelledby={`${id}-t`} className="blog-fig-svg blog-fig-flow">
      <title id={`${id}-t`}>{title}</title>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="blog-fig-arrowhead" />
        </marker>
      </defs>
      {laid.map(({ step, top, h }, i) => {
        const boxH = boxHeight(step.lines);
        const boxTop = top + (h - boxH) / 2;
        const cx = MAIN_X + MAIN_W / 2;
        const next = laid[i + 1];
        const nextBoxTop = next ? next.top + (next.h - boxHeight(next.step.lines)) / 2 : 0;
        return (
          <g key={i}>
            <rect
              x={MAIN_X} y={boxTop} width={MAIN_W} height={boxH}
              rx={step.kind === "decision" ? 18 : 8}
              className={`blog-fig-box blog-fig-box--${step.kind ?? "step"}`}
            />
            {step.lines.map((line, j) => (
              <text key={j} x={cx} y={boxTop + PAD_Y + LINE_H * (j + 0.75)} textAnchor="middle" className="blog-fig-boxtext">{line}</text>
            ))}
            {next && (
              <>
                <line x1={cx} y1={boxTop + boxH} x2={cx} y2={nextBoxTop - 1} className="blog-fig-connector" markerEnd={`url(#${id}-arrow)`} />
                {next.step.arrowLabel && (
                  <text x={cx + 6} y={(boxTop + boxH + nextBoxTop) / 2 + 4} className="blog-fig-arrowlabel">{next.step.arrowLabel}</text>
                )}
              </>
            )}
            {step.branch && (() => {
              const bH = boxHeight(step.branch.lines);
              const bTop = top + (h - bH) / 2;
              const midY = boxTop + boxH / 2;
              return (
                <g>
                  <line x1={MAIN_X + MAIN_W} y1={midY} x2={BRANCH_X - 1} y2={midY} className="blog-fig-connector" markerEnd={`url(#${id}-arrow)`} />
                  {step.branch.label && (
                    <text x={(MAIN_X + MAIN_W + BRANCH_X) / 2} y={midY - 5} textAnchor="middle" className="blog-fig-arrowlabel">{step.branch.label}</text>
                  )}
                  <rect x={BRANCH_X} y={bTop} width={BRANCH_W} height={bH} rx={8} className={`blog-fig-box blog-fig-box--${step.branch.kind ?? "step"}`} />
                  {step.branch.lines.map((line, j) => (
                    <text key={j} x={BRANCH_X + BRANCH_W / 2} y={bTop + PAD_Y + LINE_H * (j + 0.75)} textAnchor="middle" className="blog-fig-boxtext blog-fig-boxtext--small">{line}</text>
                  ))}
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}
