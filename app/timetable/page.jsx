import Navbar from "@/components/Navbar";
import TimetableGrid from "@/components/TimetableGrid";
import { NOINDEX } from "@/lib/seo";

export const metadata = {
  title: "Study app: Timetable",
  description: "Plan your weekly study schedule.",
  robots: NOINDEX,
};

export default function TimetablePage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>My Timetable</h1>
          <p>Tap any slot to add or edit a subject</p>
        </div>
        <TimetableGrid />
      </main>
    </div>
  );
}