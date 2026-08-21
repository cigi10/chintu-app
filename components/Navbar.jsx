"use client";
import "@/styles/navbar.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLocalCoins, hydrateCoins } from "@/lib/coins";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const DIRECT_ITEMS = [
  { href: "/dashboard",     label: "Home"         },
  { href: "/timer",         label: "Timer"        },
  { href: "/todo",          label: "To-do"        },
  { href: "/timetable",     label: "Timetable"    },
  { href: "/tracker",       label: "Tracker"      },
  { href: "/achievements",  label: "Achievements" },
];

const GROUPS = [
  {
    label: "Study",
    items: [
      { href: "/goals",     label: "Goals"     },
      { href: "/revisions", label: "Revisions" },
      { href: "/mocktests", label: "Mocks"      },
      { href: "/stats",     label: "Stats"      },
      { href: "/rooms",     label: "Rooms"      },
      { href: "/shop",      label: "Shop"       },
    ],
  },
  {
    label: "You",
    items: [
      { href: "/journal", label: "Journal" },
      { href: "/mood",    label: "Mood"    },
      { href: "/digest",  label: "Digest"  },
      { href: "/profile", label: "Profile" },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [coins, setCoins]                 = useState(0);
  const [coinPulse, setCoinPulse]         = useState(false);
  const [moreOpen, setMoreOpen]           = useState(false);
  const [companionName, setCompanionName] = useState("Chintu");
  const [userEmail, setUserEmail]         = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    hydrateCoins().then(setCoins);
  }, []);

  useEffect(() => {
    try {
      const c = getLocalCoins();
      setCoins(prev => {
        if (c !== prev) {
          setCoinPulse(true);
          setTimeout(() => setCoinPulse(false), 500);
        }
        return c;
      });
      const n = localStorage.getItem("chintu-companion-name");
      if (n) setCompanionName(n);
    } catch {}
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInMoreGroup = GROUPS.some(g => g.items.some(i => i.href === pathname));

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/dashboard" className="navbar__brand">{companionName}</Link>

        <div className="navbar__links">
          {DIRECT_ITEMS.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`navbar__link${active ? " navbar__link--active" : ""}`}
              >
                {item.label}
                {active && <span className="navbar__dot" />}
              </Link>
            );
          })}

          <div className="navbar__dropdown-wrap" ref={dropdownRef}>
            <button
              className={`navbar__link navbar__more-btn${isInMoreGroup ? " navbar__link--active" : ""}${moreOpen ? " navbar__more-btn--open" : ""}`}
              onClick={() => setMoreOpen(v => !v)}
            >
              More <span className="navbar__more-caret">▾</span>
              {isInMoreGroup && <span className="navbar__dot" />}
            </button>

            {moreOpen && (
              <div className="navbar__dropdown">
                {GROUPS.map(group => (
                  <div key={group.label} className="navbar__dropdown-group">
                    <p className="navbar__dropdown-group-label">{group.label}</p>
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`navbar__dropdown-item${pathname === item.href ? " navbar__dropdown-item--active" : ""}`}
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`navbar__coins${coinPulse ? " navbar__coins--pulse" : ""}`}>
          {coins} coins
        </div>

        <ThemeSwitcher />

        {userEmail ? (
          <Link href="/profile" className="navbar__avatar" title={userEmail}>
            {userEmail[0].toUpperCase()}
          </Link>
        ) : (
          <Link href="/login" className="navbar__link">Log in</Link>
        )}
      </div>
    </nav>
  );
}