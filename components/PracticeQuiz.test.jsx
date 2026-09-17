import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PracticeQuiz from "@/components/PracticeQuiz";

// Two questions, single (always-correct) option each, so answers are
// deterministic regardless of the component's shuffle-on-mount — the
// option's exact text doesn't matter, only that it's index 0 = correct.
const category = {
  slug: "test-cat",
  label: "Test",
  questions: [
    { question: "1+1?", options: ["2"], correctIndex: 0, explanation: "Two." },
    { question: "2+2?", options: ["4"], correctIndex: 0, explanation: "Four." },
  ],
};

function selectFirstOption(container) {
  fireEvent.click(container.querySelector(".quiz-options button"));
}

beforeAll(() => {
  Object.assign(navigator, { clipboard: { writeText: vi.fn(async () => {}) } });
  // jsdom doesn't drive a real animation-frame clock, so the points
  // count-up (built on requestAnimationFrame) would otherwise never
  // advance past its starting value in tests.
  global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
});

describe("PracticeQuiz — gamified flow", () => {
  it("reveals correctness immediately on selection, before advancing", () => {
    const { container } = render(<PracticeQuiz category={category} />);
    selectFirstOption(container);
    const option = container.querySelector(".quiz-options button");
    expect(option).toHaveClass("quiz-option--correct");
    expect(screen.getByText("+10 points!")).toBeInTheDocument();
  });

  it("fills the progress bar as questions advance", () => {
    const { container } = render(<PracticeQuiz category={category} />);
    expect(container.querySelector(".quiz-progress-bar-fill").style.width).toBe("0%");

    selectFirstOption(container);
    fireEvent.click(screen.getByRole("button", { name: /Next question/i }));

    expect(container.querySelector(".quiz-progress-bar-fill").style.width).toBe("50%");
  });

  it("updates the running point total immediately on a correct answer, before advancing", async () => {
    const { container } = render(<PracticeQuiz category={category} />);
    selectFirstOption(container);
    await waitFor(() => expect(screen.getByText("10 pts")).toBeInTheDocument());
  });

  it("shows a tier badge and points on the results screen after finishing", async () => {
    const { container } = render(<PracticeQuiz category={category} />);

    selectFirstOption(container);
    fireEvent.click(screen.getByRole("button", { name: /Next question/i }));
    selectFirstOption(container);
    fireEvent.click(screen.getByRole("button", { name: /Finish/i }));

    expect(screen.getByText("Sharp Shooter")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("20 pts")).toBeInTheDocument(), { timeout: 3000 });
  });
});
