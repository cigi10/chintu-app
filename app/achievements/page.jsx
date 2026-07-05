import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Chintu — Achievements",
  description: "Track your study milestones.",
};

export default function AchievementsPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Achievements</h1>
          <p>Coming soon — track your study milestones</p>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "#6E6688" }}>
          <p style={{ fontSize: "3rem" }}>🏆</p>
          <p>Achievements are under construction.</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Keep studying — your milestones are being tracked!
          </p>
        </div>
      </main>
    </div>
  );
}