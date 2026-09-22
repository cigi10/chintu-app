import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Binary Operation - Studyloaf",
  description: "What a binary operation is, and how to check whether one has an identity element, is commutative, or is associative, with worked examples.",
  openGraph: {
    title: "Binary Operation - Studyloaf",
    description: "What a binary operation is, and how to check whether one has an identity element, is commutative, or is associative, with worked examples.",
  },
};

export default function BinaryOperationPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Binary Operation",
        description: "What a binary operation is, and how to check whether one has an identity element, is commutative, or is associative, with worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Binary Operation", href: "/resources/binary-operation" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Binary Operation</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What it is</h2>
            <p className="blog-post-p">
              A <strong>binary operation</strong> <Katex>{"*"}</Katex> on a set takes any two
              elements of that set and combines them into a third element of the same set. An{" "}
              <strong>identity element</strong> <Katex>{"e"}</Katex> is one that leaves every
              element unchanged: <Katex>{"a*e = e*a = a"}</Katex> for all <Katex>{"a"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: finding an identity element</h2>
            <p className="blog-post-p">
              Find the identity element for <Katex>{"*"}</Katex> defined by{" "}
              <Katex>{"a*b = \\dfrac{ab}{4}"}</Katex> for all <Katex>{"a,b \\in \\mathbb{Q}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Set up <Katex>{"a*e=a"}</Katex> and solve for{" "}
              <Katex>{"e"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{ae}{4} = a \\;\\Rightarrow\\; e = 4"}</Katex>
            <p className="blog-post-p">
              Checking the other order confirms it: <Katex>{"e*a = \\tfrac{4a}{4} = a"}</Katex> too,
              so <Katex>{"e=4"}</Katex> is the identity element.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: commutative vs. associative</h2>
            <p className="blog-post-p">
              For real numbers, <Katex>{"*"}</Katex> is defined by <Katex>{"a*b = 1+ab"}</Katex>.
              Is it commutative? Is it associative?
            </p>
            <p className="blog-post-p">
              <strong>Commutative check:</strong> <Katex>{"a*b = 1+ab"}</Katex> and{" "}
              <Katex>{"b*a = 1+ba"}</Katex>. Since ordinary multiplication commutes,{" "}
              <Katex>{"ab=ba"}</Katex>, so <Katex>{"a*b = b*a"}</Katex> — <strong>commutative</strong>.
            </p>
            <p className="blog-post-p">
              <strong>Associative check:</strong> compare <Katex>{"(a*b)*c"}</Katex> against{" "}
              <Katex>{"a*(b*c)"}</Katex>:
            </p>
            <Katex display>{"(a*b)*c = (1+ab)*c = 1+(1+ab)c = 1+c+abc"}</Katex>
            <Katex display>{"a*(b*c) = a*(1+bc) = 1+a(1+bc) = 1+a+abc"}</Katex>
            <p className="blog-post-p">
              These only agree when <Katex>{"a=c"}</Katex>, not for every choice of{" "}
              <Katex>{"a,b,c"}</Katex> — so <Katex>{"*"}</Katex> is{" "}
              <strong>commutative but not associative</strong>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Checking commutativity and associativity here is the same kind of property-check used
              on relations more generally.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/types-of-relations">Types of Relations</Link></li>
              <li><Link href="/resources/types-of-functions">Types of Functions</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
