import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Farro } from "next/font/google";
import "./globals.css";

const farro = Farro({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://di1-iyr.pages.dev"),
  title: "Di1",
  description: "Di1 is an AI T2SQL Chatbot for Cloudflare D1",
  openGraph: {
    title: "Di1",
    description: "Di1 is an AI T2SQL Chatbot for Cloudflare D1",
    url: "https://di1-iyr.pages.dev",
    siteName: "Di1",
    locale: "en_US",
    type: "website",
    images: "/logobg.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Di1",
    card: "summary_large_image",
  },
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
      <body className={cn(farro.className, "bg-[#2b2b27] antialiased")}>
        <Navbar />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
