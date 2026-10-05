import { describe, it, expect } from "vitest";
import { SYLLABUS_SOURCES } from "./syllabusSources";

// Exam notes may only cite official sources, linked over https.
const OFFICIAL_HOSTS = ["jeemain.nta.nic.in", "www.nta.ac.in", "jeeadv.ac.in", "gate2026.iitg.ac.in", "cbseacademic.nic.in"];

describe("syllabus sources", () => {
  it("are all https links on official exam or board domains", () => {
    for (const [key, { label, href }] of Object.entries(SYLLABUS_SOURCES)) {
      const url = new URL(href);
      expect(url.protocol, key).toBe("https:");
      expect(OFFICIAL_HOSTS, key).toContain(url.hostname);
      expect(label.length, key).toBeGreaterThan(10);
    }
  });
});
