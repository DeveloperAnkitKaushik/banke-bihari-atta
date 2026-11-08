import type { Metadata, Viewport } from "next";
import { Mukta, Rozha_One } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const display = Rozha_One({ variable: "--font-display", weight: "400", subsets: ["devanagari", "latin"] });
const body = Mukta({ variable: "--font-body", weight: ["400", "500", "600", "700"], subsets: ["devanagari", "latin"] });

const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(prodHost ? `https://${prodHost}` : "http://localhost:3000"),
  title: "बांके बिहारी आटा चक्की · Banke Bihari Atta Chakki",
  description: "Fresh stone-ground atta, dals, besan and masale. घर की रसोई का पूरा भरोसा.",
  openGraph: { images: ["/logo.webp"] },
};

export const viewport: Viewport = { themeColor: "#6e1518" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hi" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="paper min-h-dvh">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Toaster theme="light" position="top-center" richColors />
      </body>
    </html>
  );
}
