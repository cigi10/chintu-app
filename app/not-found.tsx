import Link from "next/link";
import "@/styles/button.css";
import "@/styles/not-found.css";
import Companion from "@/components/Companion";

export const metadata = {
  title: "Page not found - Studyloaf",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="notfound-shell">
      <Companion mood="worried" />
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">Chintu couldn&apos;t find that page</h1>
      <p className="notfound-subtitle">
        The page you&apos;re looking for doesn&apos;t exist, or moved somewhere else. No shame, ever, let&apos;s get you back.
      </p>
      <div className="notfound-actions">
        <Link href="/dashboard" className="btn btn--primary btn--lg">
          Back to dashboard
        </Link>
        <Link href="/" className="btn btn--secondary btn--lg">
          Home
        </Link>
      </div>
    </div>
  );
}
