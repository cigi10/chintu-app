// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const rpc = vi.fn();
const maybeSingle = vi.fn();
const createAdminClient = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => createAdminClient() }));

const { POST } = await import("./route");

const SLUG = "neet-negative-marking-guessing-strategy";

function call(slug: string, cookie?: string) {
  const request = new NextRequest(`http://localhost/api/blog-views/${slug}`, {
    method: "POST",
    headers: cookie ? { cookie } : {},
  });
  return POST(request, { params: Promise.resolve({ slug }) } as never);
}

beforeEach(() => {
  rpc.mockReset();
  maybeSingle.mockReset();
  createAdminClient.mockReset();
  createAdminClient.mockReturnValue({
    rpc,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
  });
});

describe("POST /api/blog-views/[slug]", () => {
  it("increments on a first visit and sets a 24h dedup cookie scoped to the API path", async () => {
    rpc.mockResolvedValue({ data: 42, error: null });
    const res = await call(SLUG);
    expect(await res.json()).toEqual({ views: 42 });
    expect(rpc).toHaveBeenCalledWith("increment_blog_post_view", { p_slug: SLUG });
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`bv_${SLUG}=1`);
    expect(cookie).toContain("Max-Age=86400");
    expect(cookie).toContain("Path=/api/blog-views");
    expect(cookie).toContain("HttpOnly");
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("reads without incrementing when the dedup cookie is present", async () => {
    maybeSingle.mockResolvedValue({ data: { view_count: 42 }, error: null });
    const res = await call(SLUG, `bv_${SLUG}=1`);
    expect(await res.json()).toEqual({ views: 42 });
    expect(rpc).not.toHaveBeenCalled();
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("404s for a slug that isn't a real post, without touching the database", async () => {
    const res = await call("not-a-real-post");
    expect(res.status).toBe(404);
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it("returns null views when the service-role key isn't configured", async () => {
    createAdminClient.mockReturnValue(null);
    const res = await call(SLUG);
    expect(await res.json()).toEqual({ views: null });
  });

  it("returns null views and sets no cookie when the increment fails", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "boom" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await call(SLUG);
    expect(await res.json()).toEqual({ views: null });
    expect(res.headers.get("set-cookie")).toBeNull();
  });
});
