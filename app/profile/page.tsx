"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Companion from "@/components/Companion";
import Button from "@/components/Button";
import "@/styles/profile.css";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email || null);
        setJoined(session.user.created_at || null);
        setLoading(false);
      } else {
        // No cached session — double check with the server before
        // declaring the user signed out, to avoid a false negative
        // on first load while Supabase is still restoring the session.
        supabase.auth.getUser().then(({ data }) => {
          setEmail(data.user?.email || null);
          setJoined(data.user?.created_at || null);
          setLoading(false);
        });
      }
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) return <div className="profile profile--loading">Loading...</div>;

  if (!email) {
    return (
      <div className="profile">
        <Header />
        <div className="profile__companion">
          <Companion mood="waiting" />
        </div>
        <p>You're not signed in.</p>
        <Button onClick={() => router.push("/login")}>Go to login</Button>
      </div>
    );
  }

  const initial = email[0].toUpperCase();

  return (
    <div className="profile">
      <Header />
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
      </div>
      <Button variant="secondary" className="profile__signout-btn" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}