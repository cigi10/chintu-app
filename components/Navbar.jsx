"use client";
import "@/styles/navbar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLocalCoins, hydrateCoins } from "@/lib/coins";
import { hydrateCompanionName } from "@/lib/companion";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// Slim top bar: brand, coin balance, theme switcher, and login/profile
// avatar, shown on every screen size. Navigation itself now lives in
// components/Sidebar.jsx (desktop) and the hamburger overlay in
// components/BottomNav.jsx (mobile) — this component no longer renders
// any nav links or the old "More" dropdown.
export default function Navbar() {
  const pathname = usePathname();
  const [coins, setCoins]                 = useState(0);
  const [coinPulse, setCoinPulse]         = useState(false);
  const [companionName, setCompanionName] = useState("Chintu");
  const [userEmail, setUserEmail]         = useState(null);

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

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/dashboard" className="navbar__brand">{companionName}</Link>

        <div className="navbar__spacer" />

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
