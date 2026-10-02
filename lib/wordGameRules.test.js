// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { scoreGuess, keyStatusesFromScores, shareGridFromScores } from "@/lib/wordGameRules";

describe("scoreGuess", () => {
  it("marks exact, misplaced and missing letters", () => {
    expect(scoreGuess("CRANE", "CRATE")).toEqual(["correct", "correct", "correct", "absent", "correct"]);
    expect(scoreGuess("TRACE", "CRATE")).toEqual(["present", "correct", "correct", "present", "correct"]);
  });

  it("doesn't over-credit repeated letters", () => {
    // Second L is an exact match; the first finds no L left. Only one A counts.
    expect(scoreGuess("LLAMA", "ALOFT")).toEqual(["absent", "correct", "present", "absent", "absent"]);
  });
});

describe("keyStatusesFromScores and shareGridFromScores", () => {
  it("keeps each letter's best status and builds the share grid", () => {
    const guesses = ["TRACE", "CRATE"];
    const scores = guesses.map(g => scoreGuess(g, "CRATE"));
    expect(keyStatusesFromScores(guesses, scores)).toMatchObject({ C: "correct", T: "correct", R: "correct" });
    expect(shareGridFromScores(scores)).toBe("▦■■▦■\n■■■■■");
  });
});

// The answer-leak guard: anything a client component imports ends up in
// the browser bundle, so no "use client" file may reach lib/wordGame.js or
// content/wordgame/, directly or through an import chain.
describe("word banks stay server-side", () => {
  const roots = ["app", "components", "lib"];
  const files = roots.flatMap(function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      return /\.(jsx?|tsx?)$/.test(e.name) && !/\.test\./.test(e.name) ? [p] : [];
    });
  });
  const resolve = spec => {
    if (!spec.startsWith("@/")) return null;
    const base = spec.slice(2);
    for (const ext of ["", ".js", ".jsx", ".ts", ".tsx", "/index.js", "/index.jsx", "/index.ts", "/index.tsx"]) {
      if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return base + ext;
    }
    return null;
  };
  const importsOf = file => [...fs.readFileSync(file, "utf8").matchAll(/(?:import|from)\s+["']([^"']+)["']/g)].map(m => m[1]);
  const reachesBank = (file, seen = new Set()) => {
    if (seen.has(file)) return false;
    seen.add(file);
    for (const spec of importsOf(file)) {
      if (spec.startsWith("@/content/wordgame") || spec === "@/lib/wordGame") return true;
      const next = resolve(spec);
      if (next && reachesBank(next, seen)) return true;
    }
    return false;
  };

  it("no client component can import a word bank", () => {
    const clientFiles = files.filter(f => /^\s*["']use client["']/.test(fs.readFileSync(f, "utf8")));
    expect(clientFiles.length).toBeGreaterThan(0);
    const leaking = clientFiles.filter(f => reachesBank(f));
    expect(leaking).toEqual([]);
  });
});
