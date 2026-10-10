import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const trackQuizComplete = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackQuizComplete: (...args) => trackQuizComplete(...args) }));
vi.mock("@/lib/quiz", () => ({
  getDailyQuestion: () => ({ question: "2+2?", options: ["3", "4"], correctIndex: 1, explanation: "Four." }),
}));
vi.mock("@/lib/quizStreak", () => ({
  hydrateQuizStreak: () => Promise.resolve(),
  getDailyStreakInfo: () => ({ streak: 0, playedToday: false }),
  recordDailyPlayed: () => ({ streak: 1, playedToday: true }),
}));

const { default: DailyQuiz } = await import("./DailyQuiz");

const category = { slug: "general-math", label: "General Math", shareLabel: "General Math" };

beforeEach(() => trackQuizComplete.mockReset());

describe("DailyQuiz analytics", () => {
  it("fires quiz_complete once on submit with the 0/1 score", () => {
    render(<DailyQuiz category={category} />);
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit answer" }));
    expect(trackQuizComplete).toHaveBeenCalledTimes(1);
    expect(trackQuizComplete).toHaveBeenCalledWith("daily", "general-math", 1, 1);
  });

  it("reports a wrong answer as 0", () => {
    render(<DailyQuiz category={category} />);
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit answer" }));
    expect(trackQuizComplete).toHaveBeenCalledWith("daily", "general-math", 0, 1);
  });
});
