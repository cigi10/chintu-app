import "@/styles/globals.css";
import "@/styles/layout.css";
import { JetBrains_Mono, Roboto } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ConditionalNav from "@/components/ConditionalNav";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

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

export const metadata = {
  title: "Studyloaf",
  description: "Study smarter with your companion by your side.",
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
            __html: `try{var t=localStorage.getItem('chintu-theme');var v=['sunset','azure','strawberry','periwinkle','matcha','forest','majorelle','slate','cocoa','starry-nights','rose-noir','midnight-blue','twilight-forest'];document.documentElement.setAttribute('data-theme',v.includes(t)?t:'sunset');}catch(e){}`,
          }}
        />
      </head>
      <body>
        <PageTransition>
          {children}
        </PageTransition>
        <ConditionalNav />
        <Footer />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}