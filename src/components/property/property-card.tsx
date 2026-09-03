"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Scale,
  Building2,
  UserRound,
} from "lucide-react";
import type { Property } from "@/lib/types";
import type { CommuteVerdict } from "@/lib/geo";
import { propertyPrice } from "@/lib/format";
import { agencyForAgent } from "@/lib/data/agencies";
import { getAgent } from "@/lib/data/agents";
import { categoryIcon } from "@/lib/landmark-icons";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "./save-button";
import { useSaved } from "@/lib/store/saved";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
  priority = false,
  layout = "grid",
  commute,
}: {
  property: Property;
  priority?: boolean;
  layout?: "grid" | "list";
  /* Present when a multi-landmark commute search is active */
  commute?: CommuteVerdict;
}) {
  const { inCompare, toggleCompare } = useSaved();
  const comparing = inCompare(property.id);

  /* Listing source — brokerage, private owner, or independent agent */
  const isOwner = property.listingKind === "owner";
  const agency = isOwner ? undefined : agencyForAgent(property.agentId);
  const source = isOwner
    ? "Private owner"
    : (agency?.name ?? getAgent(property.agentId)?.name ?? "SpaceFlex");
  const SourceIcon = isOwner ? UserRound : Building2;

  return (
    <article
      className={cn(
        "card-hover group relative shrink-0 overflow-hidden rounded-2xl border border-line bg-raised shadow-card",
        layout === "list" && "sm:flex sm:min-h-52 sm:items-stretch"
      )}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="absolute inset-0 z-10"
        aria-label={property.title}
      />

      <div
        className={cn(
          "img-zoom relative",
          layout === "list"
            ? "aspect-[4/3] sm:aspect-auto sm:h-auto sm:w-64 sm:shrink-0 sm:self-stretch sm:[min-height:13rem] lg:w-72"
            : "aspect-[4/3]"
        )}
      >
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="inverted">
              For Rent
            </Badge>
            {property.exclusive && <Badge tone="brass">Exclusive</Badge>}
          </div>
          <SaveButton id={property.id} />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 p-5",
          layout === "list" && "sm:min-w-0 sm:flex-1 sm:justify-center"
        )}
      >
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            {propertyPrice(property, true)}
          </p>
          <h3 className="mt-1 line-clamp-1 text-[0.9375rem] font-medium text-ink">
            {property.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-[0.8125rem] text-muted">
            <MapPin size={13} className="shrink-0" />
            {property.community}, {property.city}
          </p>
        </div>

        <p className="-mt-1 flex items-center gap-1.5 text-xs text-faint">
          <SourceIcon size={12} className="shrink-0" />
          <span className="truncate">{source}</span>
        </p>

        {/* Estimated drive time to each selected hub */}
        {commute && commute.legs.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {commute.legs
              .slice()
              .sort((a, b) => a.minutes - b.minutes)
              .map((leg) => {
                const Icon = categoryIcon[leg.landmark.category];
                return (
                  <li
                    key={leg.landmark.id}
                    className="flex items-center gap-1 rounded-full bg-brass-tint px-2 py-1 text-[0.6875rem] font-medium text-ink"
                    title={`${leg.km.toFixed(1)} km to ${leg.landmark.name}`}
                  >
                    <Icon size={11} className="shrink-0 text-brass" />
                    {leg.minutes}m
                    <span className="max-w-20 truncate text-muted">
                      {leg.landmark.short}
                    </span>
                  </li>
                );
              })}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-line pt-3 text-[0.8125rem] text-muted">
          {property.beds > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} /> {property.beds}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Bath size={15} /> {property.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={15} /> {property.areaSqft.toLocaleString("en")} sqft
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(property.id);
            }}
            aria-pressed={comparing}
            aria-label={comparing ? "Remove from comparison" : "Add to comparison"}
            title="Compare"
            className={cn(
              "relative z-20 ml-auto flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              comparing
                ? "bg-brass text-white"
                : "text-faint hover:bg-brass-tint hover:text-ink"
            )}
          >
            <Scale size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
