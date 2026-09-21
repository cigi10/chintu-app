import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Profit and Loss - Studyloaf",
  description: "How to calculate profit and loss percent, and work backwards from a selling price or discount to find the cost price, with worked examples.",
  openGraph: {
    title: "Profit and Loss - Studyloaf",
    description: "How to calculate profit and loss percent, and work backwards from a selling price or discount to find the cost price, with worked examples.",
  },
};

export default function ProfitAndLossPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Profit and Loss",
        description: "How to calculate profit and loss percent, and work backwards from a selling price or discount to find the cost price, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Profit and Loss", href: "/resources/profit-and-loss" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Profit and Loss</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The core formulas</h2>
            <Katex display>{"\\text{Profit} = \\text{S.P.} - \\text{C.P.}, \\qquad \\text{Profit \\%} = \\dfrac{\\text{Profit}}{\\text{C.P.}} \\times 100"}</Katex>
            <p className="blog-post-p">
              (S.P. = selling price, C.P. = cost price.) When S.P. is less than C.P., the same
              formula gives a loss instead — a negative &quot;profit&quot;.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: profit percent</h2>
            <p className="blog-post-p">
              An old car bought for ₹25,000 is sold for ₹28,000. Find the profit percent.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Profit = 28,000 − 25,000 = ₹3,000.
            </p>
            <Katex display>{"\\text{Profit \\%} = \\dfrac{3000}{25000} \\times 100 = 12\\%"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: working backwards from a loss</h2>
            <p className="blog-post-p">
              A man bought an article for ₹450 and sold it at a 20% loss. Find the loss amount and
              the selling price.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Loss = 20% of 450:
            </p>
            <Katex display>{"\\text{Loss} = 0.20 \\times 450 = 90, \\qquad \\text{S.P.} = 450 - 90 = 360"}</Katex>
            <p className="blog-post-p">So the loss is ₹90 and the selling price is ₹360.</p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: finding the cost price</h2>
            <p className="blog-post-p">
              An article is sold for ₹500 at a 25% profit. Find its cost price.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> S.P. is 125% of C.P., so:
            </p>
            <Katex display>{"\\text{C.P.} = \\dfrac{500}{1.25} = 400"}</Katex>
            <p className="blog-post-p">The cost price is ₹400.</p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: discount</h2>
            <p className="blog-post-p">
              A shopkeeper allows a 12% discount on an article marked at ₹150. What does a customer
              actually pay?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong>
            </p>
            <Katex display>{"150 \\times (1 - 0.12) = 150 \\times 0.88 = 132"}</Katex>
            <p className="blog-post-p">The customer pays ₹132.</p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Every calculation above is a direct application of percentages to money.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/percentage">Percentage</Link></li>
              <li><Link href="/resources/percentage-shortcuts">Percentage Shortcuts</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
