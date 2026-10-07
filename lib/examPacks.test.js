import { describe, it, expect } from "vitest";
import { RAW_PACKS, PACK_NAMES, PACK_DESC, PACK_ICON, PACK_SYLLABUS_URL, PES_PACKS } from "./examPacks";
import { COUNTRIES, groupPacksForCountry, packsForCountry } from "./examRegions";

// The official GATE 2027 section names, in syllabus order, from each
// paper's 2027 syllabus PDF (docs/gate2027-facts.md), plus General Aptitude.
const GATE_2027_SECTIONS = {
  "GATE CS": ["Engineering Mathematics", "Digital Logic", "Computer Organization and Architecture", "Programming and Data Structures", "Algorithms", "Theory of Computation", "Compiler Design", "Operating System", "Databases", "Computer Networks"],
  "GATE ECE": ["Engineering Mathematics", "Networks, Signals and Systems", "Electronic Devices", "Analog Circuits", "Digital Circuits", "Control Systems", "Communications", "Electromagnetics"],
  "GATE EE": ["Engineering Mathematics", "Electric circuits", "Electromagnetic Fields", "Signals and Systems", "Electrical Machines", "Power Systems", "Control Systems", "Electrical and Electronic Measurements", "Analog and Digital Electronics", "Power Electronics"],
  "GATE ME": ["Engineering Mathematics", "Applied Mechanics and Design", "Fluid Mechanics and Thermal Sciences", "Materials, Manufacturing and Industrial Engineering"],
  "GATE BT": ["Engineering Mathematics", "General Biology", "Genetics, Cellular and Molecular Biology", "Fundamentals of Biological Engineering", "Plant, Animal and Microbial Biotechnology", "Recombinant DNA technology and Other Tools in Biotechnology"],
};
const GATE_CODE = { "GATE CS": "CS", "GATE ECE": "EC", "GATE EE": "EE", "GATE ME": "ME", "GATE BT": "BT" };

const topicName = entry => (typeof entry === "string" ? entry : entry.name);

describe("pack keys", () => {
  it("are unique, even ignoring case and spacing", () => {
    const normalized = PACK_NAMES.map(k => k.toLowerCase().replace(/\s+/g, ""));
    expect(new Set(normalized).size).toBe(PACK_NAMES.length);
  });

  it("aren't silently overwritten by the PES spread", () => {
    const pes = Object.keys(PES_PACKS);
    const base = PACK_NAMES.filter(k => !pes.includes(k));
    expect(base.length + pes.length).toBe(PACK_NAMES.length);
    for (const k of pes) expect(RAW_PACKS[k]).toBe(PES_PACKS[k]);
  });

  it("each have a description and a unique icon", () => {
    for (const k of PACK_NAMES) {
      expect(PACK_DESC[k], k).toBeTruthy();
      expect(PACK_ICON[k], k).toBeTruthy();
    }
    const icons = PACK_NAMES.map(k => PACK_ICON[k]);
    expect(new Set(icons).size).toBe(icons.length);
  });

  it("are all reachable from the onboarding picker under some region", () => {
    const reachable = new Set(COUNTRIES.flatMap(c => groupPacksForCountry(c.key, PACK_NAMES).flatMap(g => g.keys)));
    for (const k of PACK_NAMES) expect(reachable.has(k), k).toBe(true);
  });

  it("puts every GATE pack in the India onboarding picker and Tracker picker", () => {
    const gateGroup = groupPacksForCountry("India", PACK_NAMES).find(g => g.id === "gate");
    expect(gateGroup.keys).toEqual(Object.keys(GATE_2027_SECTIONS));
    for (const k of Object.keys(GATE_2027_SECTIONS)) expect(packsForCountry("India", PACK_NAMES)).toContain(k);
  });
});

describe("pack topics", () => {
  it("have no duplicate topic names within a subject", () => {
    for (const [pack, subjects] of Object.entries(RAW_PACKS)) {
      for (const [subject, topics] of Object.entries(subjects)) {
        const names = topics.map(t => topicName(t).toLowerCase());
        expect(new Set(names).size, `${pack} / ${subject}`).toBe(names.length);
      }
    }
  });
});

describe("GATE packs", () => {
  it("use the official GATE 2027 section names, in order, then General Aptitude", () => {
    for (const [pack, sections] of Object.entries(GATE_2027_SECTIONS)) {
      expect(Object.keys(RAW_PACKS[pack]), pack).toEqual([...sections, "General Aptitude"]);
    }
  });

  it("use the four GA syllabus sections", () => {
    for (const pack of Object.keys(GATE_2027_SECTIONS)) {
      expect(RAW_PACKS[pack]["General Aptitude"]).toEqual(["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"]);
    }
  });

  it("each link their official GATE 2027 syllabus PDF", () => {
    for (const [pack, code] of Object.entries(GATE_CODE)) {
      expect(PACK_SYLLABUS_URL[pack]).toBe(`https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/${code}_GATE2027_Syllabus.pdf`);
    }
  });
});
