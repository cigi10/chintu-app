import Landing from "@/components/Landing";
import { getAllBlogPosts } from "@/lib/blogPosts";

export const metadata = {
  title: "Studyloaf: Your Study Companion",
  description: "A calm study companion for exam prep, without the guilt.",
};

export default function LandingPage() {
  // getAllBlogPosts() reads content/blog/ via Node's fs, so it can only be
  // called from a server component — Landing itself is "use client" (it
  // needs hooks for the hero mood cycle), so the posts are fetched here
  // and passed down instead.
  const posts = getAllBlogPosts().slice(0, 3);
  return <Landing recentPosts={posts} />;
}
