import Navbar from "@/components/Navbar";
import GoalsManager from "@/components/GoalsManager";

export const metadata = {
  title: "Study app: Goals",
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