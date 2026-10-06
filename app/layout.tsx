import "@/styles/globals.css";
import "@/styles/layout.css";
import { JetBrains_Mono, Roboto } from "next/font/google";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import { getAdsenseClient } from "@/lib/adsense";
import ConditionalNav from "@/components/ConditionalNav";
import GuestModeBanner from "@/components/GuestModeBanner";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/seo";

// Self-hosted via next/font: no request to Google at runtime, no
// render-blocking <link>, and no layout shift while the font swaps in.
// Weights match what the manual <link> used to load: bold/extra-bold only
// for the heading font, a fuller range for body text flexibility.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

// metadataBase lets every page's canonical (and other URL fields) be a
// relative path. No canonical is set here on purpose: metadata merges
// shallowly, so a layout-level canonical would be inherited by any page
// that forgot its own and point it at the homepage.
// The google-adsense-account meta tag (not the ad script) stays sitewide so
// AdSense can still verify site ownership from the homepage now that the
// script itself only loads on /blog and /resources. It loads no ad code.
const adsenseClient = getAdsenseClient();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Studyloaf",
  description: "Study smarter with your companion by your side.",
  ...(adsenseClient && { other: { "google-adsense-account": adsenseClient } }),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${roboto.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('chintu-theme');var v=['sunset','azure','strawberry','periwinkle','matcha','forest','majorelle','slate','cocoa','starry-nights','rose-noir','midnight-blue','twilight-forest'];document.documentElement.setAttribute('data-theme',v.includes(t)?t:'cocoa');}catch(e){}`,
          }}
        />
        {/* Site-wide third-party scripts (GA) live in this one component,
            rendered once here so they're never duplicated per page. AdSense
            is not sitewide: it loads only on /blog and /resources, from
            their route layouts. Vercel Analytics is a React component
            rendered in <body> below, as @vercel/analytics/next expects. */}
        <ThirdPartyScripts />
      </head>
      <body>
        <GuestModeBanner />
        <PageTransition>
          {children}
        </PageTransition>
        <ConditionalNav />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}