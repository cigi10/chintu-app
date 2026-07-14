import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import StudyRooms from "@/components/StudyRooms";

export const metadata = {
  title: "Chintu: Study Rooms",
};

export default function RoomsPage() {
  return (
    <div className="page-root">
      <Navbar />

      <main className="page-main">
        <div className="page-header">
          <h1>Study Rooms</h1>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <StudyRooms />
        </Suspense>
      </main>
    </div>
  );
}