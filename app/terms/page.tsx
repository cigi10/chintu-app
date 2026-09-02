import Navbar from "@/components/Navbar";
import "@/styles/legal.css";

export const metadata = {
  title: "Terms of Service - Studyloaf",
  description: "The terms that apply when you use Studyloaf.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="legal-shell">
      <h1 className="legal-title">Terms of Service</h1>
      <p className="legal-updated">Last updated: September 1, 2026</p>

      <p className="legal-p">
        Welcome to Studyloaf. By creating an account or using the app, you agree to these terms.
      </p>

      <h2 className="legal-heading">What Studyloaf is</h2>
      <p className="legal-p">
        Studyloaf is a study companion web app offering a focus timer, virtual companion, to-do
        list, syllabus tracker, timetable, goals, and related study tools. It&apos;s provided
        as-is, and we&apos;re actively improving it.
      </p>

      <h2 className="legal-heading">Your account</h2>
      <ul className="legal-list">
        <li>You may sign in with Google or create an account with an email and password.</li>
        <li>You&apos;re responsible for keeping your login credentials secure.</li>
        <li>You must provide accurate information and not impersonate another person.</li>
      </ul>

      <h2 className="legal-heading">Acceptable use</h2>
      <p className="legal-p">You agree not to:</p>
      <ul className="legal-list">
        <li>Use Studyloaf for any unlawful purpose</li>
        <li>Attempt to disrupt, hack, or reverse-engineer the app or its infrastructure</li>
        <li>Abuse the service to spam or harass others</li>
      </ul>

      <h2 className="legal-heading">Your content</h2>
      <p className="legal-p">
        Any study data you enter (to-dos, goals, timetable entries, etc.) belongs to you. We
        store it so it can sync across your sessions and devices, but we don&apos;t claim
        ownership of it and don&apos;t share it publicly.
      </p>

      <h2 className="legal-heading">Availability</h2>
      <p className="legal-p">
        Studyloaf is a student-built, evolving project. We aim for reliability but don&apos;t
        guarantee uninterrupted availability, and features may change, be added, or be removed
        over time.
      </p>

      <h2 className="legal-heading">Termination</h2>
      <p className="legal-p">
        You may stop using Studyloaf and request account deletion at any time by contacting us.
        We may suspend or terminate accounts that violate these terms.
      </p>

      <h2 className="legal-heading">Limitation of liability</h2>
      <p className="legal-p">
        Studyloaf is provided without warranties of any kind. To the fullest extent permitted by
        law, we aren&apos;t liable for any indirect or incidental damages arising from your use of
        the app.
      </p>

      <h2 className="legal-heading">Changes to these terms</h2>
      <p className="legal-p">
        We may update these terms as the app develops. Continued use after changes means you
        accept the updated terms.
      </p>

      <h2 className="legal-heading">Contact</h2>
      <p className="legal-p">
        Questions about these terms? Reach out at{" "}
        <a href="mailto:contactvachmi@gmail.com" className="legal-link">
          contactvachmi@gmail.com
        </a>
        .
      </p>
      </div>
    </>
  );
}