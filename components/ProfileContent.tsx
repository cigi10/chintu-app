"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Companion from "@/components/Companion";
import Button from "@/components/Button";
import RenameCompanion from "@/components/RenameCompanion";
import { hydrateCompanionName, DEFAULT_NAME as DEFAULT_COMPANION_NAME } from "@/lib/companion";
import { flushPendingWrites } from "@/lib/storage";
import "@/styles/profile.css";

export default function ProfileContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [companionName, setCompanionName] = useState(DEFAULT_COMPANION_NAME);
  const [signingOut, setSigningOut] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email || null);
        setJoined(session.user.created_at || null);
        setLoading(false);
      } else {
        supabase.auth.getUser().then(({ data }) => {
          setEmail(data.user?.email || null);
          setJoined(data.user?.created_at || null);
          setLoading(false);
        });
      }
    });
  }, []);

  useEffect(() => {
    hydrateCompanionName().then(setCompanionName);
  }, []);

  // Local data is only cleared once the cloud has all of it. If any
  // pending write can't be flushed, the user stays signed in with their
  // local data intact and can retry; signing out regardless would lose
  // whatever hadn't synced, and keeping the data while signed out would
  // leave it on a possibly shared browser for the next account.
  async function handleSignOut() {
    setSigningOut(true);
    setSyncFailed(false);
    const { ok } = await flushPendingWrites();
    if (!ok) {
      setSyncFailed(true);
      setSigningOut(false);
      return;
    }
    await supabase.auth.signOut();
    try { localStorage.clear(); } catch {}
    router.push("/login");
    router.refresh();
  }

  if (loading) return <div className="profile profile--loading">Loading...</div>;

  if (!email) {
    return (
      <>
        <Navbar />
        <div className="profile">
          <div className="profile__companion">
            <Companion mood="waiting" />
          </div>
          <p>You&apos;re not signed in.</p>
          <Button onClick={() => router.push("/login")}>Go to login</Button>
        </div>
      </>
    );
  }

  const initial = email[0].toUpperCase();

  return (
    <>
      <Navbar />
      <div className="profile">
        <div className="profile__avatar">{initial}</div>
        <h1 className="profile__title">Your Profile</h1>
        <div className="profile__card">
          <div className="profile__row">
            <span className="profile__label">Signed in as</span>
            <span className="profile__value">{email}</span>
          </div>
          {joined && (
            <div className="profile__row">
              <span className="profile__label">Member since</span>
              <span className="profile__value">
                {new Date(joined).toLocaleDateString()}
              </span>
            </div>
          )}
          <RenameCompanion currentName={companionName} onRenamed={setCompanionName} />
        </div>
        {syncFailed && (
          <p className="profile__sync-error" role="alert">
            Some changes haven&apos;t synced yet, so you&apos;re still signed in and nothing was
            removed. Check your connection and try again.
          </p>
        )}
        <Button variant="secondary" className="profile__signout-btn" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? "Syncing..." : syncFailed ? "Try signing out again" : "Sign out"}
        </Button>
      </div>
    </>
  );
}
