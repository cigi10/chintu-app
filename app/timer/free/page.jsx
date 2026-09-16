import Navbar from "@/components/Navbar";
import FreeTimer from "@/components/FreeTimer";
import "@/styles/blog.css";

export const metadata = {
  title: "Free Pomodoro Timer - Studyloaf",
  description: "A simple, free focus timer. No login, no account, nothing saved. Just start studying.",
  openGraph: {
    title: "Free Pomodoro Timer - Studyloaf",
    description: "A simple, free focus timer. No login, no account, nothing saved. Just start studying.",
  },
};

export default function FreeTimerPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="blog-shell">
          <div className="blog-header">
            <h1 className="blog-title">Free Pomodoro Timer</h1>
            <p className="blog-subtitle">
              No login, no account, nothing saved. Pick a duration and start studying.
            </p>
          </div>
          <FreeTimer />
        </div>
      </main>
    </div>
  );
}
