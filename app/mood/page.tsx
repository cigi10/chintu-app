import Navbar from "@/components/Navbar";
import MoodCheckin from "@/components/MoodCheckin";
export default function MoodPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>How are you?</h1>
        </div>
        <MoodCheckin />
      </main>
    </div>
  );
}