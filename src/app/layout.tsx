import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileTabBar } from "@/components/site/mobile-tab-bar";
import { SavedProvider } from "@/lib/store/saved";
import { AuthProvider } from "@/lib/store/auth";

const display = Plus_Jakarta_Sans({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SpaceFlex — Luxury Real Estate in Qatar",
    template: "%s · SpaceFlex",
  },
  description:
    "The curated marketplace for premium property across Qatar — West Bay, The Pearl, Lusail and Msheireb. Verified agents, market intelligence, and investment-grade homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${instrument.variable} h-full antialiased`}
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
