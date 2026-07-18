"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { Property } from "@/lib/types";
import { propertyPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/* Abstract map: normalises lat/lng of the current result set into
   a stylised panel. Swap for Mapbox GL by replacing this component. */
export function MapPanel({ items }: { items: Property[] }) {
  const [active, setActive] = useState<Property | null>(null);

  const lats = items.map((p) => p.lat);
  const lngs = items.map((p) => p.lng);
  const minLat = Math.min(...lats) - 0.35;
  const maxLat = Math.max(...lats) + 0.35;
  const minLng = Math.min(...lngs) - 0.35;
  const maxLng = Math.max(...lngs) + 0.35;

  const pos = (p: Property) => ({
    left: `${((p.lng - minLng) / (maxLng - minLng)) * 88 + 6}%`,
    top: `${(1 - (p.lat - minLat) / (maxLat - minLat)) * 82 + 8}%`,
  });

  return (
    <div className="relative h-full min-h-[28rem] w-full overflow-hidden rounded-2xl border border-line bg-[#eef1ea]">
      {/* Cartographic texture */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 30%, rgb(156 124 72 / 0.08), transparent), radial-gradient(50% 40% at 75% 70%, rgb(60 90 114 / 0.1), transparent)",
        }}
      />
      <p className="absolute left-4 top-4 z-10 rounded-full bg-raised/90 px-3 py-1.5 text-xs font-medium text-muted shadow-card backdrop-blur-sm">
        Illustrative map · {items.length} properties
      </p>

      {items.map((p) => (
        <button
          key={p.id}
          style={pos(p)}
          onClick={() => setActive(active?.id === p.id ? null : p)}
          aria-label={`${p.title}, ${propertyPrice(p, true)}`}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-card transition-all duration-200 hover:z-30 hover:scale-110 focus-visible:z-30",
            active?.id === p.id
              ? "z-20 border-ink bg-ink text-paper"
              : "z-10 border-line-strong bg-raised text-ink hover:border-ink"
          )}
        >
          {propertyPrice(p, true).replace(/\/(month|year)/, "")}
        </button>
      ))}

      {active && (
        <div className="absolute bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
          <div className="relative flex gap-3 rounded-2xl border border-line bg-raised p-3 shadow-modal">
            <Link
              href={`/properties/${active.slug}`}
              className="absolute inset-0 z-10"
              aria-label={active.title}
            />
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={active.images[0]}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold">
                {propertyPrice(active, true)}
              </p>
              <p className="truncate text-sm">{active.title}</p>
              <p className="truncate text-xs text-muted">
                {active.community}, {active.city}
              </p>
            </div>
            <button
              onClick={() => setActive(null)}
              aria-label="Close preview"
              className="relative z-20 h-7 w-7 shrink-0 rounded-full text-muted transition-colors hover:bg-brass-tint hover:text-ink"
            >
              <X size={14} className="mx-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
