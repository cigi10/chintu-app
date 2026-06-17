"use client";
// components/BottomNav.jsx — mobile only, shown via media query.

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/timetable",  icon: "📅", label: "Timetable" },
  { href: "/timer",      icon: "⏱️", label: "Timer" },
  { href: "/tracker",    icon: "📚", label: "Tracker" },
  { href: "/shop",       icon: "🛍️", label: "Shop" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <>
      <style>{`
        .chintu-bottom-nav { display: none; }
        @media (max-width: 640px) { .chintu-bottom-nav { display: flex; } }
      `}</style>
      <nav className="chintu-bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", borderTop: "2px solid #FEF3C7", justifyContent: "space-around", alignItems: "center", padding: "8px 4px", zIndex: 50 }}>
        {ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: "2px", padding: "4px 8px" }}>
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.62rem", color: active ? "#F97316" : "#A8A29E" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}