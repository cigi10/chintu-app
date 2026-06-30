"use client";
import "@/styles/bottom-nav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BOTTOM_ITEMS = [
  { href: "/dashboard", label: "Home"    },
  { href: "/timer",     label: "Timer"   },
  { href: "/tracker",   label: "Tracker" },
  { href: "/rooms",     label: "Rooms"   },
  { href: "/shop",      label: "Shop"    },
];

export default function BottomNav() {
  const pathname = usePathname();
  const hide = pathname === "/onboarding";
  if (hide) return null;

  return (
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
    </nav>
  );
}