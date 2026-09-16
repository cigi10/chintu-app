import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import "@/styles/blog.css";

export const metadata = {
  title: "Quadratic Equations - Studyloaf",
  description: "What a quadratic equation is, solving by completing the square, the quadratic formula, and a real-life example.",
  openGraph: {
    title: "Quadratic Equations - Studyloaf",
    description: "What a quadratic equation is, solving by completing the square, the quadratic formula, and a real-life example.",
  },
};

export default function QuadraticEquationsPage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
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
              <Katex>{"x^2"}</Katex> term is missing: it's a linear equation.
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
              Let's solve <Katex>{"4x^2 - 12x + 3 = 0"}</Katex> using this method.
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
              narrower. (If <Katex>{"a = 0"}</Katex>, it's no longer a quadratic equation at all.)
              Changing <Katex>{"b"}</Katex> shifts the vertex left or right of the y-axis without
              changing the parabola's shape, and changing <Katex>{"c"}</Katex> shifts the whole graph
              up or down.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Quadratic equations in real life</h2>
            <p className="blog-post-p">
              Quadratic equations show up whenever a quantity depends on the square of another, such
              as finding the speed of a moving object, a product's profit, or an area. Here's one
              example: finding the speed of a boat that travels up and down a river.
            </p>
            <p className="blog-post-p">
              A river flows at 2 km/hour. A boat travels 20 km upstream against the current and then
              back, and the round trip takes 4 hours. Let <Katex>{"x"}</Katex> be the boat's speed in
              still water.
            </p>
            <p className="blog-post-p">
              Going upstream, the boat's speed relative to the ground is <Katex>{"x - 2"}</Katex>{" "}
              (the current slows it down); going downstream it's <Katex>{"x + 2"}</Katex> (the
              current helps it along). Since <Katex>{"\\text{time} = \\dfrac{\\text{distance}}{\\text{speed}}"}</Katex>{" "}
              and the total time is 4 hours:
            </p>
            <Katex display>{"4 = \\dfrac{20}{x-2} + \\dfrac{20}{x+2}"}</Katex>
            <p className="blog-post-p">
              Expanding this algebraically gives <Katex>{"x^2 - 10x - 4 = 0"}</Katex>. Solving with
              the quadratic formula gives two values: <Katex>{"x \\approx 10.38"}</Katex> and{" "}
              <Katex>{"x \\approx -0.38"}</Katex>. The negative value has no physical meaning here, so
              the boat's speed in still water is about 10.38 km/hour.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
