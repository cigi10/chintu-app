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
    ];
  },
};

export default nextConfig;
