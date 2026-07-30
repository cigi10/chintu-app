// lib/coins.js
// Single source of truth for reading/writing the coin balance, so CoinShop
// and PortionTracker (which both award coins) can't drift out of sync.
import { getData, setData } from "@/lib/storage";

const COIN_KEY = "coins";
const LEGACY_COIN_KEY = "chintu-coins"; // pre-cloud-sync key name

export function getLocalCoins() {
  try {
    const raw = localStorage.getItem(COIN_KEY);
    if (raw != null) return parseInt(raw, 10) || 0;
    return parseInt(localStorage.getItem(LEGACY_COIN_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

// Pulls the cloud balance down (if signed in) and writes it into the
// "coins" key so every other reader picks it up on their next read.
export async function hydrateCoins() {
  try {
    const cloud = await getData(COIN_KEY, getLocalCoins());
    localStorage.setItem(COIN_KEY, JSON.stringify(cloud));
    return cloud;
  } catch {
    return getLocalCoins();
  }
}

export async function setCoins(amount) {
  await setData(COIN_KEY, amount);
}

export async function addCoins(amount) {
  const next = getLocalCoins() + amount;
  await setCoins(next);
  return next;
}
