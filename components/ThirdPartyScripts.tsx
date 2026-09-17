import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

// Every third-party analytics/ads script the site loads, in one place.
// Rendered once from the root layout, so it applies to every page
// automatically instead of being duplicated per page.
export default function ThirdPartyScripts() {
  return (
    <>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      {/* AdSense verification script — next/script with afterInteractive
          is Google's own recommended approach for loading adsbygoogle.js
          in a Next.js app, rather than a raw <script> tag. */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4680201738326151"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}
