import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "Chintu 🐿️ — Home",
  description: "Your daily study dashboard with Chintu.",
};

export default function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF6EC", fontFamily: "'Nunito', sans-serif", color: "#1C1917" }}>
      <Navbar />
      <DashboardContent />
    </div>
  );
}