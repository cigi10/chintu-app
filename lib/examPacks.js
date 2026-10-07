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

export const PES_PACKS = {
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

// General Aptitude, common to every GATE paper: the four sections of the
// GA syllabus in the GATE 2027 information brochure.
const GATE_GA = ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"];

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
  // GATE packs: subject names are the official GATE 2027 section names,
  // character for character, in the order each syllabus PDF lists them
  // (PACK_SYLLABUS_URL below links the PDFs; docs/gate2027-facts.md records
  // the section names). Topics follow the syllabus text under each section,
  // with no additions. ME and BT sections are broad, so their topics carry
  // subtopics. General Aptitude is common to every paper; its four
  // sections are from the GA syllabus in the GATE 2027 information
  // brochure. Renaming a subject only affects packs picked after the
  // change: a tracker keeps the names it was created with.
  "GATE CS": {
    "Engineering Mathematics": [
      "Propositional and First Order Logic",
      "Sets, Relations, Functions, Partial Orders and Lattices",
      "Monoids and Groups",
      "Graphs (Connectivity, Matching, Colouring)",
      "Combinatorics (Counting, Recurrence Relations, Generating Functions)",
      "Linear Algebra (Matrices, Determinants, Linear Systems, Eigenvalues, LU Decomposition)",
      "Calculus (Limits, Continuity, Differentiability, Maxima and Minima, Mean Value Theorem, Integration)",
      "Probability and Statistics (Random Variables, Distributions, Mean, Median, Mode, Standard Deviation, Conditional Probability, Bayes Theorem)",
    ],
    "Digital Logic": [
      "Boolean Algebra and Minimization (Algebraic, Karnaugh Map, Tabular Method)",
      "Combinational Circuit Design",
      "Sequential Circuit Design",
      "Number Representation and Arithmetic (Fixed and Floating Point)",
    ],
    "Computer Organization and Architecture": [
      "Instruction Set and Addressing Modes",
      "ALU Design",
      "Control Unit Design (Hardwired and Microprogrammed)",
      "Memory Interfacing and Hierarchy (Performance, Cache Memory Mapping)",
      "I/O Interface (Interrupt and DMA)",
      "Instruction Pipelining and Pipeline Hazards",
    ],
    "Programming and Data Structures": [
      "Programming in C",
      "Recursion",
      "Arrays",
      "Stacks",
      "Queues",
      "Linked Lists",
      "Trees and Binary Search Trees",
      "Binary Heaps",
      "Graphs",
    ],
    Algorithms: [
      "Searching",
      "Sorting",
      "Hashing",
      "Asymptotic Worst Case Time and Space Complexity",
      "Greedy Algorithms",
      "Dynamic Programming",
      "Divide and Conquer",
      "Graph Traversals",
      "Minimum Spanning Trees",
      "Shortest Paths",
    ],
    "Theory of Computation": [
      "Regular Expressions and Finite Automata",
      "Context-Free Grammars and Push-Down Automata",
      "Regular and Context-Free Languages, Pumping Lemma",
      "Turing Machines and Undecidability",
    ],
    "Compiler Design": [
      "Lexical Analysis",
      "Parsing",
      "Syntax-Directed Translation",
      "Runtime Environments",
      "Intermediate Code Generation",
      "Local Optimisation",
      "Data Flow Analyses (Constant Propagation, Liveness, Common Subexpression Elimination)",
    ],
    "Operating System": [
      "System Calls",
      "Processes and Threads",
      "Inter-Process Communication",
      "Concurrency and Synchronization",
      "Deadlock",
      "CPU and I/O Scheduling",
      "Memory Management and Virtual Memory",
      "File Systems",
    ],
    Databases: [
      "ER Model",
      "Relational Algebra and Tuple Calculus",
      "SQL",
      "Integrity Constraints and Normal Forms",
      "File Organization and Indexing (B and B+ Trees)",
      "Transactions and Concurrency Control",
    ],
    "Computer Networks": [
      "Principles of Layering",
      "Switching (Circuit, Packet, Virtual Circuit) and Performance Metrics",
      "Data Link Layer (Error Detection, Medium Access Control, Ethernet)",
      "Routing (Distance Vector and Link State)",
      "IPv4 (Fragmentation, CIDR Notation, Network Address Translation)",
      "TCP (Flow Control, Congestion Control, Socket API)",
      "DNS and HTTP",
    ],
    "General Aptitude": GATE_GA,
  },
  "GATE ECE": {
    "Engineering Mathematics": [
      "Linear Algebra",
      "Calculus",
      "Differential Equations",
      "Vector Analysis",
      "Complex Analysis",
      "Probability and Statistics",
    ],
    "Networks, Signals and Systems": [
      "Circuit Analysis (Node and Mesh, Superposition, Thevenin, Norton, Reciprocity)",
      "Sinusoidal Steady State (Phasors, Complex Power, Maximum Power Transfer)",
      "RL, RC and RLC Circuits in Time and Frequency Domain (Laplace Transform)",
      "Two-Port Network Parameters and Wye-Delta Transformation",
      "LTI Systems (Causality, Stability, Impulse Response, Convolution, Poles and Zeros, Frequency Response, Group and Phase Delay)",
      "Continuous-Time Signals (Fourier Series, Fourier Transform, Sampling and Reconstruction)",
      "Discrete-Time Signals (DTFT, DFT, z-Transform, FIR and IIR Filter Design)",
    ],
    "Electronic Devices": [
      "Energy Bands, Intrinsic and Extrinsic Semiconductors, Equilibrium Carrier Concentration",
      "Direct and Indirect Band-Gap Semiconductors",
      "Carrier Transport (Drift, Diffusion, Mobility, Generation and Recombination, Poisson and Continuity Equations)",
      "P-N Junction and Zener Diode",
      "BJT",
      "MOS Capacitor and MOSFET (including Scaling)",
      "LED, Photodiode and Solar Cell",
    ],
    "Analog Circuits": [
      "Diode Circuits (Clipping, Clamping, Rectifiers)",
      "BJT and MOSFET Amplifiers (Biasing, AC Coupling, Small Signal Analysis, Frequency Response)",
      "Current Mirrors and Differential Amplifiers",
      "Op-Amp Circuits (Amplifiers, Summers, Differentiators, Integrators)",
      "Active Filters, Schmitt Trigger and Oscillators",
      "Dominant-Pole (Miller) Compensation and Phase Margin",
    ],
    "Digital Circuits": [
      "Number Representations (Binary, Integer, Floating Point)",
      "Combinatorial Circuits (Boolean Algebra, Karnaugh Map, Static CMOS Gates, Arithmetic Circuits, Code Converters, Multiplexers, Decoders)",
      "Sequential Circuits (Latches, Flip-Flops, Counters, Shift Registers, Finite State Machines)",
      "Timing (Propagation Delay, Setup and Hold Time, Critical Path Delay)",
      "Data Converters (Sample and Hold, ADCs, DACs)",
      "Semiconductor Memories (ROM, SRAM, DRAM)",
      "Computer Organization (Instructions, Addressing Modes, ALU, Datapath and Control Unit, Pipelining)",
    ],
    "Control Systems": [
      "Control System Components and Feedback Principle",
      "Transfer Function, Block Diagrams and Signal Flow Graphs",
      "Transient and Steady-State Analysis",
      "Frequency Response",
      "Routh-Hurwitz and Nyquist Stability Criteria",
      "Bode and Root-Locus Plots",
      "Compensators and PID Controller",
      "State Variable Model and State Equations",
    ],
    Communications: [
      "Random Processes (Autocorrelation, Power Spectral Density, White Noise, Filtering through LTI Systems)",
      "Analog Communications (AM, FM, Their Spectra, Superheterodyne Receivers)",
      "Information Theory (Entropy, Source Coding, Mutual Information, Channel Capacity)",
      "Digital Communications (PCM, DPCM, ASK, PSK, FSK, QAM, ISI, MAP and ML Detection, Matched Filter, SNR and BER)",
      "Error Correction (Hamming Codes, CRC)",
    ],
    Electromagnetics: [
      "Maxwell's Equations, Boundary Conditions, Wave Equation, Poynting Vector",
      "Plane Waves (Reflection, Refraction, Polarization, Phase and Group Velocity, Skin Depth)",
      "Transmission Lines (Characteristic Impedance, Impedance Matching, S-Parameters, Smith Chart)",
      "Rectangular and Circular Waveguides",
      "Light Propagation in Optical Fibers",
      "Dipole and Monopole Antennas, Linear Antenna Arrays",
    ],
    "General Aptitude": GATE_GA,
  },
  "GATE EE": {
    "Engineering Mathematics": [
      "Linear Algebra",
      "Calculus (including Fourier Series and Vector Integral Theorems)",
      "Differential Equations",
      "Complex Variables",
      "Probability and Statistics",
    ],
    "Electric circuits": [
      "Network Elements (Ideal and Dependent Sources, R, L, C, M)",
      "KCL, KVL, Node and Mesh Analysis",
      "Network Theorems (Thevenin, Norton, Superposition, Maximum Power Transfer)",
      "Transient Response of DC and AC Networks",
      "Sinusoidal Steady-State Analysis and Resonance",
      "Two-Port Networks",
      "Balanced Three-Phase Circuits and Star-Delta Transformation",
      "Complex Power and Power Factor",
    ],
    "Electromagnetic Fields": [
      "Coulomb's Law, Electric Field Intensity and Electric Flux Density",
      "Gauss's Law and Divergence",
      "Field and Potential of Point, Line, Plane and Spherical Charges",
      "Dielectrics and Capacitance",
      "Biot-Savart's Law, Ampere's Law and Curl",
      "Faraday's Law and Lorentz Force",
      "Inductance, Magnetomotive Force, Reluctance and Magnetic Circuits",
    ],
    "Signals and Systems": [
      "Continuous and Discrete Time Signals (Shifting and Scaling)",
      "Linear Time Invariant and Causal Systems",
      "Fourier Series of Periodic Signals",
      "Sampling Theorem",
      "Fourier Transform",
      "Laplace Transform and Z Transform",
      "RMS and Average Values of Periodic Waveforms",
    ],
    "Electrical Machines": [
      "Single-Phase Transformer",
      "Three-Phase Transformers and Auto-Transformer",
      "Electromechanical Energy Conversion",
      "DC Machines",
      "Three-Phase Induction Machines",
      "Single-Phase Induction Motors",
      "Synchronous Machines",
      "Losses and Efficiency",
    ],
    "Power Systems": [
      "Power Generation Concepts and AC and DC Transmission",
      "Transmission Lines and Cables",
      "Economic Load Dispatch",
      "Series and Shunt Compensation",
      "Insulators and Distribution Systems",
      "Per-Unit Quantities and Bus Admittance Matrix",
      "Load Flow (Gauss-Seidel and Newton-Raphson)",
      "Voltage and Frequency Control, Power Factor Correction",
      "Symmetrical Components and Fault Analysis",
      "Protection and Circuit Breakers",
      "System Stability and Equal Area Criterion",
    ],
    "Control Systems": [
      "Mathematical Modelling, Feedback Principle and Transfer Function",
      "Block Diagrams and Signal Flow Graphs",
      "Transient and Steady-State Analysis",
      "Routh-Hurwitz and Nyquist Stability Criteria",
      "Bode Plots and Root Loci",
      "Lag, Lead and Lead-Lag Compensators",
      "P, PI and PID Controllers",
      "State Space Model and State Equations",
    ],
    "Electrical and Electronic Measurements": [
      "Bridges and Potentiometers",
      "Measurement of Voltage, Current, Power, Energy and Power Factor",
      "Instrument Transformers",
      "Digital Voltmeters and Multimeters",
      "Phase, Time and Frequency Measurement",
      "Oscilloscopes",
      "Error Analysis",
    ],
    "Analog and Digital Electronics": [
      "Diode Circuits (Clipping, Clamping, Rectifiers)",
      "Amplifiers (Biasing, Equivalent Circuit, Frequency Response)",
      "Oscillators and Feedback Amplifiers",
      "Operational Amplifiers (Characteristics and Applications)",
      "Active Filters (Single Stage, Sallen Key, Butterworth)",
      "VCOs and Timers",
      "Combinatorial and Sequential Logic Circuits, Multiplexers, Demultiplexers",
      "Schmitt Triggers, Sample and Hold Circuits, A/D and D/A Converters",
    ],
    "Power Electronics": [
      "Thyristor, MOSFET and IGBT (V-I Characteristics, Firing and Gating Circuits)",
      "DC to DC Converters (Buck, Boost, Buck-Boost)",
      "Uncontrolled Rectifiers (Single and Three Phase)",
      "Voltage and Current Commutated Thyristor Converters",
      "Bidirectional AC to DC Voltage Source Converters",
      "Line Current Harmonics, Power Factor and Distortion Factor",
      "Voltage and Current Source Inverters, Sinusoidal PWM",
    ],
    "General Aptitude": GATE_GA,
  },
  "GATE ME": {
    "Engineering Mathematics": [
      "Linear Algebra",
      "Calculus",
      "Differential Equations",
      "Complex Variables",
      "Probability and Statistics",
      "Numerical Methods",
    ],
    "Applied Mechanics and Design": [
      { name: "Engineering Mechanics", subtopics: ["Free-Body Diagrams and Equilibrium", "Friction and Its Applications", "Plane Trusses and Frames", "Virtual Work", "Kinematics and Dynamics of Rigid Bodies in Plane Motion", "Impulse, Momentum and Energy Formulations"] },
      { name: "Mechanics of Materials", subtopics: ["Stress, Strain and Elastic Constants", "2D Stress and Strain Transformation, Mohr's Circle", "Thin-Walled Pressure Vessels", "Shear Force and Bending Moment Diagrams", "Bending and Shear Stresses, Shear Centre", "Deflection of Beams", "Torsion of Circular Shafts", "Euler's Theory of Columns", "Energy Methods and Thermal Stresses", "Strain Gauges and Rosettes", "Mechanical Properties of Materials"] },
      { name: "Theory of Machines", subtopics: ["Analysis of Plane Mechanisms", "Dynamic Analysis of Linkages", "Cams", "Gears and Gear Trains", "Flywheels and Governors", "Balancing of Reciprocating and Rotating Masses", "Gyroscope"] },
      { name: "Vibrations", subtopics: ["Free and Forced Vibration (One and Two Degrees of Freedom)", "Damping", "Vibration Isolation and Transmissibility", "Resonance and Critical Speeds of Shafts", "Control System, PID Controller, Transfer Function"] },
      { name: "Machine Design", subtopics: ["Static and Dynamic Loading, Failure Theories", "Fatigue Strength and the S-N Diagram", "Bolted, Riveted and Welded Joints", "Shafts, Gears and Belt Drives", "Rolling and Sliding Contact Bearings", "Brakes, Clutches and Springs"] },
    ],
    "Fluid Mechanics and Thermal Sciences": [
      { name: "Fluid Mechanics", subtopics: ["Fluid Properties and Fluid Statics", "Forces on Submerged Bodies, Stability of Floating Bodies", "Control-Volume Analysis", "Continuity and Momentum Equations, Velocity Potential", "Bernoulli's Equation", "Dimensional Analysis", "Viscous Flow, Boundary Layer, Turbulent Flow", "Pipe Flow and Head Losses", "Compressible Flow and Nozzles"] },
      { name: "Heat Transfer", subtopics: ["Conduction and Fins", "Unsteady Conduction, Lumped Parameter System", "Convection and Heat Transfer Correlations", "Boiling and Condensation", "Heat Exchangers (LMTD and NTU)", "Radiation"] },
      { name: "Thermodynamics", subtopics: ["Systems, Processes and Pure Substances", "Ideal and Real Gases", "Zeroth, First and Second Laws", "Work, Heat, Energy and Entropy Changes", "Closed and Open System Analysis", "Availability and Irreversibility", "Thermodynamic Relations"] },
      { name: "Applications", subtopics: ["Power Engineering (Vapour and Gas Power Cycles)", "I.C. Engines (Otto, Diesel and Dual Cycles)", "Basics of Combustion", "Refrigeration and Air-Conditioning", "Psychrometrics", "Turbomachinery"] },
    ],
    "Materials, Manufacturing and Industrial Engineering": [
      { name: "Engineering Materials", subtopics: ["Crystal Structure", "Phase Diagrams and Heat Treatment", "Metals, Alloys, Polymers, Composites and Ceramics", "Engineering and True Stress-Strain Diagrams"] },
      { name: "Casting, Forming and Joining Processes", subtopics: ["Casting Processes, Patterns, Moulds and Cores", "Solidification, Riser and Gating Design, Casting Defects", "Plastic Deformation and Yield Criteria", "Bulk and Sheet Forming", "Powder Metallurgy", "Welding, Brazing, Soldering and Adhesive Bonding", "Non-Destructive Testing"] },
      { name: "Machining and Machine Tool Operations", subtopics: ["Machining Operations and Machine Tools", "Cutting Tool Geometry (ASA and ORS)", "Mechanics of Machining", "Tool Materials, Tool Life and Tool Wear", "Economics of Machining", "Abrasive and Non-Traditional Machining", "Jigs and Fixtures"] },
      { name: "Additive Manufacturing", subtopics: ["Additive Manufacturing Processes", "Advantages, Limitations and Applications"] },
      { name: "Metrology and Inspection", subtopics: ["Limits, Fits and Tolerances", "Linear and Angular Measurements", "Comparators and Interferometry", "Form and Finish Measurement", "Alignment and Testing Methods", "Tolerance Analysis", "Coordinate Measuring Machine"] },
      { name: "Computer Aided Manufacturing and Automation", subtopics: ["CAD/CAM", "NC/CNC Machines and CNC Programming", "Pneumatic, Electro-Pneumatic and Hydraulic Actuators", "Programmable Logic Controllers"] },
      { name: "Production Planning and Control", subtopics: ["Work Study and Productivity", "Forecasting Models", "Aggregate Production Planning and Scheduling", "Materials Requirement Planning", "Six Sigma and Lean Manufacturing", "Inventory Control", "Quality and Reliability"] },
      { name: "Operations Research", subtopics: ["Linear Programming and Simplex Method", "Transportation and Assignment", "Network Flow Models", "Simple Queuing Models", "PERT and CPM"] },
    ],
    "General Aptitude": GATE_GA,
  },
  "GATE BT": {
    "Engineering Mathematics": [
      "Linear Algebra",
      "Calculus",
      "Differential Equations",
      "Probability and Statistics",
      "Numerical Methods",
    ],
    "General Biology": [
      { name: "Biochemistry", subtopics: ["Biomolecules", "Biological Membranes and Transport", "Metabolism and Its Regulation", "Glycolysis, Citric Acid Cycle and Fatty Acid Oxidation", "Photosynthesis, Respiration and Electron Transport Chain", "Enzymes, Enzyme Kinetics and Inhibition"] },
      { name: "Microbiology", subtopics: ["Bacterial Classification, Cell Wall and Archaea", "Methods in Microbiology", "Microbial Growth and Nutrition", "Operons (Lac, Trp, Ara) and Nitrogen Fixation", "Microbial Diseases and Host-Pathogen Interactions", "Antibiotics and Antimicrobial Resistance", "Two-Component Systems and Bacterial Communication", "Viruses"] },
      { name: "Immunology", subtopics: ["Lymphoid Organs, Innate Immunity and Inflammation", "Cytokines, Chemokines and Complement", "Cellular and Humoral Immunity", "Antibody Diversity, Polyclonal and Monoclonal Antibodies", "T-Cell and B-Cell Development, Memory Responses", "MHC, Antigen Processing and Presentation", "Regulation, Tolerance, Hypersensitivity and Autoimmunity", "Immunodeficiency and Graft vs Host Disease", "Immunization and Vaccines"] },
    ],
    "Genetics, Cellular and Molecular Biology": [
      { name: "Genetics and Evolutionary Biology", subtopics: ["Mendelian Inheritance, Gene Interaction, Complementation", "Linkage, Recombination and Chromosome Mapping", "Extra-Chromosomal Inheritance", "Microbial Genetics and Bacterial Gene Mapping", "Horizontal Gene Transfer and Transposable Elements", "Chromosomal Variation, Sex Determination, Genetic Disorders", "Population Genetics and Epigenetics", "Selection, Evolution, Genetic Drift and Speciation"] },
      { name: "Cell Biology", subtopics: ["Eukaryotic Cell Structure", "Cell Cycle and Cell Growth Control", "Cell-Cell Communication and Signal Transduction", "Post-Translational Modifications and Protein Trafficking", "Cell Death and Autophagy", "Extra-Cellular Matrix"] },
      { name: "Molecular Biology", subtopics: ["Genes and Chromosomes", "Mutations and Mutagenesis", "Replication, Transcription, Splicing and Translation", "Regulation of Gene Expression", "Non-Coding RNA and RNA Interference", "DNA Damage and Repair"] },
    ],
    "Fundamentals of Biological Engineering": [
      { name: "Bioreaction Engineering", subtopics: ["Rate Laws, Zero and First Order Kinetics", "Enzyme Kinetics and Inhibition", "Ideal Reactors (Batch, Mixed Flow, Plug Flow)", "Enzyme Immobilization and Diffusion Effects", "Kinetics of Cell Growth and Product Formation", "Batch, Fed-Batch and Continuous Processes", "Microbial and Enzyme Reactors, Optimization and Scale Up"] },
      { name: "Upstream and Downstream Processing", subtopics: ["Media Formulation and Sterilization", "Filtration and Centrifugation", "Cell Disruption", "Chromatography", "Extraction, Adsorption and Drying", "Process Control (Measurement Devices, Valves, Controllers, Tuning)"] },
    ],
    "Plant, Animal and Microbial Biotechnology": [
      { name: "Plants", subtopics: ["Totipotency, Organogenesis and Regeneration", "Plant Growth Regulators and Elicitors", "Tissue Culture and Cell Suspension Culture", "Secondary Metabolites and Hairy Root Culture", "Artificial Seeds and Somaclonal Variation", "Protoplast Fusion, Somatic Hybrids and Cybrids", "Transgenic Plants and Plastid Transformation"] },
      { name: "Animals", subtopics: ["Culture Media and Growth Conditions", "Cell and Tissue Preservation", "Anchorage-Dependent and Independent Culture", "Micro and Macro-Carrier Culture", "Hybridoma Technology", "Stem Cell Technology and Animal Cloning", "Transgenic, Knock-Out and Knock-In Animals"] },
      { name: "Microbes", subtopics: ["Biomass and Primary and Secondary Metabolites", "Production and Purification of Recombinant Proteins", "Clinical, Food and Industrial Microbiology", "Screening Strategies for New Products"] },
    ],
    "Recombinant DNA technology and Other Tools in Biotechnology": [
      { name: "Recombinant DNA Technology", subtopics: ["Restriction and Modification Enzymes", "Vectors and Expression Vectors", "cDNA and Genomic DNA Libraries", "Gene Isolation, Cloning and Recombinant Protein Production", "Transposons, Gene Targeting and Recombination-Based Cloning"] },
      { name: "Molecular Tools", subtopics: ["Polymerase Chain Reaction", "Labelling and Sequencing (Sanger and Next Generation)", "Southern and Northern Blotting, In-Situ Hybridization", "DNA Fingerprinting, RAPD, RFLP", "Site-Directed Mutagenesis and CRISPR-Cas", "Biosensing and Biosensors", "Interaction Tools, Genomics and Proteomics"] },
      { name: "Analytical Tools", subtopics: ["Microscopy", "Spectroscopy", "Electrophoresis and Microarrays", "Enzymatic Assays and Immunoassays", "Immunoblotting and Flow Cytometry", "Whole Genome and ChIP Sequencing"] },
      { name: "Computational Tools", subtopics: ["Bioinformatics Resources and Databases", "Sequence Analysis, Alignment and Phylogeny", "Genomics, Proteomics, Metabolomics and Gene Prediction", "Functional Annotation and Structure Prediction", "Metagenomics, Metabolic Engineering and Systems Biology"] },
    ],
    "General Aptitude": GATE_GA,
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
  "GATE CS": "Digital Logic, Architecture, Data Structures, Algorithms, TOC, Compilers, OS, Databases, Networks",
  "GATE ECE": "Networks and Signals, Devices, Analog, Digital, Control, Communications, EM",
  "GATE EE": "Circuits, EM Fields, Signals, Machines, Power Systems, Control, Measurements, Power Electronics",
  "GATE ME": "Applied Mechanics and Design, Fluids and Thermal Sciences, Manufacturing and Industrial",
  "GATE BT": "Biology, Genetics and Molecular Biology, Bioengineering, Biotech Tools",
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
  "GATE EE": "EE",
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

// The official GATE 2027 syllabus PDF behind each GATE pack, shown in the
// Portion Tracker next to the pack name.
const gateSyllabus = code => `https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/${code}_GATE2027_Syllabus.pdf`;
export const PACK_SYLLABUS_URL = {
  "GATE CS": gateSyllabus("CS"),
  "GATE ECE": gateSyllabus("EC"),
  "GATE EE": gateSyllabus("EE"),
  "GATE ME": gateSyllabus("ME"),
  "GATE BT": gateSyllabus("BT"),
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
