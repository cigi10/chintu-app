import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PracticeQuiz from "@/components/PracticeQuiz";
import { getQuizCategory, getQuizCategorySlugs } from "@/lib/quiz";

export function generateStaticParams() {
  return getQuizCategorySlugs().map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = getQuizCategory(slug);
  if (!category) return {};
  return { title: `Studyloaf: ${category.label} Practice Quiz` };
}

export default async function PracticeQuizPage({ params }) {
  const { category: slug } = await params;
  const category = getQuizCategory(slug);
  if (!category) notFound();

  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <PracticeQuiz category={category} />
      </main>
    </div>
  );
}
