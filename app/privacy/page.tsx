import Navbar from "@/components/Navbar";
import "@/styles/legal.css";

export const metadata = {
  title: "Privacy Policy - Studyloaf",
  description: "How Studyloaf collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="legal-shell">
      <h1 className="legal-title">Privacy Policy</h1>
      <p className="legal-updated">Last updated: September 1, 2026</p>

      <p className="legal-p">
        Studyloaf (&quot;we,&quot; &quot;our,&quot; or &quot;the app&quot;) is a study companion
        web app available at studyloaf.com. This Privacy Policy explains what information we
        collect when you use Studyloaf, why we collect it, how it is stored and used, and the
        choices you have. By creating an account or using Studyloaf, you agree to the practices
        described here.
      </p>

      <h2 className="legal-heading">1. Information we collect</h2>
      <p className="legal-p">We collect the following categories of information:</p>
      <ul className="legal-list">
        <li>
          <strong>Account information.</strong> When you sign up, we collect your email address.
          If you sign in with Google, we also receive your name and profile picture as provided
          by your Google account, and a unique Google account identifier used to authenticate you.
        </li>
        <li>
          <strong>Study and productivity data.</strong> Data you create while using Studyloaf,
          including: focus timer session lengths and history, to-do list items and their
          completion status, syllabus/portion tracker selections and progress, timetable entries,
          goals and their progress, achievements earned, and coins or in-app rewards balances.
        </li>
        <li>
          <strong>Companion data.</strong> Your virtual companion&apos;s chosen name, appearance,
          and any accessories or customizations you select.
        </li>
        <li>
          <strong>Preferences.</strong> Your selected color theme, display settings, and other
          in-app configuration choices.
        </li>
        <li>
          <strong>Technical and usage data.</strong> Basic technical information such as browser
          type, device type, and general usage patterns within the app, collected automatically
          to help us maintain and improve Studyloaf&apos;s reliability and performance.
        </li>
      </ul>

      <h2 className="legal-heading">2. Information we do not collect</h2>
      <p className="legal-p">
        We do not collect or store payment card details, government-issued identification numbers,
        precise real-time location data, or your browsing activity outside of the Studyloaf
        website and app. We do not read or access the contents of your email account beyond the
        email address itself.
      </p>

      <h2 className="legal-heading">3. How we use your information</h2>
      <ul className="legal-list">
        <li>To create, secure, and maintain your Studyloaf account</li>
        <li>To save your study progress, settings, and companion so they sync across your sessions and devices</li>
        <li>To operate core features such as the timer, to-do list, goals, timetable, and progress tracking</li>
        <li>To send account-related emails, such as sign-up confirmation, password reset, or important service notices</li>
        <li>To diagnose bugs, monitor performance, and improve the reliability of the app</li>
        <li>To respond to support requests you send us</li>
      </ul>
      <p className="legal-p">We do not use your data for targeted advertising, and we do not sell your data to third parties.</p>

      <h2 className="legal-heading">4. Cookies and similar technologies</h2>
      <p className="legal-p">
        Studyloaf uses essential cookies and browser storage to keep you signed in and to remember
        your preferences (such as your selected theme) between visits. We do not currently use
        third-party advertising or tracking cookies.
      </p>

      <h2 className="legal-heading">5. Google user data</h2>
      <p className="legal-p">
        If you sign in to Studyloaf using &quot;Continue with Google,&quot; Studyloaf receives the
        following information from your Google account through Google&apos;s OAuth sign-in
        process: your name, email address, profile picture, and a unique identifier used to
        recognize your account on future visits. Studyloaf does not request or receive access to
        your Gmail, Google Drive, Google Calendar, contacts, or any other Google product or data
        beyond this basic profile information.
      </p>
      <p className="legal-p">
        This information is used solely to create and authenticate your Studyloaf account, and to
        personalize your experience (for example, displaying your name). It is stored securely in
        our Supabase database and is not shared with any third party except the service providers
        listed below, who process it only as necessary to operate Studyloaf. We do not use data
        obtained through Google sign-in for advertising, and we do not transfer it to any AI model
        training process.
      </p>

      <h2 className="legal-heading">6. Third-party service providers</h2>
      <p className="legal-p">
        We rely on the following third-party services to operate Studyloaf. Each processes a
        limited set of data on our behalf, under their own security and privacy practices:
      </p>
      <ul className="legal-list">
        <li>
          <strong>Supabase</strong> — provides authentication and database storage for your
          account and study data.
        </li>
        <li>
          <strong>Google OAuth</strong> — used if you choose to sign in with your Google account,
          to verify your identity without Studyloaf ever seeing your Google password.
        </li>
        <li>
          <strong>Resend</strong> — sends transactional emails on our behalf, such as sign-up
          confirmations and password resets.
        </li>
        <li>
          <strong>Vercel</strong> — hosts the Studyloaf website and application infrastructure.
        </li>
      </ul>

      <h2 className="legal-heading">7. Data security</h2>
      <p className="legal-p">
        We take reasonable technical and organizational measures to protect your information,
        including encrypted connections (HTTPS) between your browser and our servers, and
        access-controlled database storage through Supabase. No method of transmission or storage
        is completely secure, but we work to protect your data using industry-standard practices
        appropriate for an app of this scale.
      </p>

      <h2 className="legal-heading">8. Data retention</h2>
      <p className="legal-p">
        We retain your account and study data for as long as your account remains active, so that
        your progress and settings are preserved across sessions. If you delete your account or
        request deletion, we will remove your personal data and associated study data within a
        reasonable time, except where retention is required for legitimate technical or legal
        reasons (such as backup rotation).
      </p>

      <h2 className="legal-heading">9. Your rights and choices</h2>
      <p className="legal-p">You can, at any time:</p>
      <ul className="legal-list">
        <li>Request a copy of the personal data we hold about you</li>
        <li>Request correction of inaccurate account information</li>
        <li>Request deletion of your account and associated data</li>
        <li>Withdraw consent to non-essential data processing, where applicable</li>
      </ul>
      <p className="legal-p">
        To exercise any of these rights, contact us at the email address below. We will respond
        within a reasonable timeframe.
      </p>

      <h2 className="legal-heading">10. International users</h2>
      <p className="legal-p">
        Studyloaf is used by students in multiple countries. Your information may be processed
        and stored on servers located outside your own country, including in regions where our
        infrastructure providers (such as Supabase and Vercel) operate. By using Studyloaf, you
        consent to this transfer and processing.
      </p>

      <h2 className="legal-heading">11. Children&apos;s privacy</h2>
      <p className="legal-p">
        Studyloaf is intended for students generally preparing for secondary school, standardized
        tests, or higher-education entrance exams. We do not knowingly collect personal
        information from children under 13. If you believe a child under 13 has created an
        account without appropriate parental consent, please contact us so we can review and
        remove it.
      </p>

      <h2 className="legal-heading">12. Changes to this policy</h2>
      <p className="legal-p">
        We may update this Privacy Policy as Studyloaf&apos;s features evolve. If we make material
        changes, we will update the &quot;Last updated&quot; date at the top of this page, and
        where appropriate, notify users through the app or by email.
      </p>

      <h2 className="legal-heading">13. Contact us</h2>
      <p className="legal-p">
        If you have questions about this Privacy Policy or how your data is handled, contact us
        at{" "}
        <a href="mailto:contactvachmi@gmail.com" className="legal-link">
          contactvachmi@gmail.com
        </a>
        .
      </p>
      </div>
    </>
  );
}