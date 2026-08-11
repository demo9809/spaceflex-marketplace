import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  ShieldCheck,
  UserRound,
  ArrowUpRight,
  Star,
} from "lucide-react";
import type { Agent, Property } from "@/lib/types";
import { agencyForAgent } from "@/lib/data/agencies";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

/* "Listed by" — makes the listing party explicit: a verified brokerage,
   an independent agent, or a private owner. The enquiry contact below
   (ContactCard) is separate; this answers "who is behind this listing". */
export function ListedBy({
  property,
  agent,
  className,
}: {
  property: Property;
  agent: Agent;
  className?: string;
}) {
  const kind = property.listingKind ?? "agency";
  const agency = kind === "agency" ? agencyForAgent(agent.id) : undefined;

  return (
    <section aria-labelledby="listed-by" className={cn(className)}>
      <h2 id="listed-by" className="font-display text-lg font-semibold">
        Listed by
      </h2>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-raised shadow-card">
        {/* ── Party header ── */}
        {kind === "owner" ? (
          <div className="flex items-start gap-4 p-5 md:p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brass-tint text-brass">
              <UserRound size={24} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-semibold">
                  Private owner
                </p>
                <Badge tone="neutral">Individual</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Listed directly by the owner
                {property.owner ? ` (${property.owner.name})` : ""} · on
                SpaceFlex since {property.owner?.since ?? property.yearBuilt}
              </p>
            </div>
          </div>
        ) : agency ? (
          <Link
            href={`/agencies/${agency.slug}`}
            className="group flex items-start gap-4 p-5 transition-colors hover:bg-brass-tint/40 md:p-6"
          >
            <span className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-lg font-semibold text-paper">
              {agency.logoInitials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-semibold">
                  {agency.name}
                </p>
                {agency.verified && (
                  <Badge tone="brass">
                    <BadgeCheck size={12} /> Verified
                  </Badge>
                )}
                <Badge tone="outline">Brokerage</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{agency.tagline}</p>
            </div>
            <ArrowUpRight
              size={18}
              className="mt-1 shrink-0 text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
            />
          </Link>
        ) : (
          <div className="flex items-start gap-4 p-5 md:p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brass-tint text-brass">
              <Building2 size={24} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-semibold">
                  {agent.name}
                </p>
                <Badge tone="outline">Independent agent</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Licensed individual agent · {agent.yearsActive} years on
                SpaceFlex
              </p>
            </div>
          </div>
        )}

        {/* ── Facts row ── */}
        {kind === "agency" && agency && (
          <dl className="grid grid-cols-3 border-t border-line text-center">
            <div className="border-r border-line p-4">
              <dd className="font-display text-lg font-semibold">
                {agency.activeListings}
              </dd>
              <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                Live listings
              </dt>
            </div>
            <div className="border-r border-line p-4">
              <dd className="font-display text-lg font-semibold">
                {agency.since}
              </dd>
              <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                Established
              </dt>
            </div>
            <div className="p-4">
              <dd className="font-display text-lg font-semibold">
                {agency.licenseNo.split("-")[0]}
              </dd>
              <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                Regulated
              </dt>
            </div>
          </dl>
        )}

        {/* ── Represented-by / contact strip ── */}
        <div className="flex items-center gap-3 border-t border-line bg-surface p-4">
          <Link
            href={`/agents/${agent.slug}`}
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-brass-tint"
          >
            <Image
              src={agent.photo}
              alt={agent.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">
              {kind === "owner" ? "Viewings arranged by" : "Represented by"}
            </p>
            <Link
              href={`/agents/${agent.slug}`}
              className="flex items-center gap-1.5 text-sm font-medium hover:text-brass"
            >
              {agent.name}
              {agent.verified && (
                <BadgeCheck size={13} className="shrink-0 text-brass" />
              )}
            </Link>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Star size={12} className="fill-gold stroke-gold" />
            {agent.rating}
          </span>
        </div>

        {/* ── Trust footnote ── */}
        <p className="flex items-center gap-2 border-t border-line px-4 py-3 text-xs text-muted">
          <ShieldCheck size={14} className="shrink-0 text-success" />
          {kind === "owner"
            ? "Owner identity and title are verified by SpaceFlex before publishing."
            : "Licence checked and verified by SpaceFlex."}
        </p>
      </div>
    </section>
  );
}
