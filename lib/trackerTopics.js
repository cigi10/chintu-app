// Reads the Tracker's subject/topic/subtopic tree straight out of localStorage
// so other pages (like Timetable) can suggest real topic names for assignment.
// Since this reads live each time it's called, deleting a topic in the
// Tracker means it simply won't appear here anymore — nothing to sync.
const SUBJECTS_KEY = "chintu-subjects";

export function getAllTrackerTopicNames() {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    if (!raw) return [];
    const subjects = JSON.parse(raw);
    const names = new Set();

    for (const [subjectName, topics] of Object.entries(subjects)) {
      if (subjectName) names.add(subjectName);
      for (const t of topics || []) {
        if (t.name) names.add(t.name);
        for (const s of t.subtopics || []) {
          if (s.name) names.add(s.name);
        }
      }
    }

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}