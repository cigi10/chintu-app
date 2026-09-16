import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Katex from "@/components/Katex";

describe("Katex", () => {
  it("renders a test expression to real KaTeX markup", () => {
    const { container } = render(<Katex>x^2 + y^2 = z^2</Katex>);
    const katexEl = container.querySelector(".katex");
    expect(katexEl).not.toBeNull();
    expect(container.querySelector(".katex-mathml")).not.toBeNull();
  });

  it("renders display mode as a block, inline mode as inline-block", () => {
    const { container: blockContainer } = render(<Katex display>a+b=c</Katex>);
    expect(blockContainer.querySelector(".katex-block")).not.toBeNull();
    expect(blockContainer.querySelector(".katex-display")).not.toBeNull();

    const { container: inlineContainer } = render(<Katex>a+b=c</Katex>);
    expect(inlineContainer.querySelector(".katex-inline")).not.toBeNull();
    expect(inlineContainer.querySelector(".katex-display")).toBeNull();
  });
});
