import type { ReactNode } from "react";
import VectorDiagram, { type DiagramSpec } from "./VectorDiagram";

// Diagrams for the vectors and 3D geometry resource pages. Where a page
// has a worked example, the diagram uses its numbers.

const SPECS: Record<string, DiagramSpec> = {
  // Operations on vectors: the parallelogram law of addition.
  "vector-addition": {
    title: "Vectors a and b drawn from the same point form two sides of a parallelogram. The diagonal from that point is a plus b.",
    polygons: [{ points: [[0, 0], [4, 1], [5.5, 4], [1.5, 3]], light: true }],
    lines: [
      { from: [4, 1], to: [5.5, 4], style: "dashed" },
      { from: [1.5, 3], to: [5.5, 4], style: "dashed" },
    ],
    arrows: [
      { from: [0, 0], to: [4, 1] },
      { from: [0, 0], to: [1.5, 3] },
      { from: [0, 0], to: [5.5, 4], style: "alt" },
    ],
    points: [{ at: [0, 0] }],
    labels: [
      { at: [2.2, 0.55], text: "a", offset: [4, 18] },
      { at: [0.75, 1.5], text: "b", offset: [-14, 0] },
      { at: [3.1, 2.25], text: "a + b", anchor: "start", offset: [10, 4] },
      { at: [0, 0], text: "O", offset: [-12, 6], small: true },
    ],
    scale: 52,
  },

  // Unit vector: a = 3i + 4j and its unit vector.
  "unit-vector-diagram": {
    title: "The vector a equals 3i plus 4j, of length 5, and the unit vector a-hat along it, of length 1: a divided by 5, which is 0.6i plus 0.8j.",
    axes: [4, 4.6],
    lines: [
      { from: [3, 0], to: [3, 4], style: "dashed" },
      { from: [0, 4], to: [3, 4], style: "dashed" },
    ],
    arrows: [
      { from: [0, 0], to: [3, 4], style: "alt" },
      { from: [0, 0], to: [0.6, 0.8] },
    ],
    labels: [
      { at: [3, 4], text: "a = 3i + 4j, |a| = 5", anchor: "start", offset: [8, -6], small: true },
      { at: [0.6, 0.8], text: "â = 0.6i + 0.8j, |â| = 1", anchor: "start", offset: [10, 10], small: true },
      { at: [3, 0], text: "3", offset: [0, 16], small: true },
      { at: [0, 4], text: "4", offset: [-12, 4], small: true },
    ],
    scale: 56,
  },

  // Projection of a onto b.
  "projection-diagram": {
    title: "Vector a at angle theta to vector b. Dropping a perpendicular from the tip of a onto the line of b marks off the projection of a on b, of length |a| cos theta.",
    lines: [
      { from: [3, 2.5], to: [3, 0], style: "dashed" },
      { from: [0, -0.1], to: [0, -0.7], style: "dashed" },
      { from: [3, -0.1], to: [3, -0.7], style: "dashed" },
    ],
    arrows: [
      { from: [0, 0], to: [5.5, 0] },
      { from: [0, 0], to: [3, 2.5] },
      { from: [0, -0.5], to: [3, -0.5], style: "alt" },
    ],
    rightAngles: [{ at: [3, 0], a: [3, 2.5], b: [0, 0] }],
    angles: [{ at: [0, 0], a: [5.5, 0], b: [3, 2.5], r: 30, label: "θ" }],
    labels: [
      { at: [1.5, 1.25], text: "a", offset: [-10, -8] },
      { at: [5.5, 0], text: "b", offset: [12, 5] },
      { at: [1.5, -0.5], text: "|a| cos θ", offset: [0, 20], small: true },
    ],
    scale: 56,
  },

  // Section formula: P(1, 3), Q(5, 4), ratio 2 : 1.
  "section-formula": {
    title: "Points P and Q with position vectors p and q from the origin O. R divides PQ internally in the ratio 2 to 1, between P and Q; R prime divides it externally in the ratio 2 to 1, beyond Q.",
    lines: [
      { from: [1, 3], to: [5, 4] },
      { from: [5, 4], to: [9, 5], style: "dashed" },
    ],
    arrows: [
      { from: [0, 0], to: [1, 3] },
      { from: [0, 0], to: [5, 4] },
      { from: [0, 0], to: [11 / 3, 11 / 3], style: "alt" },
    ],
    points: [{ at: [1, 3] }, { at: [5, 4] }, { at: [11 / 3, 11 / 3] }, { at: [9, 5], hollow: true }],
    labels: [
      { at: [1, 3], text: "P", offset: [-10, -8] },
      { at: [5, 4], text: "Q", offset: [2, -12] },
      { at: [11 / 3, 11 / 3], text: "R", offset: [-2, -12] },
      { at: [9, 5], text: "R′", offset: [0, -12] },
      { at: [7 / 3, 10 / 3], text: "2", offset: [-2, -14], small: true },
      { at: [13 / 3, 23 / 6], text: "1", offset: [0, -14], small: true },
      { at: [0.5, 1.5], text: "p", offset: [-12, 0] },
      { at: [2.5, 2], text: "q", offset: [8, 14] },
      { at: [0, 0], text: "O", offset: [-12, 6], small: true },
    ],
    scale: 42,
  },

  // Direction cosines: the angles a line makes with the axes.
  "direction-cosines-3d": {
    title: "A line OP from the origin, making angles alpha, beta and gamma with the x, y and z axes. Its direction cosines are cos alpha, cos beta and cos gamma.",
    three: true,
    axes: [4.2, 4.6, 4],
    lines: [
      { from: [2.4, 3, 2.8], to: [2.4, 3, 0], style: "dashed" },
      { from: [2.4, 3, 0], to: [2.4, 0, 0], style: "dashed" },
      { from: [2.4, 3, 0], to: [0, 3, 0], style: "dashed" },
    ],
    arrows: [{ from: [0, 0, 0], to: [2.4, 3, 2.8], style: "alt" }],
    angles: [
      { at: [0, 0, 0], a: [1, 0, 0], b: [2.4, 3, 2.8], r: 26, label: "α" },
      { at: [0, 0, 0], a: [0, 1, 0], b: [2.4, 3, 2.8], r: 46, label: "β" },
      { at: [0, 0, 0], a: [0, 0, 1], b: [2.4, 3, 2.8], r: 36, label: "γ" },
    ],
    points: [{ at: [2.4, 3, 2.8] }],
    labels: [
      { at: [2.4, 3, 2.8], text: "P", offset: [10, -6] },
      { at: [0, 0, 0], text: "O", offset: [-12, 4], small: true },
    ],
    scale: 46,
  },

  // Area: |a × b| is base times height.
  "parallelogram-area": {
    title: "A parallelogram with sides a and b at angle theta. Its height above a is |b| sin theta, so its area is |a| |b| sin theta, which is |a cross b|. The diagonal cuts it into two equal triangles.",
    polygons: [
      { points: [[0, 0], [5, 0], [6.6, 2.6], [1.6, 2.6]], light: true },
      { points: [[0, 0], [5, 0], [1.6, 2.6]] },
    ],
    lines: [
      { from: [5, 0], to: [6.6, 2.6], style: "dashed" },
      { from: [1.6, 2.6], to: [6.6, 2.6], style: "dashed" },
      { from: [1.6, 2.6], to: [1.6, 0], style: "dashed" },
      { from: [5, 0], to: [1.6, 2.6] },
    ],
    arrows: [
      { from: [0, 0], to: [5, 0] },
      { from: [0, 0], to: [1.6, 2.6] },
    ],
    rightAngles: [{ at: [1.6, 0], a: [1.6, 2.6], b: [5, 0] }],
    angles: [{ at: [0, 0], a: [5, 0], b: [1.6, 2.6], r: 24, label: "θ" }],
    labels: [
      { at: [2.5, 0], text: "a", offset: [0, 20] },
      { at: [0.8, 1.3], text: "b", offset: [-14, 0] },
      { at: [1.6, 1.3], text: "h = |b| sin θ", anchor: "start", offset: [8, 4], small: true },
      { at: [5.3, 1.6], text: "triangle = ½ |a × b|", anchor: "start", offset: [10, 0], small: true },
    ],
    scale: 48,
  },

  // Equation of a line: r = a + λb.
  "line-in-3d": {
    title: "A line through the point A, with position vector a, in the direction of the vector b. Any point R on the line has position vector r equal to a plus lambda b.",
    three: true,
    axes: [3.6, 5, 4.2],
    lines: [{ from: [3.2, -1.4, 0.8], to: [-0.2, 5.4, 4.2] }],
    arrows: [
      { from: [0, 0, 0], to: [2, 1, 2] },
      { from: [2, 1, 2], to: [1, 3, 3], style: "alt" },
      { from: [0, 0, 0], to: [0.4, 4.2, 3.6], style: "dashed" },
    ],
    points: [{ at: [2, 1, 2] }, { at: [0.4, 4.2, 3.6] }],
    labels: [
      { at: [2, 1, 2], text: "A", offset: [12, 12] },
      { at: [0.4, 4.2, 3.6], text: "R", offset: [12, 4] },
      { at: [1, 0.5, 1], text: "a", offset: [10, 10] },
      { at: [1.5, 2, 2.5], text: "b", offset: [10, 10] },
      { at: [0.2, 2.1, 1.8], text: "r = a + λb", anchor: "end", offset: [-8, -4], small: true },
    ],
    scale: 44,
  },

  // Intercepts: 3x + 4y + 6z = 12 cuts the axes at 4, 3 and 2.
  "plane-intercepts": {
    title: "The plane 3x plus 4y plus 6z equals 12, drawn as the triangle where it meets the three axes, at (4, 0, 0), (0, 3, 0) and (0, 0, 2).",
    three: true,
    axes: [5.4, 4.4, 3],
    polygons: [{ points: [[4, 0, 0], [0, 3, 0], [0, 0, 2]] }],
    lines: [
      { from: [4, 0, 0], to: [0, 3, 0] },
      { from: [0, 3, 0], to: [0, 0, 2] },
      { from: [0, 0, 2], to: [4, 0, 0] },
    ],
    points: [{ at: [4, 0, 0] }, { at: [0, 3, 0] }, { at: [0, 0, 2] }],
    labels: [
      { at: [4, 0, 0], text: "(4, 0, 0)", anchor: "end", offset: [-10, 4], small: true },
      { at: [0, 3, 0], text: "(0, 3, 0)", offset: [6, 18], small: true },
      { at: [0, 0, 2], text: "(0, 0, 2)", anchor: "start", offset: [10, -2], small: true },
    ],
    scale: 50,
  },

  // Angle between a line and a plane.
  "line-plane-angle": {
    title: "A line with direction b meets a plane at a point. The plane's normal n is perpendicular to the plane. The angle theta between the line and the plane is measured to the line's shadow in the plane, and the angle between the line and the normal is 90 degrees minus theta.",
    three: true,
    polygons: [{ points: [[2.6, -0.6, 0], [2.6, 4.4, 0], [-1.6, 4.4, 0], [-1.6, -0.6, 0]], light: true }],
    lines: [
      { from: [0.5, 1.5, 0], to: [0.9, 3.6, 0], style: "dashed" },
    ],
    arrows: [
      { from: [0.5, 1.5, 0], to: [0.5, 1.5, 2.8] },
      { from: [0.5, 1.5, 0], to: [0.9, 3.4, 1.6], style: "alt" },
    ],
    points: [{ at: [0.5, 1.5, 0] }],
    angles: [
      { at: [0.5, 1.5, 0], a: [0.9, 3.6, 0], b: [0.9, 3.4, 1.6], r: 44, label: "θ" },
      { at: [0.5, 1.5, 0], a: [0.5, 1.5, 2.8], b: [0.9, 3.4, 1.6], r: 30, label: "90° − θ" },
    ],
    labels: [
      { at: [0.5, 1.5, 2.8], text: "n", offset: [-12, 4] },
      { at: [0.9, 3.4, 1.6], text: "b", offset: [12, 0] },
      { at: [2.6, 4.4, 0], text: "plane", anchor: "end", offset: [-8, 18], small: true },
    ],
    scale: 52,
  },

  // Shortest distance: two skew lines and their common perpendicular.
  "skew-lines": {
    title: "Two skew lines, one above the other, not parallel and never meeting. The shortest distance between them is the length of the segment perpendicular to both.",
    three: true,
    polygons: [{ points: [[3.4, -0.6, 0], [3.4, 4.6, 0], [-1.4, 4.6, 0], [-1.4, -0.6, 0]], light: true }],
    lines: [
      { from: [3, 0, 0], to: [-1, 4, 0] },
      { from: [-1, 0, 2.6], to: [3, 4, 2.6] },
      { from: [1, 2, 0], to: [1, 2, 2.6], style: "dashed" },
      { from: [-1, 0, 2.6], to: [-1, 0, 0], style: "dashed" },
      { from: [3, 4, 2.6], to: [3, 4, 0], style: "dashed" },
    ],
    points: [{ at: [1, 2, 0] }, { at: [1, 2, 2.6] }],
    rightAngles: [
      { at: [1, 2, 0], a: [1, 2, 1], b: [0, 3, 0] },
      { at: [1, 2, 2.6], a: [1, 2, 1.6], b: [2, 3, 2.6] },
    ],
    labels: [
      { at: [-1, 4, 0], text: "L₁", offset: [12, 6] },
      { at: [3, 4, 2.6], text: "L₂", offset: [12, 0] },
      { at: [1, 2, 1.3], text: "d", offset: [-12, 4] },
    ],
    scale: 50,
  },
};

export const VECTOR_FIGURES: Record<string, (id: string) => ReactNode> = Object.fromEntries(
  Object.entries(SPECS).map(([name, spec]) => [name, (id: string) => <VectorDiagram spec={spec} id={id} />])
);
