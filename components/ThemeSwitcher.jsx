"use client";
import "@/styles/theme-switcher.css";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Droplet, Cherry, CloudMoon, Leaf, Trees, Wand2, Waves, Coffee } from "lucide-react";
import { THEMES, getStoredTheme, applyTheme } from "@/lib/theme";

const THEME_ICONS = {
  sunset: Sparkles,
  azure: Droplet,
  strawberry: Cherry,
  periwinkle: CloudMoon,
  matcha: Leaf,
  forest: Trees,
  majorelle: Wand2,
  slate: Waves,
  cocoa: Coffee,
};

const THEME_SWATCH_COLORS = {
  sunset: "#9B6FD4",
  azure: "#367ADF",
  strawberry: "#D5306D",
  periwinkle: "#4A69CE",
  matcha: "#84D175",
  forest: "#65743A",
  majorelle: "#6E44FF",
  slate: "#4F5D75",
  cocoa: "#F1DABF",
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("sunset");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function choose(themeId) {
    setTheme(themeId);
    applyTheme(themeId);
    setOpen(false);
  }

  const ActiveIcon = THEME_ICONS[theme] || Sparkles;

  return (
    <div className="theme-switcher" ref={ref}>
      <button
        type="button"
        className="theme-switcher__trigger"
        onClick={() => setOpen(v => !v)}
        title="Change theme"
        aria-label="Change theme"
      >
        <ActiveIcon size={18} strokeWidth={2.2} />
      </button>

      {open && (
        <div className="theme-switcher__menu">
          {THEMES.map(t => {
            const Icon = THEME_ICONS[t.id];
            return (
              <button
                key={t.id}
                type="button"
                className={`theme-switcher__option${theme === t.id ? " theme-switcher__option--active" : ""}`}
                onClick={() => choose(t.id)}
              >
                <span
                  className="theme-switcher__swatch"
                  style={{ background: THEME_SWATCH_COLORS[t.id] }}
                >
                  <Icon size={14} strokeWidth={2.2} color="#fff" />
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}