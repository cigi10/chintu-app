import Navbar from "@/components/Navbar";
import StudyTimer from "@/components/StudyTimer";
import FeedbackBox from "@/components/FeedbackBox";
import { Suspense } from "react";
import { NOINDEX } from "@/lib/seo";

// Rendered per request rather than prerendered: StudyTimer reads the URL
// (useSearchParams, for ?subject=, ?duration= and similar links from the
// dashboard), and on a prerendered page that pushes the whole timer to the
// browser, leaving the server HTML empty.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Studyloaf: Timer",
  robots: NOINDEX,
};

export default function TimerPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <Suspense>
          <StudyTimer />
        </Suspense>
        <FeedbackBox page="/timer" />
      </main>
    </div>
  );
}