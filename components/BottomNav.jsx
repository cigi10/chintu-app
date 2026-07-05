"use client";
import "@/styles/bottom-nav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const BOTTOM_ITEMS = [
  { href: "/dashboard", label: "Home"   },
  { href: "/timer",     label: "Timer"  },
  { href: "/tracker",   label: "Tracker" },
];

const MORE_GROUPS = [
  {
    label: "Study",
    items: [
      { href: "/timetable",    label: "Timetable"    },
      { href: "/revisions",    label: "Revisions"    },
      { href: "/todo",         label: "To-do"        },
      { href: "/mocktests",    label: "Mocks"        },
      { href: "/stats",        label: "Stats"        },
      { href: "/rooms",        label: "Rooms"        },
      { href: "/achievements", label: "Achievements" },
    ],
  },
  {
    label: "You",
    items: [
      { href: "/journal", label: "Journal" },
      { href: "/mood",    label: "Mood"    },
      { href: "/digest",  label: "Digest"  },
    ],
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const hide = pathname === "/onboarding";

  // Close the sheet whenever the route changes
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  if (hide) return null;

  const isInMoreGroup = MORE_GROUPS.some(g => g.items.some(i => i.href === pathname));

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
              <button
                type="button"
                className="bottom-sheet__close"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="bottom-sheet__content">
              {MORE_GROUPS.map(group => (
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