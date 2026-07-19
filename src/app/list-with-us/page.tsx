import type { Metadata } from "next";
import Image from "next/image";
import { Check, TrendingUp, Users, Camera } from "lucide-react";
import { IMG } from "@/lib/data/properties";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "List with SpaceFlex",
  description:
    "Featured placement, verified-buyer leads and performance analytics for agents and owners. Median time to offer: nine days.",
};

const plans = [
  {
    name: "Featured Listing",
    price: "$49",
    per: "per property / month",
    blurb: "For owners and agents boosting a single property.",
    features: [
      "Homepage featured carousel",
      "Priority in search results for 30 days",
      "Views & enquiry analytics",
      "Verified badge review",
    ],
    cta: "Boost a listing",
    highlight: false,
  },
  {
    name: "Agent Professional",
    price: "$299",
    per: "per month",
    blurb: "The working agent's toolkit — our most popular plan.",
    features: [
      "10 featured listings included",
      "Lead inbox with instant alerts",
      "Advanced analytics dashboard",
      "Partner photographer booking",
      "Bulk upload & listing templates",
      "Priority support",
    ],
    cta: "Start 30-day trial",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$999",
    per: "per month",
    blurb: "For teams running fifty listings and up.",
    features: [
      "50 featured listings included",
      "5 team seats with roles",
      "Agency branding on profiles",
      "Dedicated account manager",
      "Custom reporting & API access",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

const stats = [
  { icon: TrendingUp, value: "9 days", label: "median time to offer for featured listings" },
  { icon: Users, value: "40,000+", label: "registered buyers and renters across 8 markets" },
  { icon: Camera, value: "2.3×", label: "click-through with our photography standard" },
];

export default function ListWithUsPage() {
  return (
    <>
      <section className="relative isolate -mt-16 flex min-h-[60vh] items-end overflow-hidden md:-mt-[4.5rem]">
        <Image
          src={IMG.modernHouse}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/55" />
        <div className="container-site relative z-10 pb-14 pt-40">
          <p className="rise rise-1 eyebrow !text-paper/80">For Agents & Owners</p>
          <h1 className="rise rise-2 font-display text-h1 mt-3 max-w-2xl font-medium text-paper text-balance">
            Serious buyers are already here. Put your listing in front of them.
          </h1>
          <div className="rise rise-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/list-property" variant="inverted" size="lg">
              Create a listing
            </ButtonLink>
            <ButtonLink
              href="#plans"
              variant="outline"
              size="lg"
              className="border-white/30 text-paper hover:border-white/70 hover:bg-white/5"
            >
              See plans
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="container-site grid gap-10 py-14 md:grid-cols-3">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <s.icon size={22} className="text-brass" strokeWidth={1.8} />
              <p className="font-display mt-3 text-4xl font-medium">{s.value}</p>
              <p className="mt-1 max-w-xs text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="plans" className="container-site py-20 md:py-28">
        <SectionHeading
          eyebrow="Plans"
          title="Transparent pricing, no lock-in"
          description="Every plan is monthly. Cancel any time; your listings stay live until the period ends."
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "relative rounded-3xl bg-ink p-8 text-paper shadow-lift"
                  : "relative rounded-3xl border border-line bg-raised p-8 shadow-card"
              }
            >
              {plan.highlight && (
                <Badge tone="brass" className="absolute -top-3 left-8">
                  Most popular
                </Badge>
              )}
              <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
              <p
                className={`mt-1 text-sm ${plan.highlight ? "text-paper/70" : "text-muted"}`}
              >
                {plan.blurb}
              </p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${plan.highlight ? "text-paper/60" : "text-muted"}`}
                >
                  {plan.per}
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${plan.highlight ? "text-brass-deep" : "text-brass"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={plan.name === "Featured Listing" ? "/list-property" : "/signup"}
                variant={plan.highlight ? "inverted" : "outline"}
                size="lg"
                className="mt-8 w-full"
              >
                {plan.cta}
              </ButtonLink>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">
          Pay-per-lead available on all plans: $15–50 per verified enquiry,
          charged only on confirmed delivery.
        </p>
      </section>
    </>
  );
}
