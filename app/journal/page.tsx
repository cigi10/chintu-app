import Navbar from "@/components/Navbar";

import Journal from "@/components/Journal";
export default function JournalPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Journal</h1>
          <p>What did you do today?</p>
        </div>
        <Journal />
      </main>
    </div>
  );
}