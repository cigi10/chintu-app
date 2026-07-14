"use client";
import "@/styles/rooms.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import StudyTimer from "@/components/StudyTimer";

// Tags are optional labels layered on top of ambient presence — never a
// gate you have to pick a side of. Soft, mood-based names on purpose.
const TAGS = [
  { id: "jee-prep",       name: "JEE prep"       },
  { id: "neet-prep",      name: "NEET prep"      },
  { id: "placement-prep", name: "Placement prep" },
  { id: "deep-focus",     name: "Deep focus"     },
];

const EVERYONE_ID = "everyone";
const ORB_COLORS  = ["#9B6FD4", "#F2619C", "#F9C060", "#7EC8A0", "#6FB7D4", "#B58FE8"];

function anonId() {
  try {
    const stored = localStorage.getItem("chintu-anon-id");
    if (stored) return stored;
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `anon-${crypto.randomUUID().slice(0, 8)}`
        : `anon-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("chintu-anon-id", id);
    return id;
  } catch {
    return `anon-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export default function StudyRooms() {
  const [counts, setCounts]       = useState({});
  const [activeTag, setActiveTag] = useState(null); // optional, additive — you're always in "everyone" regardless
  const [settled, setSettled]     = useState(false); // true once the first presence sync has come back
  const channelsRef               = useRef({});
  const myId                      = useRef(anonId());

  // Everyone on this page is ambiently present together — no "join" click
  // required. Tags are additional, optional presence layered on top.
  useEffect(() => {
    const allIds = [EVERYONE_ID, ...TAGS.map(t => t.id)];
    let cancelled = false;

    allIds.forEach(id => {
      const ch = supabase.channel(`room:${id}`, {
        config: { presence: { key: myId.current } },
      });
      ch.on("presence", { event: "sync" }, () => {
        const state = ch.presenceState();
        setCounts(prev => ({ ...prev, [id]: Object.keys(state).length }));
        if (id === EVERYONE_ID && !cancelled) setSettled(true);
      }).subscribe(status => {
        if (status === "SUBSCRIBED" && id === EVERYONE_ID) {
          // Ambient auto-join — just being on the page counts you in.
          ch.track({ joinedAt: Date.now() });
        }
      });
      channelsRef.current[id] = ch;
    });

    return () => {
      cancelled = true;
      Object.values(channelsRef.current).forEach(ch => {
        ch.untrack();
        supabase.removeChannel(ch);
      });
      channelsRef.current = {};
    };
  }, []);

  function toggleTag(tagId) {
    const ch = channelsRef.current[tagId];
    if (!ch) return;

    if (activeTag === tagId) {
      ch.untrack();
      setActiveTag(null);
      return;
    }
    if (activeTag) {
      const prevCh = channelsRef.current[activeTag];
      if (prevCh) prevCh.untrack();
    }
    ch.track({ joinedAt: Date.now() });
    setActiveTag(tagId);
  }

  const everyoneCount = counts[EVERYONE_ID] || 1;
  const othersCount   = Math.max(everyoneCount - 1, 0);
  const activeTagName = activeTag ? TAGS.find(t => t.id === activeTag)?.name : null;

  return (
    <div className="rooms">
      <div className="rooms__hero">
        <OrbCluster count={everyoneCount} settled={settled} />
        <p className="rooms__hero-text" aria-live="polite">
          {!settled
            ? "Gathering the room…"
            : othersCount > 0
            ? `Studying alongside ${othersCount} other${othersCount > 1 ? "s" : ""} right now`
            : "You're here first: others will join as they start studying"}
        </p>
      </div>

      <div className="rooms__tags-section">
        <p className="rooms__tags-label">
          Optional: quietly tag what you're working on. It's just for you.
        </p>
        <div className="rooms__tags-row">
          {TAGS.map(tag => {
            const isActive = activeTag === tag.id;
            const count = counts[tag.id] || 0;
            return (
              <button
                key={tag.id}
                type="button"
                className={`rooms__tag${isActive ? " rooms__tag--active" : ""}`}
                aria-pressed={isActive}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
                {count > 0 && <span className="rooms__tag-count">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* StudyTimer is reused exactly as-is. It only learns which room it's
          in when a tag is active — the orb cluster above already covers
          the ambient "everyone" case, so we don't say it twice. */}
      <StudyTimer roomName={activeTagName} />
    </div>
  );
}

// A little cluster of floating orbs — one per person, capped, with a
// "+N" overflow past that. Reads as "people," not a stat.
function OrbCluster({ count, settled }) {
  const visible  = Math.min(count, 6);
  const overflow = count - visible;

  return (
    <div className={`rooms__orbs${settled ? "" : " rooms__orbs--pending"}`}>
      {Array.from({ length: visible }).map((_, i) => (
        <span
          key={i}
          className="rooms__orb"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${ORB_COLORS[i % ORB_COLORS.length]}dd, ${ORB_COLORS[i % ORB_COLORS.length]}88)`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
      {overflow > 0 && <span className="rooms__orb-overflow">+{overflow}</span>}
    </div>
  );
}