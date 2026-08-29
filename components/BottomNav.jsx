"use client";
import "@/styles/bottom-nav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { NAV } from "@/lib/navItems";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const BOTTOM_ITEMS = [NAV.home, NAV.timer, NAV.tracker, NAV.shop];

const STUDY_GROUP = {
  label: "Study",
  items: [NAV.goals, NAV.timetable, NAV.revisions, NAV.todo, NAV.mocktests, NAV.stats, NAV.rooms, NAV.achievements],
};

const YOU_GROUP_BASE = [NAV.journal, NAV.mood, NAV.digest, NAV.tutorial];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const hide = pathname === "/onboarding";

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  if (hide) return null;

  const youGroup = {
    label: "You",
    items: [
      ...YOU_GROUP_BASE,
      userEmail ? NAV.profile : NAV.login,
    ],
  };

  const moreGroups = [STUDY_GROUP, youGroup];
  const isInMoreGroup = moreGroups.some(g => g.items.some(i => i.href === pathname));

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
          className={`bottom-nav__item bottom-nav__more-btn${isInMoreGroup ? " bottom-nav__item--active" : ""}`}
          onClick={() => setMoreOpen(true)}
        >
          More
        </button>
      </nav>

      {moreOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setMoreOpen(false)}>
          <div
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
          >
            <div className="bottom-sheet__handle" />
            <div className="bottom-sheet__header">
              <span className="bottom-sheet__title">More</span>
              <div className="bottom-sheet__header-actions">
                <ThemeSwitcher />
                <button
                  type="button"
                  className="bottom-sheet__close"
                  onClick={() => setMoreOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bottom-sheet__content">
              {moreGroups.map(group => (
                <div key={group.label} className="bottom-sheet__group">
                  <p className="bottom-sheet__group-label">{group.label}</p>
                  <div className="bottom-sheet__grid">
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`bottom-sheet__item${pathname === item.href ? " bottom-sheet__item--active" : ""}`}
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
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