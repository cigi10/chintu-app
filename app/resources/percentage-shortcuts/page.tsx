import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Percentage Shortcuts - Studyloaf",
  description: "Common percentage calculation shortcuts and mental math tricks with worked examples.",
  openGraph: {
    title: "Percentage Shortcuts - Studyloaf",
    description: "Common percentage calculation shortcuts and mental math tricks with worked examples.",
  },
};

// Guards against floating-point noise (e.g. 400 * 1.15 === 459.99999999999994
// in JS) so every computed example displays a clean value.
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export default function PercentageShortcutsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Percentage Shortcuts",
        description: "Common percentage calculation shortcuts and mental math tricks with worked examples.",
        datePublished: "2026-09-15",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Percentage Shortcuts" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Percentage Shortcuts</h1>

          <div className="blog-post-section">
            <p className="blog-post-p">
              Percentages come up constantly in exams and everyday math. These shortcuts avoid long
              division by turning common percentages into simple fractions you can compute in your
              head.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Common percentages as fractions</h2>
            <p className="blog-post-p">
              Instead of multiplying and dividing by awkward numbers, convert the percentage to a
              simple fraction first.
            </p>
            <ul className="blog-post-list">
              <li>10% of a number: divide the number by 10. 10% of 250 is {round2(250 / 10)}.</li>
              <li>5% of a number: find 10% first, then take half of it. 5% of 250 is {round2(250 / 10 / 2)}.</li>
              <li>1% of a number: divide the number by 100. 1% of 250 is {round2(250 / 100)}.</li>
              <li>50% of a number: divide the number by 2. 50% of 84 is {round2(84 / 2)}.</li>
              <li>25% of a number: divide the number by 4. 25% of 84 is {round2(84 / 4)}.</li>
              <li>20% of a number: divide the number by 5. 20% of 90 is {round2(90 / 5)}.</li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Building up other percentages</h2>
            <p className="blog-post-p">
              Once you have 10% and 5% of a number, most other percentages are quick additions or
              subtractions of those two building blocks.
            </p>
            <p className="blog-post-p">
              Example: What is 15% of 320? 10% of 320 is {round2(320 / 10)}, and 5% of 320 is{" "}
              {round2(320 / 10 / 2)}. Adding them gives 15% of 320 = {round2(320 / 10 + 320 / 10 / 2)}.
            </p>
            <p className="blog-post-p">
              Example: What is 35% of 200? 10% of 200 is {round2(200 / 10)}, so 30% is{" "}
              {round2((200 / 10) * 3)}, and 5% is {round2(200 / 10 / 2)}. Adding 30% and 5% gives 35% of 200 ={" "}
              {round2((200 / 10) * 3 + 200 / 10 / 2)}.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Swap the numbers trick</h2>
            <p className="blog-post-p">
              X% of Y is always equal to Y% of X, since both are just (X times Y) divided by 100.
              This is useful when one of the two numbers is much easier to take a percentage of.
            </p>
            <p className="blog-post-p">
              Example: 8% of 50 is awkward to picture directly, but it equals 50% of 8, which is
              simply half of 8, giving {round2(8 / 2)}.
            </p>
            <p className="blog-post-p">
              Example: 4% of 75 equals 75% of 4. 75% of 4 is three quarters of 4, which is{" "}
              {round2((3 / 4) * 4)}.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Percentage increase and decrease</h2>
            <p className="blog-post-p">
              To increase a number by X%, multiply it by (1 + X/100). To decrease it by X%,
              multiply it by (1 - X/100).
            </p>
            <p className="blog-post-p">
              Example: Increase 400 by 15%. Multiply 400 by 1.15 to get {round2(400 * 1.15)}.
            </p>
            <p className="blog-post-p">
              Example: Decrease 400 by 15%. Multiply 400 by 0.85 to get {round2(400 * 0.85)}.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Finding what percentage one number is of another</h2>
            <p className="blog-post-p">
              To find what percentage a part is of a whole, divide the part by the whole and
              multiply by 100.
            </p>
            <p className="blog-post-p">
              Example: 45 out of 60 is what percentage? Dividing 45 by 60 gives 0.75, and
              multiplying by 100 gives {round2((45 / 60) * 100)}%.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
