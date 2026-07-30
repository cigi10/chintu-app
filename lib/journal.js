// lib/journal.js
// Single source of truth for journal entries, written from Journal.jsx.
import { getData, setData } from "@/lib/storage";

const JOURNAL_KEY = "journal";
const LEGACY_JOURNAL_KEY = "chintu-journal"; // pre-cloud-sync key name

export function getLocalJournal() {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY) ?? localStorage.getItem(LEGACY_JOURNAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Pulls the cloud entries down so a returning user on a new device/browser
// doesn't see an empty journal.
export async function hydrateJournal() {
  try {
    const cloud = await getData(JOURNAL_KEY, getLocalJournal());
    const entries = cloud || {};
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    return entries;
  } catch {
    return getLocalJournal();
  }
}

export async function saveJournal(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  await setData(JOURNAL_KEY, entries);
}
