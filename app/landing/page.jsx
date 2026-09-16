import Landing from "@/components/Landing";
import { getAllBlogPosts } from "@/lib/blogPosts";

export const metadata = {
  title: "Studyloaf: Your Study Companion",
  description: "Your study bestie that doesn't guilt-trip you. Focus timers, portion tracking, and zero shame for an off day.",
  openGraph: {
    title: "Studyloaf: Your Study Companion",
    description: "Your study bestie that doesn't guilt-trip you. Focus timers, portion tracking, and zero shame for an off day.",
  },
};

export default function LandingPage() {
  const recentPosts = getAllBlogPosts().slice(0, 3);
  return <Landing recentPosts={recentPosts} />;
}
