import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/script", () => ({ default: props => <script data-testid="adsense" data-src={props.src} /> }));
const { default: AdSenseScript } = await import("./AdSenseScript");

afterEach(() => vi.unstubAllEnvs());

describe("AdSenseScript", () => {
  it("renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "");
    const { container } = render(<AdSenseScript />);
    expect(container.innerHTML).toBe("");
  });

  it("loads adsbygoogle.js for the configured client", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-4680201738326151");
    const { getByTestId } = render(<AdSenseScript />);
    expect(getByTestId("adsense").dataset.src).toContain("adsbygoogle.js?client=ca-pub-4680201738326151");
  });
});
