import Navbar from "@/components/Navbar";
import WeeklyDigest from "@/components/WeeklyDigest";
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