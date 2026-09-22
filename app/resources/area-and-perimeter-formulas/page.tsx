import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Area and Perimeter Formulas Reference - Studyloaf",
  description: "Area and perimeter formulas for rectangles, squares, circles, sectors, triangles, and regular pentagons, including Heron's formula, with a worked example.",
  openGraph: {
    title: "Area and Perimeter Formulas Reference - Studyloaf",
    description: "Area and perimeter formulas for rectangles, squares, circles, sectors, triangles, and regular pentagons, including Heron's formula, with a worked example.",
  },
};

export default function AreaAndPerimeterFormulasPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Area and Perimeter Formulas Reference",
        description: "Area and perimeter formulas for rectangles, squares, circles, sectors, triangles, and regular pentagons, including Heron's formula, with a worked example.",
        datePublished: "2026-09-23T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Area and Perimeter Formulas Reference", href: "/resources/area-and-perimeter-formulas" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Area and Perimeter Formulas Reference</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Rectangle and square</h2>
            <Katex display>{"\\text{Rectangle: Area} = l \\times b, \\qquad \\text{Perimeter} = 2(l+b)"}</Katex>
            <Katex display>{"\\text{Square: Area} = a^2, \\qquad \\text{Perimeter} = 4a"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Circle and sector</h2>
            <Katex display>{"\\text{Circle: Area} = \\pi r^2, \\qquad \\text{Circumference} = 2\\pi r"}</Katex>
            <p className="blog-post-p">
              A <strong>sector</strong> is the pie-slice region enclosed by two radii and an arc,
              spanning an angle <Katex>{"C"}</Katex> in degrees:
            </p>
            <Katex display>{"\\text{Area of sector} = \\pi r^2 \\times \\dfrac{C}{360}"}</Katex>
            <Katex display>{"\\text{Perimeter of sector} = 2r + 2\\pi r \\times \\dfrac{C}{360}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Triangle, including Heron&apos;s formula</h2>
            <p className="blog-post-p">
              With a known base and height, area is straightforward. When only the three side
              lengths are known, <strong>Heron&apos;s formula</strong> avoids needing the height at
              all:
            </p>
            <Katex display>{"\\text{Area} = \\dfrac{1}{2} \\times \\text{base} \\times \\text{height}"}</Katex>
            <Katex display>{"s = \\dfrac{a+b+c}{2}, \\qquad \\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)}"}</Katex>
            <p className="blog-post-p">
              <strong>Worked example:</strong> find the area of a triangle with sides 5, 6, and 7.
            </p>
            <Katex display>{"s = \\dfrac{5+6+7}{2} = 9"}</Katex>
            <Katex display>{"\\text{Area} = \\sqrt{9(9-5)(9-6)(9-7)} = \\sqrt{9 \\times 4 \\times 3 \\times 2} = \\sqrt{216} = 6\\sqrt{6}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Regular pentagon</h2>
            <p className="blog-post-p">
              A regular pentagon splits neatly into 5 identical triangles, so its area is 5 times
              one of them:
            </p>
            <Katex display>{"\\text{Area} = 5 \\times \\left(\\dfrac{1}{2} \\times \\text{base} \\times \\text{height}\\right), \\qquad \\text{Perimeter} = 5 \\times \\text{side}"}</Katex>
            <p className="blog-post-p">
              When only the side length <Katex>{"a"}</Katex> is known:
            </p>
            <Katex display>{"\\text{Area} = \\dfrac{5a^2}{4\\tan 36^\\circ}"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
