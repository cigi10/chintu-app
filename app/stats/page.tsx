import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
import { NOINDEX } from "@/lib/seo";

export const metadata = {
  title: "Studyloaf: Stats",
  description: "Charts of your study time and progress over the long term.",
  robots: NOINDEX,
};

export default function StatsPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Stats</h1>
        </div>
        <Stats />
      </main>
    </div>
  );
}