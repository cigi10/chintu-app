import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import "@/styles/blog.css";

export const metadata = {
  title: "Trigonometry Basics - Studyloaf",
  description: "Sine, cosine, tangent and their reciprocals, standard angle values, and the core trigonometric identities.",
  openGraph: {
    title: "Trigonometry Basics - Studyloaf",
    description: "Sine, cosine, tangent and their reciprocals, standard angle values, and the core trigonometric identities.",
  },
};

export default function TrigonometryPage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Trigonometry Basics</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is trigonometry?</h2>
            <p className="blog-post-p">
              Trigonometry is the study of the relationship between the side lengths and angles of a
              triangle. It gets its name from the Greek <em>trigonon</em> (triangle) and{" "}
              <em>metron</em> (measure). In a right triangle, relative to an acute angle{" "}
              <Katex>{"\\theta"}</Katex>: the <strong>hypotenuse</strong> is the side opposite the
              right angle, the <strong>opposite</strong> side is opposite <Katex>{"\\theta"}</Katex>,
              and the <strong>adjacent</strong> side is next to <Katex>{"\\theta"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The six ratios</h2>
            <p className="blog-post-p">
              The three main ratios are sine, cosine, and tangent, defined for an angle{" "}
              <Katex>{"\\theta"}</Katex> as:
            </p>
            <Katex display>{"\\sin\\theta = \\dfrac{\\text{opposite}}{\\text{hypotenuse}}, \\quad \\cos\\theta = \\dfrac{\\text{adjacent}}{\\text{hypotenuse}}, \\quad \\tan\\theta = \\dfrac{\\text{opposite}}{\\text{adjacent}}"}</Katex>
            <p className="blog-post-p">Three more ratios are the reciprocals of these:</p>
            <Katex display>{"\\csc\\theta = \\dfrac{1}{\\sin\\theta}, \\quad \\sec\\theta = \\dfrac{1}{\\cos\\theta}, \\quad \\cot\\theta = \\dfrac{1}{\\tan\\theta}"}</Katex>
            <p className="blog-post-p">
              A key fact: the values of these ratios for a given angle don't depend on the size of
              the triangle, only on the angle itself, since any two right triangles with the same
              acute angle are similar (their sides are all in the same proportion). This is the
              foundation trigonometry is built on.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: finding a building's height</h2>
            <p className="blog-post-p">
              One common application is finding the height of a building without measuring it
              directly. Stand at a point <Katex>{"C"}</Katex>, a distance of 250 m from the building
              (<Katex>{"BC"}</Katex>), and measure the angle of elevation to the top of the building
              as 53&deg;. Using the tangent function:
            </p>
            <Katex display>{"\\tan 53^\\circ = \\dfrac{AB}{BC} = \\dfrac{AB}{250}"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"\\tan 53^\\circ \\approx 1.327"}</Katex>,
            </p>
            <Katex display>{"1.327 = \\dfrac{AB}{250} \\implies AB = 331.75 \\text{ m}"}</Katex>
            <p className="blog-post-p">
              The building's height comes out to 331.75 m, without ever measuring it directly.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Standard angle values</h2>
            <p className="blog-post-p">
              It helps to know the ratios for a handful of standard angles: 0&deg;, 30&deg;, 45&deg;,
              60&deg;, and 90&deg;. There's a pattern worth noticing: for sine, the numerator (as{" "}
              <Katex>{"\\sqrt{0}, \\sqrt{1}, \\sqrt{2}, \\sqrt{3}, \\sqrt{4}"}</Katex>{" "}
              over 2) increases from 0&deg; to 90&deg;; for cosine, the same five values repeat but in
              reverse. Tangent is just sine divided by cosine, and cosecant/secant/cotangent are the
              reciprocals of sine/cosine/tangent, so none of them need to be memorized separately.
            </p>
            <div className="blog-post-table-wrap">
              <table className="blog-post-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>0&deg;</th>
                    <th>30&deg;</th>
                    <th>45&deg;</th>
                    <th>60&deg;</th>
                    <th>90&deg;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>sin &theta;</td>
                    <td><Katex>{"0"}</Katex></td>
                    <td><Katex>{"\\frac{1}{2}"}</Katex></td>
                    <td><Katex>{"\\frac{\\sqrt{2}}{2}"}</Katex></td>
                    <td><Katex>{"\\frac{\\sqrt{3}}{2}"}</Katex></td>
                    <td><Katex>{"1"}</Katex></td>
                  </tr>
                  <tr>
                    <td>cos &theta;</td>
                    <td><Katex>{"1"}</Katex></td>
                    <td><Katex>{"\\frac{\\sqrt{3}}{2}"}</Katex></td>
                    <td><Katex>{"\\frac{\\sqrt{2}}{2}"}</Katex></td>
                    <td><Katex>{"\\frac{1}{2}"}</Katex></td>
                    <td><Katex>{"0"}</Katex></td>
                  </tr>
                  <tr>
                    <td>tan &theta;</td>
                    <td><Katex>{"0"}</Katex></td>
                    <td><Katex>{"\\frac{1}{\\sqrt{3}}"}</Katex></td>
                    <td><Katex>{"1"}</Katex></td>
                    <td><Katex>{"\\sqrt{3}"}</Katex></td>
                    <td>not defined</td>
                  </tr>
                  <tr>
                    <td>csc &theta;</td>
                    <td>not defined</td>
                    <td><Katex>{"2"}</Katex></td>
                    <td><Katex>{"\\sqrt{2}"}</Katex></td>
                    <td><Katex>{"\\frac{2}{\\sqrt{3}}"}</Katex></td>
                    <td><Katex>{"1"}</Katex></td>
                  </tr>
                  <tr>
                    <td>sec &theta;</td>
                    <td><Katex>{"1"}</Katex></td>
                    <td><Katex>{"\\frac{2}{\\sqrt{3}}"}</Katex></td>
                    <td><Katex>{"\\sqrt{2}"}</Katex></td>
                    <td><Katex>{"2"}</Katex></td>
                    <td>not defined</td>
                  </tr>
                  <tr>
                    <td>cot &theta;</td>
                    <td>not defined</td>
                    <td><Katex>{"\\sqrt{3}"}</Katex></td>
                    <td><Katex>{"1"}</Katex></td>
                    <td><Katex>{"\\frac{1}{\\sqrt{3}}"}</Katex></td>
                    <td><Katex>{"0"}</Katex></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Trigonometric identities</h2>
            <p className="blog-post-p">
              An identity is an equation involving trigonometric ratios that holds for every value of{" "}
              <Katex>{"\\theta"}</Katex>. The three Pythagorean identities:
            </p>
            <ul className="blog-post-list">
              <li><Katex>{"\\sin^2\\theta + \\cos^2\\theta = 1"}</Katex></li>
              <li><Katex>{"\\sec^2\\theta - \\tan^2\\theta = 1"}</Katex></li>
              <li><Katex>{"\\csc^2\\theta - \\cot^2\\theta = 1"}</Katex></li>
            </ul>
            <p className="blog-post-p">The double-angle and triple-angle identities:</p>
            <ul className="blog-post-list">
              <li><Katex>{"\\sin 2\\theta = 2\\sin\\theta\\cos\\theta"}</Katex></li>
              <li><Katex>{"\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta"}</Katex></li>
              <li><Katex>{"\\tan 2\\theta = \\dfrac{2\\tan\\theta}{1 - \\tan^2\\theta}"}</Katex></li>
              <li><Katex>{"\\sin 3\\theta = 3\\sin\\theta - 4\\sin^3\\theta"}</Katex></li>
              <li><Katex>{"\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta"}</Katex></li>
              <li><Katex>{"\\tan 3\\theta = \\dfrac{3\\tan\\theta - \\tan^3\\theta}{1 - 3\\tan^2\\theta}"}</Katex></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
