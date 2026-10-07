import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  GATE_2027_KEY_DATES, GATE_2027_STAGES, GATE_2027_SYLLABI, GATE_TOPIC_PAGES, getGate2027Stage,
} from "@/lib/gate2027";
import { getExamBySlug } from "@/lib/examDates";
import { getResourceBySlug } from "@/lib/resources";
import { getResourceContent } from "@/lib/resourceContent";

const allText = () => JSON.stringify({ GATE_2027_KEY_DATES, GATE_2027_STAGES });

describe("GATE 2027 facts", () => {
  it("first exam weekend matches the countdown date", () => {
    expect(GATE_2027_KEY_DATES.find(d => d.id === "exam-1").date).toBe(getExamBySlug("gate-2027").date);
  });

  it("key dates are in order", () => {
    const dated = GATE_2027_KEY_DATES.filter(d => d.date).map(d => d.date);
    expect([...dated].sort()).toEqual(dated);
  });

  // docs/gate2027-facts.md: registration dates move and the late-fee
  // closing date, rectification window and two-paper extended fee are
  // UNVERIFIED. None of their values may be shown.
  it("never quotes a registration, rectification or unverified fee value", () => {
    const text = allText();
    for (const banned of ["5 October", "12 October", "14 October", "21 October", "3 November", "November 03", "3000", "4500", "5000", "2500"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("every syllabus link is an official GATE 2027 PDF", () => {
    for (const paper of GATE_2027_SYLLABI) {
      expect(paper.href).toBe(`https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/${paper.code}_GATE2027_Syllabus.pdf`);
    }
  });

  it("every topic page exists and cites a GATE 2027 source", () => {
    for (const slug of GATE_TOPIC_PAGES) {
      expect(getResourceBySlug(slug), slug).toBeTruthy();
      const content = getResourceContent(slug);
      if (content) {
        expect(content.exam.sources.some(key => key.startsWith("gate-2027-")), slug).toBe(true);
      } else {
        const tsx = fs.readFileSync(path.join(process.cwd(), "app", "resources", slug, "page.tsx"), "utf8");
        expect(tsx, slug).toMatch(/gate-2027-/);
      }
    }
  });
});

describe("getGate2027Stage", () => {
  it("is null before the cycle starts", () => {
    expect(getGate2027Stage(new Date("2026-08-01T12:00:00+05:30"))).toBeNull();
  });

  it("picks the stage for the IST calendar date", () => {
    expect(getGate2027Stage(new Date("2026-10-07T12:00:00+05:30")).title).toBe("Registration period");
    expect(getGate2027Stage(new Date("2027-01-04T00:30:00+05:30")).title).toBe("City allotment and admit card");
    // 3 January 23:00 UTC is already 4 January in IST.
    expect(getGate2027Stage(new Date("2027-01-03T23:00:00Z")).title).toBe("City allotment and admit card");
    expect(getGate2027Stage(new Date("2027-02-14T12:00:00+05:30")).title).toBe("Exam weekends");
    expect(getGate2027Stage(new Date("2027-06-01T12:00:00+05:30")).title).toBe("Results are out");
  });

  it("stages are in date order", () => {
    const froms = GATE_2027_STAGES.map(s => s.from);
    expect([...froms].sort()).toEqual(froms);
  });
});
