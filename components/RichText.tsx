import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Katex from "@/components/Katex";

// Inline markup for JSON-authored content (content/resources/*.json):
//   $x^2$          inline KaTeX (rendered on the server, like <Katex>)
//   **Solution:**  bold
//   *same*         italic
//   [label](/href) internal link
// A literal dollar sign is written \$. Nothing nests inside math; bold,
// italic and links may contain math and each other.
export default function RichText({ text }: { text: string }) {
  return <>{parse(text)}</>;
}

function parse(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let i = 0;
  const flush = () => {
    if (buf) out.push(buf);
    buf = "";
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === "\\" && text[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }

    if (ch === "$") {
      const end = text.indexOf("$", i + 1);
      if (end === -1) throw new Error(`Unclosed $ in: ${text}`);
      flush();
      out.push(<Katex key={out.length}>{text.slice(i + 1, end)}</Katex>);
      i = end + 1;
      continue;
    }

    if (text.startsWith("**", i)) {
      const end = findClose(text, "**", i + 2);
      flush();
      out.push(<strong key={out.length}>{parse(text.slice(i + 2, end))}</strong>);
      i = end + 2;
      continue;
    }

    if (ch === "*") {
      const end = findClose(text, "*", i + 1);
      flush();
      out.push(<em key={out.length}>{parse(text.slice(i + 1, end))}</em>);
      i = end + 1;
      continue;
    }

    if (ch === "[") {
      const mid = text.indexOf("](", i);
      const end = mid === -1 ? -1 : text.indexOf(")", mid);
      if (mid !== -1 && end !== -1) {
        flush();
        out.push(
          <Link key={out.length} href={text.slice(mid + 2, end)}>
            {parse(text.slice(i + 1, mid))}
          </Link>
        );
        i = end + 1;
        continue;
      }
    }

    buf += ch;
    i++;
  }

  flush();
  return out.map((node, k) => (typeof node === "string" ? <Fragment key={`t${k}`}>{node}</Fragment> : node));
}

// Finds the closing marker, skipping over any $...$ math in between so a
// `*` inside LaTeX never closes emphasis.
function findClose(text: string, marker: string, from: number) {
  let i = from;
  while (i < text.length) {
    if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end === -1) break;
      i = end + 1;
      continue;
    }
    if (marker === "*" && text.startsWith("**", i)) {
      i = findClose(text, "**", i + 2) + 2;
      continue;
    }
    if (text.startsWith(marker, i)) return i;
    i++;
  }
  throw new Error(`Unclosed ${marker} in: ${text}`);
}
