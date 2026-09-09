import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileTabBar } from "@/components/site/mobile-tab-bar";
import { SavedProvider } from "@/lib/store/saved";
import { AuthProvider } from "@/lib/store/auth";
import { AiAssistantProvider } from "@/lib/store/ai-assistant-context";
import { LeadCaptureProvider } from "@/lib/store/lead-store";
import { AgencyReviewProvider } from "@/lib/store/review-store";
import { LeadCaptureModal } from "@/components/lead/lead-capture-modal";
import { AiAssistantDrawer } from "@/components/site/ai-assistant-drawer";
import { AiFloatingButton } from "@/components/site/ai-floating-button";

const display = Plus_Jakarta_Sans({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "SpaceFlex — Luxury Real Estate in Qatar",
    template: "%s · SpaceFlex",
  },
  description:
    "The curated marketplace for premium property across Qatar — West Bay, The Pearl, Lusail and Msheireb. Verified agents, market intelligence, and investment-grade homes.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SpaceFlex",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${instrument.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <div className="flex min-h-dvh flex-col overflow-x-clip">
          <AuthProvider>
            <SavedProvider>
              <LeadCaptureProvider>
                <AgencyReviewProvider>
                  <AiAssistantProvider>
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                    <MobileTabBar />
                    <LeadCaptureModal />
                    <AiAssistantDrawer />
                    <AiFloatingButton />
                  </AiAssistantProvider>
                </AgencyReviewProvider>
              </LeadCaptureProvider>
            </SavedProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
