import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { StrictMode } from "react";

vi.mock("@/lib/analytics", () => ({ trackSignUp: vi.fn() }));
const { trackSignUp } = await import("@/lib/analytics");
const { default: SignupTracker } = await import("./SignupTracker");

describe("SignupTracker", () => {
  beforeEach(() => trackSignUp.mockReset());

  it("fires sign_up once for ?signup=google and strips only that param", () => {
    window.history.replaceState(null, "", "/onboarding?signup=google&step=2");
    render(<StrictMode><SignupTracker /></StrictMode>);
    expect(trackSignUp).toHaveBeenCalledTimes(1);
    expect(trackSignUp).toHaveBeenCalledWith("google");
    expect(window.location.pathname + window.location.search).toBe("/onboarding?step=2");
  });

  it("doesn't fire again once the param is gone (reload, back)", () => {
    window.history.replaceState(null, "", "/onboarding?signup=google");
    render(<SignupTracker />);
    render(<SignupTracker />);
    expect(trackSignUp).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe("");
  });

  it("doesn't fire on a normal visit", () => {
    window.history.replaceState(null, "", "/onboarding");
    render(<SignupTracker />);
    expect(trackSignUp).not.toHaveBeenCalled();
  });
});
