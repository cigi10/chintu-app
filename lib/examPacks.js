// Single source of truth for exam pack data: the subject/topic tree used by
// the Portion Tracker, plus display metadata (short descriptions, onboarding
// icons) used by both PortionTracker and Onboarding. Keys are stored as-is
// in Supabase/localStorage and used to key into subject/topic config, so
// they can't be renamed without a data migration.

export const RAW_PACKS = {
  JEE: {
    Physics:   ["Kinematics", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Gravitation", "Thermodynamics", "Electrostatics", "Current Electricity", "Magnetism", "Optics", "Modern Physics"],
    Chemistry: ["Mole Concept", "Atomic Structure", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Electrochemistry", "Organic Basics", "Hydrocarbons", "Coordination Compounds", "Periodic Table"],
    Maths:     ["Sets & Functions", "Quadratic Equations", "Sequences & Series", "Trigonometry", "Coordinate Geometry", "Limits & Derivatives", "Integration", "Vectors", "Probability", "Matrices & Determinants"],
  },
  NEET: {
    Physics:   ["Kinematics", "Laws of Motion", "Work & Energy", "Gravitation", "Thermodynamics", "Electrostatics", "Current Electricity", "Optics", "Modern Physics"],
    Chemistry: ["Mole Concept", "Chemical Bonding", "Equilibrium", "Organic Basics", "Biomolecules", "Coordination Compounds", "Electrochemistry"],
    Biology:   ["Cell Structure", "Genetics", "Human Physiology", "Plant Physiology", "Ecology", "Evolution", "Reproduction", "Biotechnology", "Human Health & Disease"],
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
    "Digital Logic": ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits", "Number Representation"],
    "Computer Organization & Architecture": ["Machine Instructions", "ALU & Datapath", "Pipelining", "Memory Hierarchy"],
    "Programming & Data Structures": ["Programming in C", "Arrays & Stacks", "Linked Lists", "Trees & Graphs", "Hashing"],
    Algorithms: ["Asymptotic Analysis", "Sorting & Searching", "Divide & Conquer", "Greedy & DP", "Graph Algorithms"],
    "Theory of Computation": ["Regular Languages", "Context-Free Languages", "Turing Machines", "Undecidability"],
    "Compiler Design": ["Lexical Analysis", "Parsing", "Syntax-Directed Translation", "Code Optimization"],
    "Operating Systems": ["Processes & Threads", "Synchronization", "Memory Management", "File Systems", "Deadlocks"],
    Databases: ["ER Model", "Relational Algebra", "SQL", "Normalization", "Transactions & Concurrency"],
    "Computer Networks": ["OSI & TCP/IP", "Routing", "Congestion Control", "Application Layer Protocols"],
  },
  "GATE ECE": {
    "Engineering Mathematics": ["Linear Algebra", "Calculus", "Differential Equations", "Probability & Statistics", "Complex Variables"],
    Networks: ["Network Theorems", "Two-Port Networks", "Transient Analysis", "AC Circuits"],
    "Electronic Devices": ["Semiconductor Physics", "Diodes", "BJT & MOSFET", "Fabrication Basics"],
    "Analog Circuits": ["Amplifiers", "Op-Amps", "Feedback & Oscillators", "Power Supplies"],
    "Digital Circuits": ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits", "Semiconductor Memories"],
    "Signals and Systems": ["LTI Systems", "Fourier Analysis", "Laplace & Z-Transform", "Sampling"],
    "Control Systems": ["Transfer Functions", "Time Response", "Stability Analysis", "Frequency Response"],
    Communications: ["Analog Modulation", "Digital Modulation", "Information Theory", "Noise in Communication"],
    Electromagnetics: ["Electrostatics", "Maxwell's Equations", "Transmission Lines", "Waveguides & Antennas"],
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
  },
  "GATE BT": {
    "Engineering Mathematics": ["Linear Algebra", "Calculus", "Probability & Statistics", "Differential Equations"],
    "General Biotechnology": ["Biochemistry", "Molecular Biology & Genetics", "Cell Biology", "Microbiology", "Immunology"],
    "Recombinant DNA Technology": ["Cloning Vectors", "Gene Expression", "PCR & Sequencing", "Genetic Engineering Tools"],
    "Plant & Animal Biotechnology": ["Tissue Culture", "Transgenic Plants", "Animal Cell Culture", "Transgenic Animals"],
    "Bioprocess Engineering": ["Fermentation", "Downstream Processing", "Enzyme Kinetics", "Bioreactor Design"],
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
  "GATE CS": "CS Core, DSA, TOC, OS, DBMS, Networks",
  "GATE ECE": "Networks, Electronics, Signals, Control, Comm",
  "GATE ME": "Thermo, Fluid Mechanics, SOM, Design, Manufacturing",
  "GATE BT": "Biochemistry, Molecular Biology, Bioprocess Eng",
  "NEET-MDS": "Dental Anatomy, Prosthodontics, Periodontics, Surgery",
  INBDE: "Biomedical Sciences, Clinical Dentistry, Patient Care",
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
