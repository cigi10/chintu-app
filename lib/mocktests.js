// lib/mocktests.js
// Single source of truth for mock test scores, written from MockTests.jsx.
import { getData, setData } from "@/lib/storage";

const MOCK_KEY = "mocktests";
const LEGACY_MOCK_KEY = "chintu-mock-scores"; // pre-cloud-sync key name

export function getLocalMockScores() {
  try {
    const raw = localStorage.getItem(MOCK_KEY) ?? localStorage.getItem(LEGACY_MOCK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Pulls the cloud scores down so a returning user on a new device/browser
// doesn't see an empty history.
export async function hydrateMockScores() {
  try {
    const cloud = await getData(MOCK_KEY, getLocalMockScores());
    const scores = cloud || [];
    localStorage.setItem(MOCK_KEY, JSON.stringify(scores));
    return scores;
  } catch {
    return getLocalMockScores();
  }
}

export async function saveMockScores(scores) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(scores));
  await setData(MOCK_KEY, scores);
}
