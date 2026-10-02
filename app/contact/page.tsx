import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import "@/styles/contact.css";

export const metadata = {
  title: "Write to Us - Studyloaf",
  description: "Send Studyloaf a message: bug reports, feature ideas, or anything else.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Write to Us", href: "/contact" },
        ]} />
        <div className="page-header page-header--centered">
          <h1 className="page-title">Write to Us</h1>
          <p className="page-subtitle">Bugs, ideas, or just a hello: this goes straight to the team.</p>
        </div>
        <ContactForm />

        <section className="contact-guide" aria-labelledby="contact-guide-heading">
          <h2 id="contact-guide-heading" className="contact-guide__heading">What helps us most</h2>
          <ul className="contact-guide__list">
            <li>
              <strong>Something broken:</strong> the page you were on, what you tapped or typed, and
              what happened instead of what you expected.
            </li>
            <li>
              <strong>A mistake in a blog post or resource page:</strong>{" "}the page&apos;s title, the
              line that&apos;s wrong, and the correction, with a source if you have one. Exam rules
              change every year, and reader corrections help keep these pages accurate.
            </li>
            <li>
              <strong>A feature idea:</strong> what you were trying to do when you wished the app
              could do it. That tells us more than the feature name alone.
            </li>
          </ul>
          <p className="contact-guide__p">
            The form sends only your message, so there&apos;s no automatic email reply. If
            you&apos;d like an answer, include an email address in the message, or write to{" "}
            <a href="mailto:contact.studyloaf@gmail.com">contact.studyloaf@gmail.com</a>{" "}directly.
            If you&apos;re signed in, your message is linked to your account.
          </p>
        </section>
      </main>
    </div>
  );
}
