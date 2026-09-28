// Single source of truth for exam pack data: the subject/topic tree used by
// the Portion Tracker, plus display metadata (short descriptions, onboarding
// icons) used by both PortionTracker and Onboarding. Keys are stored as-is
// in Supabase/localStorage and used to key into subject/topic config, so
// they can't be renamed without a data migration.

// PES University semester syllabus templates (CSE/AIML and ECE, Sem 1-6).
// Course titles only, deliberately — course codes are re-issued most
// years, so keying anything on them would break the template every
// syllabus revision. Each pack is scoped to one (branch, semester) pair;
// picking a pack gives one Tracker subject per COURSE (not per semester),
// each with 4 fixed units, each unit carrying the same
// PPT/Notes/QB/QA/MCQ/Self Notes checklist as subtopics underneath.
//
// Batch 14 grouped courses under "Semester N Core" / "... Electives"
// subject headers. Batch 15 removed that: "Core" and "Elective" no longer
// appear anywhere in the UI — every course, whether originally core or
// elective, is just its own section with no grouping label. The
// core/elective distinction is kept only in the comments below, for
// whoever next needs to know which courses can vary by section.
//
// NOTE: three course titles below are unconfirmed placeholders, kept as
// the bare abbreviation from the source material rather than guessed out
// in full — see the "CIE", "ADA", "AFML" entries and the accompanying
// comments. Swap in the real titles once confirmed.
const PES_UNIT_ITEMS = ["PPT", "Notes", "QB", "QA", "MCQ", "Self Notes"];

// One PES course's 4 units, each carrying the fixed checklist above as
// subtopics. Called fresh per course (not shared/reused) so each course
// gets its own independent set of unit/subtopic objects.
function pesUnits() {
  return [1, 2, 3, 4].map(n => ({ name: `Unit ${n}`, subtopics: PES_UNIT_ITEMS }));
}

// Turns a flat list of course titles into { courseTitle: <4 units>, ... }
// — the shape RAW_PACKS expects, with every course promoted to its own
// top-level subject.
function pesSubjects(courseNames) {
  const subjects = {};
  for (const name of courseNames) subjects[name] = pesUnits();
  return subjects;
}

const PES_SEM1_COMMON = [
  "Python for Computational Problem Solving (+ Lab)",
  "Elements of Electrical Engineering",
  "Environmental Studies & Life Sciences",
  "Engineering Mathematics I",
  "Mechanical Engineering Sciences",
  "Engineering Physics (+ Lab)",
];
const PES_SEM2_COMMON = [
  "Problem Solving With C",
  "Engineering Mechanics - Statics",
  "Engineering Chemistry",
  "Electronic Principles And Devices",
  "Engineering Mathematics II",
  "Constitution of India Cyber Law and Professional Ethics",
];

const PES_PACKS = {
  "PES CSE/AIML Sem 1": pesSubjects(PES_SEM1_COMMON),
  "PES CSE/AIML Sem 2": pesSubjects(PES_SEM2_COMMON),
  "PES CSE/AIML Sem 3": pesSubjects([
    "Digital Design and Computer Organization",
    "Data Structures and Algorithms",
    "Mathematics for Computer Science Engineering",
    "Automata and Formal Language Logic",
    "Web Technologies",
  ]),
  "PES CSE/AIML Sem 4": pesSubjects([
    "Computer Networks",
    "Design and Analysis of Algorithms",
    "Linear Algebra",
    "Microprocessors and Computer Architecture",
    "Operating Systems",
    // Unconfirmed: "CIE" in the source material, full name not yet
    // verified — ask before treating this as final.
    "CIE",
  ]),
  "PES CSE/AIML Sem 5": pesSubjects([
    // Core:
    "Database Management Systems", "Machine Learning", "Software Engineering",
    // AIML electives (varies by section):
    "AI for Industry",
    // Unconfirmed: "ADA" and "AFML" in the source material, full names
    // not yet verified — ask before treating these as final.
    "ADA", "AFML",
  ]),
  "PES CSE/AIML Sem 6": pesSubjects(["Cloud Computing", "Compiler Design", "Object Oriented Analysis and Design"]),
  "PES ECE Sem 1": pesSubjects(PES_SEM1_COMMON),
  "PES ECE Sem 2": pesSubjects(PES_SEM2_COMMON),
  "PES ECE Sem 3": pesSubjects([
    "Mathematics for Electronics Engineers",
    "Signals and Systems",
    "Computer Aided Digital Design",
    "Analog Circuit Design",
    "Network Analysis and Synthesis",
    "Essentials of Innovation and Entrepreneurship I",
  ]),
  "PES ECE Sem 4": pesSubjects([
    "Digital Signal Processing",
    "Digital VLSI Design",
    "Control Systems",
    "Electromagnetic Field Theory",
    "Linear Algebra and its Applications",
    "Essentials of Innovation and Entrepreneurship II",
  ]),
  "PES ECE Sem 5": pesSubjects([
    // Core:
    "Digital Communication", "Computer Communication Networks", "Computer Organization and Design",
    // Electives (codes vary):
    "Embedded Systems", "Verification of Digital Systems",
  ]),
  "PES ECE Sem 6": pesSubjects([
    // Core:
    "High Performance Computing", "Transmission Lines Waveguides and Antennas", "Project Work Phase II",
    // Electives (codes vary):
    "Cryptography", "VLSI Circuit Testing and Testability", "Machine Learning and Applications",
  ]),
};

export const RAW_PACKS = {
  JEE: {
    Physics:   ["Kinematics", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Gravitation", "Properties of Solids & Liquids", "Kinetic Theory of Gases", "Thermodynamics", "Oscillations & Waves", "Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction & AC", "Electromagnetic Waves", "Optics", "Modern Physics", "Semiconductor Electronics"],
    Chemistry: ["Mole Concept", "Atomic Structure", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Electrochemistry", "Chemical Kinetics", "Solutions", "Periodic Table", "p-Block Elements", "d & f-Block Elements", "Coordination Compounds", "Organic Basics", "Hydrocarbons", "Haloalkanes & Haloarenes", "Aldehydes, Ketones & Carboxylic Acids", "Amines", "Biomolecules"],
    Maths:     ["Sets & Functions", "Complex Numbers", "Quadratic Equations", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series", "Trigonometry", "Coordinate Geometry", "Limits & Derivatives", "Integration", "Vectors", "Statistics", "Probability", "Matrices & Determinants"],
  },
  NEET: {
    Physics:   ["Kinematics", "Laws of Motion", "Work & Energy", "Gravitation", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves", "Electrostatics", "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction", "Optics", "Modern Physics", "Dual Nature of Matter", "Atoms & Nuclei", "Semiconductor Electronics"],
    Chemistry: ["Mole Concept", "Chemical Bonding", "Equilibrium", "Redox Reactions", "Chemical Kinetics", "Electrochemistry", "p-Block Elements", "d & f-Block Elements", "Coordination Compounds", "Organic Basics", "Haloalkanes & Haloarenes", "Alcohols/Phenols/Ethers", "Aldehydes, Ketones & Carboxylic Acids", "Amines", "Biomolecules"],
    Biology:   ["Diversity in Living World", "Structural Organisation in Animals and Plants", "Cell Structure", "Genetics", "Human Physiology", "Plant Physiology", "Ecology", "Evolution", "Reproduction", "Biotechnology", "Human Health & Disease"],
  },
  "SAT/ACT": {
    Math:               ["Heart of Algebra", "Problem Solving & Data", "Passport to Advanced Math", "Geometry & Trig", "Statistics Basics"],
    "Reading & Writing": ["Reading Comprehension", "Grammar & Usage", "Vocabulary in Context", "Essay/Writing Skills", "Rhetorical Analysis"],
  },
  "A-Levels": {
    Maths:     ["Pure Maths 1", "Pure Maths 2", "Statistics", "Mechanics"],
    Physics:   ["Mechanics", "Electricity", "Waves", "Thermal Physics", "Nuclear Physics"],
    Chemistry: ["Atomic Structure", "Bonding", "Organic Chemistry", "Energetics", "Equilibria"],
  },
  GCSEs: {
    Maths:   ["Number", "Algebra", "Geometry & Measures", "Statistics", "Probability"],
    English: ["Reading Skills", "Creative Writing", "Persuasive Writing", "Poetry Analysis", "Shakespeare"],
    Science: ["Biology Basics", "Chemistry Basics", "Physics Basics", "Working Scientifically"],
  },
  Gaokao: {
    Maths:   ["Functions", "Sequences", "Trigonometry", "Solid Geometry", "Probability & Statistics", "Conic Sections"],
    Chinese: ["Classical Texts", "Modern Prose", "Composition Writing", "Poetry Appreciation"],
    English: ["Reading Comprehension", "Cloze Test", "Grammar", "Writing Task"],
  },
  "GRE/GMAT": {
    Quant:  ["Arithmetic", "Algebra", "Geometry", "Data Interpretation", "Word Problems"],
    Verbal: ["Reading Comprehension", "Critical Reasoning", "Sentence Correction", "Text Completion", "Vocabulary"],
  },
  Placements: {
    DSA:             ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming", "Greedy Algorithms", "Sorting & Searching"],
    "CS Core":       ["Operating Systems", "DBMS", "Computer Networks", "OOP Concepts", "System Design Basics"],
    "ECE Core":      ["Analog Electronics", "Digital Electronics", "Signals & Systems", "Communication Systems", "Microprocessors", "VLSI Basics", "Control Systems"],
    "Mech Core":     ["Thermodynamics", "Fluid Mechanics", "Strength of Materials", "Theory of Machines", "Manufacturing Processes", "Machine Design"],
    "Aptitude & HR": ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "HR Interview Prep", "Resume & Projects"],
  },
  "UPSC CSE": {
    History: ["Ancient India", "Medieval India", "Modern India", "World History", "Art & Culture"],
    Geography: ["Physical Geography", "Indian Geography", "World Geography", "Economic Geography"],
    Polity: ["Constitution", "Governance", "Fundamental Rights", "Parliament", "Judiciary"],
    Economy: ["Basic Concepts", "Indian Economy", "Budget & Fiscal Policy", "International Trade"],
    "Environment & Ecology": ["Biodiversity", "Climate Change", "Environmental Policies", "Conservation"],
    "Science & Tech": ["Space", "Biotechnology", "IT & Communication", "Defence Tech"],
    "Current Affairs": ["National Issues", "International Relations", "Government Schemes"],
    CSAT: ["Comprehension", "Logical Reasoning", "Basic Numeracy", "Decision Making"],
    "Essay & Ethics": ["Essay Writing Practice", "Ethics Case Studies", "Aptitude & Foundational Values"],
  },
  CFA: {
    "Ethical & Professional Standards": ["Code of Ethics", "Standards of Conduct", "GIPS"],
    "Quantitative Methods": ["Time Value of Money", "Statistics", "Probability", "Hypothesis Testing"],
    Economics: ["Microeconomics", "Macroeconomics", "International Trade", "Monetary Policy"],
    "Financial Statement Analysis": ["Income Statement", "Balance Sheet", "Cash Flow", "Ratio Analysis"],
    "Corporate Issuers": ["Capital Structure", "Corporate Governance", "Business Models"],
    "Equity Investments": ["Market Organization", "Equity Valuation", "Industry Analysis"],
    "Fixed Income": ["Bond Features", "Yield Measures", "Term Structure", "Credit Risk"],
    Derivatives: ["Forwards & Futures", "Options", "Swaps", "Risk Management"],
    "Alternative Investments": ["Real Estate", "Private Equity", "Hedge Funds", "Commodities"],
    "Portfolio Management": ["Portfolio Risk & Return", "Asset Allocation", "Portfolio Construction"],
  },
  MCAT: {
    "Biological & Biochemical Foundations": ["Cell Biology", "Molecular Biology", "Genetics", "Metabolism"],
    "Chemical & Physical Foundations": ["General Chemistry", "Organic Chemistry", "Physics", "Biochemistry"],
    "Psychological & Social Foundations": ["Behavior", "Psychology Basics", "Sociology Basics", "Biopsychosocial Model"],
    "Critical Analysis & Reasoning": ["Passage Analysis", "Argument Evaluation", "Reasoning Beyond the Text"],
  },
  "IELTS/TOEFL": {
    Listening: ["Conversations", "Lectures", "Note Completion", "Multiple Choice Practice"],
    Reading: ["Skimming & Scanning", "True/False/Not Given", "Matching Headings", "Academic Passages"],
    Writing: ["Task 1 (Graphs/Letters)", "Task 2 (Essays)", "Coherence & Cohesion", "Grammar Range"],
    Speaking: ["Part 1 Introduction", "Part 2 Cue Card", "Part 3 Discussion", "Fluency Practice"],
  },
  CPA: {
    "Auditing & Attestation": ["Audit Planning", "Internal Controls", "Evidence & Procedures", "Reporting"],
    "Business Environment & Concepts": ["Corporate Governance", "Economic Concepts", "Financial Management", "IT & Operations"],
    "Financial Accounting & Reporting": ["Conceptual Framework", "Financial Statements", "Transactions", "Governmental Accounting"],
    Regulation: ["Business Law", "Federal Taxation - Individuals", "Federal Taxation - Entities", "Ethics"],
  },
  "GATE CS": {
    "Engineering Mathematics": ["Discrete Mathematics", "Linear Algebra", "Calculus", "Probability & Statistics"],
    // Revised for GATE 2027 — see the three sections below (Digital Logic,
    // Computer Organization & Architecture, Computer Networks). Verified
    // against the official GATE 2027 syllabus (gate2027.iitm.ac.in).
    "Digital Logic": [
      "Boolean Algebra & Minimization (K-Map, Quine-McCluskey)",
      "Combinational Circuits (MUX, Decoder, Adder, Comparator)",
      "Sequential Circuits (Flip-Flops, Counters, Shift Registers, FSMs)",
      "Number Representation & Arithmetic (Fixed & Floating Point)",
    ],
    "Computer Organization & Architecture": [
      "Machine Instructions & Addressing Modes",
      "ALU Design",
      "Datapath & CPU Control (Hardwired & Microprogrammed)",
      "Memory Hierarchy (Cache & Main Memory)",
      "I/O Interface & Interrupt Handling",
      "Pipelining",
    ],
    // Confirmed unchanged for 2027.
    "Programming & Data Structures": [
      "Programming in C",
      "Recursion",
      "Arrays",
      "Stacks",
      "Queues",
      "Linked Lists",
      "Trees (BST, AVL, Heaps, B-Trees)",
      "Graphs (BFS, DFS, Shortest Paths, Spanning Trees)",
      "Hashing",
    ],
    Algorithms: ["Asymptotic Analysis", "Sorting & Searching", "Divide & Conquer", "Greedy & DP", "Graph Algorithms"],
    "Theory of Computation": ["Regular Languages", "Context-Free Languages", "Turing Machines", "Undecidability"],
    "Compiler Design": ["Lexical Analysis", "Parsing", "Syntax-Directed Translation", "Code Optimization"],
    "Operating Systems": ["Processes & Threads", "Synchronization", "Memory Management", "File Systems", "Deadlocks"],
    Databases: ["ER Model", "Relational Algebra", "SQL", "Normalization", "Transactions & Concurrency"],
    // Reduced scope for GATE 2027: OSI as a standalone topic, ARP, DHCP,
    // ICMP, UDP, FTP, and SMTP/email protocols are no longer separately
    // examinable — see the reference note above.
    "Computer Networks": [
      "Physical Layer",
      "Data Link Layer (Framing, Error Detection, MAC, Ethernet, Bridging)",
      "Switching",
      "IPv4 & IPv6",
      "Routing Algorithms (Shortest Path, Distance Vector, Link State)",
      "Congestion Control",
      "DNS & HTTP",
    ],
    // Mandatory on every GATE paper regardless of discipline, ~15% of marks.
    "General Aptitude": ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"],
  },
  "GATE ECE": {
    "Engineering Mathematics": ["Linear Algebra", "Calculus", "Differential Equations", "Probability & Statistics", "Complex Variables"],
    Networks: ["Network Theorems", "Two-Port Networks", "Transient Analysis", "AC Circuits"],
    "Electronic Devices": ["Semiconductor Physics", "Diodes", "BJT & MOSFET", "Fabrication Basics", "MOS Capacitor & CMOS Inverter Operation", "MOS Small-Signal Models", "Short-Channel Effects & Device Scaling"],
    "Analog Circuits": ["Amplifiers", "Op-Amps", "Feedback & Oscillators", "Power Supplies", "Differential Amplifiers & Current Mirrors", "Active Filters", "Dominant-Pole (Miller) Compensation & Phase Margin"],
    "Digital Circuits": ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits", "Semiconductor Memories", "FSM Design", "Timing & Hazard Analysis", "HDL-Oriented Design Concepts"],
    "Signals and Systems": ["LTI Systems", "Fourier Analysis", "Laplace & Z-Transform", "Sampling", "Correlation & Power Spectral Density", "Introductory State-Space Representation"],
    "Control Systems": ["Transfer Functions", "Time Response", "Stability Analysis", "Frequency Response", "Introductory State-Space Analysis"],
    Communications: ["Analog Modulation", "Digital Modulation", "Information Theory", "Noise in Communication", "Random Processes", "Error Correction (Hamming Codes, CRC)"],
    Electromagnetics: ["Electrostatics", "Maxwell's Equations", "Transmission Lines", "Waveguides & Antennas"],
    "General Aptitude": ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"],
  },
  "GATE ME": {
    "Engineering Mathematics": ["Linear Algebra", "Calculus", "Differential Equations", "Numerical Methods"],
    "Applied Mechanics": ["Engineering Mechanics", "Mechanics of Materials", "Theory of Machines", "Vibrations"],
    "Strength of Materials": ["Stress & Strain", "Bending & Shear", "Torsion", "Deflection of Beams"],
    "Machine Design": ["Design for Static Loading", "Fatigue Design", "Gears & Bearings", "Joints & Fasteners"],
    "Fluid Mechanics": ["Fluid Statics", "Fluid Dynamics", "Boundary Layers", "Dimensional Analysis"],
    "Heat Transfer": ["Conduction", "Convection", "Radiation", "Heat Exchangers"],
    Thermodynamics: ["Laws of Thermodynamics", "Power Cycles", "Refrigeration Cycles", "Properties of Pure Substances"],
    "Manufacturing Engineering": ["Casting", "Forming", "Machining", "Metrology & Inspection"],
    "Industrial Engineering": ["Production Planning", "Inventory Control", "Operations Research", "Quality Management"],
    "General Aptitude": ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"],
  },
  "GATE BT": {
    "Engineering Mathematics": ["Linear Algebra", "Calculus", "Probability & Statistics", "Differential Equations"],
    "General Biotechnology": ["Biochemistry", "Molecular Biology & Genetics", "Cell Biology", "Microbiology", "Immunology"],
    "Recombinant DNA Technology": ["Cloning Vectors", "Gene Expression", "PCR & Sequencing", "Genetic Engineering Tools"],
    "Plant & Animal Biotechnology": ["Tissue Culture", "Transgenic Plants", "Animal Cell Culture", "Transgenic Animals"],
    "Bioprocess Engineering": ["Fermentation", "Downstream Processing", "Enzyme Kinetics", "Bioreactor Design"],
    "General Aptitude": ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"],
  },
  "NEET-MDS": {
    "General Anatomy & Physiology": ["Head & Neck Anatomy", "Physiology Basics", "Biochemistry Basics"],
    "General Pathology & Microbiology": ["Pathology Basics", "Oral Microbiology", "Immunology"],
    "Dental Anatomy & Oral Histology": ["Tooth Morphology", "Oral Histology", "Embryology"],
    "Dental Materials": ["Restorative Materials", "Impression Materials", "Cements & Ceramics"],
    "Conservative Dentistry & Endodontics": ["Caries Management", "Root Canal Treatment", "Restorative Techniques"],
    Prosthodontics: ["Complete Dentures", "Fixed Prosthodontics", "Removable Partial Dentures"],
    Periodontics: ["Periodontal Disease", "Periodontal Surgery", "Oral Hygiene"],
    "Oral & Maxillofacial Surgery": ["Extractions", "Trauma Management", "Anesthesia"],
    Orthodontics: ["Growth & Development", "Malocclusion", "Appliances"],
    "Pedodontics & Public Health Dentistry": ["Child Dental Care", "Preventive Dentistry", "Community Dentistry"],
  },
  INBDE: {
    "Biomedical Sciences": ["Anatomy & Physiology", "Biochemistry", "Microbiology & Immunology", "Pharmacology"],
    "Behavioral Sciences": ["Patient Communication", "Ethics & Jurisprudence", "Practice Management"],
    "Dental Materials & Instruments": ["Restorative Materials", "Impression Materials", "Instrumentation"],
    "Diagnosis & Treatment Planning": ["Radiographic Interpretation", "Treatment Sequencing", "Risk Assessment"],
    "Oral Health Maintenance": ["Preventive Dentistry", "Periodontal Therapy", "Prosthodontics Basics"],
    "Practice & Patient Management": ["Infection Control", "Emergency Management", "Legal & Ethical Issues"],
  },
  ...PES_PACKS,
};

export const PACK_NAMES = Object.keys(RAW_PACKS);

// Short subject-line descriptions shown under each pack name (ExamPicker,
// Onboarding's pack grid).
export const PACK_DESC = {
  Custom: "Build your own topic list",
  JEE: "Physics, Chemistry, Maths",
  NEET: "Physics, Chemistry, Biology",
  "SAT/ACT": "Math, Reading & Writing",
  "A-Levels": "Maths, Physics, Chemistry",
  GCSEs: "Maths, English, Science",
  Gaokao: "Maths, Chinese, English",
  "GRE/GMAT": "Quant, Verbal",
  Placements: "CS, ECE, Mech, DSA, Aptitude",
  "UPSC CSE": "History, Polity, Economy, Environment, CSAT",
  CFA: "Ethics, Quant, Economics, Equity, Fixed Income, Derivatives",
  MCAT: "Biology, Chemistry, Physics, Psychology, CARS",
  "IELTS/TOEFL": "Listening, Reading, Writing, Speaking",
  CPA: "Auditing, Business Concepts, Financial Reporting, Regulation",
  "GATE CS": "Digital Logic, Architecture, DSA, Algorithms, TOC, Compilers, OS, DBMS, Networks, Aptitude",
  "GATE ECE": "Networks, Electronics, Signals, Control, Comm",
  "GATE ME": "Thermo, Fluid Mechanics, SOM, Design, Manufacturing",
  "GATE BT": "Biochemistry, Molecular Biology, Bioprocess Eng",
  "NEET-MDS": "Dental Anatomy, Prosthodontics, Periodontics, Surgery",
  INBDE: "Biomedical Sciences, Clinical Dentistry, Patient Care",
  "PES CSE/AIML Sem 1": "Python, Electrical Eng, Environmental Studies, Maths I, Mechanical Eng, Physics",
  "PES CSE/AIML Sem 2": "C Programming, Engineering Mechanics, Chemistry, Electronic Principles, Maths II, Constitution & Ethics",
  "PES CSE/AIML Sem 3": "Digital Design, Data Structures & Algorithms, Maths for CSE, Automata Theory, Web Tech",
  "PES CSE/AIML Sem 4": "Computer Networks, Design & Analysis of Algorithms, Linear Algebra, Microprocessors, OS, CIE",
  "PES CSE/AIML Sem 5": "DBMS, Machine Learning, Software Engineering, AI for Industry, and more",
  "PES CSE/AIML Sem 6": "Cloud Computing, Compiler Design, Object Oriented Analysis & Design",
  "PES ECE Sem 1": "Python, Electrical Eng, Environmental Studies, Maths I, Mechanical Eng, Physics",
  "PES ECE Sem 2": "C Programming, Engineering Mechanics, Chemistry, Electronic Principles, Maths II, Constitution & Ethics",
  "PES ECE Sem 3": "Maths for Electronics, Signals & Systems, Digital Design, Analog Circuits, Networks, Innovation & Entrepreneurship I",
  "PES ECE Sem 4": "DSP, VLSI Design, Control Systems, EM Field Theory, Linear Algebra, Innovation & Entrepreneurship II",
  "PES ECE Sem 5": "Digital Communication, Computer Networks, Computer Organization, Embedded Systems, and more",
  "PES ECE Sem 6": "High Performance Computing, Transmission Lines & Antennas, Project Work, and more",
};

// Two-letter badges shown on Onboarding's pack picker buttons.
export const PACK_ICON = {
  Custom: "CU",
  JEE: "JE",
  NEET: "NE",
  "SAT/ACT": "SA",
  "A-Levels": "AL",
  GCSEs: "GC",
  Gaokao: "GK",
  "GRE/GMAT": "GR",
  Placements: "PL",
  "UPSC CSE": "UP",
  CFA: "CF",
  MCAT: "MC",
  "IELTS/TOEFL": "IE",
  CPA: "CP",
  "GATE CS": "GS",
  "GATE ECE": "GE",
  "GATE ME": "GM",
  "GATE BT": "GB",
  "NEET-MDS": "ND",
  INBDE: "IN",
  "PES CSE/AIML Sem 1": "C1",
  "PES CSE/AIML Sem 2": "C2",
  "PES CSE/AIML Sem 3": "C3",
  "PES CSE/AIML Sem 4": "C4",
  "PES CSE/AIML Sem 5": "C5",
  "PES CSE/AIML Sem 6": "C6",
  "PES ECE Sem 1": "E1",
  "PES ECE Sem 2": "E2",
  "PES ECE Sem 3": "E3",
  "PES ECE Sem 4": "E4",
  "PES ECE Sem 5": "E5",
  "PES ECE Sem 6": "E6",
};

// Display-only labels for exam pack keys. The keys themselves (e.g.
// "A-Levels") are stored as-is in Supabase/localStorage and used to key
// into PortionTracker's subject/topic config, so they can't be renamed
// without a data migration — this just controls what's shown on screen.
const EXAM_PACK_LABELS = {
  "A-Levels": "A Levels",
};

export function examPackLabel(key) {
  return EXAM_PACK_LABELS[key] || key;
}
