"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useSaved } from "@/lib/store/saved";
import { properties } from "@/lib/data/properties";
import { PropertyCard } from "@/components/property/property-card";
import { CompareTray } from "@/components/site/compare-tray";
import { ButtonLink } from "@/components/ui/button";

export default function SavedPage() {
  const { saved } = useSaved();
  const items = properties.filter((p) => saved.includes(p.id));

  return (
    <div className="container-site py-14 md:py-20">
      <p className="eyebrow">Your collection</p>
      <h1 className="font-display text-h1 mt-2 font-medium tracking-tight">
        Saved properties
      </h1>
      <p className="mt-2 text-sm text-muted">
        {items.length} {items.length === 1 ? "property" : "properties"} · synced
        to this device
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-line-strong py-24 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brass-tint text-brass">
            <Heart size={26} />
          </span>
          <p className="font-display mt-6 text-2xl font-medium">
            Nothing saved yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Tap the heart on any property to build your shortlist. We&apos;ll
            alert you if a saved home changes price.
          </p>
          <ButtonLink href="/properties" className="mt-6">
            Browse properties
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <p className="mt-10 text-sm text-muted">
            Want these side by side?{" "}
            <Link
              href="/compare"
              className="font-medium text-brass underline underline-offset-4 hover:text-brass-deep"
            >
              Open the comparison tool
            </Link>
            .
          </p>
        </>
      )}
      <CompareTray />
    </div>
  );
}
