"use client";
import "@/styles/shop.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Companion from "@/components/Companion";
import { hydrateCoins, setCoins as persistCoins } from "@/lib/coins";
import { ITEMS, CATEGORIES, itemById } from "@/lib/shopItems";
import { hydrateShop, saveShop } from "@/lib/shopOwnership";
import { SOUNDS, SOUND_PRICES, isSoundOwned, isSoundForSale, shopIdForSound, loadSoundSettings, resolveSoundId } from "@/lib/timerSounds";
import { saveSoundSettings } from "@/lib/soundSettings";
import { playSoundNow } from "@/lib/timerAudio";

const DEFAULT_SHOP = { owned: [], equipped: {} };
const DEFAULT_SOUND_VIEW = { soundId: "ding", volume: 0.6, muted: false };

const ART_THUMBS = {
  glasses:       "/shop-items/glasses.PNG",
  scarf:         "/shop-items/scarf.PNG",
  bowtie:        "/shop-items/bowtie.PNG",
  headphones:    "/shop-items/headphones.PNG",
  socks:         "/shop-items/socks.PNG",
  flowers_yellow:"/shop-items/flowers_yellow.PNG",
  leaves:        "/shop-items/leaves.PNG",
  necktie_pink:  "/shop-items/necktie_pink.PNG",
  pearls:        "/shop-items/pearls.PNG",
  sweater_red:   "/shop-items/sweater_red.PNG",
};

export default function CoinShop() {
  const [coins, setCoins]     = useState(0);
  const [shop, setShop]       = useState(DEFAULT_SHOP);
  // Mirrors shop.equipped's { slot: itemId } shape, but only ever lives in
  // local state — trying something on never touches owned/equipped data or
  // the cloud, so it costs nothing and reverts the instant it's cleared.
  const [preview, setPreview] = useState({});
  const [soundSettings, setSoundSettings] = useState(DEFAULT_SOUND_VIEW);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // hydrateShop merges cloud and local purchases, so one bought here
      // whose sync failed is never replaced by an older cloud copy.
      const [cloudCoins, mergedShop] = await Promise.all([hydrateCoins(), hydrateShop()]);
      if (cancelled) return;
      setCoins(cloudCoins);
      setShop(mergedShop);
      setSoundSettings(loadSoundSettings());
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

  function buySound(sound) {
    const shopId = shopIdForSound(sound.id);
    const price = SOUND_PRICES[sound.id];
    if (!isSoundForSale(sound.id) || shop.owned.includes(shopId) || coins < price) return;
    const newCoins = coins - price;
    const newShop = { ...shop, owned: [...shop.owned, shopId] };
    setCoins(newCoins); setShop(newShop);
    persistCoins(newCoins); saveShop(newShop);
  }

  function selectSound(sound) {
    setSoundSettings(saveSoundSettings({ ...loadSoundSettings(), soundId: sound.id }));
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
                          <Button
                            className="shop__item-buy-btn"
                            size="sm"
                            disabled={!affordable}
                            onClick={() => buy(item)}
                          >
                            {affordable ? "Buy" : "Locked"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="shop__item-equip-btn"
                          variant={equipped ? "primary" : "ghost"}
                          size="sm"
                          fullWidth
                          onClick={() => toggleEquip(item)}
                        >
                          {equipped ? "Unequip" : "Equip"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="shop__category">
            <h3 className="shop__category-title">Timer sounds</h3>
            <p className="shop__category-note">Plays when a timer session ends. Preview any of them before you buy.</p>
            <div className="shop__item-grid">
              {SOUNDS.map(sound => {
                const owned = isSoundOwned(sound.id, shop.owned);
                const inUse = resolveSoundId(soundSettings.soundId, shop.owned) === sound.id;
                const forSale = isSoundForSale(sound.id);
                const price = SOUND_PRICES[sound.id];
                const affordable = forSale && coins >= price;
                return (
                  <div key={sound.id} className={`shop__item-card shop__item-card--sound${inUse ? " shop__item-card--equipped" : ""}`}>
                    <div className="shop__item-icon shop__item-icon--sound" aria-hidden="true">♪</div>
                    <div className="shop__item-name">{sound.name}</div>
                    <div className="shop__item-cost">
                      {owned ? (isSoundOwned(sound.id, []) ? "Free" : "Owned") : forSale ? `${price} coins` : "Not for sale yet"}
                    </div>
                    <div className="shop__item-actions">
                      <button
                        className="shop__item-tryon-btn"
                        onClick={() => playSoundNow(sound.id, soundSettings.volume)}
                        aria-label={`Preview ${sound.name}`}
                      >
                        Preview
                      </button>
                      {owned ? (
                        <Button
                          className="shop__item-buy-btn"
                          size="sm"
                          variant={inUse ? "primary" : "ghost"}
                          disabled={inUse}
                          onClick={() => selectSound(sound)}
                        >
                          {inUse ? "In use" : "Use"}
                        </Button>
                      ) : (
                        <Button
                          className="shop__item-buy-btn"
                          size="sm"
                          disabled={!affordable}
                          onClick={() => buySound(sound)}
                        >
                          {affordable ? "Buy" : "Locked"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}