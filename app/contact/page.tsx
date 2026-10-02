import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";

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
      </main>
    </div>
  );
}
