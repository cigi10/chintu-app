import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Permutations and Combinations - Studyloaf",
  description: "How to count arrangements with permutations, with a worked dictionary-order example finding a specific word among all arrangements of a word's letters.",
  openGraph: {
    title: "Permutations and Combinations - Studyloaf",
    description: "How to count arrangements with permutations, with a worked dictionary-order example finding a specific word among all arrangements of a word's letters.",
  },
};

export default function PermutationsAndCombinationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Permutations and Combinations",
        description: "How to count arrangements with permutations, with a worked dictionary-order example finding a specific word among all arrangements of a word's letters.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Permutations and Combinations", href: "/resources/permutations-and-combinations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Permutations and Combinations</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Permutations vs. combinations</h2>
            <p className="blog-post-p">
              A <strong>permutation</strong> is an arrangement where order matters; a{" "}
              <strong>combination</strong> is a selection where it doesn&apos;t. The number of ways to
              arrange all <Katex>{"n"}</Katex> distinct items is <Katex>{"n!"}</Katex> (n factorial):{" "}
              <Katex>{"n! = n \\times (n-1) \\times \\cdots \\times 2 \\times 1"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: the 19th word in dictionary order</h2>
            <p className="blog-post-p">
              If all permutations of the letters of the word MASK are arranged in dictionary order,
              which one is the 19th word?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Sort the letters alphabetically first: A, K, M, S. There are{" "}
              <Katex>{"4! = 24"}</Katex> total arrangements. Group them by starting letter — each
              group has <Katex>{"3! = 6"}</Katex> words, since the remaining 3 letters can be arranged
              6 ways:
            </p>
            <ul className="blog-post-list">
              <li>Words 1–6 start with A</li>
              <li>Words 7–12 start with K</li>
              <li>Words 13–18 start with M</li>
              <li>Words 19–24 start with S</li>
            </ul>
            <p className="blog-post-p">
              The 19th word is the <em>first</em> word starting with S. Arranging the remaining
              letters (A, K, M) in alphabetical order gives <strong>SAKM</strong>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Counting the total number of outcomes in a probability problem is often exactly this
              kind of permutation or combination count.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/probability">Probability</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
