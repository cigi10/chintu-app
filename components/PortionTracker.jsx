"use client";
import "@/styles/tracker.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";
import { getGoalsForDate } from "@/lib/goals";

const SESSION_LOG_KEY = "chintu-session-log";

const STATUS_ORDER = ["not-started", "in-progress", "done", "migrated", "cancelled", "question"];
const STATUS_LABEL = {
  "not-started": "Not started",
  "in-progress": "In progress",
  "done":        "Done",
  "migrated":    "Migrated",
  "cancelled":   "Cancelled",
  "question":    "Unclear",
};
const BULLET_CONTENT = {
  "not-started": "",
  "in-progress": "",
  "done":        "✓",
  "migrated":    "→",
  "cancelled":   "✕",
  "question":    "?",
};

function nextStatus(current) {
  const i = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

function loadSessionLog() {
  try { return JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || "[]"); } catch { return []; }
}
function minutesForTopic(log, topicName) {
  return log.filter(s => (s.subject || "").toLowerCase() === topicName.toLowerCase())
             .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
}
function minutesForSubject(log, topics) {
  const names = topics.map(t => t.name.toLowerCase());
  return log.filter(s => names.includes((s.subject || "").toLowerCase()))
             .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
}
function formatMinutes(total) {
  if (!total) return "0m logged";
  const h = Math.floor(total / 60), m = total % 60;
  return h > 0 ? `${h}h ${m}m logged` : `${m}m logged`;
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
    Custom: "Build your own topic list",
    JEE: "Physics, Chemistry, Maths",
    NEET: "Physics, Chemistry, Biology",
    "SAT/ACT": "Math, Reading & Writing",
    "A-Levels": "Maths, Physics, Chemistry",
    GCSEs: "Maths, English, Science",
    Gaokao: "Maths, Chinese, English",
    "GRE/GMAT": "Quant, Verbal",
    Placements: "CS, ECE, DSA, Aptitude",
  };
  const options = ["Custom", ...PACK_NAMES];
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
  const router = useRouter();
  const [examType, setExamType]       = useState(null);
  const [subjects, setSubjects]       = useState({});
  const [sessionLog, setSessionLog]   = useState([]);
  const [newTopicMap, setNewTopicMap] = useState({});
  const [newSubtopic, setNewSubtopic] = useState({});
  const [expanded, setExpanded]       = useState({});
  const [celebrating, setCelebrating] = useState(false);
  const [celebratingSubject, setCelebratingSubject] = useState("");
  const [pendingSwitch, setPendingSwitch] = useState(false);
  const [todayGoals, setTodayGoals]   = useState([]);

  const [showNewSubjectForm, setShowNewSubjectForm] = useState(false);
  const [newSubjectName, setNewSubjectName]   = useState("");
  const [newSubjectTopic, setNewSubjectTopic] = useState("");

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

  useEffect(() => {
    if (!examType) return;
    const log = loadSessionLog();
    setSessionLog(log);
    setSubjects(prev => {
      let changed = false;
      const updated = {};
      for (const [subj, topics] of Object.entries(prev)) {
        updated[subj] = topics.map(t => {
          if (t.status === "not-started" && minutesForTopic(log, t.name) > 0) {
            changed = true;
            return { ...t, status: "in-progress" };
          }
          return t;
        });
      }
      return changed ? updated : prev;
    });
  }, [examType]);

  useEffect(() => {
    setTodayGoals(getGoalsForDate(new Date()));
  }, []);

  function pickExam(packName) {
    setExamType(packName);
    setSubjects(buildFreshSubjects(packName));
  }

  function cycleTopicStatus(subject, topicId) {
    setSubjects(prev => {
      const wasFullyDone = subjectProgress(prev[subject]) === 100;
      const topics = prev[subject].map(t => {
        if (t.id !== topicId) return t;
        const newStatus = nextStatus(t.status);
        if (newStatus === "done" && t.status !== "done") addCoins(5);
        return { ...t, status: newStatus };
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
        const subtopics = (t.subtopics || []).map(s =>
          s.id !== subtopicId ? s : { ...s, status: nextStatus(s.status) }
        );
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

  function addTopicToSubject(subject) {
    const text = (newTopicMap[subject] || "").trim();
    if (!text) return;
    setSubjects(prev => ({
      ...prev,
      [subject]: [...(prev[subject] || []), { id: `${text}-${Date.now()}`, name: text, status: "not-started", subtopics: [] }],
    }));
    setNewTopicMap(prev => ({ ...prev, [subject]: "" }));
  }

  function createNewSubject() {
    const subjName = newSubjectName.trim();
    const topicName = newSubjectTopic.trim();
    if (!subjName) return;
    setSubjects(prev => ({
      ...prev,
      [subjName]: topicName
        ? [{ id: `${topicName}-${Date.now()}`, name: topicName, status: "not-started", subtopics: [] }]
        : [],
    }));
    setNewSubjectName("");
    setNewSubjectTopic("");
    setShowNewSubjectForm(false);
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
  const subjectEntries = Object.entries(subjects);

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

      <div className="tracker__quicklinks">
        <button className="tracker__quicklink-btn" onClick={() => router.push("/timer")}>
          Open Timer
        </button>
        <button className="tracker__quicklink-btn" onClick={() => router.push("/timetable")}>
          View this week's plan
        </button>
        <button className="tracker__quicklink-btn" onClick={() => router.push("/dashboard")}>
          Back to Home
        </button>
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

      {todayGoals.length > 0 && (
        <div className="tracker__today-goals">
          <span className="tracker__today-goals-label">Today's goals</span>
          <div className="tracker__today-goals-list">
            {todayGoals.map(g => (
              <button
                key={g.id}
                className="tracker__today-goal-chip"
                onClick={() => router.push(`/timer?subject=${encodeURIComponent(g.subject)}&duration=${g.durationMinutes}&goalId=${g.id}`)}
                title={`Study ${g.subject} for ${g.durationMinutes}m`}
              >
                <span className="tracker__goal-dot" style={{ backgroundColor: g.color }} />
                {g.subject}
                <span className="tracker__today-goal-mins">{g.durationMinutes}m</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {subjectEntries.length === 0 && !showNewSubjectForm && (
        <p className="tracker__empty-hint">No subjects yet: add your first one below.</p>
      )}

      {subjectEntries.map(([subject, topics]) => (
        <div key={subject} className="tracker__subject">
          <div className="tracker__subject-header">
            <div className="tracker__subject-name-row">
              <h3 className="tracker__subject-name">{subject}</h3>
              <button
                className="tracker__subject-study-btn"
                onClick={() => router.push(`/timer?subject=${encodeURIComponent(subject)}`)}
              >
                Study
              </button>
            </div>
            <span className="tracker__subject-pct">
              {subjectProgress(topics)}% · {formatMinutes(minutesForSubject(sessionLog, topics))}
            </span>
          </div>
          <div className="tracker__progress-bar-bg">
            <div className="tracker__progress-bar-fill" style={{ width: `${subjectProgress(topics)}%` }} />
          </div>

          <div className="tracker__topic-list">
            {topics.map(t => {
              const isCancelled = t.status === "cancelled";
              return (
                <div key={t.id} className="tracker__topic-block">
                  <div className="tracker__topic-row">
                    <button
                      className={`tracker__bullet tracker__bullet--${t.status}`}
                      onClick={() => cycleTopicStatus(subject, t.id)}
                      aria-label={STATUS_LABEL[t.status]}
                      title={STATUS_LABEL[t.status]}
                    >
                      {BULLET_CONTENT[t.status]}
                    </button>

                    <div className="tracker__topic-name-wrap">
                      <span className={`tracker__topic-name${isCancelled ? " tracker__topic-name--cancelled" : ""}`}>
                        {t.name}
                      </span>
                      <div className="tracker__topic-meta">
                        {t.status !== "not-started" && (
                          <span className={`tracker__status-pill tracker__status-pill--${t.status}`}>
                            {STATUS_LABEL[t.status]}
                          </span>
                        )}
                        <span className="tracker__topic-time">{formatMinutes(minutesForTopic(sessionLog, t.name))}</span>
                      </div>
                    </div>

                    <button
                      className="tracker__topic-study-btn"
                      onClick={() => router.push(`/timer?subject=${encodeURIComponent(t.name)}`)}
                    >
                      Study
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
                            <span
                              className={`tracker__bullet tracker__bullet--sub tracker__bullet--${s.status}`}
                              title={STATUS_LABEL[s.status]}
                            >
                              {BULLET_CONTENT[s.status]}
                            </span>
                            <span className={`tracker__topic-name${s.status === "cancelled" ? " tracker__topic-name--cancelled" : ""}`}>
                              {s.name}
                            </span>
                          </button>
                          {/* Same wiring as topics: pushes subject to Timer so it logs to
                              session history and shows up in stats. */}
                          <span className="tracker__subtopic-time">{formatMinutes(minutesForTopic(sessionLog, s.name))}</span>
                          <button
                            className="tracker__subtopic-study-btn"
                            onClick={() => router.push(`/timer?subject=${encodeURIComponent(s.name)}`)}
                          >
                            Study
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
              );
            })}
          </div>

          <div className="tracker__add-topic-row">
            <input
              className="tracker__add-input"
              value={newTopicMap[subject] || ""}
              onChange={e => setNewTopicMap(prev => ({ ...prev, [subject]: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addTopicToSubject(subject)}
              placeholder={`Add a topic to ${subject}...`}
            />
            <button className="tracker__add-btn" onClick={() => addTopicToSubject(subject)}>Add</button>
          </div>
        </div>
      ))}

      <div className="tracker__new-subject-block">
        {!showNewSubjectForm ? (
          <button className="tracker__new-subject-btn" onClick={() => setShowNewSubjectForm(true)}>
            + Add a new subject
          </button>
        ) : (
          <div className="tracker__new-subject-form">
            <p className="tracker__new-subject-title">New subject</p>
            <input
              className="tracker__add-input"
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
              placeholder="Subject name (e.g. Economics)"
              autoFocus
            />
            <input
              className="tracker__add-input"
              value={newSubjectTopic}
              onChange={e => setNewSubjectTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createNewSubject()}
              placeholder="First topic (optional)"
            />
            <div className="tracker__new-subject-actions">
              <button className="tracker__add-btn" onClick={createNewSubject} disabled={!newSubjectName.trim()}>
                Create subject
              </button>
              <button className="tracker__new-subject-cancel" onClick={() => { setShowNewSubjectForm(false); setNewSubjectName(""); setNewSubjectTopic(""); }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}