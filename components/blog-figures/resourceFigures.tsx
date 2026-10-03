import type { ReactNode } from "react";
import FunctionPlot, { type PlotSpec } from "./FunctionPlot";

// Graphs for resource pages (content/resources/*.json), embedded with a
// `figure` block by name. Each draws the exact function the page's own
// worked example uses, so the picture and the algebra agree.

const PI = Math.PI;
const PI_TICKS = { [PI / 2]: "π/2", [PI]: "π", [(3 * PI) / 2]: "3π/2", [2 * PI]: "2π" };

const SPECS: Record<string, PlotSpec> = {
  // Power rule: y = x³ and its derivative 3x².
  "power-rule-graph": {
    title: "Graph of y equals x cubed and its derivative y equals 3x squared. Where the cubic is steep, the derivative is large; at x equals 0 the cubic is flat and the derivative is 0.",
    x: [-2.2, 2.2],
    y: [-5, 8],
    xTicks: [-2, -1, 1, 2],
    yTicks: [-4, 4, 8],
    curves: [
      { f: x => x ** 3 },
      { f: x => 3 * x ** 2, style: "alt" },
    ],
    points: [{ at: [0, 0] }],
    labels: [
      { at: [1.4, 2], text: "y = x³" },
      { at: [-1.35, 6.6], text: "y′ = 3x²" },
      { at: [0.15, -1.8], text: "slope 0 at x = 0", small: true },
    ],
  },

  // Tangents and normals: y = x² at (1, 1).
  "tangent-and-normal": {
    title: "The parabola y equals x squared with its tangent y equals 2x minus 1 and its normal y equals minus x over 2 plus 3 over 2, both through the point (1, 1). The normal is perpendicular to the tangent.",
    x: [-2.5, 3.5],
    y: [-1.5, 4.5],
    aspect: "equal",
    xTicks: [-2, -1, 1, 2, 3],
    yTicks: [-1, 1, 2, 3, 4],
    curves: [
      { f: x => x * x },
      { f: x => 2 * x - 1, style: "alt" },
      { f: x => -x / 2 + 1.5, style: "dashed" },
    ],
    points: [{ at: [1, 1] }],
    labels: [
      { at: [-1.75, 4.1], text: "y = x²" },
      { at: [2.7, 3.6], text: "tangent" },
      { at: [-1.05, 1.55], text: "normal" },
      { at: [1.15, 0.4], text: "(1, 1)", small: true },
    ],
  },

  // Rolle's theorem: f(x) = x² + 2x − 8 on [−4, 2].
  "rolles-theorem-graph": {
    title: "Graph of f(x) equals x squared plus 2x minus 8 on the interval from minus 4 to 2. The curve starts and ends at height 0, and at c equals minus 1 its tangent is horizontal.",
    x: [-5, 3],
    y: [-10.5, 4],
    xTicks: [-3, -2, -1, 1],
    yTicks: [-4, 4],
    curves: [
      { f: x => x * x + 2 * x - 8, domain: [-4.6, 2.6], style: "alt" },
      { f: x => x * x + 2 * x - 8, domain: [-4, 2] },
    ],
    lines: [{ from: [-3, -9], to: [1, -9], style: "dashed" }],
    points: [{ at: [-4, 0] }, { at: [2, 0] }, { at: [-1, -9] }],
    labels: [
      { at: [-4.15, -1.4], text: "a = −4", anchor: "end", small: true },
      { at: [2.15, -1.4], text: "b = 2", small: true },
      { at: [-1, -6.4], text: "c = −1, f′(c) = 0", anchor: "middle", small: true },
    ],
  },

  // Mean value theorem: f(x) = √x on [0, 4].
  "mean-value-theorem-graph": {
    title: "Graph of f(x) equals root x on the interval from 0 to 4, with the chord from (0, 0) to (4, 2) and the parallel tangent at c equals 1, both with slope one half.",
    x: [-0.4, 5],
    y: [-0.4, 3],
    xTicks: [1, 2, 3, 4],
    yTicks: [1, 2],
    curves: [
      { f: x => Math.sqrt(x), domain: [0, 4.8] },
      { f: x => x / 2 + 0.5, style: "alt" },
    ],
    lines: [{ from: [0, 0], to: [4, 2], style: "dashed" }],
    points: [{ at: [0, 0] }, { at: [4, 2] }, { at: [1, 1] }],
    labels: [
      { at: [2.2, 2.45], text: "tangent at c = 1", anchor: "end", small: true },
      { at: [2.6, 0.95], text: "chord, slope 1/2", small: true },
      { at: [4.1, 1.75], text: "y = √x", small: true },
    ],
  },

  // Maxima and minima: g(x) = x³ − 3x.
  "maxima-minima-graph": {
    title: "Graph of g(x) equals x cubed minus 3x, with a local maximum at (minus 1, 2) and a local minimum at (1, minus 2), where the tangent is horizontal.",
    x: [-2.6, 2.6],
    y: [-4, 4],
    xTicks: [-2, -1, 1, 2],
    yTicks: [-2, 2],
    curves: [{ f: x => x ** 3 - 3 * x }],
    lines: [
      { from: [-1.7, 2], to: [-0.3, 2], style: "dashed" },
      { from: [0.3, -2], to: [1.7, -2], style: "dashed" },
    ],
    points: [{ at: [-1, 2] }, { at: [1, -2] }],
    labels: [
      { at: [-1, 2.45], text: "local max (−1, 2)", anchor: "middle", small: true },
      { at: [1, -2.75], text: "local min (1, −2)", anchor: "middle", small: true },
    ],
  },

  // Increasing and decreasing: f(x) = 4x³ − 6x² − 72x + 30.
  "increasing-decreasing-graph": {
    title: "Graph of f(x) equals 4x cubed minus 6x squared minus 72x plus 30. It rises until x equals minus 2, falls between minus 2 and 3, and rises again after 3.",
    x: [-5, 6],
    y: [-280, 270],
    xTicks: [-4, -2, 2, 4],
    yTicks: [-200, -100, 100, 200],
    curves: [{ f: x => 4 * x ** 3 - 6 * x ** 2 - 72 * x + 30 }],
    lines: [
      { from: [-2, 0], to: [-2, 118], style: "dashed" },
      { from: [3, 0], to: [3, -132], style: "dashed" },
    ],
    points: [{ at: [-2, 118] }, { at: [3, -132] }],
    labels: [
      { at: [-4.8, 215], text: "increasing", small: true },
      { at: [0.6, 70], text: "decreasing", small: true },
      { at: [4.3, -150], text: "increasing", small: true },
      { at: [-2, 140], text: "(−2, 118)", anchor: "middle", small: true },
      { at: [3, -165], text: "(3, −132)", anchor: "middle", small: true },
    ],
  },

  // Approximations: f(x) = x²/4 at x = 2 with dx = 1.5.
  "differential-approximation": {
    title: "The curve y equals x squared over 4 with its tangent at x equals 2. Moving dx equals 1.5 along the tangent rises dy; the curve itself rises the slightly larger delta y.",
    x: [-0.3, 5],
    y: [-0.3, 4.2],
    xTicks: [1, 2, 3.5],
    yTicks: [1, 2, 3, 4],
    xTickLabels: { 2: "x", 3.5: "x + dx" },
    curves: [
      { f: x => (x * x) / 4, domain: [0, 4.1] },
      { f: x => x - 1, domain: [0.8, 4.4], style: "alt" },
    ],
    lines: [
      { from: [2, 1], to: [3.5, 1], style: "dashed" },
      { from: [3.5, 1], to: [3.5, 3.0625], style: "dashed" },
      { from: [3.9, 1], to: [3.9, 2.5] },
      { from: [4.25, 1], to: [4.25, 3.0625] },
    ],
    points: [{ at: [2, 1] }, { at: [3.5, 3.0625] }, { at: [3.5, 2.5], hollow: true }],
    labels: [
      { at: [2.75, 0.68], text: "dx", anchor: "middle" },
      { at: [3.96, 1.7], text: "dy", small: true },
      { at: [4.31, 2.05], text: "Δy", small: true },
      { at: [3.4, 3.35], text: "y = x²/4", anchor: "end", small: true },
      { at: [1.9, 1.25], text: "(x, f(x))", anchor: "end", small: true },
    ],
  },

  // Continuity: a jump, a removable gap and a corner on one graph.
  "discontinuity-types": {
    title: "One graph with three trouble spots: a jump at x equals 2 where the left and right limits differ, a removable gap at x equals 5 where the limit exists but the point is missing, and a corner at x equals 7.5 where the graph is continuous but not differentiable.",
    x: [0, 10],
    y: [0, 5.2],
    xTicks: [2, 5, 7.5],
    curves: [
      { f: x => 1 + 0.4 * x, domain: [0, 2] },
      { f: x => 2.6 + 0.2 * x, domain: [2, 7.5] },
      { f: x => 4.1 - 0.8 * (x - 7.5), domain: [7.5, 10] },
    ],
    points: [
      { at: [2, 1.8], hollow: true },
      { at: [2, 3] },
      { at: [5, 3.6], hollow: true },
      { at: [5, 1.4] },
      { at: [7.5, 4.1] },
    ],
    labels: [
      { at: [2, 4.6], text: "jump", anchor: "middle" },
      { at: [5, 4.6], text: "removable", anchor: "middle" },
      { at: [7.5, 4.6], text: "corner", anchor: "middle" },
      { at: [5.25, 1.3], text: "f(5) defined elsewhere", small: true },
    ],
  },

  // Area: y = cos x on [0, 2π].
  "area-under-cosine": {
    title: "Graph of y equals cos x from 0 to 2 pi with the area between the curve and the x-axis shaded. The middle half-period lies below the axis, so its signed integral is negative.",
    x: [-0.3, 2 * PI + 0.3],
    y: [-1.4, 1.4],
    xTicks: [PI / 2, PI, (3 * PI) / 2, 2 * PI],
    yTicks: [-1, 1],
    xTickLabels: PI_TICKS,
    shade: [{ upper: Math.cos, from: 0, to: 2 * PI }],
    curves: [{ f: Math.cos }],
    labels: [
      { at: [0.5, 0.35], text: "+", anchor: "middle" },
      { at: [PI, -0.45], text: "−", anchor: "middle" },
      { at: [2 * PI - 0.5, 0.35], text: "+", anchor: "middle" },
    ],
  },

  // Area between y = x and y = x² on [0, 1].
  "area-between-curves": {
    title: "The line y equals x and the parabola y equals x squared, meeting at (0, 0) and (1, 1), with the region between them shaded. The line is the upper curve on that interval.",
    x: [-0.15, 1.35],
    y: [-0.15, 1.25],
    aspect: "equal",
    xTicks: [0.5, 1],
    yTicks: [0.5, 1],
    shade: [{ upper: x => x, lower: x => x * x, from: 0, to: 1 }],
    curves: [
      { f: x => x },
      { f: x => x * x, style: "alt" },
    ],
    points: [{ at: [0, 0] }, { at: [1, 1] }],
    labels: [
      { at: [1.15, 1.06], text: "y = x", small: true },
      { at: [1.07, 1.2], text: "y = x²", anchor: "end", small: true },
    ],
  },

  // Linear programming: 2x + y ≤ 10, x + 3y ≤ 15, x, y ≥ 0.
  "lp-feasible-region": {
    title: "The feasible region for 2x plus y at most 10, x plus 3y at most 15, x and y at least 0: a quadrilateral with corners (0, 0), (5, 0), (3, 4) and (0, 5).",
    x: [-0.6, 9],
    y: [-0.6, 7],
    aspect: "equal",
    xTicks: [1, 2, 3, 4, 5, 6, 7, 8],
    yTicks: [1, 2, 3, 4, 5, 6],
    polygons: [[[0, 0], [5, 0], [3, 4], [0, 5]]],
    curves: [
      { f: x => 10 - 2 * x, style: "alt" },
      { f: x => (15 - x) / 3, style: "alt" },
    ],
    points: [{ at: [0, 0] }, { at: [5, 0] }, { at: [3, 4] }, { at: [0, 5] }],
    labels: [
      { at: [1.75, 6.6], text: "2x + y = 10", small: true },
      { at: [8.9, 2.55], text: "x + 3y = 15", anchor: "end", small: true },
      { at: [3.2, 4.3], text: "(3, 4)", small: true },
      { at: [0.2, 5.3], text: "(0, 5)", small: true },
      { at: [5.15, 0.3], text: "(5, 0)", small: true },
      { at: [1.6, 1.8], text: "feasible", anchor: "middle" },
    ],
  },
};

export const RESOURCE_FIGURES: Record<string, (id: string) => ReactNode> = Object.fromEntries(
  Object.entries(SPECS).map(([name, spec]) => [name, (id: string) => <FunctionPlot spec={spec} id={id} />])
);
