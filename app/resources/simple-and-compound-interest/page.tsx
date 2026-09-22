import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Simple and Compound Interest - Studyloaf",
  description: "The simple interest and compound interest formulas, why compound interest grows faster, and worked examples for both.",
  openGraph: {
    title: "Simple and Compound Interest - Studyloaf",
    description: "The simple interest and compound interest formulas, why compound interest grows faster, and worked examples for both.",
  },
};

export default function SimpleAndCompoundInterestPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Simple and Compound Interest",
        description: "The simple interest and compound interest formulas, why compound interest grows faster, and worked examples for both.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Simple and Compound Interest", href: "/resources/simple-and-compound-interest" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Simple and Compound Interest</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Simple interest</h2>
            <p className="blog-post-p">
              Simple interest charges the same fee every period, always calculated on the original
              principal <Katex>{"P"}</Katex>:
            </p>
            <Katex display>{"SI = \\dfrac{P \\times N \\times R}{100}"}</Katex>
            <p className="blog-post-p">
              where <Katex>{"N"}</Katex> is the number of years and <Katex>{"R"}</Katex> the annual
              rate as a percentage.
            </p>
            <p className="blog-post-p">
              <strong>Worked example:</strong> Find the simple interest on <Katex>{"\\text{₹}25{,}000"}</Katex>{" "}
              borrowed for 3 years at 9% per annum.
            </p>
            <Katex display>{"SI = \\dfrac{25000 \\times 3 \\times 9}{100} = 6750"}</Katex>
            <p className="blog-post-p">
              The total amount repaid is <Katex>{"A = P + SI = 25000 + 6750 = 31{,}750"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Compound interest: interest on interest</h2>
            <p className="blog-post-p">
              Compound interest adds each period&apos;s interest back into the principal before
              computing the next period&apos;s interest — so later interest is earned on more than
              just the original sum. Using the same numbers as above,{" "}
              <Katex>{"\\text{₹}25{,}000"}</Katex> at 9% annually, compounded once a year:
            </p>
            <Katex display>{"I_1 = 25000 \\times \\dfrac{9}{100} = 2250 \\quad\\Rightarrow\\quad \\text{new principal} = 27{,}250"}</Katex>
            <Katex display>{"I_2 = 27250 \\times \\dfrac{9}{100} = 2452.5 \\quad\\Rightarrow\\quad \\text{new principal} = 29{,}702.5"}</Katex>
            <Katex display>{"I_3 = 29702.5 \\times \\dfrac{9}{100} = 2673.225"}</Katex>
            <p className="blog-post-p">
              Total interest over 3 years: <Katex>{"2250 + 2452.5 + 2673.225 = 7375.725"}</Katex> —
              more than the <Katex>{"\\text{₹}6750"}</Katex> simple interest gave, even though the
              principal and rate are identical.
            </p>
            <p className="blog-post-p">
              The same result comes directly from the compound interest formula, with{" "}
              <Katex>{"n"}</Katex> compounding periods per year over <Katex>{"t"}</Katex> years:
            </p>
            <Katex display>{"CI = P\\left(1+\\dfrac{r}{100n}\\right)^{nt} - P"}</Katex>
            <p className="blog-post-p">
              With annual compounding (<Katex>{"n=1"}</Katex>):
            </p>
            <Katex display>{"CI = 25000(1.09)^3 - 25000 = 25000(1.295029) - 25000 = 7375.725"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
