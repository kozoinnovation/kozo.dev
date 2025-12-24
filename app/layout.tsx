import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "kozo.dev",
    template: "%s | kozo.dev",
  },
  description: "SaaS Developer - Building embeddable micro-SaaS",
  openGraph: {
    title: "kozo.dev",
    description: "SaaS Developer - Building embeddable micro-SaaS",
    url: "https://kozo.dev",
    siteName: "kozo.dev",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@kozo_innov",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
