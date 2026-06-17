// app/layout.tsx
import { Nunito } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata = {
  title: "Chintu 🐿️ — Your Study Companion",
  description: "Study smarter for JEE, NEET, and Placements with Chintu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Nunito', sans-serif", backgroundColor: "#FDF6EC" }}>
        <PageTransition>{children}</PageTransition>
        <BottomNav />
      </body>
    </html>
  );
}