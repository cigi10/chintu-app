import Link from "next/link";
import Navbar from "@/components/Navbar";
import UnsubscribeForm from "@/components/UnsubscribeForm";
import { unsubscribeSecret, verifyUnsubscribeToken } from "@/lib/unsubscribeToken";
import "@/styles/legal.css";

// Reached from the link in a study email: /unsubscribe?token=<signed token>
// (lib/unsubscribeToken.js). The token names an email_signups row without
// containing the address. The page is personal and has no content worth
// indexing, and the token shouldn't leak to other sites via Referer.
export const metadata = {
  title: "Unsubscribe - Studyloaf",
  description: "Stop receiving study emails from Studyloaf.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type UnsubscribePageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && verifyUnsubscribeToken(token, unsubscribeSecret()) !== null;

  return (
    <>
      <Navbar />
      <div className="legal-shell">
        <div className="legal-card">
          <h1 className="legal-title">Unsubscribe from study emails</h1>
          {valid ? (
            <>
              <p className="legal-p">
                Press the button to stop receiving study plans and exam updates from Studyloaf.
              </p>
              <UnsubscribeForm token={token} />
            </>
          ) : (
            <p className="legal-p">
              This unsubscribe link isn&apos;t valid. Please use the link from your most recent email, or{" "}
              <Link href="/contact" className="legal-link">write to us</Link> and we&apos;ll remove you.
            </p>
          )}
          <p className="legal-p">
            See the <Link href="/privacy" className="legal-link">privacy policy</Link> for how the email list is handled.
          </p>
        </div>
      </div>
    </>
  );
}
