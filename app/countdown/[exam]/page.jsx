import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ExamCountdown from "@/components/ExamCountdown";
import { getExamBySlug, getExamSlugs } from "@/lib/examDates";
import "@/styles/blog.css";

export function generateStaticParams() {
  return getExamSlugs().map(exam => ({ exam }));
}

export async function generateMetadata({ params }) {
  const { exam: slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) return {};

  return {
    title: `${exam.name} Countdown - Studyloaf`,
    description: `Live countdown to ${exam.name}.`,
    openGraph: {
      title: `${exam.name} Countdown - Studyloaf`,
      description: `Live countdown to ${exam.name}.`,
    },
  };
}

export default async function ExamCountdownPage({ params }) {
  const { exam: slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) notFound();

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <div className="blog-header">
          <h1 className="blog-title">{exam.name} Countdown</h1>
        </div>
        <ExamCountdown exam={exam} />
      </div>
    </>
  );
}
