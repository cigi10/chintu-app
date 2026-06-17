"use client";
// components/CoinShop.jsx
// Chintu's room (equipped items) + the coin shop (buy/equip).

import { useState, useEffect } from "react";
import Chintu from "@/components/Chintu";

const COIN_KEY = "chintu-coins";
const SHOP_KEY = "chintu-shop"; // { owned: [ids], equipped: { desk, wall, wearable } }

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
function loadShop() {
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    return raw ? JSON.parse(raw) : { owned: [], equipped: {} };
  } catch { return { owned: [], equipped: {} }; }
}
function saveShop(s) { try { localStorage.setItem(SHOP_KEY, JSON.stringify(s)); } catch {} }

export default function CoinShop() {
  const [coins, setCoins] = useState(0);
  const [shop, setShop] = useState({ owned: [], equipped: {} });

  useEffect(() => {
    setCoins(loadCoins());
    setShop(loadShop());
  }, []);

  function buy(item) {
    if (coins < item.cost || shop.owned.includes(item.id)) return;
    const newCoins = coins - item.cost;
    const newShop = { ...shop, owned: [...shop.owned, item.id] };
    setCoins(newCoins);
    setShop(newShop);
    saveCoins(newCoins);
    saveShop(newShop);
  }

  function toggleEquip(item) {
    const isEquipped = shop.equipped[item.slot] === item.id;
    const newEquipped = { ...shop.equipped };
    if (isEquipped) delete newEquipped[item.slot];
    else newEquipped[item.slot] = item.id;
    const newShop = { ...shop, equipped: newEquipped };
    setShop(newShop);
    saveShop(newShop);
  }

  const itemById = id => ITEMS.find(i => i.id === id);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1C1917", backgroundColor: "#FEF3C7", border: "2px solid #FDE68A", borderRadius: "999px", padding: "6px 16px" }}>
          🪙 {coins}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ flex: "1 1 260px", backgroundColor: "#FFFBF5", border: "2px solid #FEF3C7", borderRadius: "20px", padding: "1.5rem", textAlign: "center", position: "relative", minHeight: "320px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.05rem", margin: "0 0 1rem" }}>Chintu's Room</h2>

          <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem", height: "1.6rem" }}>
            {shop.equipped.wall ? itemById(shop.equipped.wall)?.emoji : ""}
          </div>

          <div style={{ position: "relative", display: "inline-block", transform: "scale(0.6)" }}>
            <Chintu mood="studying" />
            {shop.equipped.wearable && (
              <span style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", fontSize: "2.4rem" }}>
                {itemById(shop.equipped.wearable)?.emoji}
              </span>
            )}
          </div>

          <div style={{ fontSize: "1.6rem", marginTop: "-0.5rem" }}>
            {shop.equipped.desk ? itemById(shop.equipped.desk)?.emoji : "🪑"}
          </div>
        </div>

        <div style={{ flex: "2 1 320px" }}>
          {CATEGORIES.map(cat => (
            <div key={cat.slot} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#92400E", marginBottom: "0.6rem" }}>{cat.label}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                {ITEMS.filter(i => i.slot === cat.slot).map(item => {
                  const owned = shop.owned.includes(item.id);
                  const equipped = shop.equipped[item.slot] === item.id;
                  const affordable = coins >= item.cost;
                  return (
                    <div key={item.id} style={{ backgroundColor: "#FFFBF5", border: `2px solid ${equipped ? "#F97316" : "#FEF3C7"}`, borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>{item.emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.78rem", marginBottom: "2px" }}>{item.name}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.72rem", color: "#92400E", marginBottom: "8px" }}>{item.cost} 🪙</div>
                      {!owned ? (
                        <button
                          onClick={() => buy(item)}
                          disabled={!affordable}
                          style={{ width: "100%", padding: "6px", borderRadius: "999px", border: "none", backgroundColor: affordable ? "#F97316" : "#FED7AA", color: "#fff", fontWeight: 800, fontSize: "0.72rem", cursor: affordable ? "pointer" : "not-allowed" }}
                        >
                          {affordable ? "Buy" : "🔒 Locked"}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleEquip(item)}
                          style={{ width: "100%", padding: "6px", borderRadius: "999px", border: "2px solid #F97316", backgroundColor: equipped ? "#F97316" : "transparent", color: equipped ? "#fff" : "#F97316", fontWeight: 800, fontSize: "0.72rem", cursor: "pointer" }}
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