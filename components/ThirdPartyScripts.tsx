import { GoogleAnalytics } from "@next/third-parties/google";
import { internalTrafficScript } from "@/lib/internalTraffic";

// The site-wide third-party scripts (analytics), rendered once from the
// root layout. AdSense is deliberately not here: it loads only on content
// routes, from components/AdSenseScript.tsx.
export default function ThirdPartyScripts() {
  return (
    <>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          {/* A plain inline script runs while <head> is parsed, before the
              GA init script, so ?internal=1 visits have traffic_type set
              before the first page_view. See lib/internalTraffic.js. */}
          <script dangerouslySetInnerHTML={{ __html: internalTrafficScript }} />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </>
      )}
    </>
  );
}
