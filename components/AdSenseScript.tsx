import Script from "next/script";
import { getAdsenseClient, adsenseScriptSrc } from "@/lib/adsense";

// The AdSense loader, rendered only by the /blog and /resources route
// layouts (app/blog/layout.tsx, app/resources/layout.jsx), so it never
// loads on the app itself: onboarding, dashboard, timer, tracker, login,
// shop, games or quiz. Renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT is
// unset. next/script with afterInteractive is Google's recommended way to
// load adsbygoogle.js in Next.js; it dedupes by src across navigations.
export default function AdSenseScript() {
  const client = getAdsenseClient();
  if (!client) return null;
  return (
    <Script
      async
      src={adsenseScriptSrc(client)}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
