"use client";
import "@/styles/sidebar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_GROUPS } from "@/lib/navItems";
import { CHROME_HIDDEN_ON } from "@/components/ConditionalNav";

const COLLAPSE_KEY = "chintu-sidebar-collapsed";

function loadCollapsed() {
  try { return localStorage.getItem(COLLAPSE_KEY) === "1"; } catch { return false; }
}

// Persistent desktop-only left sidebar (see styles/sidebar.css for the
// >640px breakpoint, matching the same cutoff BottomNav/Navbar already
// use elsewhere). Replaces the old Navbar "More" dropdown, which
// overflowed off-screen once enough links piled up. Scrolls independently
// of page content via its own overflow-y, so a tall section list never
// makes anything unreachable regardless of viewport height.
export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(loadCollapsed());
  }, []);

  function toggleCollapsed() {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }

  const shouldHide = CHROME_HIDDEN_ON.some(path => pathname?.startsWith(path));
  if (shouldHide) return null;

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      <button
        type="button"
        className="sidebar__collapse-btn"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "»" : "«"}
      </button>

      {!collapsed && (
        <nav className="sidebar__scroll">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="sidebar__group">
              <p className="sidebar__group-label">{group.label}</p>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar__item${pathname === item.href ? " sidebar__item--active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}
    </aside>
  );
}
