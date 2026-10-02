import type { ReactNode } from "react";
import ScoreTrends from "./ScoreTrends";
import PercentileShifts from "./PercentileShifts";
import Flowchart, { type FlowStep } from "./Flowchart";

// Named figures a blog post can embed with a `figure` section:
//   { "heading": null, "figure": { "name": "score-trends", "caption": "..." } }
// Each is an inline SVG drawn from theme tokens (see .blog-fig-* in
// blog.css), so it follows every colour theme. lib/blogPosts.test.js checks
// that every name a post uses exists here.

const JOSAA_TO_CSAB: FlowStep[] = [
  { lines: ["JEE Main and JEE Advanced", "results declared"] },
  { lines: ["JoSAA registration and", "choice filling (list locked)"] },
  { lines: ["Mock allotments", "(a preview, not final)"] },
  {
    lines: ["JoSAA Rounds 1 to 5:", "IITs, NITs, IIITs, GFTIs"],
    branch: { lines: ["IITs and IISc:", "no rounds", "after this"], kind: "end" },
  },
  {
    arrowLabel: "vacant NIT+ seats",
    lines: ["CSAB Special Rounds 1 and 2", "NITs, IIITs, GFTIs only"],
    branch: { lines: ["Needs fresh", "registration", "and a fee"], kind: "warn" },
  },
  { lines: ["Admission at the", "allotted institute"], kind: "end" },
];

const JOSAA_ROUND: FlowStep[] = [
  { lines: ["A JoSAA round's results", "are published"] },
  {
    kind: "decision",
    lines: ["Seat allotted", "this round?"],
    branch: { label: "No", lines: ["Stays in for", "the next round"] },
  },
  {
    arrowLabel: "Yes",
    lines: ["Report online by deadline:", "Freeze, Float or Slide,", "documents, acceptance fee"],
    branch: { label: "missed", lines: ["Seat cancelled,", "out of JoSAA"], kind: "warn" },
  },
  {
    lines: ["Float or Slide: a later round", "can upgrade your seat"],
    branch: { label: "Freeze", lines: ["Keeps the seat,", "stops here"], kind: "end" },
  },
  { lines: ["Final round (5th in 2026):", "accept the seat or lose it"] },
  { arrowLabel: "no seat", lines: ["CSAB special rounds (NIT+),", "state counselling, or other", "admission routes"], kind: "end" },
];

export const BLOG_FIGURES: Record<string, () => ReactNode> = {
  "score-trends": () => <ScoreTrends />,
  "percentile-shifts": () => <PercentileShifts />,
  "josaa-to-csab": () => <Flowchart steps={JOSAA_TO_CSAB} title="From JEE results through JoSAA's five rounds to CSAB's special rounds and admission" />,
  "josaa-round": () => <Flowchart steps={JOSAA_ROUND} title="What happens in each JoSAA round depending on whether you are allotted a seat and complete reporting" />,
};
