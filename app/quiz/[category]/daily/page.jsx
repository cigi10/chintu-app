import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DailyQuiz from "@/components/DailyQuiz";
import { getQuizCategory, getQuizCategorySlugs } from "@/lib/quiz";

export function generateStaticParams() {
  return getQuizCategorySlugs().map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = getQuizCategory(slug);
  if (!category) return {};
  return { title: `Chintu: ${category.label} Daily Challenge` };
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
      </main>
    </div>
  );
}
