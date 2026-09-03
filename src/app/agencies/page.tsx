import type { Metadata } from "next";
import { agencies } from "@/lib/data/agencies";
import { SectionHeading } from "@/components/site/section-heading";
import { CompareTray } from "@/components/site/compare-tray";
import { AgencyDirectory } from "./agency-directory";

export const metadata: Metadata = {
  title: "Real Estate Agencies in Qatar | SpaceFlex",
  description:
    "Explore Qatar's verified, licence-checked real estate agencies and brokerages across Doha, Lusail, and The Pearl.",
};

export default function AgenciesPage() {
  return (
    <>
      <div className="container-site py-14 md:py-20">
        <SectionHeading
          eyebrow="Agency Directory"
          title="Every agency verified. Every licence confirmed."
          description="We licence-check every brokerage, verify their regulatory compliance, and track their active rental portfolios so you work with trusted partners."
        />

        <div className="mt-8">
          <AgencyDirectory agencies={agencies} />
        </div>
      </div>

      <CompareTray />
    </>
  );
}
