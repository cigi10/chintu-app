"use client";
import "@/styles/shop.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Companion from "@/components/Companion";
import { getData, setData } from "@/lib/storage";
import { hydrateCoins, setCoins as persistCoins } from "@/lib/coins";

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

const ITEMS = [
  { id: "glasses",        name: "Little glasses",   cost: 75,  slot: "wearable", art: "glasses"        },
  { id: "scarf",          name: "Tiny scarf",       cost: 100, slot: "wearable", art: "scarf"          },
  { id: "bowtie",         name: "Dapper bowtie",    cost: 90,  slot: "wearable", art: "bowtie"         },
  { id: "headphones",     name: "Study headphones", cost: 140, slot: "wearable", art: "headphones"     },
  { id: "socks",          name: "Cozy socks",       cost: 70,  slot: "wearable", art: "socks"          },
  { id: "flowers_yellow", name: "Flower crown",     cost: 90,  slot: "wearable", art: "flowers_yellow" },
  { id: "leaves",         name: "Falling leaves",   cost: 80,  slot: "wearable", art: "leaves"         },
  { id: "necktie_pink",   name: "Pink bow",         cost: 95,  slot: "wearable", art: "necktie_pink"   },
  { id: "pearls",         name: "Pearl necklace",   cost: 120, slot: "wearable", art: "pearls"         },
  { id: "sweater_red",    name: "Red sweater",      cost: 130, slot: "wearable", art: "sweater_red"    },
];

const CATEGORIES = [
  { slot: "wearable", label: "Wearables" },
];

function loadLocalShop() {
  try {
    const raw = localStorage.getItem(SHOP_KEY) ?? localStorage.getItem(LEGACY_SHOP_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      owned: Array.isArray(parsed?.owned) ? parsed.owned : [],
      equipped: (parsed?.equipped && typeof parsed.equipped === "object") ? parsed.equipped : {},
    };
  } catch {
    return { owned: [], equipped: {} };
  }
}

function sanitizeShop(raw) {
  if (!raw || typeof raw !== "object") return DEFAULT_SHOP;
  return {
    owned: Array.isArray(raw.owned) ? raw.owned : [],
    equipped: (raw.equipped && typeof raw.equipped === "object") ? raw.equipped : {},
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

  const itemById = id => ITEMS.find(i => i.id === id);
  const equippedWearable = shop.equipped.wearable ? itemById(shop.equipped.wearable) : null;
  const previewWearable  = preview.wearable ? itemById(preview.wearable) : null;
  const displayWearable  = previewWearable || equippedWearable;

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
              accessories={displayWearable?.art ? [displayWearable.art] : []}
            />
          </div>
          {previewWearable && (
            <div className="shop__preview-banner">
              Trying on {previewWearable.name}
              <button
                className="shop__preview-banner-clear"
                onClick={() => clearPreview(previewWearable.slot)}
              >
                Clear
              </button>
            </div>
          )}
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