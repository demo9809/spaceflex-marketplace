import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";
import { ReportCard } from "./report-card";

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Quarterly research on Qatar's property market — pricing, absorption, yields and forecasts.",
};

const reports = [
  {
    id: "r1",
    title: "Qatar Residential Review",
    period: "Q2 2026",
    pages: 24,
    highlights: ["Lusail absorption heat map", "Pearl service-charge index", "Rental yield tables by district"],
    tier: "Free",
  },
  {
    id: "r2",
    title: "Qatar Prime Villa Report",
    period: "Mid-Year 2026",
    pages: 18,
    highlights: ["West Bay Lagoon pricing", "Onaiza record closings", "Renovation cost model"],
    tier: "Free",
  },
  {
    id: "r3",
    title: "Lusail Corridor Outlook",
    period: "2026–2028",
    pages: 32,
    highlights: ["Lusail district absorption", "National Vision 2030 pipeline", "Institutional entry points"],
    tier: "Premium · QAR 360",
  },
  {
    id: "r4",
    title: "Expat Freehold Report",
    period: "FY 2025–26",
    pages: 21,
    highlights: ["Freehold vs usufruct demand", "Residency-threshold buying", "Zone-by-zone price index"],
    tier: "Premium · QAR 360",
  },
];

export default function ReportsPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <SectionHeading
        eyebrow="Research Desk"
        title="Market reports built from transaction data"
        description="Every quarter our research team publishes what actually closed — not asking prices. Free reports need only an email; premium editions include full data exports."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
