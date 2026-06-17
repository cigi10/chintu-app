// app/timetable/page.tsx
// Weekly timetable page. Renders Navbar + TimetableGrid.
// All data lives in localStorage under "chintu-timetable".

import Navbar from "@/components/Navbar";
import TimetableGrid from "@/components/TimetableGrid";

export const metadata = {
  title: "Chintu 🐿️ — Timetable",
  description: "Plan your weekly study schedule with Chintu.",
};

export default function TimetablePage() {
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
      <main style={{ padding: "1.5rem 1.25rem 6rem" }}>

        {/* Page header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: "1.5rem",
            color: "#1C1917", margin: "0 0 4px",
          }}>
            My Timetable 📅
          </h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600, fontSize: "0.875rem",
            color: "#92400E", margin: 0,
          }}>
            Tap any slot to add or edit a subject
          </p>
        </div>

        {/* The grid — handles all interactivity */}
        <TimetableGrid />

      </main>
    </div>
  );
}