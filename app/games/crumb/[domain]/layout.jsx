import "@/styles/crumb.css";
import CrumbDomainTabs from "@/components/CrumbDomainTabs";

// Wraps every individual domain puzzle with the tab switcher, so moving
// between domains is a click within the game rather than a trip back to
// the /games/crumb overview. Adding a domain later is just a new entry
// in lib/wordGame.js's WORD_GAME_DOMAINS - CrumbDomainTabs reads that
// list directly, so this layout never needs to change.
export default function CrumbDomainLayout({ children }) {
  return (
    <>
      <CrumbDomainTabs />
      {children}
    </>
  );
}
