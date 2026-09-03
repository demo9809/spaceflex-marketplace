import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShieldCheck, ArrowRight, Building2, Users } from "lucide-react";
import type { Agency } from "@/lib/types";
import { agencyAgents, agencyListings } from "@/lib/data/agencies";
import { Badge } from "@/components/ui/badge";

export function AgencyCard({ agency }: { agency: Agency }) {
  const team = agencyAgents(agency.id);
  const listings = agencyListings(agency.id);

  return (
    <article className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-raised p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-brass/40">
      <Link
        href={`/agencies/${agency.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${agency.name}'s agency profile`}
      />

      <div>
        {/* Top bar: Monogram / Initials + Verification */}
        <div className="flex items-start justify-between gap-4">
          {agency.logo ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lift">
              <Image
                src={agency.logo}
                alt={agency.name}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink text-paper font-display text-xl font-bold shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-brass-deep">
              {agency.logoInitials}
            </div>
          )}
          <div className="flex flex-col items-end gap-1.5">
            {agency.verified && (
              <Badge tone="brass" className="flex items-center gap-1 text-[0.6875rem]">
                <BadgeCheck size={12} /> Verified Agency
              </Badge>
            )}
            <span className="text-[0.6875rem] font-medium text-muted">
              Est. {agency.since}
            </span>
          </div>
        </div>

        {/* Agency Name & Tagline */}
        <div className="mt-5">
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink group-hover:text-brass transition-colors">
            {agency.name}
          </h3>
          <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-2">
            {agency.tagline}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-faint">
            <ShieldCheck size={13} className="text-success shrink-0" />
            <span>Licence: {agency.licenseNo}</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-surface/80 p-3 text-center border border-line/60">
          <div>
            <p className="font-display text-lg font-bold text-ink">
              {listings.length || agency.activeListings}
            </p>
            <p className="text-[0.625rem] uppercase tracking-wider text-muted font-medium">
              Live Rentals
            </p>
          </div>
          <div className="border-l border-line/60">
            <p className="font-display text-lg font-bold text-ink">
              {team.length}
            </p>
            <p className="text-[0.625rem] uppercase tracking-wider text-muted font-medium">
              Advisors
            </p>
          </div>
        </div>

        {/* Team Avatars preview */}
        {team.length > 0 && (
          <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between">
            <div className="flex items-center -space-x-2 overflow-hidden">
              {team.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="relative h-8 w-8 rounded-full ring-2 ring-raised overflow-hidden"
                  title={a.name}
                >
                  <Image
                    src={a.photo}
                    alt={a.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ))}
              {team.length > 3 && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass-tint text-[0.625rem] font-bold text-brass ring-2 ring-raised">
                  +{team.length - 3}
                </span>
              )}
            </div>
            <span className="text-xs text-muted line-clamp-1 max-w-[140px] text-right">
              {team[0]?.name}{team.length > 1 ? ` & ${team.length - 1} more` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-5 pt-3 border-t border-line/40 flex items-center justify-between text-xs font-semibold text-brass group-hover:text-brass-deep transition-colors">
        <span>View agency & listings</span>
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </article>
  );
}
