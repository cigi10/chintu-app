"use client";
// components/StudyRooms.jsx
// Anonymous realtime "study with me" rooms using Supabase Presence.
// No chat, no names — just a live headcount per room.

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import StudyTimer from "@/components/StudyTimer";

const ROOMS = [
  { id: "jee-grind",      name: "JEE Grind",      tag: "📐 JEE" },
  { id: "neet-focus",     name: "NEET Focus",     tag: "🧬 NEET" },
  { id: "placement-prep", name: "Placement Prep", tag: "💻 Placements" },
  { id: "free-study",     name: "Free Study",     tag: "📖 Open" },
];

function anonId() {
  return `anon-${Math.random().toString(36).slice(2, 10)}`;
}

export default function StudyRooms() {
  const [counts, setCounts] = useState({});
  const [joinedRoom, setJoinedRoom] = useState(null);
  const channelsRef = useRef({});
  const joinedChannelRef = useRef(null);
  const myIdRef = useRef(anonId());

  useEffect(() => {
    ROOMS.forEach(room => {
      const channel = supabase.channel(`room:${room.id}`, {
        config: { presence: { key: myIdRef.current } },
      });
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          setCounts(prev => ({ ...prev, [room.id]: Object.keys(state).length }));
        })
        .subscribe();
      channelsRef.current[room.id] = channel;
    });

    return () => {
      Object.values(channelsRef.current).forEach(ch => supabase.removeChannel(ch));
      channelsRef.current = {};
    };
  }, []);

  function joinRoom(roomId) {
    const channel = channelsRef.current[roomId];
    if (channel) {
      channel.track({ joinedAt: Date.now() });
      joinedChannelRef.current = channel;
    }
    setJoinedRoom(roomId);
  }

  function leaveRoom() {
    if (joinedChannelRef.current) joinedChannelRef.current.untrack();
    joinedChannelRef.current = null;
    setJoinedRoom(null);
  }

  useEffect(() => {
    return () => { if (joinedChannelRef.current) joinedChannelRef.current.untrack(); };
  }, []);

  if (joinedRoom) {
    const room = ROOMS.find(r => r.id === joinedRoom);
    const othersCount = Math.max((counts[joinedRoom] || 1) - 1, 0);
    return (
      <div style={{ textAlign: "center" }}>
        <button
          onClick={leaveRoom}
          style={{ marginBottom: "1rem", fontWeight: 700, fontSize: "0.8rem", color: "#92400E", background: "none", border: "2px solid #FEF3C7", borderRadius: "999px", padding: "6px 16px", cursor: "pointer" }}
        >
          ← Leave {room.name}
        </button>

        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#92400E", backgroundColor: "#FEF3C7", borderRadius: "999px", padding: "6px 16px", display: "inline-block", marginBottom: "1rem" }}>
          {othersCount > 0 ? `${othersCount} others studying with you 🌿` : "You're early — more will join soon 🌅"}
        </p>

        <StudyTimer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {ROOMS.map(room => {
        const count = counts[room.id] || 0;
        return (
          <div key={room.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFBF5", border: "2px solid #FEF3C7", borderRadius: "16px", padding: "16px 20px" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem" }}>{room.name}</div>
              <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "#92400E" }}>{room.tag}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontWeight: 800, fontSize: "0.85rem", color: count > 0 ? "#F97316" : "#A8A29E", animation: count > 10 ? "pulse-glow 1.6s ease-in-out infinite" : "none" }}>
                {count > 0 ? `${count} studying now` : "Be the first today 🌅"}
              </span>
              <button
                onClick={() => joinRoom(room.id)}
                style={{ padding: "8px 18px", borderRadius: "999px", border: "none", backgroundColor: "#F97316", color: "#fff", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Join Room
              </button>
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}