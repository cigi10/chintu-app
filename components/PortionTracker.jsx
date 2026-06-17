"use client";
// components/PortionTracker.jsx
// Syllabus tracker for JEE, NEET, or self-added Placement topics.
// 4-state cycle per topic, per-subject progress bars, overall progress
// drives Chintu's mood (+ a sparkle effect near 100%).

import { useState, useEffect } from "react";
import Chintu from "@/components/Chintu";

const STORAGE_KEY = "chintu-tracker";

const JEE_SYLLABUS = {
  Physics: [
    "Units & Measurements", "Kinematics", "Laws of Motion",
    "Work, Energy & Power", "Rotational Motion", "Gravitation",
    "Solids & Fluids", "Thermodynamics", "Oscillations & Waves",
    "Electrostatics & Capacitance", "Current Electricity & Magnetism",
    "Optics & Modern Physics",
  ],
  Chemistry: [
    "Mole Concept & Stoichiometry", "Atomic Structure", "Chemical Bonding",
    "States of Matter", "Thermodynamics", "Equilibrium",
    "Redox & Electrochemistry", "Chemical Kinetics",
    "Periodic Table & Periodicity", "Coordination Compounds",
    "Organic Chemistry Basics", "Hydrocarbons & Functional Groups",
  ],
  Maths: [
    "Sets, Relations & Functions", "Complex Numbers", "Quadratic Equations",
    "Sequences & Series", "Permutations & Combinations", "Binomial Theorem",
    "Matrices & Determinants", "Limits, Continuity & Differentiability",
    "Application of Derivatives", "Integral Calculus",
    "Coordinate Geometry", "Vectors & 3D Geometry",
  ],
};

const NEET_SYLLABUS = {
  Physics: [
    "Units & Measurements", "Kinematics", "Laws of Motion",
    "Work, Energy & Power", "Rotational Motion", "Gravitation",
    "Thermodynamics", "Oscillations & Waves",
    "Electrostatics & Current Electricity", "Optics & Modern Physics",
  ],
  Chemistry: [
    "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
    "States of Matter & Thermodynamics", "Equilibrium", "Redox Reactions",
    "p-Block Elements", "d and f Block Elements",
    "Organic Chemistry Basics", "Biomolecules & Polymers",
  ],
  Biology: [
    "Diversity in Living World", "Structural Organisation in Animals & Plants",
    "Cell Structure & Function", "Plant Physiology",
    "Human Physiology — Digestion", "Human Physiology — Circulation",
    "Human Physiology — Respiration", "Human Physiology — Excretion",
    "Human Physiology — Nervous System", "Human Physiology — Endocrine System",
    "Reproduction in Organisms", "Human Reproduction",
    "Genetics & Inheritance", "Molecular Basis of Inheritance",
    "Evolution", "Human Health & Disease", "Biotechnology",
    "Ecology & Environment",
  ],
};

const STATUS_ORDER = ["notStarted", "inProgress", "done", "needsRevision"];
const STATUS_META = {
  notStarted:    { icon: "⬜" },
  inProgress:    { icon: "🟡" },
  done:          { icon: "🟢" },
  needsRevision: { icon: "🔄" },
};

function buildInitialSubjects(examType) {
  if (examType === "JEE") return cloneFromSyllabus(JEE_SYLLABUS, "jee");
  if (examType === "NEET") return cloneFromSyllabus(NEET_SYLLABUS, "neet");
  if (examType === "Placements") return { "My Topics": [] };
  return {};
}

function cloneFromSyllabus(syllabus, prefix) {
  const result = {};
  for (const subject of Object.keys(syllabus)) {
    result[subject] = syllabus[subject].map((name, i) => ({
      id: `${prefix}-${subject}-${i}`,
      name,
      status: "notStarted",
    }));
  }
  return result;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function subjectProgress(topics) {
  if (!topics.length) return 0;
  const done = topics.filter(t => t.status === "done").length;
  return Math.round((done / topics.length) * 100);
}

function overallProgress(subjects) {
  const all = Object.values(subjects).flat();
  if (!all.length) return 0;
  const done = all.filter(t => t.status === "done").length;
  return Math.round((done / all.length) * 100);
}

function moodForProgress(p) {
  if (p >= 60) return "happy";
  if (p >= 25) return "studying";
  return "waiting";
}

function ExamPicker({ onPick }) {
  const options = [
    { key: "JEE", label: "JEE", emoji: "📐", desc: "Physics · Chemistry · Maths" },
    { key: "NEET", label: "NEET", emoji: "🧬", desc: "Physics · Chemistry · Biology" },
    { key: "Placements", label: "Placements", emoji: "💻", desc: "Build your own topic list" },
  ];
  return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <p style={{ fontWeight: 700, color: "#92400E", marginBottom: "1.25rem" }}>
        Which exam are you preparing for?
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }}>
        {options.map(o => (
          <button
            key={o.key}
            onClick={() => onPick(o.key)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "14px 18px", borderRadius: "16px",
              border: "2px solid #FEF3C7", backgroundColor: "#FFFBF5",
              cursor: "pointer", textAlign: "left",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>{o.emoji}</span>
            <span>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1C1917" }}>{o.label}</div>
              <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "#92400E" }}>{o.desc}</div>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PortionTracker() {
  const [examType, setExamType] = useState(undefined);
  const [subjects, setSubjects] = useState({});
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.examType) {
      setExamType(saved.examType);
      setSubjects(saved.subjects || {});
    } else {
      setExamType(null);
    }
  }, []);

  function pickExam(type) {
    const fresh = buildInitialSubjects(type);
    setExamType(type);
    setSubjects(fresh);
    saveState({ examType: type, subjects: fresh });
  }

  function switchExam() {
    const ok = window.confirm("Switching exams will reset your current progress. Continue?");
    if (!ok) return;
    setExamType(null);
    setSubjects({});
    localStorage.removeItem(STORAGE_KEY);
  }

  function cycleStatus(subject, id) {
    const updated = { ...subjects };
    updated[subject] = updated[subject].map(t => {
      if (t.id !== id) return t;
      const next = STATUS_ORDER[(STATUS_ORDER.indexOf(t.status) + 1) % STATUS_ORDER.length];
      return { ...t, status: next };
    });
    setSubjects(updated);
    saveState({ examType, subjects: updated });
  }

  function addPlacementTopic() {
    if (!newTopic.trim()) return;
    const updated = { ...subjects };
    const list = updated["My Topics"] || [];
    updated["My Topics"] = [
      ...list,
      { id: crypto.randomUUID(), name: newTopic.trim(), status: "notStarted" },
    ];
    setSubjects(updated);
    saveState({ examType, subjects: updated });
    setNewTopic("");
  }

  function removePlacementTopic(id) {
    const updated = { ...subjects };
    updated["My Topics"] = (updated["My Topics"] || []).filter(t => t.id !== id);
    setSubjects(updated);
    saveState({ examType, subjects: updated });
  }

  if (examType === undefined) return null;
  if (examType === null) return <ExamPicker onPick={pickExam} />;

  const overall = overallProgress(subjects);
  const mood = moodForProgress(overall);
  const showSparkle = overall >= 90;

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#92400E", backgroundColor: "#FEF3C7", borderRadius: "999px", padding: "6px 14px" }}>
          {examType} · {overall}% complete
        </div>
        <button
          onClick={switchExam}
          style={{ fontWeight: 700, fontSize: "0.78rem", color: "#92400E", background: "none", border: "2px solid #FEF3C7", borderRadius: "999px", padding: "6px 14px", cursor: "pointer" }}
        >
          Switch exam
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", position: "relative" }}>
        <div style={{ transform: "scale(0.7)" }}>
          <Chintu mood={mood} />
        </div>
        {showSparkle && (
          <>
            <style>{`
              @keyframes sparkle-pop {
                0%, 100% { opacity: 0.4; transform: scale(0.8); }
                50%      { opacity: 1;   transform: scale(1.3); }
              }
            `}</style>
            {["10%","85%","20%","75%"].map((pos, i) => (
              <span key={i} style={{
                position: "absolute", top: i % 2 === 0 ? "10%" : "70%", left: pos,
                fontSize: "1.2rem", animation: `sparkle-pop ${1.2 + i * 0.3}s ease-in-out infinite`,
              }}>✨</span>
            ))}
          </>
        )}
      </div>

      {examType === "Placements" && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
          <input
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addPlacementTopic()}
            placeholder="e.g. DSA, System Design, GRE Vocab..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "2px solid #FEF3C7", fontFamily: "'Nunito', sans-serif", fontWeight: 600, outline: "none" }}
          />
          <button
            onClick={addPlacementTopic}
            style={{ padding: "10px 18px", borderRadius: "10px", border: "none", backgroundColor: "#F97316", color: "#fff", fontWeight: 800, cursor: "pointer" }}
          >
            Add +
          </button>
        </div>
      )}

      {Object.entries(subjects).map(([subject, topics]) => (
        <div key={subject} style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{ fontWeight: 800, fontSize: "1rem", margin: 0, color: "#1C1917" }}>{subject}</h3>
            <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#F97316" }}>{subjectProgress(topics)}%</span>
          </div>

          <div style={{ height: "8px", backgroundColor: "#FEF3C7", borderRadius: "999px", marginBottom: "10px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${subjectProgress(topics)}%`, backgroundColor: "#F97316", borderRadius: "999px", transition: "width 0.4s ease" }} />
          </div>

          {topics.length === 0 && examType === "Placements" && (
            <p style={{ fontSize: "0.8rem", color: "#A8A29E", fontWeight: 600 }}>
              No topics yet — add what you're studying above.
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {topics.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFBF5", border: "2px solid #FEF3C7", borderRadius: "10px", padding: "8px 12px" }}>
                <button
                  onClick={() => cycleStatus(subject, t.id)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", flex: 1, textAlign: "left", padding: 0 }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{STATUS_META[t.status].icon}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1C1917" }}>{t.name}</span>
                </button>
                {examType === "Placements" && (
                  <button onClick={() => removePlacementTopic(t.id)} style={{ background: "none", border: "none", color: "#D1C5BD", fontSize: "1rem", cursor: "pointer" }}>×</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}