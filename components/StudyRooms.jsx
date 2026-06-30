"use client";
import "@/styles/rooms.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import StudyTimer from "@/components/StudyTimer";

const ROOMS = [
  { id: "jee-grind",      name: "JEE Grind",     tag: "JEE"        },
  { id: "neet-focus",     name: "NEET Focus",     tag: "NEET"       },
  { id: "placement-prep", name: "Placement Prep", tag: "Placements" },
  { id: "free-study",     name: "Free Study",     tag: "Open"       },
];

function anonId() {
  try {
    const stored = localStorage.getItem("chintu-anon-id");
    if (stored) return stored;
    const id = `anon-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("chintu-anon-id", id);
    return id;
  } catch {
    return `anon-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export default function StudyRooms() {
  const [counts, setCounts]         = useState({});
  const [joinedRoom, setJoinedRoom] = useState(null);
  const channelsRef                 = useRef({});
  const joinedChannelRef            = useRef(null);
  const myId                        = useRef(anonId());

  useEffect(() => {
    ROOMS.forEach(room => {
      const ch = supabase.channel(`room:${room.id}`, {
        config: { presence: { key: myId.current } },
      });
      ch.on("presence", { event: "sync" }, () => {
        const state = ch.presenceState();
        setCounts(prev => ({ ...prev, [room.id]: Object.keys(state).length }));
      }).subscribe();
      channelsRef.current[room.id] = ch;
    });
    return () => {
      Object.values(channelsRef.current).forEach(ch => supabase.removeChannel(ch));
      channelsRef.current = {};
    };
  }, []);

  function joinRoom(roomId) {
    const ch = channelsRef.current[roomId];
    if (ch) {
      ch.track({ joinedAt: Date.now() });
      joinedChannelRef.current = ch;
    }
    setJoinedRoom(roomId);
  }

  function leaveRoom() {
    if (joinedChannelRef.current) joinedChannelRef.current.untrack();
    joinedChannelRef.current = null;
    setJoinedRoom(null);
  }

  useEffect(() => {
    return () => {
      if (joinedChannelRef.current) joinedChannelRef.current.untrack();
    };
  }, []);

  if (joinedRoom) {
    const room        = ROOMS.find(r => r.id === joinedRoom);
    const count       = counts[joinedRoom] || 1;
    const othersCount = Math.max(count - 1, 0);

    return (
      <div className="rooms__session">
        <div className="rooms__session-header">
          <button className="rooms__leave-btn" onClick={leaveRoom}>
            Leave {room.name}
          </button>
          <p className="rooms__presence-count">
            {othersCount > 0
              ? `${othersCount} other${othersCount > 1 ? "s" : ""} studying with you`
              : "You're the only one here right now"}
          </p>
        </div>
        <StudyTimer roomName={room.name} />
      </div>
    );
  }

  return (
    <div className="rooms__list">
      {ROOMS.map(room => {
        const count = counts[room.id] || 0;
        return (
          <div key={room.id} className="rooms__card">
            <div className="rooms__card-info">
              <div className="rooms__card-name">{room.name}</div>
              <div className="rooms__card-tag">{room.tag}</div>
            </div>
            <div className="rooms__card-right">
              <span className={`rooms__count${count > 0 ? " rooms__count--active" : ""}`}>
                {count > 0 ? `${count} studying now` : "No one here yet"}
              </span>
              <button className="rooms__join-btn" onClick={() => joinRoom(room.id)}>
                Join
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}