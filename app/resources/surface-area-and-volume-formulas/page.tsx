import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Surface Area and Volume Formulas Reference - Studyloaf",
  description: "Surface area and volume formulas for cuboids, cubes, spheres, cylinders, cones, and frustums of a cone, with a worked example.",
  openGraph: {
    title: "Surface Area and Volume Formulas Reference - Studyloaf",
    description: "Surface area and volume formulas for cuboids, cubes, spheres, cylinders, cones, and frustums of a cone, with a worked example.",
  },
};

export default function SurfaceAreaAndVolumeFormulasPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Surface Area and Volume Formulas Reference",
        description: "Surface area and volume formulas for cuboids, cubes, spheres, cylinders, cones, and frustums of a cone, with a worked example.",
        datePublished: "2026-09-23T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Surface Area and Volume Formulas Reference", href: "/resources/surface-area-and-volume-formulas" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Surface Area and Volume Formulas Reference</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Cuboid, cube, and sphere</h2>
            <Katex display>{"\\text{Cuboid: Surface Area} = 2(lb+lh+bh), \\qquad \\text{Volume} = lbh"}</Katex>
            <Katex display>{"\\text{Cube: Surface Area} = 6l^2, \\qquad \\text{Volume} = l^3"}</Katex>
            <Katex display>{"\\text{Sphere: Surface Area} = 4\\pi r^2, \\qquad \\text{Volume} = \\dfrac{4}{3}\\pi r^3"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Cylinder</h2>
            <Katex display>{"\\text{Surface Area} = 2\\pi rh + 2\\pi r^2, \\qquad \\text{Volume} = \\pi r^2 h"}</Katex>
            <p className="blog-post-p">
              <strong>Worked example:</strong> find the surface area and volume of a cylinder with{" "}
              <Katex>{"r=7"}</Katex> and <Katex>{"h=10"}</Katex> (using{" "}
              <Katex>{"\\pi \\approx \\tfrac{22}{7}"}</Katex> since 7 divides out cleanly):
            </p>
            <Katex display>{"\\text{Volume} = \\dfrac{22}{7} \\times 49 \\times 10 = 22 \\times 7 \\times 10 = 1540"}</Katex>
            <Katex display>{"\\text{Surface Area} = 2 \\times \\dfrac{22}{7} \\times 7 \\times (10+7) = 44 \\times 17 = 748"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Cone and its frustum</h2>
            <p className="blog-post-p">
              A cone&apos;s slant height is <Katex>{"l = \\sqrt{r^2+h^2}"}</Katex>:
            </p>
            <Katex display>{"\\text{Surface Area} = \\pi r (r + \\sqrt{h^2+r^2}), \\qquad \\text{Volume} = \\dfrac{1}{3}\\pi r^2 h"}</Katex>
            <p className="blog-post-p">
              Slicing the top off a cone parallel to its base leaves a <strong>frustum</strong>,
              with base radius <Katex>{"R"}</Katex> and top radius <Katex>{"r"}</Katex>. Its slant
              height is the hypotenuse of a right triangle with legs <Katex>{"h"}</Katex> and the
              radius gap <Katex>{"R-r"}</Katex>:
            </p>
            <Katex display>{"s = \\sqrt{(R-r)^2 + h^2}"}</Katex>
            <p className="blog-post-p">
              <strong>Worked example:</strong> a frustum has <Katex>{"R=5"}</Katex>,{" "}
              <Katex>{"r=2"}</Katex>, and <Katex>{"h=4"}</Katex>:
            </p>
            <Katex display>{"s = \\sqrt{(5-2)^2 + 4^2} = \\sqrt{9+16} = \\sqrt{25} = 5"}</Katex>
            <p className="blog-post-p">The lateral surface area then follows directly:</p>
            <Katex display>{"\\text{Lateral Surface Area} = \\pi(R+r)s = \\pi(5+2)(5) = 35\\pi"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
