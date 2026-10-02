import { describe, it, expect } from "vitest";
import { formatViewCount } from "@/lib/blogViews";

describe("formatViewCount", () => {
  it("hides counts under 10", () => {
    expect(formatViewCount(0)).toBeNull();
    expect(formatViewCount(9)).toBeNull();
    expect(formatViewCount(null)).toBeNull();
  });

  it("shows 10 and above with comma separators", () => {
    expect(formatViewCount(10)).toBe("10 views");
    expect(formatViewCount(1204)).toBe("1,204 views");
    expect(formatViewCount(1234567)).toBe("1,234,567 views");
  });
});
