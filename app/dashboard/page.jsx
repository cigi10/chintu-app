import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/DashboardContent";
import FeedbackBox from "@/components/FeedbackBox";
import { NOINDEX } from "@/lib/seo";

export const metadata = {
  title: "Study app: Home",
  description: "Your daily study dashboard with your study companion.",
  robots: NOINDEX,
};

export default function DashboardPage() {
  return (
    <div className="page-root">
      <Navbar />
      <DashboardContent />
      <FeedbackBox page="/dashboard" />
    </div>
  );
}