import "@/styles/globals.css";
import "@/styles/layout.css";
import ConditionalNav from "@/components/ConditionalNav";
import PageTransition from "@/components/PageTransition";
import type { ReactNode } from "react";

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
    <html lang="en" suppressHydrationWarning>
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
      </body>
    </html>
  );
}