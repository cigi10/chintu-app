import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PracticeQuiz from "@/components/PracticeQuiz";
import ToolAbout from "@/components/ToolAbout";
import { getQuizCategory, getQuizCategorySlugs } from "@/lib/quiz";
import { getQuizPageContent } from "@/lib/toolPageContent";

export function generateStaticParams() {
  return getQuizCategorySlugs().map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = getQuizCategory(slug);
  if (!category) return {};
  const description = getQuizPageContent(slug, "practice")?.description;
  return {
    title: `Studyloaf: ${category.label} Practice Quiz`,
    description,
    openGraph: { title: `${category.label} Practice Quiz - Studyloaf`, description },
    alternates: { canonical: `/quiz/${category.slug}/practice` },
  };
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
        <ToolAbout content={getQuizPageContent(slug, "practice")} />
      </main>
    </div>
  );
}
