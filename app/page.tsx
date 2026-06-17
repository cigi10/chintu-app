// app/dashboard/page.jsx
// Main dashboard shell for Chintu study companion.
// Static only — no auth, no Supabase. Uses localStorage in future tasks.

import Navbar from "@/components/Navbar";
import Chintu from "@/components/Chintu";

export default function DashboardPage() {
  return (
    // Full-page warm cream background
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FDF6EC",
        fontFamily: "'Nunito', sans-serif",
        color: "#1C1917",
      }}
    >
      {/* ── Top navigation bar ── */}
      <Navbar />

      {/* ── Main content: centered vertically and horizontally ── */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 73px)", // subtract navbar height
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        {/* Chintu character placeholder */}
        <Chintu mood="studying" />

        {/* Welcome text */}
        <div style={{ marginTop: "2rem", maxWidth: "340px" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1C1917",
              lineHeight: 1.3,
              marginBottom: "0.5rem",
            }}
          >
            Ready to study, Chintu? 🌟
          </h1>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#92400E",
              backgroundColor: "#FEF3C7",
              borderRadius: "12px",
              padding: "10px 20px",
              display: "inline-block",
            }}
          >
            JEE · NEET · Placements
          </p>
        </div>
      </main>
    </div>
  );
}