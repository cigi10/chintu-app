"use client";
import "@/styles/tracker.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";

const STATUS_ORDER = ["not-started", "in-progress", "done", "needs-revision"];
const STATUS_META = {
  "not-started":    { icon: "○", label: "Not started" },
  "in-progress":    { icon: "◑", label: "In progress" },
  "done":           { icon: "●", label: "Done" },
  "needs-revision": { icon: "↺", label: "Needs revision" },
};

function nextStatus(current) {
  const i = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

function makeTopics(names) {
  return names.map((name, i) => ({
    id: `${name}-${i}`,
    name,
    status: "not-started",
    subtopics: [],
  }));
}

const RAW_PACKS = {
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
    "Aptitude & HR": ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "HR Interview Prep", "Resume & Projects"],
  },
};

const PACK_NAMES = Object.keys(RAW_PACKS);

function buildFreshSubjects(packName) {
  if (packName === "Custom") return {};
  const subjects = {};
  for (const [subject, topicNames] of Object.entries(RAW_PACKS[packName] || {})) {
    subjects[subject] = makeTopics(topicNames);
  }
  return subjects;
}

function subjectProgress(topics) {
  if (!topics || topics.length === 0) return 0;
  const done = topics.filter(t => t.status === "done").length;
  return Math.round((done / topics.length) * 100);
}

function overallProgress(subjects) {
  const all = Object.values(subjects).flat();
  if (all.length === 0) return 0;
  const done = all.filter(t => t.status === "done").length;
  return Math.round((done / all.length) * 100);
}

function moodFromProgress(pct) {
  if (pct >= 80) return "happy";
  if (pct >= 40) return "studying";
  if (pct > 0)   return "waiting";
  return "worried";
}

function addCoins(amount) {
  try {
    const current = parseInt(localStorage.getItem("chintu-coins") || "0", 10);
    localStorage.setItem("chintu-coins", String(current + amount));
  } catch {}
}

function ExamPicker({ onPick }) {
  const DESC = {
    JEE: "Physics, Chemistry, Maths",
    NEET: "Physics, Chemistry, Biology",
    "SAT/ACT": "Math, Reading & Writing",
    "A-Levels": "Maths, Physics, Chemistry",
    GCSEs: "Maths, English, Science",
    Gaokao: "Maths, Chinese, English",
    "GRE/GMAT": "Quant, Verbal",
    Placements: "CS, ECE, DSA, Aptitude",
    Custom: "Build your own topic list",
  };
  const options = [...PACK_NAMES, "Custom"];
  return (
    <div className="exam-picker">
      <p className="exam-picker__prompt">Which exam are you preparing for?</p>
      <div className="exam-picker__list">
        {options.map(key => (
          <button key={key} className="exam-picker__btn" onClick={() => onPick(key)}>
            <div className="exam-picker__btn-name">{key}</div>
            <div className="exam-picker__btn-desc">{DESC[key]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PortionTracker() {
  const [examType, setExamType]       = useState(null);
  const [subjects, setSubjects]       = useState({});
  const [newTopic, setNewTopic]       = useState("");
  const [newSubject, setNewSubject]   = useState("");
  const [newSubtopic, setNewSubtopic] = useState({});
  const [expanded, setExpanded]       = useState({});
  const [celebrating, setCelebrating] = useState(false);
  const [celebratingSubject, setCelebratingSubject] = useState("");
  const [pendingSwitch, setPendingSwitch] = useState(false);

  useEffect(() => {
    try {
      const savedPack     = localStorage.getItem("chintu-exam-pack");
      const savedSubjects = localStorage.getItem("chintu-subjects");
      if (savedPack) {
        setExamType(savedPack);
        setSubjects(savedSubjects ? JSON.parse(savedSubjects) : buildFreshSubjects(savedPack));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!examType) return;
    try {
      localStorage.setItem("chintu-exam-pack", examType);
      localStorage.setItem("chintu-subjects", JSON.stringify(subjects));
    } catch {}
  }, [examType, subjects]);

  function pickExam(packName) {
    setExamType(packName);
    setSubjects(buildFreshSubjects(packName));
  }

  function cycleStatus(subject, topicId) {
    setSubjects(prev => {
      const wasFullyDone = subjectProgress(prev[subject]) === 100;
      const topics = prev[subject].map(t => {
        if (t.id !== topicId) return t;
        const newStat = nextStatus(t.status);
        if (newStat === "done" && t.status !== "done") addCoins(5);
        return { ...t, status: newStat };
      });
      const isNowFullyDone = subjectProgress(topics) === 100;
      if (!wasFullyDone && isNowFullyDone) {
        addCoins(25);
        setCelebratingSubject(subject);
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
      }
      return { ...prev, [subject]: topics };
    });
  }

  function cycleSubtopicStatus(subject, topicId, subtopicId) {
    setSubjects(prev => {
      const topics = prev[subject].map(t => {
        if (t.id !== topicId) return t;
        const subtopics = (t.subtopics || []).map(s => {
          if (s.id !== subtopicId) return s;
          return { ...s, status: nextStatus(s.status) };
        });
        return { ...t, subtopics };
      });
      return { ...prev, [subject]: topics };
    });
  }

  function addSubtopic(subject, topicId) {
    const text = (newSubtopic[topicId] || "").trim();
    if (!text) return;
    setSubjects(prev => {
      const topics = prev[subject].map(t => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subtopics: [...(t.subtopics || []), { id: `${text}-${Date.now()}`, name: text, status: "not-started" }],
        };
      });
      return { ...prev, [subject]: topics };
    });
    setNewSubtopic(prev => ({ ...prev, [topicId]: "" }));
  }

  function addTopic() {
    if (!newTopic.trim()) return;
    const subjectKey = newSubject.trim() || "Custom Topics";
    setSubjects(prev => {
      const existing = prev[subjectKey] || [];
      return {
        ...prev,
        [subjectKey]: [...existing, { id: `${newTopic}-${Date.now()}`, name: newTopic.trim(), status: "not-started", subtopics: [] }],
      };
    });
    setNewTopic("");
  }

  function removeTopic(subject, topicId) {
    setSubjects(prev => ({ ...prev, [subject]: prev[subject].filter(t => t.id !== topicId) }));
  }

  function toggleExpand(topicId) {
    setExpanded(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  }

  if (!examType) return <ExamPicker onPick={pickExam} />;

  const overall = overallProgress(subjects);
  const mood = celebrating ? "celebrating" : moodFromProgress(overall);

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {celebrating && (
        <div className="tracker__celebration-banner">
          <p className="tracker__celebration-text">
            {celebratingSubject} complete! +25 coins
          </p>
        </div>
      )}

      <div className="tracker__top-bar">
        <div className="tracker__exam-badge">{examType} — {overall}% complete</div>
        <button className="tracker__switch-btn" onClick={() => setPendingSwitch(true)}>Switch exam</button>
      </div>

      {pendingSwitch && (
        <div className="tracker__warning">
          <p>Switching packs will reset your current progress. Are you sure?</p>
          <div className="tracker__warning-actions">
            <button className="tracker__warning-confirm" onClick={() => { setPendingSwitch(false); setExamType(null); setSubjects({}); }}>Yes, switch</button>
            <button className="tracker__warning-cancel" onClick={() => setPendingSwitch(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="tracker__companion-wrap">
        <Companion mood={mood} />
      </div>

      <div className="tracker__add-row">
        <input className="tracker__add-input" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject (optional)" />
        <input className="tracker__add-input" value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && addTopic()} placeholder="Add a custom topic..." />
        <button className="tracker__add-btn" onClick={addTopic}>Add</button>
      </div>

      {Object.entries(subjects).map(([subject, topics]) => (
        <div key={subject} className="tracker__subject">
          <div className="tracker__subject-header">
            <h3 className="tracker__subject-name">{subject}</h3>
            <span className="tracker__subject-pct">{subjectProgress(topics)}%</span>
          </div>
          <div className="tracker__progress-bar-bg">
            <div className="tracker__progress-bar-fill" style={{ width: `${subjectProgress(topics)}%` }} />
          </div>
          <div className="tracker__topic-list">
            {topics.map(t => (
              <div key={t.id} className="tracker__topic-block">
                <div className="tracker__topic-row">
                  <button className="tracker__topic-btn" onClick={() => cycleStatus(subject, t.id)}>
                    <span className="tracker__topic-icon">{STATUS_META[t.status].icon}</span>
                    <span className="tracker__topic-name">{t.name}</span>
                  </button>
                  <button className="tracker__topic-expand" onClick={() => toggleExpand(t.id)}>
                    {expanded[t.id] ? "−" : "+"}
                  </button>
                  <button className="tracker__topic-remove" onClick={() => removeTopic(subject, t.id)}>×</button>
                </div>

                {expanded[t.id] && (
                  <div className="tracker__subtopic-block">
                    {(t.subtopics || []).map(s => (
                      <div key={s.id} className="tracker__subtopic-row">
                        <button className="tracker__subtopic-btn" onClick={() => cycleSubtopicStatus(subject, t.id, s.id)}>
                          <span className="tracker__topic-icon">{STATUS_META[s.status].icon}</span>
                          <span className="tracker__topic-name">{s.name}</span>
                        </button>
                      </div>
                    ))}
                    <div className="tracker__subtopic-add-row">
                      <input
                        className="tracker__add-input tracker__add-input--small"
                        value={newSubtopic[t.id] || ""}
                        onChange={e => setNewSubtopic(prev => ({ ...prev, [t.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && addSubtopic(subject, t.id)}
                        placeholder="Add subtopic..."
                      />
                      <button className="tracker__add-btn" onClick={() => addSubtopic(subject, t.id)}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}