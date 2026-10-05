import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Quadratic Equations - Studyloaf",
  description: "What a quadratic equation is, solving by factoring, completing the square and the quadratic formula, solved examples on word problems, and the nature of roots.",
  openGraph: {
    title: "Quadratic Equations - Studyloaf",
    description: "What a quadratic equation is, solving by factoring, completing the square and the quadratic formula, solved examples on word problems, and the nature of roots.",
  },
  alternates: { canonical: "/resources/quadratic-equations" },
};

export default function QuadraticEquationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Quadratic Equations",
        description: "What a quadratic equation is, solving by factoring, completing the square and the quadratic formula, solved examples on word problems, and the nature of roots.",
        datePublished: "2026-09-16T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math: Algebra", href: "/resources/math-algebra" },
          { label: "Quadratic Equations", href: "/resources/quadratic-equations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Quadratic Equations</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is a quadratic equation?</h2>
            <p className="blog-post-p">A quadratic equation is any equation of the form</p>
            <Katex display>{"ax^2 + bx + c = 0"}</Katex>
            <p className="blog-post-p">where:</p>
            <ul className="blog-post-list">
              <li><Katex>{"x"}</Katex> represents a variable or an unknown</li>
              <li><Katex>{"a"}</Katex>, <Katex>{"b"}</Katex>, and <Katex>{"c"}</Katex> are constants</li>
              <li><Katex>{"a \\neq 0"}</Katex></li>
            </ul>
            <p className="blog-post-p">Here are some examples:</p>
            <ul className="blog-post-list">
              <li><Katex>{"x^2 + 2x + 8 = 0"}</Katex></li>
              <li><Katex>{"4x^2 - 6x + 9 = 0"}</Katex></li>
              <li><Katex>{"x^2 - 25x = 0"}</Katex></li>
              <li><Katex>{"9x^2 + 81 = 0"}</Katex></li>
            </ul>
            <p className="blog-post-p">
              <Katex>{"9x + 5 = 0"}</Katex> is <em>not</em> a quadratic equation since the{" "}
              <Katex>{"x^2"}</Katex> term is missing: it&apos;s a linear equation.
            </p>
            <p className="blog-post-p">A few more points to remember:</p>
            <ul className="blog-post-list">
              <li>A quadratic equation involves only one unknown (<Katex>{"x"}</Katex> in this case).</li>
              <li>A quadratic equation only contains powers of <Katex>{"x"}</Katex> that are non-negative.</li>
              <li>
                The solutions to the equation are the values of <Katex>{"x"}</Katex> that make it
                equal 0. These are called the <strong>roots</strong> of the equation.
              </li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Solving by factoring</h2>
            <p className="blog-post-p">
              When a quadratic factors neatly, splitting the middle term is often faster than
              completing the square. Solve <Katex>{"\\sqrt{2}x^2 + 7x + 5\\sqrt{2} = 0"}</Katex>.
            </p>
            <p className="blog-post-p">
              Multiply the outer coefficients: <Katex>{"\\sqrt{2} \\times 5\\sqrt{2} = 10"}</Katex>.
              Find two numbers that multiply to 10 and add to 7: that&apos;s 5 and 2. Split the
              middle term using them, then factor by grouping:
            </p>
            <Katex display>{"\\sqrt{2}x^2 + 5x + 2x + 5\\sqrt{2} = 0"}</Katex>
            <Katex display>{"x(\\sqrt{2}x + 5) + \\sqrt{2}(\\sqrt{2}x + 5) = 0"}</Katex>
            <Katex display>{"(\\sqrt{2}x + 5)(x + \\sqrt{2}) = 0"}</Katex>
            <p className="blog-post-p">
              Each factor set to zero gives a root:{" "}
              <Katex>{"x = -\\dfrac{5}{\\sqrt{2}}"}</Katex> or <Katex>{"x = -\\sqrt{2}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Solving by completing the square</h2>
            <p className="blog-post-p">
              A quadratic equation with real or complex coefficients has two roots. These two roots
              may or may not be distinct, and they may or may not be real. One way to find them is a
              method called <strong>completing the square</strong>, starting from the standard form{" "}
              <Katex>{"ax^2 + bx + c = 0"}</Katex>:
            </p>
            <ol className="blog-post-list">
              <li>
                Divide each side by <Katex>{"a"}</Katex>:{" "}
                <Katex>{"x^2 + \\dfrac{bx}{a} + \\dfrac{c}{a} = 0"}</Katex>
              </li>
              <li>
                Subtract the constant <Katex>{"\\dfrac{c}{a}"}</Katex> from both sides:{" "}
                <Katex>{"x^2 + \\dfrac{bx}{a} = -\\dfrac{c}{a}"}</Katex>
              </li>
              <li>
                Add the square of one-half of <Katex>{"\\dfrac{b}{a}"}</Katex>, the coefficient of{" "}
                <Katex>{"x"}</Katex>, to both sides:{" "}
                <Katex>{"x^2 + \\dfrac{bx}{a} + \\dfrac{b^2}{4a^2} = -\\dfrac{c}{a} + \\dfrac{b^2}{4a^2}"}</Katex>
              </li>
              <li>
                Rewrite the left side as a square and simplify the right side:{" "}
                <Katex>{"\\left(x + \\dfrac{b}{2a}\\right)^2 = \\dfrac{b^2 - 4ac}{4a^2}"}</Katex>
              </li>
              <li>
                Take the square root of both sides:{" "}
                <Katex>{"x + \\dfrac{b}{2a} = \\pm\\dfrac{\\sqrt{b^2 - 4ac}}{2a}"}</Katex>, so{" "}
                <Katex>{"x = \\pm\\dfrac{\\sqrt{b^2 - 4ac}}{2a} - \\dfrac{b}{2a}"}</Katex>
              </li>
            </ol>
            <p className="blog-post-p">This leads to the quadratic formula:</p>
            <Katex display>{"x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"}</Katex>
            <p className="blog-post-p">
              The <Katex>{"\\pm"}</Katex> means both{" "}
              <Katex>{"\\dfrac{-b + \\sqrt{b^2 - 4ac}}{2a}"}</Katex> and{" "}
              <Katex>{"\\dfrac{-b - \\sqrt{b^2 - 4ac}}{2a}"}</Katex> are roots of the equation.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Let&apos;s solve <Katex>{"4x^2 - 12x + 3 = 0"}</Katex> using this method.
            </p>
            <ol className="blog-post-list">
              <li>
                Divide each side by 4: <Katex>{"x^2 - 3x + \\dfrac{3}{4} = 0"}</Katex>
              </li>
              <li>
                Subtract <Katex>{"\\dfrac{3}{4}"}</Katex> from both sides:{" "}
                <Katex>{"x^2 - 3x = -\\dfrac{3}{4}"}</Katex>
              </li>
              <li>
                Add the square of one-half of 3 (the coefficient of <Katex>{"x"}</Katex>) to both
                sides: <Katex>{"x^2 - 3x + \\dfrac{9}{4} = -\\dfrac{3}{4} + \\dfrac{9}{4}"}</Katex>
              </li>
              <li>
                Rewrite the left side as a square:{" "}
                <Katex>{"\\left(x - \\dfrac{3}{2}\\right)^2 = \\dfrac{6}{4}"}</Katex>
              </li>
              <li>
                Take the square root of both sides:{" "}
                <Katex>{"x - \\dfrac{3}{2} = \\pm\\dfrac{\\sqrt{6}}{2}"}</Katex>, so{" "}
                <Katex>{"x = \\dfrac{3 \\pm \\sqrt{6}}{2} \\approx 2.72 \\text{ or } 0.28"}</Katex>
              </li>
            </ol>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The shape of the graph</h2>
            <p className="blog-post-p">
              The graph of a quadratic equation is a curve called a parabola. When{" "}
              <Katex>{"a"}</Katex> is positive, the parabola opens upward; when <Katex>{"a"}</Katex>{" "}
              is negative, it opens downward. As <Katex>{"|a|"}</Katex> increases, the parabola gets
              narrower. (If <Katex>{"a = 0"}</Katex>, it&apos;s no longer a quadratic equation at all.)
              Changing <Katex>{"b"}</Katex> shifts the vertex left or right of the y-axis without
              changing the parabola&apos;s shape, and changing <Katex>{"c"}</Katex> shifts the whole graph
              up or down.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Quadratic equations in real life</h2>
            <p className="blog-post-p">
              Quadratic equations show up whenever a quantity depends on the square of another, such
              as finding the speed of a moving object, a product&apos;s profit, or an area. Here&apos;s one
              example: finding the speed of a boat that travels up and down a river.
            </p>
            <p className="blog-post-p">
              A river flows at 2 km/hour. A boat travels 20 km upstream against the current and then
              back, and the round trip takes 4 hours. Let <Katex>{"x"}</Katex> be the boat&apos;s speed in
              still water.
            </p>
            <p className="blog-post-p">
              Going upstream, the boat&apos;s speed relative to the ground is <Katex>{"x - 2"}</Katex>{" "}
              (the current slows it down); going downstream it&apos;s <Katex>{"x + 2"}</Katex> (the
              current helps it along). Since <Katex>{"\\text{time} = \\dfrac{\\text{distance}}{\\text{speed}}"}</Katex>{" "}
              and the total time is 4 hours:
            </p>
            <Katex display>{"4 = \\dfrac{20}{x-2} + \\dfrac{20}{x+2}"}</Katex>
            <p className="blog-post-p">
              Expanding this algebraically gives <Katex>{"x^2 - 10x - 4 = 0"}</Katex>. Solving with
              the quadratic formula gives two values: <Katex>{"x \\approx 10.38"}</Katex> and{" "}
              <Katex>{"x \\approx -0.38"}</Katex>. The negative value has no physical meaning here, so
              the boat&apos;s speed in still water is about 10.38 km/hour.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Quadratic Equations: Solved Examples</h2>
            <p className="blog-post-p">
              These work through the standard board-exam question types one at a time: checking whether an equation is quadratic, setting one up from a word problem, solving it, and reading the nature of its roots.
            </p>
            <h3 className="blog-post-subheading">Is it actually quadratic?</h3>
            <p className="blog-post-p">
              An equation is quadratic only once it&apos;s simplified: expand both sides fully and
              collect like terms first, then check the degree. Two examples with different outcomes:
            </p>
            <p className="blog-post-p">
              <Katex>{"(x+1)^2 = 2(x-3)"}</Katex> expands to <Katex>{"x^2+2x+1=2x-6"}</Katex>, which
              simplifies to <Katex>{"x^2 + 7 = 0"}</Katex>, degree 2, so this <strong>is</strong>{" "}
              a quadratic equation.
            </p>
            <p className="blog-post-p">
              <Katex>{"(x-2)(x+1) = (x-1)(x+3)"}</Katex> expands to{" "}
              <Katex>{"x^2 - x - 2 = x^2 + 2x - 3"}</Katex>, and the <Katex>{"x^2"}</Katex> terms
              cancel, leaving <Katex>{"-3x + 1 = 0"}</Katex>, only degree 1, so this{" "}
              <strong>is not</strong> a quadratic equation, despite looking like one before expanding.
            </p>
            <h3 className="blog-post-subheading">Turning a word problem into a quadratic equation</h3>
            <p className="blog-post-p">
              The product of two consecutive positive integers is 306. Represent this as a quadratic
              equation.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the first integer be <Katex>{"x"}</Katex>, so the next
              consecutive integer is <Katex>{"x+1"}</Katex>. Their product is 306:
            </p>
            <Katex display>{"x(x+1) = 306 \\;\\Rightarrow\\; x^2 + x - 306 = 0"}</Katex>
            <h3 className="blog-post-subheading">Solving by factorization</h3>
            <p className="blog-post-p">
              Solve <Katex>{"2x^2 + x - 6 = 0"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Split the middle term into two parts whose product matches{" "}
              <Katex>{"2 \\times (-6) = -12"}</Katex> and whose sum is <Katex>{"1"}</Katex>: that&apos;s{" "}
              <Katex>{"4"}</Katex> and <Katex>{"-3"}</Katex>.
            </p>
            <Katex display>{"2x^2 + 4x - 3x - 6 = 0 \\;\\Rightarrow\\; 2x(x+2) - 3(x+2) = 0 \\;\\Rightarrow\\; (x+2)(2x-3) = 0"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x = -2"}</Katex> or <Katex>{"x = \\dfrac{3}{2}"}</Katex>.
            </p>
            <h3 className="blog-post-subheading">A word problem solved end to end</h3>
            <p className="blog-post-p">
              The altitude of a right triangle is 7 cm less than its base. If the hypotenuse is 13
              cm, find the other two sides.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the base be <Katex>{"x"}</Katex> cm, so the altitude is{" "}
              <Katex>{"x - 7"}</Katex> cm. By the Pythagorean theorem:
            </p>
            <Katex display>{"13^2 = x^2 + (x-7)^2 \\;\\Rightarrow\\; 169 = 2x^2 - 14x + 49 \\;\\Rightarrow\\; x^2 - 7x - 60 = 0"}</Katex>
            <Katex display>{"x^2 - 12x + 5x - 60 = 0 \\;\\Rightarrow\\; (x-12)(x+5) = 0 \\;\\Rightarrow\\; x = 12 \\text{ or } x = -5"}</Katex>
            <p className="blog-post-p">
              A side length can&apos;t be negative, so <Katex>{"x = 12"}</Katex>: the base is 12 cm and
              the altitude is <Katex>{"12 - 7 = 5"}</Katex> cm, a 5-12-13 right triangle, and{" "}
              <Katex>{"5^2 + 12^2 = 13^2"}</Katex> checks out.
            </p>
            <h3 className="blog-post-subheading">Solving by completing the square</h3>
            <p className="blog-post-p">
              Solve <Katex>{"2x^2 - 7x + 3 = 0"}</Katex> by completing the square.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Divide by 2, then move the constant to the right:
            </p>
            <Katex display>{"x^2 - \\dfrac{7}{2}x = -\\dfrac{3}{2}"}</Katex>
            <p className="blog-post-p">
              Add <Katex>{"\\left(\\dfrac{7}{4}\\right)^2 = \\dfrac{49}{16}"}</Katex> to both sides
              to complete the square on the left:
            </p>
            <Katex display>{"\\left(x-\\dfrac{7}{4}\\right)^2 = \\dfrac{-24+49}{16} = \\dfrac{25}{16} \\;\\Rightarrow\\; x - \\dfrac{7}{4} = \\pm\\dfrac{5}{4}"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x = \\dfrac{12}{4} = 3"}</Katex> or <Katex>{"x = \\dfrac{2}{4} = \\dfrac{1}{2}"}</Katex>.
            </p>
            <h3 className="blog-post-subheading">The nature of the roots</h3>
            <p className="blog-post-p">
              The discriminant <Katex>{"b^2-4ac"}</Katex> tells you what kind of roots to expect
              before you even solve: positive means two distinct real roots, zero means one
              repeated real root, and negative means no real roots at all.
            </p>
            <p className="blog-post-p">
              For what value(s) of <Katex>{"k"}</Katex> does <Katex>{"2x^2+kx+3=0"}</Katex> have
              two equal roots?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Equal roots require <Katex>{"b^2-4ac=0"}</Katex>:
            </p>
            <Katex display>{"k^2 - 4(2)(3) = 0 \\;\\Rightarrow\\; k^2 = 24 \\;\\Rightarrow\\; k = \\pm 2\\sqrt{6}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Quadratic equations lean heavily on recognizing squares quickly, so a fast reference for
              them speeds up both solving and double-checking your roots.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/squares-and-cubes">Squares and Cubes Reference</Link></li>
              <li><Link href="/resources/operations-on-matrices">Operations on Matrices</Link></li>
              <li><Link href="/resources/complex-numbers">Complex Numbers</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
