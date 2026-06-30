"use client";
import "@/styles/shop.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";

const COIN_KEY = "chintu-coins";
const SHOP_KEY = "chintu-shop";

const ITEMS = [
  { id: "chai",       name: "Chai cup",             emoji: "🍵", cost: 50,  slot: "desk" },
  { id: "succulent",  name: "Succulent",             emoji: "🌱", cost: 80,  slot: "desk" },
  { id: "books",      name: "Stack of books",        emoji: "📚", cost: 120, slot: "desk" },
  { id: "lamp",       name: "Desk lamp",             emoji: "🪔", cost: 150, slot: "desk" },
  { id: "starchart",  name: "Star chart",            emoji: "⭐", cost: 100, slot: "wall" },
  { id: "poster",     name: "Motivational poster",   emoji: "📋", cost: 90,  slot: "wall" },
  { id: "rainwindow", name: "Window with rain",      emoji: "🌧️", cost: 200, slot: "wall" },
  { id: "glasses",    name: "Little glasses",        emoji: "👓", cost: 75,  slot: "wearable" },
  { id: "scarf",      name: "Tiny scarf",            emoji: "🧣", cost: 100, slot: "wearable" },
  { id: "gradcap",    name: "Graduate cap",          emoji: "🎓", cost: 180, slot: "wearable" },
  { id: "diwali",     name: "Diwali lights",         emoji: "✨", cost: 250, slot: "wearable" },
  { id: "headband",   name: "Exam warrior headband", emoji: "🏹", cost: 300, slot: "wearable" },
];

const CATEGORIES = [
  { slot: "desk",     label: "Desk items" },
  { slot: "wall",     label: "Wall items" },
  { slot: "wearable", label: "Wearables" },
];

function loadCoins() { try { return parseInt(localStorage.getItem(COIN_KEY) || "0", 10); } catch { return 0; } }
function saveCoins(n) { try { localStorage.setItem(COIN_KEY, String(n)); } catch {} }
function loadShop() { try { const r = localStorage.getItem(SHOP_KEY); return r ? JSON.parse(r) : { owned: [], equipped: {} }; } catch { return { owned: [], equipped: {} }; } }
function saveShop(s) { try { localStorage.setItem(SHOP_KEY, JSON.stringify(s)); } catch {} }

export default function CoinShop() {
  const [coins, setCoins] = useState(0);
  const [shop, setShop]   = useState({ owned: [], equipped: {} });

  useEffect(() => { setCoins(loadCoins()); setShop(loadShop()); }, []);

  function buy(item) {
    if (coins < item.cost || shop.owned.includes(item.id)) return;
    const newCoins = coins - item.cost;
    const newShop  = { ...shop, owned: [...shop.owned, item.id] };
    setCoins(newCoins); setShop(newShop); saveCoins(newCoins); saveShop(newShop);
  }

  function toggleEquip(item) {
    const isEquipped = shop.equipped[item.slot] === item.id;
    const newEquipped = { ...shop.equipped };
    if (isEquipped) delete newEquipped[item.slot]; else newEquipped[item.slot] = item.id;
    const newShop = { ...shop, equipped: newEquipped };
    setShop(newShop); saveShop(newShop);
  }

  const itemById = id => ITEMS.find(i => i.id === id);

  return (
    <div>
      <div className="shop__coin-bar">
        <div className="shop__coin-badge">🪙 {coins}</div>
      </div>

      <div className="shop__layout">
        {/* Room preview */}
        <div className="shop__room">
          <h2 className="shop__room-title">Your Room</h2>
          <div className="shop__room-wall-item">
            {shop.equipped.wall ? itemById(shop.equipped.wall)?.emoji : ""}
          </div>
          <div className="shop__room-companion-wrap">
            <Companion mood="studying" />
            {shop.equipped.wearable && (
              <span className="shop__room-wearable">
                {itemById(shop.equipped.wearable)?.emoji}
              </span>
            )}
          </div>
          <div className="shop__room-desk-item">
            {shop.equipped.desk ? itemById(shop.equipped.desk)?.emoji : "🪑"}
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
                      <div className="shop__item-emoji">{item.emoji}</div>
                      <div className="shop__item-name">{item.name}</div>
                      <div className="shop__item-cost">{item.cost} 🪙</div>
                      {!owned ? (
                        <button
                          className="shop__item-buy-btn"
                          disabled={!affordable}
                          onClick={() => buy(item)}
                        >
                          {affordable ? "Buy" : "🔒 Locked"}
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