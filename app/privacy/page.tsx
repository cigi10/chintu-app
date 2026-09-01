import "@/styles/legal.css";

export const metadata = {
  title: "Privacy Policy - Studyloaf",
  description: "How Studyloaf collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="legal-shell">
      <h1 className="legal-title">Privacy Policy</h1>
      <p className="legal-updated">Last updated: September 1, 2026</p>

      <p className="legal-p">
        Studyloaf (&quot;we,&quot; &quot;our,&quot; or &quot;the app&quot;) is a study companion web app.
        This page explains what information we collect, why, and how it&apos;s handled.
      </p>

      <h2 className="legal-heading">Information we collect</h2>
      <ul className="legal-list">
        <li>
          <strong>Account information:</strong> When you sign in with Google or create an account
          with email and password, we receive your email address and, if you use Google sign-in,
          your name and profile picture as provided by Google.
        </li>
        <li>
          <strong>Study data you create:</strong> This includes your study timer sessions, to-do
          items, goals, syllabus/portion tracking selections, timetable entries, achievements, and
          your companion&apos;s chosen name and appearance. This data is stored so it syncs across
          your devices.
        </li>
        <li>
          <strong>Preferences:</strong> Your selected theme and other in-app display settings.
        </li>
      </ul>

      <h2 className="legal-heading">What we don&apos;t collect</h2>
      <p className="legal-p">
        We do not collect payment information, government ID numbers, precise location data, or
        browsing activity outside of Studyloaf. We do not sell your data to third parties.
      </p>

      <h2 className="legal-heading">How we use your information</h2>
      <ul className="legal-list">
        <li>To create and maintain your account</li>
        <li>To save and sync your study progress, settings, and companion across sessions and devices</li>
        <li>To communicate with you about your account (e.g., email confirmation, password reset) when necessary</li>
      </ul>

      <h2 className="legal-heading">Where your data is stored</h2>
      <p className="legal-p">
        Studyloaf uses{" "}
        <a href="https://supabase.com" target="_blank" rel="noopener" className="legal-link">
          Supabase
        </a>{" "}
        for authentication and database storage, and Google OAuth for sign-in. Transactional
        emails (such as sign-up confirmation) are sent via{" "}
        <a href="https://resend.com" target="_blank" rel="noopener" className="legal-link">
          Resend
        </a>
        . These providers process data on our behalf under their own security and privacy practices.
      </p>

      <h2 className="legal-heading">Data retention and deletion</h2>
      <p className="legal-p">
        Your data is retained as long as your account is active. If you&apos;d like your account
        and associated data deleted, contact us at the email below and we will remove it.
      </p>

      <h2 className="legal-heading">Children&apos;s privacy</h2>
      <p className="legal-p">
        Studyloaf is intended for students generally preparing for secondary or higher-education
        exams. We do not knowingly collect data from children under 13. If you believe a child
        under 13 has created an account, please contact us so we can remove it.
      </p>

      <h2 className="legal-heading">Changes to this policy</h2>
      <p className="legal-p">
        We may update this policy as Studyloaf evolves. Material changes will be reflected on
        this page with an updated date above.
      </p>

      <h2 className="legal-heading">Contact</h2>
      <p className="legal-p">
        Questions about this policy or your data? Reach out at{" "}
        <a href="mailto:contact@studyloaf.com" className="legal-link">
          contact@studyloaf.com
        </a>
        .
      </p>
    </div>
  );
}