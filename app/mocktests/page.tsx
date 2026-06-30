import Navbar from "@/components/Navbar";
import MockTests from "@/components/MockTests";
export default function MockTestsPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <h1>Mock Tests</h1>
          <p>Track your scores over time</p>
        </div>
        <MockTests />
      </main>
    </div>
  );
}