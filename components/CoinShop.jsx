"use client";
import "@/styles/shop.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";
import { getData, setData } from "@/lib/storage";
import { hydrateCoins, setCoins as persistCoins } from "@/lib/coins";

const SHOP_KEY = "shop_ownership";
const LEGACY_SHOP_KEY = "chintu-shop"; // pre-cloud-sync key name
const DEFAULT_SHOP = { owned: [], equipped: {} };

const ART_THUMBS = {
  glasses:    "/companion/icons/glasses.PNG",
  scarf:      "/companion/icons/scarf.PNG",
  bowtie:     "/companion/icons/bowtie.PNG",
  headphones: "/companion/icons/headphones.PNG",
  socks:      "/companion/icons/socks.PNG",
};

const ITEMS = [
  { id: "glasses",    name: "Little glasses",   cost: 75,  slot: "wearable", art: "glasses"    },
  { id: "scarf",      name: "Tiny scarf",       cost: 100, slot: "wearable", art: "scarf"      },
  { id: "bowtie",     name: "Dapper bowtie",    cost: 90,  slot: "wearable", art: "bowtie"     },
  { id: "headphones", name: "Study headphones", cost: 140, slot: "wearable", art: "headphones" },
  { id: "socks",      name: "Cozy socks",       cost: 70,  slot: "wearable", art: "socks"      },
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
  const [coins, setCoins] = useState(0);
  const [shop, setShop]   = useState(DEFAULT_SHOP);

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
    const newShop  = { ...shop, owned: [...shop.owned, item.id] };
    setCoins(newCoins); setShop(newShop);
    persistCoins(newCoins); saveShop(newShop);
  }

  function toggleEquip(item) {
    const isEquipped = shop.equipped[item.slot] === item.id;
    const newEquipped = { ...shop.equipped };
    if (isEquipped) delete newEquipped[item.slot]; else newEquipped[item.slot] = item.id;
    const newShop = { ...shop, equipped: newEquipped };
    setShop(newShop); saveShop(newShop);
  }

  const itemById = id => ITEMS.find(i => i.id === id);
  const equippedWearable = shop.equipped.wearable ? itemById(shop.equipped.wearable) : null;

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
              mood="studying"
              accessories={equippedWearable?.art ? [equippedWearable.art] : []}
            />
          </div>
        </div>

        {/* Catalog */}
        <div className="shop__catalog">
          {CATEGORIES.map(cat => (
            <div key={cat.slot} className="shop__category">
              <h3 className="shop__category-title">{cat.label}</h3>
              <div className="shop__item-grid">
                {ITEMS.filter(i => i.slot === cat.slot).map(item => {
                  const owned    = shop.owned.includes(item.id);
                  const equipped = shop.equipped[item.slot] === item.id;
                  const affordable = coins >= item.cost;
                  return (
                    <div key={item.id} className={`shop__item-card${equipped ? " shop__item-card--equipped" : ""}`}>
                      <div className="shop__item-icon">
                        <img src={ART_THUMBS[item.art]} alt="" className="shop__item-icon-img" />
                      </div>
                      <div className="shop__item-name">{item.name}</div>
                      <div className="shop__item-cost">{item.cost} coins</div>
                      {!owned ? (
                        <button
                          className="shop__item-buy-btn"
                          disabled={!affordable}
                          onClick={() => buy(item)}
                        >
                          {affordable ? "Buy" : "Locked"}
                        </button>
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