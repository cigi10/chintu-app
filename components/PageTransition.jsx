"use client";
// components/PageTransition.jsx — simple fade-in on route change.

import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <div key={pathname} style={{ animation: "chintu-fade-in 0.25s ease" }}>
      <style>{`
        @keyframes chintu-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}