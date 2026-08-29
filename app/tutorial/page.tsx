import Navbar from "@/components/Navbar";
import TutorialGuide from "@/components/TutorialGuide";

export const metadata = {
  title: "Studyloaf: How it works",
  description: "A quick tour of Studyloaf for anyone new to study apps.",
};

export default function TutorialPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <TutorialGuide />
      </main>
    </div>
  );
}
