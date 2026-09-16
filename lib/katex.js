// lib/katex.js
// Server-side math rendering via katex's renderToString — used only from
// server components (see components/Katex.jsx), so katex's JS never ships
// to the client, only the static HTML/MathML it produces.
import katex from "katex";

export function renderMath(expr, displayMode = false) {
  return katex.renderToString(expr, { throwOnError: false, displayMode });
}
