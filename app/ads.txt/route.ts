// A route handler rather than a public/ads.txt static file, matching this
// project's existing convention for other well-known root SEO files
// (see app/robots.ts, app/sitemap.ts) — it also guarantees the exact
// Content-Type Google's ads.txt crawler expects, rather than relying on
// whatever MIME type the static file server infers for .txt.
//
// Content never changes at request time, so force-static prerenders this
// once at build time instead of re-running the handler per request.
export const dynamic = "force-static";

export async function GET() {
  return new Response("google.com, pub-4680201738326151, DIRECT, f08c47fec0942fa0\n", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
