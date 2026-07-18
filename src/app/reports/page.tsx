import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";
import { ReportCard } from "./report-card";

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Quarterly research on GCC and Indian property markets — pricing, absorption, yields and forecasts.",
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
    title: "Dubai Prime Villa Report",
    period: "Mid-Year 2026",
    pages: 18,
    highlights: ["Frond-level Palm pricing", "Emirates Hills record closings", "Renovation cost model"],
    tier: "Free",
  },
  {
    id: "r3",
    title: "Saudi Giga-Corridor Outlook",
    period: "2026–2028",
    pages: 32,
    highlights: ["Riyadh north growth districts", "Vision 2030 supply pipeline", "Institutional entry points"],
    tier: "Premium · $99",
  },
  {
    id: "r4",
    title: "NRI Capital Flows: Gulf → India",
    period: "FY 2025–26",
    pages: 21,
    highlights: ["Remittance-to-property tracking", "Mumbai & Gurugram prime index", "Repatriation rule guide"],
    tier: "Premium · $99",
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
