import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DailyQuiz from "@/components/DailyQuiz";
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
  const description = getQuizPageContent(slug, "daily")?.description;
  return {
    title: `Studyloaf: ${category.label} Daily Challenge`,
    description,
    openGraph: { title: `${category.label} Daily Challenge - Studyloaf`, description },
    alternates: { canonical: `/quiz/${category.slug}/daily` },
  };
}

export default async function DailyQuizPage({ params }) {
  const { category: slug } = await params;
  const category = getQuizCategory(slug);
  if (!category) notFound();

  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <DailyQuiz category={category} />
        <ToolAbout content={getQuizPageContent(slug, "daily")} />
      </main>
    </div>
  );
}
