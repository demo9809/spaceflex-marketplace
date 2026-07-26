"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Navigation } from "lucide-react";
import type { Landmark } from "@/lib/types";
import type { CommuteMatch } from "@/lib/geo";
import { propertyPrice } from "@/lib/format";
import { categoryIcon } from "@/lib/landmark-icons";
import { cn } from "@/lib/utils";

/* Straight-line km reachable within `minutes`, inverting the same
   estimate the engine uses (min = km·detour/speed·60). */
const DETOUR_FACTOR = 1.35;
const AVG_SPEED_KMH = 34;
const reachKm = (minutes: number) => (minutes * AVG_SPEED_KMH) / 60 / DETOUR_FACTOR;

const KM_PER_LAT_DEG = 110.6;
const KM_PER_LNG_DEG = 100.6; /* ≈ 111·cos(25°) at Doha's latitude */

const letter = (i: number) => String.fromCharCode(65 + i);

/* Stylised, dependency-free fallback used when no Google Maps key is set.
   Plots hubs (lettered, with indicative reach rings), matching homes, and a
   dashed path between hubs. */
export function CommuteMapIllustrative({
  hubs,
  matches,
  maxMinutes,
}: {
  hubs: Landmark[];
  matches: CommuteMatch[];
  maxMinutes: number;
}) {
  const [active, setActive] = useState<string | null>(null);

  const geo = useMemo(() => {
    const pts = [
      ...hubs.map((h) => ({ lat: h.lat, lng: h.lng })),
      ...matches.map((m) => ({ lat: m.property.lat, lng: m.property.lng })),
    ];
    const base = pts.length ? pts : hubs.map((h) => ({ lat: h.lat, lng: h.lng }));
    const lats = base.map((p) => p.lat);
    const lngs = base.map((p) => p.lng);
    const pad = 0.06;
    const minLat = (lats.length ? Math.min(...lats) : 25.0) - pad;
    const maxLat = (lats.length ? Math.max(...lats) : 25.4) + pad;
    const minLng = (lngs.length ? Math.min(...lngs) : 51.35) - pad;
    const maxLng = (lngs.length ? Math.max(...lngs) : 51.62) + pad;
    const spanLat = Math.max(maxLat - minLat, 0.02);
    const spanLng = Math.max(maxLng - minLng, 0.02);
    return { minLat, minLng, spanLat, spanLng };
  }, [hubs, matches]);

  const x = (lng: number) => ((lng - geo.minLng) / geo.spanLng) * 88 + 6;
  const y = (lat: number) => (1 - (lat - geo.minLat) / geo.spanLat) * 82 + 9;

  const km = reachKm(maxMinutes);
  const rx = (km / KM_PER_LNG_DEG / geo.spanLng) * 88;
  const ry = (km / KM_PER_LAT_DEG / geo.spanLat) * 82;

  const activeMatch = matches.find((m) => m.property.id === active);
  const hasHubs = hubs.length > 0;

  return (
    <div className="relative h-full min-h-[26rem] w-full overflow-hidden rounded-3xl border border-line bg-[var(--map-canvas)] shadow-card">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 28% 32%, rgb(22 98 70 / 0.07), transparent), radial-gradient(48% 42% at 78% 72%, rgb(174 138 78 / 0.09), transparent)",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {hubs.map((h) => (
          <ellipse
            key={`ring-${h.id}`}
            cx={x(h.lng)}
            cy={y(h.lat)}
            rx={rx}
            ry={ry}
            className="commute-ring"
            fill="var(--brass)"
            fillOpacity={0.06}
            stroke="var(--brass)"
            strokeOpacity={0.4}
            strokeWidth={0.4}
            strokeDasharray="1.4 1.4"
          />
        ))}
        {hubs.length > 1 && (
          <polyline
            points={hubs.map((h) => `${x(h.lng)},${y(h.lat)}`).join(" ")}
            fill="none"
            stroke="var(--ink)"
            strokeOpacity={0.35}
            strokeWidth={0.5}
            strokeDasharray="1.8 1.6"
            strokeLinecap="round"
          />
        )}
      </svg>

      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-raised/90 px-3 py-1.5 text-[0.6875rem] font-medium text-muted shadow-card backdrop-blur-sm">
        <Navigation size={12} className="text-brass" />
        {hasHubs ? `${matches.length} within ~${maxMinutes} min` : "Add a place to begin"}
      </div>

      {matches.map((m) => {
        const p = m.property;
        const on = active === p.id;
        return (
          <button
            key={p.id}
            style={{ left: `${x(p.lng)}%`, top: `${y(p.lat)}%` }}
            onClick={() => setActive(on ? null : p.id)}
            aria-label={`${p.title}, ${propertyPrice(p, true)}, ${m.verdict.worstMinutes} min worst commute`}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold shadow-card transition-all duration-200 hover:z-30 hover:scale-110 focus-visible:z-30",
              on
                ? "z-30 border-ink bg-ink text-paper"
                : "z-10 border-line-strong bg-raised text-ink hover:border-brass"
            )}
          >
            {propertyPrice(p, true).replace(/\s?\/\s?(month|year)/, "")}
          </button>
        );
      })}

      {hubs.map((h, i) => {
        const Icon = categoryIcon[h.category];
        return (
          <div
            key={h.id}
            style={{ left: `${x(h.lng)}%`, top: `${y(h.lat)}%` }}
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brass text-white shadow-lift">
                <Icon size={14} />
              </div>
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[0.5625rem] font-bold text-paper ring-2 ring-white">
                {letter(i)}
              </span>
              <span className="mt-1 max-w-24 truncate rounded-full bg-ink/85 px-2 py-0.5 text-[0.625rem] font-medium text-paper backdrop-blur-sm">
                {h.short}
              </span>
            </div>
          </div>
        );
      })}

      {activeMatch && (
        <div className="absolute bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
          <div className="relative flex gap-3 rounded-2xl border border-line bg-raised p-3 shadow-modal">
            <Link
              href={`/properties/${activeMatch.property.slug}`}
              className="absolute inset-0 z-10"
              aria-label={activeMatch.property.title}
            />
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={activeMatch.property.images[0]}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold">
                {propertyPrice(activeMatch.property, true)}
              </p>
              <p className="truncate text-sm">{activeMatch.property.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-brass">
                <Navigation size={11} />
                {activeMatch.verdict.worstMinutes} min to the furthest place
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

      <p className="pointer-events-none absolute bottom-3 right-4 z-20 text-[0.625rem] text-faint">
        Illustrative · drive times est.
      </p>
    </div>
  );
}
