// app/timer/page.tsx
// Study timer page — Navbar + StudyTimer component.

import Navbar from "@/components/Navbar";
import StudyTimer from "@/components/StudyTimer";

export const metadata = {
  title: "Chintu 🐿️ — Timer",
  description: "Pomodoro and custom study timers with Chintu by your side.",
};

export default function TimerPage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FDF6EC",
      fontFamily: "'Nunito', sans-serif",
      color: "#1C1917",
    }}>
      {/* ── Top navigation ── */}
      <Navbar />

      {/* ── Page content ── */}
      <main style={{ padding: "1.5rem 1.25rem 0" }}>

        {/* Page header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: "1.5rem",
            color: "#1C1917", margin: "0 0 4px",
          }}>
            Study Timer ⏱️
          </h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600, fontSize: "0.875rem",
            color: "#92400E", margin: 0,
          }}>
            25 min focus · earn coins · Chintu cheers you on
          </p>
        </div>

        {/* Timer — handles all state internally */}
        <StudyTimer />

      </main>
    </div>
  );
}