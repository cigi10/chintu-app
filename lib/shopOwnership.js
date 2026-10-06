// lib/shopOwnership.js
//
// Loading and saving shop_ownership ({ owned: [itemId], equipped: { slot:
// itemId } }), shared by the coin shop, the companion and the timer's
// sound settings.
//
// Purchases must never be lost to a failed sync. Every save writes local
// first (lib/storage.js), and a failed cloud write is retried by the
// sign-out flush. On load, a plain cloud-wins read would quietly replace a
// local purchase that never reached the cloud with the older cloud copy,
// so instead: read the cloud strictly, and if it succeeded, keep the
// union of cloud and local purchases (ownership only ever grows). If the
// merge added anything the cloud didn't have, it is written back up. If
// the cloud read failed, the local copy is used as is.
import { readCloudValue, setData } from "@/lib/storage";
import { migrateEquippedSlots } from "@/lib/shopItems";

export const SHOP_KEY = "shop_ownership";
const LEGACY_SHOP_KEY = "chintu-shop"; // pre-cloud-sync key name
export const SHOP_CHANGE_EVENT = "chintu-shop-change";

export function sanitizeShop(raw) {
  if (!raw || typeof raw !== "object") return { owned: [], equipped: {} };
  return {
    owned: Array.isArray(raw.owned) ? [...new Set(raw.owned.filter(id => typeof id === "string"))] : [],
    equipped: migrateEquippedSlots(raw.equipped),
  };
}

export function loadLocalShop() {
  try {
    const raw = localStorage.getItem(SHOP_KEY) ?? localStorage.getItem(LEGACY_SHOP_KEY);
    return sanitizeShop(raw ? JSON.parse(raw) : null);
  } catch {
    return sanitizeShop(null);
  }
}

// Cloud equipped choices win (they may come from another device); owned
// items are the union, in cloud order then any local-only extras.
export function mergeShops(cloud, local) {
  const c = sanitizeShop(cloud);
  const l = sanitizeShop(local);
  const owned = [...c.owned, ...l.owned.filter(id => !c.owned.includes(id))];
  const equipped = Object.keys(c.equipped).length > 0 ? c.equipped : l.equipped;
  return { owned, equipped };
}

export async function hydrateShop() {
  const local = loadLocalShop();
  const cloud = await readCloudValue(SHOP_KEY);
  if (!cloud.ok) return local; // logged out, or the read failed: keep local

  const merged = mergeShops(cloud.value, local);
  try { localStorage.setItem(SHOP_KEY, JSON.stringify(merged)); } catch {}
  const cloudOwned = sanitizeShop(cloud.value).owned;
  if (merged.owned.length > cloudOwned.length) await setData(SHOP_KEY, merged);
  return merged;
}

export async function saveShop(shop) {
  const clean = sanitizeShop(shop);
  const result = await setData(SHOP_KEY, clean);
  try { window.dispatchEvent(new Event(SHOP_CHANGE_EVENT)); } catch {}
  return result;
}
