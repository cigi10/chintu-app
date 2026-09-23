import Navbar from "@/components/Navbar";

// Shared shell for every /games route (hub and each domain page) so the
// Navbar isn't re-rendered per page - matches the page-root/page-main
// wrapper every other top-level route uses.
export default function GamesLayout({ children }) {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">{children}</main>
    </div>
  );
}
