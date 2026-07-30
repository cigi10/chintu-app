"use client";
import "@/styles/shop.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";
import { getData, setData } from "@/lib/storage";
import { hydrateCoins, setCoins as persistCoins } from "@/lib/coins";

const SHOP_KEY = "shop_ownership";
const LEGACY_SHOP_KEY = "chintu-shop"; // pre-cloud-sync key name

// Item icons use the same accessory art worn by the companion elsewhere in
// the app — no art yet for desk/wall items, so those just show name + cost.
const ART_THUMBS = {
  glasses:    "/companion/icons/glasses.PNG",
  scarf:      "/companion/icons/scarf.PNG",
  bowtie:     "/companion/icons/bowtie.PNG",
  headphones: "/companion/icons/headphones.PNG",
};

const ITEMS = [
  { id: "chai",       name: "Chai cup",             cost: 50,  slot: "desk" },
  { id: "succulent",  name: "Succulent",             cost: 80,  slot: "desk" },
  { id: "books",      name: "Stack of books",        cost: 120, slot: "desk" },
  { id: "lamp",       name: "Desk lamp",             cost: 150, slot: "desk" },
  { id: "starchart",  name: "Star chart",            cost: 100, slot: "wall" },
  { id: "poster",     name: "Motivational poster",   cost: 90,  slot: "wall" },
  { id: "rainwindow", name: "Window with rain",      cost: 200, slot: "wall" },
  { id: "glasses",    name: "Little glasses",        cost: 75,  slot: "wearable", art: "glasses"    },
  { id: "scarf",      name: "Tiny scarf",            cost: 100, slot: "wearable", art: "scarf"      },
  { id: "bowtie",     name: "Dapper bowtie",         cost: 90,  slot: "wearable", art: "bowtie"     },
  { id: "headphones", name: "Study headphones",      cost: 140, slot: "wearable", art: "headphones" },
  { id: "gradcap",    name: "Graduate cap",          cost: 180, slot: "wearable" },
  { id: "diwali",     name: "Diwali lights",         cost: 250, slot: "wearable" },
  { id: "headband",   name: "Exam warrior headband", cost: 300, slot: "wearable" },
];

const CATEGORIES = [
  { slot: "desk",     label: "Desk items" },
  { slot: "wall",     label: "Wall items" },
  { slot: "wearable", label: "Wearables" },
];

function loadLocalShop() {
  try {
    const raw = localStorage.getItem(SHOP_KEY) ?? localStorage.getItem(LEGACY_SHOP_KEY);
    return raw ? JSON.parse(raw) : { owned: [], equipped: {} };
  } catch {
    return { owned: [], equipped: {} };
  }
}
async function saveShop(s) {
  await setData(SHOP_KEY, s);
  window.dispatchEvent(new Event("chintu-shop-change"));
}

export default function CoinShop() {
  const [coins, setCoins] = useState(0);
  const [shop, setShop]   = useState({ owned: [], equipped: {} });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Pull the cloud balance/inventory down so a returning signed-in
      // user doesn't see a stale or empty state on a new device.
      const [cloudCoins, cloudShop] = await Promise.all([
        hydrateCoins(),
        getData(SHOP_KEY, loadLocalShop()),
      ]);
      if (cancelled) return;
      setCoins(cloudCoins);
      setShop(cloudShop || { owned: [], equipped: {} });
      try { localStorage.setItem(SHOP_KEY, JSON.stringify(cloudShop || { owned: [], equipped: {} })); } catch {}
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
          <div className="shop__room-wall-item">
            {shop.equipped.wall ? itemById(shop.equipped.wall)?.name : ""}
          </div>
          <div className="shop__room-companion-wrap">
            <Companion
              mood="studying"
              accessories={equippedWearable?.art ? [equippedWearable.art] : []}
            />
          </div>
          <div className="shop__room-desk-item">
            {shop.equipped.desk ? itemById(shop.equipped.desk)?.name : ""}
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
                      {item.art && (
                        <div className="shop__item-icon">
                          <img src={ART_THUMBS[item.art]} alt="" className="shop__item-icon-img" />
                        </div>
                      )}
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