import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
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