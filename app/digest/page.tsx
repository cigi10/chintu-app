import Navbar from "@/components/Navbar";
import WeeklyDigest from "@/components/WeeklyDigest";

export const metadata = {
  title: "Studyloaf: Weekly Digest",
  description: "A weekly summary of how much you studied.",
};

export default function DigestPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <WeeklyDigest />
      </main>
    </div>
  );
}