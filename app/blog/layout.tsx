import type { ReactNode } from "react";
import AdSenseScript from "@/components/AdSenseScript";

// Wraps every /blog page. Its only job is loading AdSense on blog content
// (see components/AdSenseScript.tsx); ads stay off the rest of the site.
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdSenseScript />
    </>
  );
}
