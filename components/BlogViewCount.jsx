"use client";
import { useEffect, useRef, useState } from "react";
import { formatViewCount } from "@/lib/blogViews";

// Records this visit and shows the post's view count in the meta row.
// Runs after load so the post page itself stays statically generated.
// Renders nothing until the count arrives, or at all for posts under
// MIN_DISPLAYED_VIEWS (see lib/blogViews.js).
export default function BlogViewCount({ slug }) {
  const [views, setViews] = useState(null);
  // React's development double-run of effects would otherwise send two
  // requests at once, both before the dedup cookie exists.
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    fetch(`/api/blog-views/${encodeURIComponent(slug)}`, { method: "POST" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setViews(data?.views ?? null))
      .catch(() => {});
  }, [slug]);

  const label = formatViewCount(views);
  if (!label) return null;

  return (
    <>
      <span className="blog-card-meta-dot">•</span>
      <span>{label}</span>
    </>
  );
}
