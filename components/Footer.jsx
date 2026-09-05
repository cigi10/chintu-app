import Link from "next/link";
import "@/styles/footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__copy">© {new Date().getFullYear()} Studyloaf</span>
        <div className="site-footer__links">
          <Link href="/blog" className="site-footer__link">Blog</Link>
          <Link href="/privacy" className="site-footer__link">Privacy Policy</Link>
          <Link href="/terms" className="site-footer__link">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}