import Navbar from "@/components/Navbar";
import StudyTimer from "@/components/StudyTimer";
import { Suspense } from "react";

export const metadata = {
  title: "Chintu: Timer",
};

export default function TimerPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <Suspense>
          <StudyTimer />
        </Suspense>
      </main>
    </div>
  );
}