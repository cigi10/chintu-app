// lib/syllabusSources.js
//
// The official documents every exam note on a resource page is checked
// against. A note may only state what one of the sources it cites
// actually lists; each was downloaded and read when the note was written
// (Phase 0 verification pass, October 2026). They are the latest
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
  "gate-2026-ec": {
    label: "GATE 2026 EC syllabus",
    href: "https://gate2026.iitg.ac.in/doc/GATE2026_Syllabus/EC_2026_Syllabus.pdf",
  },
  "gate-2026-ee": {
    label: "GATE 2026 EE syllabus",
    href: "https://gate2026.iitg.ac.in/doc/GATE2026_Syllabus/EE_2026_Syllabus.pdf",
  },
  "gate-2026-in": {
    label: "GATE 2026 IN syllabus",
    href: "https://gate2026.iitg.ac.in/doc/GATE2026_Syllabus/IN_2026_Syllabus.pdf",
  },
  "gate-2026-brochure": {
    label: "GATE 2026 information brochure (General Aptitude syllabus)",
    href: "https://gate2026.iitg.ac.in/doc/IB/GATE2026-IB-10102025.pdf",
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
