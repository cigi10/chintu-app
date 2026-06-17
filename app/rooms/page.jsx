import Navbar from "@/components/Navbar";
import StudyRooms from "@/components/StudyRooms";

export const metadata = {
  title: "Chintu 🐿️ — Study Rooms",
  description: "Study alongside other students, anonymously, in real time.",
};

export default function RoomsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF6EC", fontFamily: "'Nunito', sans-serif", color: "#1C1917" }}>
      <Navbar />
      <main style={{ padding: "1.5rem 1.25rem 6rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontWeight: 800, fontSize: "1.5rem", margin: "0 0 4px" }}>Study Rooms 🌿</h1>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#92400E", margin: 0 }}>
            Anonymous, ambient, no chat — just company
          </p>
        </div>
        <StudyRooms />
      </main>
    </div>
  );
}