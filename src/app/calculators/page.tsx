import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";
import { Calculators } from "./calculators";

export const metadata: Metadata = {
  title: "Investment Calculators",
  description:
    "Mortgage and rental-yield calculators for Qatar property — model payments, yields and break-even before you offer.",
};

export default function CalculatorsPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <SectionHeading
        eyebrow="Tools"
        title="Run the numbers before the viewing"
        description="The same models our research desk uses — simplified. Indicative outputs, not financial advice."
      />
      <Calculators />
    </div>
  );
}
