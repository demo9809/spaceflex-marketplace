"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useSaved } from "@/lib/store/saved";
import { properties } from "@/lib/data/properties";
import { propertyPrice, pricePerSqft, formatArea } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

const rows = [
  { label: "Price", get: (p: (typeof properties)[number]) => propertyPrice(p, true) },
  { label: "Price / sqft", get: (p: (typeof properties)[number]) => pricePerSqft(p) },
  { label: "Type", get: (p: (typeof properties)[number]) => p.type },
  { label: "Bedrooms", get: (p: (typeof properties)[number]) => (p.beds > 0 ? String(p.beds) : "—") },
  { label: "Bathrooms", get: (p: (typeof properties)[number]) => String(p.baths) },
  { label: "Built area", get: (p: (typeof properties)[number]) => formatArea(p.areaSqft) },
  { label: "Year built", get: (p: (typeof properties)[number]) => String(p.yearBuilt) },
  { label: "Furnishing", get: (p: (typeof properties)[number]) => p.furnishing },
  { label: "Parking", get: (p: (typeof properties)[number]) => `${p.parking} bays` },
  { label: "Est. yield", get: (p: (typeof properties)[number]) => (p.rentYield ? `${p.rentYield}%` : "—") },
  { label: "Days on market", get: (p: (typeof properties)[number]) => String(p.daysOnMarket) },
  { label: "Location", get: (p: (typeof properties)[number]) => `${p.community}, ${p.city}` },
];

export default function ComparePage() {
  const { compare, toggleCompare } = useSaved();
  const items = properties.filter((p) => compare.includes(p.id));

  return (
    <div className="container-site py-14 md:py-20">
      <p className="eyebrow">Decision tools</p>
      <h1 className="font-display text-h1 mt-2 font-medium tracking-tight">
        Compare properties
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Up to four properties side by side. Add homes from any listing card
        using the scale icon.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-line-strong py-24 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brass-tint text-brass">
            <Scale size={26} />
          </span>
          <p className="font-display mt-6 text-2xl font-medium">
            Nothing to compare yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Tap the scale icon on any property card to add it here.
          </p>
          <ButtonLink href="/properties" className="mt-6">
            Browse properties
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-raised shadow-card">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 border-b border-line p-4 text-left align-bottom text-xs uppercase tracking-[0.14em] text-muted">
                  Property
                </th>
                {items.map((p) => (
                  <th key={p.id} className="border-b border-line p-4 text-left">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        aria-label={`Remove ${p.title}`}
                        className="absolute -right-1 -top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-raised shadow-card transition-colors hover:bg-danger-tint hover:text-danger"
                      >
                        <X size={13} />
                      </button>
                      <Link href={`/properties/${p.slug}`} className="block">
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="220px"
                            className="object-cover"
                          />
                        </span>
                        <span className="mt-2 block font-medium leading-snug">
                          {p.title}
                        </span>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 ? "bg-surface" : ""}>
                  <th className="p-4 text-left text-xs uppercase tracking-[0.12em] text-muted">
                    {row.label}
                  </th>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 font-medium">
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
