// lib/tracker.js
// Single source of truth for the portion tracker's data: exam pack,
// subject/topic tree, session log, and daily/weekly bonus log. These used
// to live under four separate localStorage keys (chintu-exam-pack,
// chintu-subjects, chintu-session-log, chintu-bonus-log), written from
// PortionTracker.jsx and StudyTimer.jsx and read from half a dozen other
// components — but Supabase only has one "tracker" jsonb column for all of
// it, so they're bundled into one blob here.
//
// Tags: each topic can carry a `tags` array (e.g. ["JEE"], or
// ["GATE CS", "Placements"] once a topic has been imported from more than
// one pack) so a user can track several overlapping goals in one merged
// list instead of being locked to a single active pack. `examPack` stays
// as the pack chosen at onboarding (still shown as the primary badge);
// `importedPacks` additionally tracks every pack whose topics have been
// merged in via importPackTopics(); `customTags` holds tags the user
// created themselves that may not be attached to anything yet, so they
// still show up as a filter option.
import { getData, setData } from "@/lib/storage";
import { RAW_PACKS } from "./examPacks";

const TRACKER_KEY = "tracker";
const LEGACY_EXAM_PACK_KEY = "chintu-exam-pack";
const LEGACY_SUBJECTS_KEY = "chintu-subjects";
const LEGACY_SESSION_LOG_KEY = "chintu-session-log";
const LEGACY_BONUS_LOG_KEY = "chintu-bonus-log";

function defaultTracker() {
  return { examPack: null, subjects: {}, sessionLog: [], bonusLog: {}, importedPacks: [], customTags: [] };
}

function normalizeTopicName(name) {
  return (name || "").trim().toLowerCase();
}

// Fills in tags/importedPacks/customTags for trackers saved before this
// concept existed — a topic with no `tags` yet is assumed to belong to
// whatever pack was active, so an existing single-pack user's tracker
// looks exactly the same as before (one implicit tag group) rather than
// having anything disappear or show up untagged.
function migrateTags(tracker) {
  const importedPacks = Array.isArray(tracker.importedPacks)
    ? tracker.importedPacks
    : (tracker.examPack ? [tracker.examPack] : []);
  const customTags = Array.isArray(tracker.customTags) ? tracker.customTags : [];

  const subjects = {};
  for (const [subject, topics] of Object.entries(tracker.subjects || {})) {
    subjects[subject] = (topics || []).map(t =>
      Array.isArray(t.tags) ? t : { ...t, tags: tracker.examPack ? [tracker.examPack] : [] }
    );
  }
  return { ...tracker, importedPacks, customTags, subjects };
}

function readLegacyJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Nothing under the new consolidated key yet — build it once from
// whatever's under the old, separate per-piece keys.
function buildFromLegacyKeys() {
  return {
    examPack: (() => { try { return localStorage.getItem(LEGACY_EXAM_PACK_KEY) || null; } catch { return null; } })(),
    subjects: readLegacyJSON(LEGACY_SUBJECTS_KEY, {}),
    sessionLog: readLegacyJSON(LEGACY_SESSION_LOG_KEY, []),
    bonusLog: readLegacyJSON(LEGACY_BONUS_LOG_KEY, {}),
  };
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (raw) return migrateTags({ ...defaultTracker(), ...JSON.parse(raw) });
  } catch {
    // fall through to legacy read below
  }
  return migrateTags({ ...defaultTracker(), ...buildFromLegacyKeys() });
}

function saveLocal(tracker) {
  try { localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker)); } catch {}
  setData(TRACKER_KEY, tracker); // fire-and-forget cloud sync
}

// Pulls the cloud tracker down (if signed in) so a returning user on a new
// device/browser doesn't see empty subjects/history.
export async function hydrateTracker() {
  try {
    const cloud = await getData(TRACKER_KEY, loadLocal());
    const tracker = migrateTags({ ...defaultTracker(), ...(cloud || {}) });
    localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
    return tracker;
  } catch {
    return loadLocal();
  }
}

export function getLocalTracker() {
  return loadLocal();
}

export function getExamPack() { return getLocalTracker().examPack; }
export function getSubjects() { return getLocalTracker().subjects; }
export function getSessionLog() { return getLocalTracker().sessionLog; }
export function getBonusLog() { return getLocalTracker().bonusLog; }
export function getImportedPacks() { return getLocalTracker().importedPacks; }

// examPack/subjects get re-saved on every tracker change (any topic edit,
// not just picking a pack), so importedPacks is only reset here when
// examPack is genuinely changing — i.e. the first-ever pick, or "Switch
// exam" (which is meant to reset progress, so wiping any multi-pack
// import state along with it is correct, not a side effect to avoid).
export function saveExamPackAndSubjects(examPack, subjects) {
  const tracker = getLocalTracker();
  const isNewPack = !!examPack && examPack !== tracker.examPack;
  tracker.examPack = examPack;
  tracker.subjects = subjects;
  tracker.importedPacks = isNewPack ? [examPack] : tracker.importedPacks;
  saveLocal(tracker);
}

export function appendSessionLogEntry(entry) {
  const tracker = getLocalTracker();
  tracker.sessionLog = [...tracker.sessionLog, entry];
  saveLocal(tracker);
  return tracker.sessionLog;
}

export function saveBonusLog(bonusLog) {
  const tracker = getLocalTracker();
  tracker.bonusLog = bonusLog;
  saveLocal(tracker);
}

/**
 * Every tag currently known to this tracker — customTags the user
 * created, every pack they've imported (a pack name doubles as its
 * topics' default tag), the active examPack, and any tag attached to an
 * actual topic. Sorted for a stable filter-chip order.
 */
export function getAllTags() {
  const tracker = getLocalTracker();
  const set = new Set(tracker.customTags);
  tracker.importedPacks.forEach(p => set.add(p));
  if (tracker.examPack) set.add(tracker.examPack);
  Object.values(tracker.subjects).flat().forEach(t => (t.tags || []).forEach(tag => set.add(tag)));
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Registers a user-defined tag so it shows up as a filter option even
 * before anything is tagged with it. No-ops (case-insensitively) if the
 * tag already exists, whether as a custom tag or one already in use.
 */
export function addCustomTag(tagName) {
  const name = (tagName || "").trim();
  if (!name) return getLocalTracker();

  const tracker = getLocalTracker();
  const alreadyKnown = getAllTags().some(t => t.toLowerCase() === name.toLowerCase());
  if (alreadyKnown) return tracker;

  const updated = { ...tracker, customTags: [...tracker.customTags, name] };
  saveLocal(updated);
  return updated;
}

/** Replaces one topic's tag list outright (dedupes, doesn't merge). */
export function setTopicTags(subject, topicId, tags) {
  const tracker = getLocalTracker();
  const topics = (tracker.subjects[subject] || []).map(t =>
    t.id === topicId ? { ...t, tags: [...new Set((tags || []).map(tag => tag.trim()).filter(Boolean))] } : t
  );
  const updated = { ...tracker, subjects: { ...tracker.subjects, [subject]: topics } };
  saveLocal(updated);
  return updated;
}

/**
 * Merges a whole exam pack's subjects/topics into the user's existing
 * tracker instead of replacing it (that's what "Switch exam" is for).
 * Within a subject, a topic whose name case-insensitively matches one
 * already there is treated as the same topic — the importing pack's name
 * is just added to its tags — rather than creating a duplicate; anything
 * less clear-cut than an exact normalized-name match is left as two
 * separate, separately-tagged topics rather than guessing.
 */
export function importPackTopics(packName) {
  const tracker = getLocalTracker();
  const packSubjects = RAW_PACKS[packName];
  if (!packSubjects) return tracker;

  const subjects = { ...tracker.subjects };
  for (const [subjectName, topicNames] of Object.entries(packSubjects)) {
    const topics = subjects[subjectName] ? [...subjects[subjectName]] : [];
    const indexByName = new Map(topics.map((t, i) => [normalizeTopicName(t.name), i]));

    for (const topicName of topicNames) {
      const key = normalizeTopicName(topicName);
      const idx = indexByName.get(key);
      if (idx != null) {
        const existing = topics[idx];
        if (!(existing.tags || []).includes(packName)) {
          topics[idx] = { ...existing, tags: [...(existing.tags || []), packName] };
        }
      } else {
        topics.push({
          id: `${topicName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: topicName,
          status: "not-started",
          subtopics: [],
          tags: [packName],
        });
        indexByName.set(key, topics.length - 1);
      }
    }
    subjects[subjectName] = topics;
  }

  const importedPacks = tracker.importedPacks.includes(packName)
    ? tracker.importedPacks
    : [...tracker.importedPacks, packName];
  const updated = { ...tracker, subjects, importedPacks };
  saveLocal(updated);
  return updated;
}
