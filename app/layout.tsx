import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { AI } from "./action";
import "./globals.css";

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Di1",
  description: "Di1 is an AI T2SQL Chatbot for Cloudflare D1",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(sans.className, "bg-[#2b2b27] antialiased")}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
