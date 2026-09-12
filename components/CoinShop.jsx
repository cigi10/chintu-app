"use client";
import "@/styles/shop.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Companion from "@/components/Companion";
import { getData, setData } from "@/lib/storage";
import { hydrateCoins, setCoins as persistCoins } from "@/lib/coins";
import { ITEMS, CATEGORIES, itemById, migrateEquippedSlots } from "@/lib/shopItems";

const SHOP_KEY = "shop_ownership";
const LEGACY_SHOP_KEY = "chintu-shop"; // pre-cloud-sync key name
const DEFAULT_SHOP = { owned: [], equipped: {} };

const ART_THUMBS = {
  glasses:       "/companion/icons/glasses.PNG",
  scarf:         "/companion/icons/scarf.PNG",
  bowtie:        "/companion/icons/bowtie.PNG",
  headphones:    "/companion/icons/headphones.PNG",
  socks:         "/companion/icons/socks.PNG",
  flowers_yellow:"/companion/icons/flowers_yellow.PNG",
  leaves:        "/companion/icons/leaves.PNG",
  necktie_pink:  "/companion/icons/necktie_pink.PNG",
  pearls:        "/companion/icons/pearls.PNG",
  sweater_red:   "/companion/icons/sweater_red.PNG",
};

function loadLocalShop() {
  try {
    const raw = localStorage.getItem(SHOP_KEY) ?? localStorage.getItem(LEGACY_SHOP_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      owned: Array.isArray(parsed?.owned) ? parsed.owned : [],
      equipped: migrateEquippedSlots(parsed?.equipped),
    };
  } catch {
    return { owned: [], equipped: {} };
  }
}

function sanitizeShop(raw) {
  if (!raw || typeof raw !== "object") return DEFAULT_SHOP;
  return {
    owned: Array.isArray(raw.owned) ? raw.owned : [],
    equipped: migrateEquippedSlots(raw.equipped),
  };
}

async function saveShop(s) {
  await setData(SHOP_KEY, s);
  window.dispatchEvent(new Event("chintu-shop-change"));
}

export default function CoinShop() {
  const [coins, setCoins]     = useState(0);
  const [shop, setShop]       = useState(DEFAULT_SHOP);
  // Mirrors shop.equipped's { slot: itemId } shape, but only ever lives in
  // local state — trying something on never touches owned/equipped data or
  // the cloud, so it costs nothing and reverts the instant it's cleared.
  const [preview, setPreview] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cloudCoins, cloudShop] = await Promise.all([
        hydrateCoins(),
        getData(SHOP_KEY, loadLocalShop()),
      ]);
      if (cancelled) return;
      const safeShop = sanitizeShop(cloudShop);
      setCoins(cloudCoins);
      setShop(safeShop);
      try { localStorage.setItem(SHOP_KEY, JSON.stringify(safeShop)); } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  function buy(item) {
    if (coins < item.cost || shop.owned.includes(item.id)) return;
    const newCoins = coins - item.cost;
    // If they were already trying it on, keep it on rather than snapping
    // back to whatever (or nothing) was equipped before — buying should
    // feel like keeping what's on, not resetting it.
    const wasPreviewing = preview[item.slot] === item.id;
    const newEquipped = wasPreviewing ? { ...shop.equipped, [item.slot]: item.id } : shop.equipped;
    const newShop = { ...shop, owned: [...shop.owned, item.id], equipped: newEquipped };
    setCoins(newCoins); setShop(newShop);
    if (wasPreviewing) clearPreview(item.slot);
    persistCoins(newCoins); saveShop(newShop);
  }

  function toggleEquip(item) {
    const isEquipped = shop.equipped[item.slot] === item.id;
    const newEquipped = { ...shop.equipped };
    if (isEquipped) delete newEquipped[item.slot]; else newEquipped[item.slot] = item.id;
    const newShop = { ...shop, equipped: newEquipped };
    setShop(newShop); saveShop(newShop);
  }

  function togglePreview(item) {
    setPreview(prev => {
      const isPreviewing = prev[item.slot] === item.id;
      const next = { ...prev };
      if (isPreviewing) delete next[item.slot]; else next[item.slot] = item.id;
      return next;
    });
  }

  function clearPreview(slot) {
    setPreview(prev => {
      if (!(slot in prev)) return prev;
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }

  // One display item per slot: whatever's being previewed in that slot
  // wins over what's actually equipped there, same as the old singular
  // logic — just applied per-slot instead of to one shared slot, so
  // trying on a hat doesn't hide an already-equipped pair of glasses.
  const allSlots = [...new Set([...Object.keys(shop.equipped), ...Object.keys(preview)])];
  const displayItemsBySlot = allSlots
    .map(slot => itemById(preview[slot] || shop.equipped[slot]))
    .filter(Boolean);
  const previewItems = Object.values(preview)
    .map(id => itemById(id))
    .filter(Boolean);

  return (
    <div>
      <div className="shop__coin-bar">
        <div className="shop__coin-badge">{coins} coins</div>
      </div>

      <div className="shop__layout">
        {/* Room preview */}
        <div className="shop__room">
          <h2 className="shop__room-title">Your Room</h2>
          <div className="shop__room-companion-wrap">
            <Companion
              mood="happy"
              accessories={displayItemsBySlot.map(item => item.art)}
            />
          </div>
          {previewItems.map(item => (
            <div key={item.slot} className="shop__preview-banner">
              Trying on {item.name}
              <button
                className="shop__preview-banner-clear"
                onClick={() => clearPreview(item.slot)}
              >
                Clear
              </button>
            </div>
          ))}
        </div>

        {/* Catalog */}
        <div className="shop__catalog">
          {CATEGORIES.map(cat => (
            <div key={cat.slot} className="shop__category">
              <h3 className="shop__category-title">{cat.label}</h3>
              <div className="shop__item-grid">
                {ITEMS.filter(i => i.slot === cat.slot).map(item => {
                  const owned     = shop.owned.includes(item.id);
                  const equipped  = shop.equipped[item.slot] === item.id;
                  const previewing = preview[item.slot] === item.id;
                  const affordable = coins >= item.cost;
                  return (
                    <div
                      key={item.id}
                      className={`shop__item-card${equipped ? " shop__item-card--equipped" : ""}${previewing ? " shop__item-card--previewing" : ""}`}
                    >
                      <div className="shop__item-icon">
                        <Image src={ART_THUMBS[item.art]} alt="" className="shop__item-icon-img" fill sizes="48px" />
                      </div>
                      <div className="shop__item-name">{item.name}</div>
                      <div className="shop__item-cost">{item.cost} coins</div>
                      {!owned ? (
                        <div className="shop__item-actions">
                          <button
                            className={`shop__item-tryon-btn${previewing ? " shop__item-tryon-btn--active" : ""}`}
                            onClick={() => togglePreview(item)}
                          >
                            {previewing ? "Trying on" : "Try on"}
                          </button>
                          <button
                            className="shop__item-buy-btn"
                            disabled={!affordable}
                            onClick={() => buy(item)}
                          >
                            {affordable ? "Buy" : "Locked"}
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`shop__item-equip-btn${equipped ? " shop__item-equip-btn--active" : ""}`}
                          onClick={() => toggleEquip(item)}
                        >
                          {equipped ? "Unequip" : "Equip"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}