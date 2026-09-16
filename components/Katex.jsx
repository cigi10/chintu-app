// components/Katex.jsx
// Renders a math expression to static HTML at build/request time via
// KaTeX's renderToString (lib/katex.js) — this is a server component
// (no "use client"), so no KaTeX JS is ever sent to the browser, only
// the HTML/MathML output plus its stylesheet.
import "katex/dist/katex.min.css";
import { renderMath } from "@/lib/katex";

export default function Katex({ children, display = false }) {
  const html = renderMath(children, display);
  return (
    <span
      className={display ? "katex-block" : "katex-inline"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
