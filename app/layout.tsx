import "@/styles/variables.css";
import "@/styles/globals.css";
import "@/styles/layout.css";
import BottomNav from "@/components/BottomNav";
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PageTransition>
          {children}
        </PageTransition>
        <BottomNav />
      </body>
    </html>
  );
}