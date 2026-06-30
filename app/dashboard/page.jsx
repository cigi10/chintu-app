import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "Study app — Home",
  description: "Your daily study dashboard with Chintu.",
};

export default function DashboardPage() {
  return (
    <div className="page-root">
      <Navbar />
      <DashboardContent />
    </div>
  );
}