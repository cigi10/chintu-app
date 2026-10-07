import Link from "next/link";
import { NAV } from "@/lib/navItems";
import "@/styles/footer.css";

// The Navbar's "Free Tools" menu only exists after hydration, so this
// server-rendered footer is the one sitewide crawlable path to the public
// hubs. Keeping every hub here holds each resource, tool and blog page
// within 3 clicks of any page, the homepage included.
const PUBLIC_LINKS = ["blog", "resources", "quiz", "games", "timetableGenerator", "countdown", "gate"];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__copy">© {new Date().getFullYear()} Studyloaf</span>
        <div className="site-footer__links">
          {PUBLIC_LINKS.map(key => (
            <Link key={key} href={NAV[key].href} className="site-footer__link">{NAV[key].label}</Link>
          ))}
          <Link href="/privacy" className="site-footer__link">Privacy Policy</Link>
          <Link href="/terms" className="site-footer__link">Terms of Service</Link>
          <Link href="/contact" className="site-footer__link">Write to Us</Link>
        </div>
      </div>
    </footer>
  );
}