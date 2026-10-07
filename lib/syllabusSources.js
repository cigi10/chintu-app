// lib/syllabusSources.js
//
// The official documents every exam note on a resource page is checked
// against. A note may only state what one of the sources it cites
// actually lists; each was downloaded and read when the note was written
// (Phase 0 verification pass, October 2026; GATE moved to the 2027
// syllabi on 7 October 2026, see docs/gate2027-facts.md). They are the latest
// published versions at that time, so the exam section also tells
// readers to confirm with the newest notification.
//
// lib/resources.test.js checks every exam note cites at least one key here.

export const SYLLABUS_SOURCES = {
  "jee-main-2026": {
    label: "JEE (Main) 2026 syllabus (NTA)",
    href: "https://jeemain.nta.nic.in/document/syllabus-2026/",
  },
  "jee-advanced-2026": {
    label: "JEE (Advanced) 2026 syllabus",
    href: "https://jeeadv.ac.in/documents/jee-advanced-2026-syllabus.pdf",
  },
  "neet-ug-2026": {
    label: "NEET (UG) 2026 syllabus (NMC, published by NTA)",
    href: "https://www.nta.ac.in/Download/Notice/Notice_20260108180635.pdf",
  },
  "gate-2027-ec": {
    label: "GATE 2027 EC syllabus",
    href: "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/EC_GATE2027_Syllabus.pdf",
  },
  "gate-2027-ee": {
    label: "GATE 2027 EE syllabus",
    href: "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/EE_GATE2027_Syllabus.pdf",
  },
  "gate-2027-in": {
    label: "GATE 2027 IN syllabus",
    href: "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/IN_GATE2027_Syllabus.pdf",
  },
  "gate-2027-brochure": {
    label: "GATE 2027 information brochure (General Aptitude syllabus)",
    href: "https://gate2027ib.iitm.ac.in/GATE2027-IB.pdf",
  },
  "cbse-9-10-2025-26": {
    label: "CBSE Mathematics curriculum, Classes IX-X (2025-26)",
    href: "https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/Maths_Sec_2025-26.pdf",
  },
  "cbse-11-12-2025-26": {
    label: "CBSE Mathematics curriculum, Classes XI-XII (2025-26)",
    href: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Maths_SrSec_2025-26.pdf",
  },
};

export function getSyllabusSource(key) {
  return SYLLABUS_SOURCES[key];
}
