import Navbar from "@/components/Navbar";
import TimetableGenerator from "@/components/TimetableGenerator";
import "@/styles/blog.css";

export const metadata = {
  title: "Free Timetable Generator - Studyloaf",
  description: "Enter your subjects, hours per day, and exam date to generate a simple weekly study timetable. No login required.",
  openGraph: {
    title: "Free Timetable Generator - Studyloaf",
    description: "Enter your subjects, hours per day, and exam date to generate a simple weekly study timetable. No login required.",
  },
};

export default function TimetableGeneratorPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="blog-shell">
          <div className="blog-header">
            <h1 className="blog-title">Timetable Generator</h1>
            <p className="blog-subtitle">
              Enter your subjects, hours available per day, and your exam date. Nothing is saved anywhere.
            </p>
          </div>
          <TimetableGenerator />
        </div>
      </main>
    </div>
  );
}
