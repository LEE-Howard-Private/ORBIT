import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font downloads at build time and self-hosts, so the demo stays offline-safe.
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ORBIT — Optimized Routing for Better Intelligent Teamwork",
  description:
    "Meetings are not the problem. Unnecessary synchronization is. ORBIT routes every work request to the cheapest path to a decision.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
