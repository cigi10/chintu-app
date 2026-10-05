import Onboarding from "@/components/Onboarding";
import SignupTracker from "@/components/SignupTracker";
import { NOINDEX } from "@/lib/seo";

export const metadata = {
  title: "Studyloaf: Get Started",
  description: "Set up your exam pack, companion, and exam date.",
  robots: NOINDEX,
};

export default function OnboardingPage() {
  return (
    <>
      <SignupTracker />
      <Onboarding />
    </>
  );
}