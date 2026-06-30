import Navbar from "@/components/Navbar";
import RevisionQueue from "@/components/RevisionQueue";
export default function RevisionsPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Revision Queue</h1>
          <p>Topics due for review today</p>
        </div>
        <RevisionQueue />
      </main>
    </div>
  );
}