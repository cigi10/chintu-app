import Landing from "@/components/Landing";
import OnboardedRedirect from "@/components/OnboardedRedirect";
import { getAllBlogPosts } from "@/lib/blogPosts";

export const metadata = {
  title: "Studyloaf: Your Study Companion",
  description: "A calm study companion for exam prep, without the guilt.",
  alternates: { canonical: "/" },
};

// The landing page is server-rendered right here at / so a fresh visitor
// (and Google) gets real content immediately. Signed-in and already-
// onboarded visitors never reach this render: proxy.ts redirects them to
// /dashboard first, with OnboardedRedirect as the client-side fallback
// for anyone whose onboarded flag predates the cookie.
export default function RootPage() {
  // getAllBlogPosts() reads content/blog/ via Node's fs, so it can only be
  // called from a server component. Landing itself is "use client" (it
  // needs hooks for the hero mood cycle), so the posts are fetched here
  // and passed down instead.
  const posts = getAllBlogPosts().slice(0, 3);
  return (
    <>
      <OnboardedRedirect />
      <Landing recentPosts={posts} />
    </>
  );
}
