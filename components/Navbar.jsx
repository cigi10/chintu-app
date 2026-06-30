"use client";
import "@/styles/navbar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const PRIMARY_ITEMS = [
  { href: "/dashboard",  label: "Home"      },
  { href: "/timer",      label: "Timer"     },
  { href: "/rooms",      label: "Rooms"     },
  { href: "/timetable",  label: "Timetable" },
  { href: "/tracker",    label: "Tracker"   },
  { href: "/revisions",  label: "Revisions" },
  { href: "/mocktests",  label: "Mocks"     },
  { href: "/todo",       label: "To-do"     },
  { href: "/stats",      label: "Stats"     },
  { href: "/journal",    label: "Journal"   },
  { href: "/mood",       label: "Mood"      },
  { href: "/digest",     label: "Digest"    },
  { href: "/shop",       label: "Shop"      },
];

export default function Navbar() {
  const pathname = usePathname();
  const [coins, setCoins]     = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try { setCoins(parseInt(localStorage.getItem("chintu-coins") || "0", 10)); } catch {}
  }, [pathname]);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/dashboard" className="navbar__brand">Chintu</Link>

        {/* Desktop links */}
        <div className="navbar__links">
          {PRIMARY_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar__link${pathname === item.href ? " navbar__link--active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="navbar__right">
          <span className="navbar__coins">{coins} coins</span>
          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {PRIMARY_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar__mobile-link${pathname === item.href ? " navbar__mobile-link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}