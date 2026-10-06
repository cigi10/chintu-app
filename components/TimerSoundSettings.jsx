"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SOUNDS, SOUND_PRICES, SOUND_SETTINGS_EVENT,
  isSoundOwned, isSoundForSale, loadSoundSettings, resolveSoundId,
} from "@/lib/timerSounds";
import { saveSoundSettings, hydrateSoundSettings } from "@/lib/soundSettings";
import { playSoundNow } from "@/lib/timerAudio";
import { hydrateShop, loadLocalShop, SHOP_CHANGE_EVENT } from "@/lib/shopOwnership";
import { NAV } from "@/lib/navItems";
import "@/styles/timer-sound.css";

// Choose the completion sound, preview any of them (locked ones too, like
// the shop's "Try on"), and set volume or mute. Settings sync through
// user_data.timer_sound (lib/soundSettings.js), and a change event lets the
// running timer reschedule its pending sound.
export default function TimerSoundSettings() {
  const [settings, setSettings] = useState(() => loadSoundSettings());
  const [owned, setOwned] = useState(() => loadLocalShop().owned);

  useEffect(() => {
    let cancelled = false;
    hydrateShop().then(shop => { if (!cancelled) setOwned(shop.owned); });
    hydrateSoundSettings().then(next => { if (!cancelled) setSettings(next); });
    const onShop = () => setOwned(loadLocalShop().owned);
    const onSettings = () => setSettings(loadSoundSettings());
    window.addEventListener(SHOP_CHANGE_EVENT, onShop);
    window.addEventListener(SOUND_SETTINGS_EVENT, onSettings);
    return () => {
      cancelled = true;
      window.removeEventListener(SHOP_CHANGE_EVENT, onShop);
      window.removeEventListener(SOUND_SETTINGS_EVENT, onSettings);
    };
  }, []);

  function save(next) {
    setSettings(saveSoundSettings(next));
  }

  function choose(id) {
    if (!isSoundOwned(id, owned) || id === settings.soundId) return;
    save({ ...settings, soundId: id });
  }

  // If the saved choice isn't owned (e.g. a purchase not yet synced to this
  // device), the default plays and is shown as selected.
  const activeId = resolveSoundId(settings.soundId, owned);

  return (
    <fieldset className="timer-sound">
      <legend className="timer-sound__legend">Completion sound</legend>

      <div className="timer-sound__list">
        {SOUNDS.map(sound => {
          const isOwned = isSoundOwned(sound.id, owned);
          const inputId = `timer-sound-${sound.id}`;
          return (
            <div key={sound.id} className={`timer-sound__row${isOwned ? "" : " timer-sound__row--locked"}`}>
              <input
                type="radio"
                id={inputId}
                name="timer-sound"
                className="timer-sound__radio"
                checked={activeId === sound.id}
                disabled={!isOwned}
                onChange={() => choose(sound.id)}
              />
              <label htmlFor={inputId} className="timer-sound__name">
                {sound.name}
                {!isOwned && (
                  <span className="timer-sound__lock">
                    {isSoundForSale(sound.id) ? `${SOUND_PRICES[sound.id]} coins in the shop` : "Locked"}
                  </span>
                )}
              </label>
              <button
                type="button"
                className="timer-sound__preview"
                onClick={() => playSoundNow(sound.id, settings.volume)}
                aria-label={`Preview ${sound.name}`}
              >
                Preview
              </button>
            </div>
          );
        })}
      </div>

      <div className="timer-sound__controls">
        <label className="timer-sound__volume">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(settings.volume * 100)}
            disabled={settings.muted}
            onChange={e => save({ ...settings, volume: Number(e.target.value) / 100 })}
            aria-valuetext={`${Math.round(settings.volume * 100)}%`}
          />
          <span className="timer-sound__volume-value">{Math.round(settings.volume * 100)}%</span>
        </label>
        <label className="timer-sound__mute">
          <input
            type="checkbox"
            checked={settings.muted}
            onChange={e => save({ ...settings, muted: e.target.checked })}
          />
          <span>Mute</span>
        </label>
      </div>

      {SOUNDS.some(s => !isSoundOwned(s.id, owned) && isSoundForSale(s.id)) && (
        <p className="timer-sound__shop-link">
          Unlock more sounds in the <Link href={NAV.shop.href}>coin shop</Link>.
        </p>
      )}
    </fieldset>
  );
}
