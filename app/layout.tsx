import "@/styles/globals.css";
import "@/styles/layout.css";
import ConditionalNav from "@/components/ConditionalNav";
import PageTransition from "@/components/PageTransition";
import type { ReactNode } from "react";

export const metadata = {
  title: "Your Study Companion",
  description: "Study smarter with Chintu by your side.",
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
            __html: `try{var t=localStorage.getItem('chintu-theme');var v=['sunset','azure','strawberry','periwinkle','matcha','forest','majorelle','slate','cocoa'];document.documentElement.setAttribute('data-theme',v.includes(t)?t:'sunset');}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
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