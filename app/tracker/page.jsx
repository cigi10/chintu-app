import Navbar from "@/components/Navbar";
import PortionTracker from "@/components/PortionTracker";

export const metadata = {
  title: "Study app: Tracker",
  description: "Track your syllabus progress for JEE, NEET, or Placements.",
};

export default function TrackerPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Portion Tracker </h1>
          <p>Tap a topic to update its status</p>
        </div>
        <PortionTracker />
      </main>
    </div>
  );
}