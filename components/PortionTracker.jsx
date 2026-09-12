"use client";
import "@/styles/tracker.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";
import { getGoalsForDate, hydrateGoals } from "@/lib/goals";
import { addCoins } from "@/lib/coins";
import {
  hydrateTracker,
  getSessionLog,
  saveExamPackAndSubjects,
  getAllTags,
  addCustomTag,
  setTopicTags,
  importPackTopics,
} from "@/lib/tracker";
import { upsertTodoForTopic } from "@/lib/todos";
import { RAW_PACKS, PACK_NAMES, PACK_DESC, examPackLabel } from "@/lib/examPacks";
import { COUNTRIES, packsForCountry } from "@/lib/examRegions";

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

function ExamPicker({ onPick }) {
  const [country, setCountry] = useState(null);

  if (!country) {
    return (
      <div className="exam-picker">
        <p className="exam-picker__prompt">Where are you studying from?</p>
        <div className="exam-picker__list">
          {COUNTRIES.map(c => (
            <button key={c.key} className="exam-picker__btn" onClick={() => setCountry(c.key)}>
              <div className="exam-picker__btn-name">{c.key}</div>
              <div className="exam-picker__btn-desc">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const options = ["Custom", ...packsForCountry(country, PACK_NAMES)];
  return (
    <div className="exam-picker">
      <p className="exam-picker__prompt">Which exam are you preparing for?</p>
      <div className="exam-picker__list">
        {options.map(key => (
          <button key={key} className="exam-picker__btn" onClick={() => onPick(key)}>
            <div className="exam-picker__btn-name">{examPackLabel(key)}</div>
            <div className="exam-picker__btn-desc">{PACK_DESC[key]}</div>
          </button>
        ))}
      </div>
      <button className="exam-picker__back" onClick={() => setCountry(null)}>← Change region</button>
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

  // Tags: a topic can carry several ("GATE CS", "Placements", "Personal"),
  // so several overlapping goals live in one merged list instead of one
  // pack at a time. See lib/tracker.js for the tag/import data model.
  const [allTags, setAllTags]           = useState([]);
  const [activeTag, setActiveTag]       = useState("All");
  const [editingTagsFor, setEditingTagsFor] = useState(null); // topic id
  const [newTagInput, setNewTagInput]   = useState("");
  const [showImportPicker, setShowImportPicker] = useState(false);

  useEffect(() => {
    hydrateTracker().then(({ examPack, subjects: savedSubjects }) => {
      if (examPack) {
        setExamType(examPack);
        setSubjects(Object.keys(savedSubjects).length ? savedSubjects : buildFreshSubjects(examPack));
      }
    });
  }, []);

  useEffect(() => {
    if (!examType) return;
    saveExamPackAndSubjects(examType, subjects);
  }, [examType, subjects]);

  useEffect(() => {
    if (!examType) return;
    const log = getSessionLog();
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
    hydrateGoals().then(() => setTodayGoals(getGoalsForDate(new Date())));
  }, []);

  // Keeps the filter-chip list in sync with whatever tags actually exist
  // (custom tags, imported packs, or tags picked up from subjects state).
  useEffect(() => {
    setAllTags(getAllTags());
  }, [subjects]);

  function pickExam(packName) {
    setExamType(packName);
    setSubjects(buildFreshSubjects(packName));
  }

  function handleImportPack(packName) {
    const updated = importPackTopics(packName);
    setSubjects(updated.subjects);
    setShowImportPicker(false);
  }

  function toggleTopicTag(subject, topic, tag) {
    const current = topic.tags || [];
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    const updated = setTopicTags(subject, topic.id, next);
    setSubjects(updated.subjects);
  }

  function createAndApplyTag(subject, topic) {
    const name = newTagInput.trim();
    if (!name) return;
    addCustomTag(name);
    const current = topic.tags || [];
    const updated = current.some(t => t.toLowerCase() === name.toLowerCase())
      ? { subjects }
      : setTopicTags(subject, topic.id, [...current, name]);
    setSubjects(updated.subjects);
    setNewTagInput("");
    setAllTags(getAllTags());
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
    // Adding while a specific tag filter is active tags the new topic
    // with it, matching what you're currently looking at; "All" leaves
    // it untagged since there's no single obvious tag to pick.
    const tags = activeTag !== "All" ? [activeTag] : [];
    setSubjects(prev => ({
      ...prev,
      [subject]: [...(prev[subject] || []), { id: `${text}-${Date.now()}`, name: text, status: "not-started", subtopics: [], tags }],
    }));
    setNewTopicMap(prev => ({ ...prev, [subject]: "" }));
    upsertTodoForTopic(text, subject);
  }

  function createNewSubject() {
    const subjName = newSubjectName.trim();
    const topicName = newSubjectTopic.trim();
    if (!subjName) return;
    const tags = activeTag !== "All" ? [activeTag] : [];
    setSubjects(prev => ({
      ...prev,
      [subjName]: topicName
        ? [{ id: `${topicName}-${Date.now()}`, name: topicName, status: "not-started", subtopics: [], tags }]
        : [],
    }));
    setNewSubjectName("");
    setNewSubjectTopic("");
    setShowNewSubjectForm(false);
    if (topicName) upsertTodoForTopic(topicName, subjName);
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
  // Filtering is topic-level and display-only: subjectProgress/overall
  // above still reflect every topic regardless of the active tag filter.
  // Every subject still renders (header, progress bar, and — importantly
  // — the "add a topic" form) even when nothing in it matches the active
  // filter, so you can add a first topic under a tag to a subject that
  // doesn't have one yet instead of the subject just disappearing.
  const subjectEntries = Object.entries(subjects).map(([subject, topics]) => [
    subject,
    topics,
    activeTag === "All" ? topics : topics.filter(t => (t.tags || []).includes(activeTag)),
  ]);

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
        <div className="tracker__exam-badge">{examPackLabel(examType)} · {overall}% complete</div>
        <button className="tracker__switch-btn" onClick={() => setPendingSwitch(true)}>Switch exam</button>
      </div>

      <div className="tracker__quicklinks">
        <button className="tracker__quicklink-btn" onClick={() => router.push("/timer")}>
          Open Timer
        </button>
        <button className="tracker__quicklink-btn" onClick={() => router.push("/timetable")}>
          View this week&apos;s plan
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
          <span className="tracker__today-goals-label">Today&apos;s goals</span>
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

      {allTags.length > 0 && (
        <div className="tracker__tag-filter-row">
          <button
            className={`tracker__tag-filter-chip${activeTag === "All" ? " tracker__tag-filter-chip--active" : ""}`}
            onClick={() => setActiveTag("All")}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tracker__tag-filter-chip${activeTag === tag ? " tracker__tag-filter-chip--active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {subjectEntries.length === 0 && !showNewSubjectForm && (
        <p className="tracker__empty-hint">No subjects yet: add your first one below.</p>
      )}

      {subjectEntries.map(([subject, topics, visibleTopics]) => (
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
            {activeTag !== "All" && visibleTopics.length === 0 && (
              <p className="tracker__empty-hint tracker__empty-hint--inline">
                Nothing tagged &quot;{activeTag}&quot; in {subject} yet — add one below.
              </p>
            )}
            {visibleTopics.map(t => {
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
                        {(t.tags || []).map(tag => (
                          <span key={tag} className="tracker__tag-pill">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <button
                      className="tracker__topic-study-btn"
                      onClick={() => router.push(`/timer?subject=${encodeURIComponent(t.name)}`)}
                    >
                      Study
                    </button>
                    <button
                      className="tracker__topic-tag-btn"
                      onClick={() => setEditingTagsFor(prev => prev === t.id ? null : t.id)}
                      aria-label="Edit tags"
                      title="Edit tags"
                    >
                      🏷
                    </button>
                    <button
                      className="tracker__topic-expand"
                      onClick={() => toggleExpand(t.id)}
                      aria-label={expanded[t.id] ? "Collapse topic" : "Expand topic"}
                    >
                      {expanded[t.id] ? "−" : "+"}
                    </button>
                    <button className="tracker__topic-remove" onClick={() => removeTopic(subject, t.id)} aria-label="Remove topic">×</button>
                  </div>

                  {editingTagsFor === t.id && (
                    <div className="tracker__tag-editor">
                      {allTags.map(tag => {
                        const active = (t.tags || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            className={`tracker__tag-chip${active ? " tracker__tag-chip--active" : ""}`}
                            onClick={() => toggleTopicTag(subject, t, tag)}
                          >
                            {tag}
                          </button>
                        );
                      })}
                      <div className="tracker__tag-editor-new">
                        <input
                          className="tracker__add-input tracker__add-input--small"
                          value={newTagInput}
                          onChange={e => setNewTagInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && createAndApplyTag(subject, t)}
                          placeholder="New tag..."
                        />
                        <button className="tracker__add-btn" onClick={() => createAndApplyTag(subject, t)}>Add</button>
                      </div>
                    </div>
                  )}

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
          <div className="tracker__bottom-actions">
            <button className="tracker__new-subject-btn" onClick={() => setShowNewSubjectForm(true)}>
              + Add a new subject
            </button>
            <button className="tracker__new-subject-btn" onClick={() => setShowImportPicker(true)}>
              + Import another exam pack
            </button>
          </div>
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

      {showImportPicker && (
        <div className="tracker__warning">
          <p>
            Import a pack&apos;s topics into your current list — subjects merge together, and a topic
            already in your list gets tagged with both instead of being duplicated.
          </p>
          <ExamPicker onPick={handleImportPack} />
          <button className="tracker__warning-cancel" onClick={() => setShowImportPicker(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}