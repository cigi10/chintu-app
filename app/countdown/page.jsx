import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getExamDates } from "@/lib/examDates";
import "@/styles/blog.css";

export const metadata = {
  title: "Exam Countdowns - Studyloaf",
  description: "Live countdowns to JEE, NEET, and GATE exam dates.",
  openGraph: {
    title: "Exam Countdowns - Studyloaf",
    description: "Live countdowns to JEE, NEET, and GATE exam dates.",
  },
};

export default function CountdownIndexPage() {
  const exams = getExamDates();

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <div className="blog-header">
          <h1 className="blog-title">Exam Countdowns</h1>
          <p className="blog-subtitle">Live countdowns to upcoming exam dates.</p>
        </div>

        <div className="blog-list">
          {exams.map(exam => (
            <Link key={exam.slug} href={`/countdown/${exam.slug}`} className="blog-card">
              <h2 className="blog-card-title">{exam.name}</h2>
              <p className="blog-card-desc">
                {exam.date ? `Exam date: ${exam.date}` : "Exam date not yet officially announced"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
