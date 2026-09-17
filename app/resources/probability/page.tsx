import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Probability - Studyloaf",
  description: "What probability measures, independent vs dependent events, and conditional probability, with worked card, dice, and survey examples.",
  openGraph: {
    title: "Probability - Studyloaf",
    description: "What probability measures, independent vs dependent events, and conditional probability, with worked card, dice, and survey examples.",
  },
};

export default function ProbabilityPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Probability",
        description: "What probability measures, independent vs dependent events, and conditional probability, with worked card, dice, and survey examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Probability" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Probability</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is probability?</h2>
            <p className="blog-post-p">
              Probability measures how likely an event is to happen, on a scale from 0 (impossible)
              to 1 (certain):
            </p>
            <Katex display>{"P(A) = \\dfrac{\\text{number of favourable outcomes}}{\\text{total number of outcomes}}"}</Katex>
            <p className="blog-post-p">
              For example, drawing a King from a standard 52-card deck: 4 of the 52 cards are Kings,
              so <Katex>{"P(\\text{King}) = \\dfrac{4}{52} = \\dfrac{1}{13}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Independent vs. dependent events</h2>
            <p className="blog-post-p">
              Two events are <strong>independent</strong> when one doesn&apos;t affect the other&apos;s
              outcome — like tossing a coin and rolling a die together:
            </p>
            <Katex display>{"P(\\text{Head and 3}) = P(\\text{Head}) \\times P(3) = \\dfrac{1}{2}\\times\\dfrac{1}{6} = \\dfrac{1}{12}"}</Katex>
            <p className="blog-post-p">
              Two events are <strong>dependent</strong> when one changes the odds of the other — like
              drawing two cards without replacement. Drawing a King, then a Queen from the remaining
              51 cards:
            </p>
            <Katex display>{"P(\\text{King then Queen}) = \\dfrac{4}{52}\\times\\dfrac{4}{51} = \\dfrac{4}{663}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Conditional probability</h2>
            <p className="blog-post-p">
              Conditional probability asks: given that event B already happened, what&apos;s the
              chance of event A?
            </p>
            <Katex display>{"P(A \\mid B) = \\dfrac{P(A \\text{ and } B)}{P(B)}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Out of 50 students surveyed, 35 play basketball, and of those, 25 are boys. What&apos;s
              the probability that a basketball player is a boy?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let A = &quot;plays basketball&quot; and B = &quot;is a
              boy&quot;. Then <Katex>{"P(A) = \\dfrac{35}{50}"}</Katex> and{" "}
              <Katex>{"P(A \\text{ and } B) = \\dfrac{25}{50}"}</Katex>:
            </p>
            <Katex display>{"P(B \\mid A) = \\dfrac{25/50}{35/50} = \\dfrac{25}{35} = \\dfrac{5}{7} \\approx 0.71"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Counting the &quot;total number of outcomes&quot; in a probability problem often comes
              down to a permutations or combinations calculation.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/permutations-and-combinations">Permutations and Combinations</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
