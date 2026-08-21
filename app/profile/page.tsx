"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || null);
      setJoined(data.user?.created_at || null);
      setLoading(false);
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
        <p>You're not signed in.</p>
        <button onClick={() => router.push("/login")}>Go to login</button>
      </div>
    );
  }

  return (
    <div className="profile">
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
      <button className="profile__signout-btn" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}