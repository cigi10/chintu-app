"use client";
import "@/styles/bottom-nav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV, NAV_GROUPS } from "@/lib/navItems";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// The 4 core icons always on screen — everything else (including Home and
// Timer again) lives in the sectioned "Menu" sheet below.
const BOTTOM_ITEMS = [NAV.home, NAV.timer, NAV.tracker, NAV.shop];

export default function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const hide = pathname === "/onboarding";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (hide) return null;

  const isInMenuGroup = NAV_GROUPS.some(g => g.items.some(key => NAV[key].href === pathname));

  return (
    <>
      <nav className="bottom-nav">
        {BOTTOM_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav__item${pathname === item.href ? " bottom-nav__item--active" : ""}`}
          >
            {item.label}
          </Link>
        ))}

        <button
          type="button"
          className={`bottom-nav__item bottom-nav__menu-btn${isInMenuGroup ? " bottom-nav__item--active" : ""}`}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </nav>

      {menuOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setMenuOpen(false)}>
          <div
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
          >
            <div className="bottom-sheet__handle" />
            <div className="bottom-sheet__header">
              <span className="bottom-sheet__title">Menu</span>
              <div className="bottom-sheet__header-actions">
                <ThemeSwitcher />
                <button
                  type="button"
                  className="bottom-sheet__close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bottom-sheet__content">
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="bottom-sheet__group">
                  <p className="bottom-sheet__group-label">{group.label}</p>
                  <div className="bottom-sheet__grid">
                    {group.items.map(key => {
                      const item = NAV[key];
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`bottom-sheet__item${pathname === item.href ? " bottom-sheet__item--active" : ""}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
