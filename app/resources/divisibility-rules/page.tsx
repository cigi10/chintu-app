import Navbar from "@/components/Navbar";
import "@/styles/blog.css";

export const metadata = {
  title: "Divisibility Rules - Studyloaf",
  description: "Quick tests to check whether a number is divisible by 2 through 12, with worked examples.",
  openGraph: {
    title: "Divisibility Rules - Studyloaf",
    description: "Quick tests to check whether a number is divisible by 2 through 12, with worked examples.",
  },
};

export default function DivisibilityRulesPage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Divisibility Rules</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What are divisibility rules?</h2>
            <p className="blog-post-p">
              Divisibility rules are shortcut methods used to check whether a number is completely
              divisible by another number, meaning the remainder is zero, without doing the full
              division. For example, to check if a number is divisible by 2, you do not need to
              divide it at all. If the number ends in 2, 4, 6, 8, or 0, it is divisible by 2.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 2</h2>
            <p className="blog-post-p">A number is divisible by 2 if its last digit is 2, 4, 6, 8, or 0.</p>
            <p className="blog-post-p">
              Example: Is 176 divisible by 2? The last digit of 176 is 6, so 176 is divisible by 2.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 3</h2>
            <p className="blog-post-p">A number is divisible by 3 if the sum of its digits is a multiple of 3.</p>
            <p className="blog-post-p">
              Example: Is 1131 divisible by 3? The sum of its digits is 1 + 1 + 3 + 1 = 6, which is a
              multiple of 3, so 1131 is divisible by 3.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 4</h2>
            <p className="blog-post-p">
              A number is divisible by 4 if its last two digits form a multiple of 4, or if the last
              two digits are 00.
            </p>
            <p className="blog-post-p">
              Example: Is 1264 divisible by 4? Its last two digits, 64, are a multiple of 4, so 1264
              is divisible by 4.
            </p>
            <p className="blog-post-p">
              Example: Is 2600 divisible by 4? Its last two digits are 00, so 2600 is divisible by 4.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 5</h2>
            <p className="blog-post-p">A number is divisible by 5 if its last digit is 0 or 5.</p>
            <p className="blog-post-p">
              Example: Is 135 divisible by 5? The last digit of 135 is 5, so 135 is divisible by 5.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 6</h2>
            <p className="blog-post-p">A number is divisible by 6 if it is divisible by both 2 and 3.</p>
            <p className="blog-post-p">
              Example: Is 96 divisible by 6? 96 is divisible by 2 since its last digit is 6, and it is
              divisible by 3 since the sum of its digits, 9 + 6 = 15, is a multiple of 3. So 96 is
              divisible by 6.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 7</h2>
            <p className="blog-post-p">
              A number is divisible by 7 if subtracting twice its last digit from the number formed
              by the remaining digits gives 0 or a multiple of 7.
            </p>
            <p className="blog-post-p">
              Example: Is 168 divisible by 7? Twice the last digit, 8, is 16. Subtracting 16 from the
              remaining digits, 16, gives 0, so 168 is divisible by 7.
            </p>
            <p className="blog-post-p">
              Example: Is 441 divisible by 7? Twice the last digit, 1, is 2. Subtracting 2 from the
              remaining digits, 44, gives 42, which is a multiple of 7, so 441 is divisible by 7.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 8</h2>
            <p className="blog-post-p">A number is divisible by 8 if its last three digits form a multiple of 8.</p>
            <p className="blog-post-p">
              Example: Is 1864 divisible by 8? Its last three digits, 864, are a multiple of 8, so
              1864 is divisible by 8.
            </p>
            <p className="blog-post-p">
              Example: Is 14032 divisible by 8? Its last three digits, 032, are a multiple of 8, so
              14032 is divisible by 8.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 9</h2>
            <p className="blog-post-p">A number is divisible by 9 if the sum of its digits is a multiple of 9.</p>
            <p className="blog-post-p">
              Example: Is 1134 divisible by 9? The sum of its digits is 1 + 1 + 3 + 4 = 9, which is a
              multiple of 9, so 1134 is divisible by 9.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 10</h2>
            <p className="blog-post-p">A number is divisible by 10 if its last digit is 0.</p>
            <p className="blog-post-p">
              Example: Is 3440 divisible by 10? The last digit of 3440 is 0, so 3440 is divisible by 10.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 11</h2>
            <p className="blog-post-p">
              A number is divisible by 11 if the difference between the sum of the digits at odd
              positions and the sum of the digits at even positions, counted from right to left, is
              divisible by 11.
            </p>
            <p className="blog-post-p">
              Example: Is 7392 divisible by 11? The sum of the digits at odd positions from the right
              is 2 + 3 = 5. The sum of the digits at even positions from the right is 9 + 7 = 16. The
              difference, 16 minus 5 equals 11, is divisible by 11, so 7392 is divisible by 11.
            </p>
            <p className="blog-post-p">
              Example: Is 2090 divisible by 11? The sum of the digits at odd positions from the right
              is 0 + 0 = 0. The sum of the digits at even positions from the right is 9 + 2 = 11. The
              difference, 11 minus 0 equals 11, is divisible by 11, so 2090 is divisible by 11.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Divisible by 12</h2>
            <p className="blog-post-p">A number is divisible by 12 if it is divisible by both 3 and 4.</p>
            <p className="blog-post-p">
              Example: Is 408 divisible by 12? 408 is divisible by 3 since the sum of its digits,
              4 + 0 + 8 = 12, is a multiple of 3, and it is divisible by 4 since its last two digits,
              08, are a multiple of 4. So 408 is divisible by 12.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
