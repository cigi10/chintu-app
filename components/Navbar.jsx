"use client";
import "@/styles/navbar.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLocalCoins, hydrateCoins } from "@/lib/coins";

const DIRECT_ITEMS = [
  { href: "/dashboard",     label: "Home"         },
  { href: "/timer",         label: "Timer"        },
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
      { href: "/todo",      label: "To-do"      },
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

  // Pull the cloud coin balance down once per session — after this,
  // localStorage is up to date and the pathname-triggered read below is
  // enough to stay in sync as the user navigates.
  useEffect(() => {
    hydrateCoins().then(setCoins);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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

        {userEmail ? (
          <button
            type="button"
            className="navbar__link navbar__signout-btn"
            onClick={handleSignOut}
            title={userEmail}
          >
            Sign out
          </button>
        ) : (
          <Link href="/login" className="navbar__link">Log in</Link>
        )}
      </div>
    </nav>
  );
}