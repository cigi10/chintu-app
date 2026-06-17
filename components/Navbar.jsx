"use client";
// components/Navbar.jsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/timetable",  icon: "📅", label: "Timetable" },
  { href: "/timer",      icon: "⏱️", label: "Timer" },
  { href: "/tracker",    icon: "📚", label: "Tracker" },
  { href: "/shop",       icon: "🛍️", label: "Shop" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    try { setCoins(parseInt(localStorage.getItem("chintu-coins") || "0", 10)); } catch {}
  }, [pathname]);

  return (
    <>
      <style>{`
        .chintu-desktop-nav { display: none; gap: 4px; }
        @media (min-width: 641px) { .chintu-desktop-nav { display: flex; } }
      `}</style>
      <nav style={{ backgroundColor: "#FFFFFF", borderBottom: "2px solid #FEF3C7", boxShadow: "0 2px 8px rgba(249, 115, 22, 0.08)", width: "100%", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxSizing: "border-box", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#F97316", letterSpacing: "-0.5px" }}>Chintu 🐿️</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#F97316", backgroundColor: "#FEF3C7", borderRadius: "999px", padding: "2px 8px", letterSpacing: "0.05em" }}>BETA</span>
        </div>

        <div className="chintu-desktop-nav">
          {ITEMS.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", padding: "8px 14px", borderRadius: "999px", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: active ? "#FFFFFF" : "#92400E", backgroundColor: active ? "#F97316" : "transparent", transition: "background-color 0.2s" }}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </div>

        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1C1917", backgroundColor: "#FEF3C7", border: "2px solid #FDE68A", borderRadius: "999px", padding: "6px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "1.1rem" }}>🪙</span>
          <span>{coins}</span>
        </div>
      </nav>
    </>
  );
}