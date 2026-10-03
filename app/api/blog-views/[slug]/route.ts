import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBlogPost } from "@/lib/blogPosts";
import { VIEW_COOKIE_PATH, VIEW_DEDUP_SECONDS, viewCookieName, viewCountingEnabled } from "@/lib/blogViews";

// POST /api/blog-views/<slug>: records a view (at most once per visitor
// per post per 24h, via a cookie) and returns { views }. Blog pages stay
// statically generated; components/BlogViewCount.jsx calls this after
// the page loads.
//
// Writes go through increment_blog_post_view(), which only the service
// role may execute (see supabase/migrations/*_blog_post_views.sql), so
// this route is the only way to count a view. `views` is null whenever
// the count can't be read, and the page simply shows nothing. Outside the
// live production deployment it only reads (see viewCountingEnabled).
export async function POST(request: NextRequest, ctx: RouteContext<"/api/blog-views/[slug]">) {
  const { slug } = await ctx.params;

  // Only real posts get a row, so arbitrary slugs can't fill the table.
  if (!getBlogPost(slug)) {
    return Response.json({ views: null }, { status: 404 });
  }

  const supabase = createAdminClient();
  if (!supabase) return noStore({ views: null });

  const alreadyCounted = request.cookies.has(viewCookieName(slug));

  if (alreadyCounted || !viewCountingEnabled()) {
    const { data, error } = await supabase
      .from("blog_post_views")
      .select("view_count")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("blog-views read failed:", error.message);
      return noStore({ views: null });
    }
    return noStore({ views: data?.view_count ?? 0 });
  }

  const { data, error } = await supabase.rpc("increment_blog_post_view", { p_slug: slug });
  if (error) {
    console.error("blog-views increment failed:", error.message);
    return noStore({ views: null });
  }

  const response = noStore({ views: data as number });
  response.headers.append(
    "Set-Cookie",
    [
      `${viewCookieName(slug)}=1`,
      `Max-Age=${VIEW_DEDUP_SECONDS}`,
      `Path=${VIEW_COOKIE_PATH}`,
      "HttpOnly",
      "SameSite=Lax",
      ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
    ].join("; ")
  );
  return response;
}

function noStore(body: { views: number | null }) {
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
