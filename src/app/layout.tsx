import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "INVOiSE — Simple Invoice Generator",
  description:
    "Create professional invoices, choose templates and currency, export PDF. Data persists in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", urbanist.variable, "font-sans")}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
