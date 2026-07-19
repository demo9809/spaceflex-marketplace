import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileTabBar } from "@/components/site/mobile-tab-bar";
import { SavedProvider } from "@/lib/store/saved";
import { AuthProvider } from "@/lib/store/auth";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SpaceFlex — Luxury Real Estate Across the Gulf & India",
    template: "%s · SpaceFlex",
  },
  description:
    "The curated marketplace for premium property across Qatar, the UAE, Saudi Arabia and India. Verified agents, market intelligence, and investment-grade homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SavedProvider>
            <SiteHeader />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <SiteFooter />
            <MobileTabBar />
          </SavedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
