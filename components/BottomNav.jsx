"use client";
import "@/styles/bottom-nav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV, NAV_GROUPS } from "@/lib/navItems";

const BOTTOM_ITEMS = [NAV.home, NAV.timer, NAV.tracker, NAV.shop];

// Mobile bottom bar: the 4 core icons stay fixed, plus a hamburger that
// opens the same NAV_GROUPS sectioned list the desktop Sidebar shows, as
// a slide-in side panel (dismissible by tapping the backdrop or the X)
// rather than the old bottom sheet.
export default function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const hide = pathname === "/onboarding";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (hide) return null;

  const isInMenu = NAV_GROUPS.some(g => g.items.some(i => i.href === pathname));

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
          className={`bottom-nav__item bottom-nav__hamburger-btn${isInMenu ? " bottom-nav__item--active" : ""}`}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="bottom-nav__hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Menu
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)}>
          <div className="nav-panel" onClick={e => e.stopPropagation()}>
            <div className="nav-panel__header">
              <span className="nav-panel__title">Menu</span>
              <button
                type="button"
                className="nav-panel__close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="nav-panel__scroll">
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="nav-panel__group">
                  <p className="nav-panel__group-label">{group.label}</p>
                  {group.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-panel__item${pathname === item.href ? " nav-panel__item--active" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
