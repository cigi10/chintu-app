import Navbar from "@/components/Navbar";
import Achievements from "@/components/Achievements";

export const metadata = {
  title: "Chintu: Achievements",
  description: "Track your study milestones.",
};

export default function AchievementsPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Achievements</h1>
          <p>Track every milestone in your study journey</p>
        </div>
        <Achievements />
      </main>
    </div>
  );
}