"use client";
import "@/styles/navbar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLocalCoins, hydrateCoins } from "@/lib/coins";
import { hydrateCompanionName, DEFAULT_NAME as DEFAULT_COMPANION_NAME, COMPANION_NAME_CHANGE_EVENT } from "@/lib/companion";
import { NAV, NAV_GROUPS } from "@/lib/navItems";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  Home, Clock, CheckSquare, Calendar, TrendingUp, Flag, RotateCcw, FileText,
  BarChart2, Trophy, Users, ShoppingBag, Wand2, Hourglass, Brain, BookOpen,
  Newspaper, HelpCircle, NotebookPen, Smile, Mail, User, Puzzle,
} from "lucide-react";

// One small icon per "More" menu item, purely decorative — keyed by the
// same NAV keys used everywhere else so it can't drift out of sync with
// lib/navItems.js.
const NAV_ICONS = {
  home: Home, timer: Clock, todo: CheckSquare, timetable: Calendar,
  tracker: TrendingUp, goals: Flag, revisions: RotateCcw, mocktests: FileText,
  stats: BarChart2, achievements: Trophy, rooms: Users, shop: ShoppingBag,
  timetableGenerator: Wand2, countdown: Hourglass, quiz: Brain, games: Puzzle, resources: BookOpen,
  blog: Newspaper, tutorial: HelpCircle, journal: NotebookPen, mood: Smile,
  digest: Mail, profile: User,
};

// Kept small and curated on purpose — everything else (including Home and
// Timer again) is also reachable from the sectioned "More" menu below, but
// these two are frequent enough to deserve a one-click shortcut.
const DIRECT_KEYS = ["home", "timer"];
const DIRECT_ITEMS = DIRECT_KEYS.map(key => NAV[key]);

export default function Navbar() {
  const pathname = usePathname();
  const [coins, setCoins]                 = useState(0);
  const [coinPulse, setCoinPulse]         = useState(false);
  // Which group's dropdown is open, by label — null when all are closed.
  // Only one open at a time: opening one closes whichever else was open.
  const [openGroup, setOpenGroup]         = useState(null);
  const [companionName, setCompanionName] = useState(DEFAULT_COMPANION_NAME);
  const [userEmail, setUserEmail]         = useState(null);
  const menusRef = useRef(null);

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
    hydrateCompanionName().then(setCompanionName);
  }, []);

  // Picks up a rename made elsewhere on the same page (e.g. the profile
  // page's "Rename your companion") without needing a navigation to
  // trigger the pathname-keyed refresh below. "storage" alone wouldn't
  // fire in this same tab, so setCompanionName also dispatches this
  // event directly — see lib/companion.js.
  useEffect(() => {
    function handleRename() { hydrateCompanionName().then(setCompanionName); }
    window.addEventListener(COMPANION_NAME_CHANGE_EVENT, handleRename);
    window.addEventListener("storage", handleRename);
    return () => {
      window.removeEventListener(COMPANION_NAME_CHANGE_EVENT, handleRename);
      window.removeEventListener("storage", handleRename);
    };
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
      const n = localStorage.getItem("companion-name") || localStorage.getItem("chintu-companion-name");
      if (n) setCompanionName(n);
    } catch {}
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menusRef.current && !menusRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Guests haven't created an account yet, so the brand spot should
            identify the site, not a still-default companion name that
            reads like the app's own name. Once logged in, showing their
            actual companion name here is a nice personal touch instead. */}
        <Link href={NAV.home.href} className="navbar__brand">
          {userEmail ? companionName : "Studyloaf"}
        </Link>

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

          <div className="navbar__group-menus" ref={menusRef}>
            {NAV_GROUPS.map(group => {
              const isOpen = openGroup === group.label;
              // Home and Timer are duplicated inside Study's own item list
              // (so they're still reachable from the dropdown), but they
              // already get their own active state via DIRECT_ITEMS above —
              // exclude them here so Study doesn't light up redundantly
              // whenever you're just on /dashboard or /timer.
              const isActiveGroup = group.items.some(
                key => !DIRECT_KEYS.includes(key) && NAV[key].href === pathname
              );
              return (
                <div key={group.label} className="navbar__dropdown-wrap">
                  <button
                    className={`navbar__link navbar__more-btn${isActiveGroup ? " navbar__link--active" : ""}${isOpen ? " navbar__more-btn--open" : ""}`}
                    onClick={() => setOpenGroup(g => (g === group.label ? null : group.label))}
                    aria-expanded={isOpen}
                  >
                    {group.label} <span className="navbar__more-caret">▾</span>
                    {isActiveGroup && <span className="navbar__dot" />}
                  </button>

                  {isOpen && (
                    <div className="navbar__dropdown">
                      {group.items.map(key => {
                        const item = NAV[key];
                        const Icon = NAV_ICONS[key];
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`navbar__dropdown-item${pathname === item.href ? " navbar__dropdown-item--active" : ""}`}
                            onClick={() => setOpenGroup(null)}
                          >
                            {Icon && <Icon size={15} className="navbar__dropdown-item-icon" aria-hidden="true" />}
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`navbar__coins${coinPulse ? " navbar__coins--pulse" : ""}`}>
          {coins} coins
        </div>

        <ThemeSwitcher />

        {userEmail ? (
          <Link href={NAV.profile.href} className="navbar__avatar" title={userEmail}>
            {userEmail[0].toUpperCase()}
          </Link>
        ) : (
          <Link href={NAV.login.href} className="navbar__link">{NAV.login.label}</Link>
        )}
      </div>
    </nav>
  );
}
