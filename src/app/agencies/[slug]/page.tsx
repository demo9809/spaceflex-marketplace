import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck, Building2, Users } from "lucide-react";
import {
  agencies,
  getAgency,
  agencyAgents,
  agencyListings,
} from "@/lib/data/agencies";
import { AgentCard } from "@/components/agent/agent-card";
import { PropertyCard } from "@/components/property/property-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { CompareTray } from "@/components/site/compare-tray";

export function generateStaticParams() {
  return agencies.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agency = getAgency(slug);
  if (!agency) return {};
  return {
    title: `${agency.name} — Real Estate Agency`,
    description: `${agency.tagline}. ${agency.activeListings} live rental listings across the SpaceFlex marketplace.`,
  };
}

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = getAgency(slug);
  if (!agency) notFound();

  const team = agencyAgents(agency.id);
  const listings = agencyListings(agency.id);

  const stats = [
    { label: "Live rentals", value: String(listings.length || agency.activeListings) },
    { label: "Advisors", value: String(team.length) },
    { label: "Established", value: String(agency.since) },
    { label: "Licence", value: agency.licenseNo },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-site py-14 md:py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            {agency.logo ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
                <Image
                  src={agency.logo}
                  alt={agency.name}
                  fill
                  priority
                  sizes="96px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="font-display flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-ink text-3xl font-semibold text-paper shadow-lift">
                {agency.logoInitials}
              </span>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-h1 font-medium tracking-tight">
                  {agency.name}
                </h1>
                {agency.verified && (
                  <Badge tone="brass">
                    <BadgeCheck size={12} /> Verified
                  </Badge>
                )}
                <Badge tone="outline">
                  <Building2 size={12} /> Licensed Agency
                </Badge>
              </div>
              <p className="mt-2 text-muted">
                {agency.tagline} · Based in {agency.city}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1 text-xs font-medium text-success">
                <ShieldCheck size={13} />
                Licence {agency.licenseNo} · verified by SpaceFlex
              </p>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-raised p-5"
              >
                <dd className="font-display text-2xl font-semibold">
                  {s.value}
                </dd>
                <dt className="mt-0.5 text-xs uppercase tracking-[0.12em] text-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-site py-14 md:py-20">
        {team.length > 0 && (
          <section aria-labelledby="agency-team">
            <SectionHeading
              eyebrow="The team"
              title={`${team.length} advisor${team.length === 1 ? "" : "s"} at ${agency.name}`}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((a) => (
                <AgentCard key={a.id} agent={a} />
              ))}
            </div>
          </section>
        )}

        {listings.length > 0 && (
          <section aria-labelledby="agency-listings" className="mt-20">
            <SectionHeading
              eyebrow="Rental Portfolio"
              title={`Live rentals from ${agency.name}`}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-20 flex flex-col items-center gap-4 rounded-3xl bg-ink px-6 py-14 text-center text-paper">
          <Users size={24} className="text-brass-deep" />
          <h2 className="font-display text-h3 max-w-md font-medium text-balance">
            Are you a licensed agency? List your portfolio on SpaceFlex.
          </h2>
          <ButtonLink href="/list-with-us" variant="inverted" size="lg">
            Partner with us
          </ButtonLink>
        </div>
      </div>

      <CompareTray />
    </>
  );
}
