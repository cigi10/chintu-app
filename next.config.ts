import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.14"],
  async redirects() {
    return [
      // The Games IA restructure (batch 13) moved each Crumb domain under
      // /games/crumb/<domain>. These three old paths were in the submitted
      // sitemap before that move, so they're redirected rather than left
      // to 404 for anyone who indexed or bookmarked them.
      { source: "/games/neet", destination: "/games/crumb/neet", permanent: true },
      { source: "/games/clat", destination: "/games/crumb/clat", permanent: true },
      { source: "/games/board-exams", destination: "/games/crumb/board-exams", permanent: true },
      // The landing page used to live at /landing, reached from / by a
      // client-side redirect. It's now server-rendered at / itself.
      { source: "/landing", destination: "/", permanent: true },
      // Two near-duplicate JEE percentile posts were merged into the
      // normalization post. Their URLs may already be indexed, so they
      // redirect rather than 404.
      { source: "/blog/jee-main-percentile-to-rank-conversion", destination: "/blog/jee-main-normalization-explained", permanent: true },
      { source: "/blog/jee-main-scorecard-explained", destination: "/blog/jee-main-normalization-explained", permanent: true },
      // Two overlapping calculus pages were merged into tangents-and-normals
      // when the resource pages moved to JSON (Task 3, calculus batch).
      { source: "/resources/slope-of-tangent-and-normal", destination: "/resources/tangents-and-normals", permanent: true },
      // Phase 0 thin-page audit: each pair covered one half of the same
      // NCERT topic in under 110 words, so they were merged into one page.
      { source: "/resources/ratio", destination: "/resources/ratio-and-proportion", permanent: true },
      { source: "/resources/proportion", destination: "/resources/ratio-and-proportion", permanent: true },
      { source: "/resources/intercepts-of-a-plane", destination: "/resources/equation-of-a-plane", permanent: true },
    ];
  },
};

export default nextConfig;
