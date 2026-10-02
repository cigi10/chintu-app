import Navbar from "@/components/Navbar";
import GoalsManager from "@/components/GoalsManager";
import { NOINDEX } from "@/lib/seo";

export const metadata = {
  title: "Study app: Goals",
  robots: NOINDEX,
};

export default function GoalsPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <GoalsManager />
      </main>
    </div>
  );
}