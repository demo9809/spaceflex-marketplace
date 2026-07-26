"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Navigation,
  Plus,
  SlidersHorizontal,
  ArrowRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { properties } from "@/lib/data/properties";
import { landmarks, landmarkCategories } from "@/lib/data/landmarks";
import { evaluateCommute, commuteScore, type CommuteMatch } from "@/lib/geo";
import type { Landmark, LandmarkCategory, PropertyType } from "@/lib/types";
import { categoryIcon } from "@/lib/landmark-icons";
import { PropertyCard } from "./property-card";
import { CommuteMap } from "./commute-map";
import { FilterPopover } from "./filter-popover";
import { Button, ButtonLink } from "@/components/ui/button";
import { CompareTray } from "@/components/site/compare-tray";
import { cn } from "@/lib/utils";

type Status = "all" | "sale" | "rent";

const starterIds = ["l1", "l7", "l11", "l22"];
const budgetPresets = [15, 30, 45, 60];
const propertyTypes: PropertyType[] = [
  "Apartment",
  "Villa",
  "Penthouse",
  "Townhouse",
  "Duplex",
  "Office",
];
const bedOptions = ["any", "1", "2", "3", "4", "5"];

const compact = (n: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export function DriveTimeSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const initHubs = params.get("hubs")?.split(",").filter(Boolean) ?? [];

  const [status, setStatus] = useState<Status>(
    (params.get("status") as Status) ?? "all"
  );
  const [aId, setAId] = useState(initHubs[0] ?? "");
  const [bId, setBId] = useState(initHubs[1] ?? "");
  const [type, setType] = useState(params.get("type") ?? "all");
  const [beds, setBeds] = useState(params.get("beds") ?? "any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [maxCommute, setMaxCommute] = useState(Number(params.get("commute")) || 30);

  const aLandmark = useMemo(() => landmarks.find((l) => l.id === aId), [aId]);
  const bLandmark = useMemo(() => landmarks.find((l) => l.id === bId), [bId]);

  const selectedHubs = useMemo(
    () => [aLandmark, bLandmark].filter(Boolean) as Landmark[],
    [aLandmark, bLandmark]
  );

  const hasHubs = selectedHubs.length > 0;

  useEffect(() => {
    const ids = selectedHubs.map((l) => l.id);
    const p = new URLSearchParams();
    if (ids.length) {
      p.set("hubs", ids.join(","));
      p.set("commute", String(maxCommute));
      p.set("match", "all");
    }
    if (status !== "all") p.set("status", status);
    if (type !== "all") p.set("type", type);
    if (beds !== "any") p.set("beds", beds);
    router.replace(`/drive-time${p.toString() ? `?${p}` : ""}`, { scroll: false });
  }, [selectedHubs, maxCommute, status, type, beds, router]);

  const matches: CommuteMatch[] = useMemo(() => {
    if (!selectedHubs.length) return [];
    return properties
      .filter((p) => {
        if (status !== "all" && p.status !== status) return false;
        if (type !== "all" && p.type !== type) return false;
        if (beds !== "any" && p.beds < Number(beds)) return false;
        if (minPrice && p.price < Number(minPrice)) return false;
        if (maxPrice && p.price > Number(maxPrice)) return false;
        if (minArea && p.areaSqft < Number(minArea)) return false;
        if (maxArea && p.areaSqft > Number(maxArea)) return false;
        return true;
      })
      .map((property) => ({
        property,
        verdict: evaluateCommute(property, selectedHubs, maxCommute, "all"),
      }))
      .filter((m) => m.verdict.passes)
      .sort(
        (a, b) => commuteScore(a.verdict, "all") - commuteScore(b.verdict, "all")
      );
  }, [selectedHubs, maxCommute, status, type, beds, minPrice, maxPrice, minArea, maxArea]);

  const fullSearchHref = useMemo(() => {
    const ids = selectedHubs.map((l) => l.id);
    const p = new URLSearchParams();
    if (ids.length) {
      p.set("hubs", ids.join(","));
      p.set("commute", String(maxCommute));
      p.set("match", "all");
    }
    if (status !== "all") p.set("status", status);
    if (type !== "all") p.set("type", type);
    if (beds !== "any") p.set("beds", beds);
    return `/properties${p.toString() ? `?${p}` : ""}`;
  }, [selectedHubs, maxCommute, status, type, beds]);

  const addStarter = (id: string) => {
    if (!aId) setAId(id);
    else if (!bId) setBId(id);
  };

  const priceSummary =
    minPrice && maxPrice
      ? `${compact(Number(minPrice))}–${compact(Number(maxPrice))}`
      : maxPrice
        ? `≤ ${compact(Number(maxPrice))}`
        : minPrice
          ? `≥ ${compact(Number(minPrice))}`
          : null;

  const areaSummary =
    minArea && maxArea
      ? `${compact(Number(minArea))}–${compact(Number(maxArea))}`
      : maxArea
        ? `≤ ${compact(Number(maxArea))}`
        : minArea
          ? `≥ ${compact(Number(minArea))}`
          : null;

  const statusLabel =
    status === "sale" ? "Buy" : status === "rent" ? "Rent" : "Buy & Rent";

  const letterBadge = (l: string) => (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass text-[0.625rem] font-bold text-white">
      {l}
    </span>
  );

  /* All filter fields — rendered horizontally in the top bar (results mode)
     or stacked full-width in the left column (setup mode). */
  const renderFields = (fullWidth: boolean) => (
    <>
      <FilterPopover
        label="Buy & Rent"
        value={statusLabel}
        active={status !== "all"}
        fullWidth={fullWidth}
      >
        {(close) => (
          <div className="space-y-1">
            {(
              [
                { v: "all", label: "Buy & Rent" },
                { v: "sale", label: "Buy" },
                { v: "rent", label: "Rent" },
              ] as const
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => {
                  setStatus(o.v);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  status === o.v ? "bg-brass-tint font-medium text-ink" : "hover:bg-surface"
                )}
              >
                {o.label}
                {status === o.v && <span className="text-brass">✓</span>}
              </button>
            ))}
          </div>
        )}
      </FilterPopover>

      <FilterPopover
        leading={letterBadge("A")}
        label="First point of interest"
        value={aLandmark?.short}
        active={!!aId}
        fullWidth={fullWidth}
        panelWidth={340}
      >
        {(close) => (
          <LandmarkPicker
            selectedId={aId}
            excludeId={bId}
            onSelect={(id) => {
              setAId(id);
              close();
            }}
            onClear={() => {
              setAId("");
              close();
            }}
          />
        )}
      </FilterPopover>

      <FilterPopover
        leading={letterBadge("B")}
        label="Second point of interest"
        value={bLandmark?.short}
        active={!!bId}
        fullWidth={fullWidth}
        panelWidth={340}
      >
        {(close) => (
          <LandmarkPicker
            selectedId={bId}
            excludeId={aId}
            onSelect={(id) => {
              setBId(id);
              close();
            }}
            onClear={() => {
              setBId("");
              close();
            }}
          />
        )}
      </FilterPopover>

      <FilterPopover
        label="Property type"
        value={type === "all" ? null : type}
        active={type !== "all"}
        fullWidth={fullWidth}
      >
        {(close) => (
          <div className="space-y-1">
            {["all", ...propertyTypes].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  type === t ? "bg-brass-tint font-medium text-ink" : "hover:bg-surface"
                )}
              >
                {t === "all" ? "Any type" : t}
                {type === t && <span className="text-brass">✓</span>}
              </button>
            ))}
          </div>
        )}
      </FilterPopover>

      <FilterPopover
        label="Beds & Baths"
        value={beds === "any" ? null : `${beds}+ Beds`}
        active={beds !== "any"}
        fullWidth={fullWidth}
      >
        {() => (
          <div>
            <p className="mb-2 text-[0.8125rem] font-medium text-muted">Bedrooms</p>
            <div className="flex flex-wrap gap-2">
              {bedOptions.map((b) => (
                <button
                  key={b}
                  onClick={() => setBeds(b)}
                  aria-pressed={beds === b}
                  className={cn(
                    "h-9 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors",
                    beds === b
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-muted hover:border-ink hover:text-ink"
                  )}
                >
                  {b === "any" ? "Any" : `${b}+`}
                </button>
              ))}
            </div>
          </div>
        )}
      </FilterPopover>

      <FilterPopover
        label="Price (QAR)"
        value={priceSummary}
        active={!!priceSummary}
        fullWidth={fullWidth}
      >
        {() => (
          <MinMaxPanel
            unit="QAR"
            min={minPrice}
            max={maxPrice}
            onMin={setMinPrice}
            onMax={setMaxPrice}
            step={50000}
          />
        )}
      </FilterPopover>

      <FilterPopover
        label="Area (sqft)"
        value={areaSummary}
        active={!!areaSummary}
        fullWidth={fullWidth}
      >
        {() => (
          <MinMaxPanel
            unit="sqft"
            min={minArea}
            max={maxArea}
            onMin={setMinArea}
            onMax={setMaxArea}
            step={100}
          />
        )}
      </FilterPopover>

      <FilterPopover
        leading={<Navigation size={14} className="text-brass" />}
        label="Drive time"
        value={`${maxCommute} minutes`}
        active
        fullWidth={fullWidth}
      >
        {() => (
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[0.8125rem] font-medium text-muted">
                Max drive time
              </span>
              <span className="font-display text-lg font-semibold text-ink">
                {maxCommute} min
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={maxCommute}
              onChange={(e) => setMaxCommute(Number(e.target.value))}
              aria-label="Maximum drive time in minutes"
              className="mt-3 w-full accent-[var(--brass)]"
            />
            <div className="mt-2 flex gap-1.5">
              {budgetPresets.map((m) => (
                <button
                  key={m}
                  onClick={() => setMaxCommute(m)}
                  aria-pressed={maxCommute === m}
                  className={cn(
                    "flex-1 rounded-full border py-1.5 text-xs font-medium transition-colors",
                    maxCommute === m
                      ? "border-brass bg-brass-tint text-ink"
                      : "border-line text-muted hover:border-ink hover:text-ink"
                  )}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        )}
      </FilterPopover>
    </>
  );

  const returnLink = (
    <Link
      href="/properties"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brass transition-colors hover:text-brass-deep"
    >
      <ChevronLeft size={16} /> Return to regular search
    </Link>
  );

  return (
    <>
      {/* Top filter bar — only once a search is active */}
      {hasHubs && (
        <div className="sticky top-16 z-40 border-b border-line bg-paper/90 backdrop-blur-xl md:top-[4.5rem]">
          <div className="container-site">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
              {renderFields(false)}
            </div>
          </div>
        </div>
      )}

      <div className="container-site pb-24 pt-6">
        {!hasHubs ? (
          /* ── SETUP MODE — fields on the left, map on the right ── */
          <div className="grid gap-8 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <div>
              {returnLink}
              <p className="eyebrow mt-5 flex items-center gap-1.5">
                <Navigation size={13} /> Search by commute
              </p>
              <h1 className="font-display text-h3 mt-2 font-medium tracking-tight text-balance">
                Find homes by drive time
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Add the places your day revolves around — we&apos;ll map only the
                homes that reach them within your budget.
              </p>

              <div className="mt-5 space-y-2.5">{renderFields(true)}</div>

              <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
                <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-faint">
                  <Sparkles size={12} /> Popular starts
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {starterIds
                    .map((id) => landmarks.find((l) => l.id === id))
                    .filter(Boolean)
                    .map((l) => {
                      const lm = l as Landmark;
                      const Icon = categoryIcon[lm.category];
                      return (
                        <button
                          key={lm.id}
                          onClick={() => addStarter(lm.id)}
                          className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-[0.8125rem] font-medium text-ink transition-colors hover:border-brass hover:bg-brass-tint"
                        >
                          <Icon size={13} className="text-brass" />
                          {lm.short}
                          <Plus size={13} className="text-faint" />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="h-[24rem] lg:h-[34rem]">
                <CommuteMap hubs={[]} matches={[]} maxMinutes={maxCommute} />
              </div>
            </div>
          </div>
        ) : (
          /* ── RESULTS MODE — results on the left, map on the right ── */
          <>
            {returnLink}
            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_minmax(0,30rem)]">
              <div className="min-w-0">
                {matches.length === 0 ? (
                  <NoMatches
                    onWiden={() => setMaxCommute((m) => Math.min(60, m + 15))}
                  />
                ) : (
                  <>
                    <div className="mb-5 flex items-end justify-between gap-4">
                      <div>
                        <h1 className="font-display text-h4 font-semibold tracking-tight">
                          Properties near your points
                        </h1>
                        <p className="mt-1 text-sm text-muted" aria-live="polite">
                          {matches.length} {matches.length === 1 ? "home" : "homes"}{" "}
                          within {maxCommute} min · best commute first
                        </p>
                      </div>
                      <ButtonLink
                        href={fullSearchHref}
                        variant="outline"
                        size="sm"
                        className="hidden shrink-0 sm:inline-flex"
                      >
                        Full search
                        <ArrowRight size={15} />
                      </ButtonLink>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {matches.slice(0, 16).map((m, i) => (
                        <PropertyCard
                          key={m.property.id}
                          property={m.property}
                          priority={i < 2}
                          commute={m.verdict}
                        />
                      ))}
                    </div>
                    {matches.length > 16 && (
                      <div className="mt-8 text-center">
                        <ButtonLink href={fullSearchHref} variant="outline">
                          See all {matches.length} in full search
                          <ArrowRight size={16} />
                        </ButtonLink>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="lg:sticky lg:top-[9rem] lg:self-start">
                <div className="h-[24rem] lg:h-[calc(100svh-11rem)] lg:max-h-[42rem]">
                  <CommuteMap
                    hubs={selectedHubs}
                    matches={matches}
                    maxMinutes={maxCommute}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky mobile CTA */}
      {hasHubs && matches.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
          <ButtonLink href={fullSearchHref} variant="brass" className="w-full">
            Open {matches.length} {matches.length === 1 ? "home" : "homes"} in full search
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
      )}

      <CompareTray />
    </>
  );
}

/* ── Landmark autocomplete used inside the A / B popovers ── */
function LandmarkPicker({
  selectedId,
  excludeId,
  onSelect,
  onClear,
}: {
  selectedId: string;
  excludeId: string;
  onSelect: (id: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<LandmarkCategory | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landmarks
      .filter((l) => l.id !== excludeId)
      .filter((l) => (cat === "All" ? true : l.category === cat))
      .filter((l) => (q ? `${l.name} ${l.city}`.toLowerCase().includes(q) : true))
      .slice(0, 30);
  }, [query, cat, excludeId]);

  return (
    <div>
      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search offices, schools, malls…"
          aria-label="Search places"
          className="h-10 w-full rounded-xl border border-line bg-surface pl-8 pr-3 text-sm placeholder:text-faint focus:border-brass focus:outline-none"
        />
      </div>

      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
        {(["All", ...landmarkCategories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as LandmarkCategory | "All")}
            aria-pressed={cat === c}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              cat === c
                ? "border-brass bg-brass-tint text-ink"
                : "border-line text-muted hover:border-ink hover:text-ink"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {selectedId && (
        <button
          onClick={onClear}
          className="mt-2 w-full rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Clear selection
        </button>
      )}

      <ul className="mt-2 max-h-56 space-y-0.5 overflow-y-auto">
        {results.length === 0 && (
          <li className="px-3 py-4 text-center text-xs text-faint">
            No places match “{query}”.
          </li>
        )}
        {results.map((l) => {
          const Icon = categoryIcon[l.category];
          const on = l.id === selectedId;
          return (
            <li key={l.id}>
              <button
                onClick={() => onSelect(l.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  on ? "bg-brass-tint" : "hover:bg-surface"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    on ? "bg-brass text-white" : "bg-surface text-muted"
                  )}
                >
                  <Icon size={13} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{l.name}</span>
                  <span className="block truncate text-xs text-faint">
                    {l.category} · {l.city}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Min / max numeric panel for price and area ── */
function MinMaxPanel({
  unit,
  min,
  max,
  onMin,
  onMax,
  step,
}: {
  unit: string;
  min: string;
  max: string;
  onMin: (v: string) => void;
  onMax: (v: string) => void;
  step: number;
}) {
  const field =
    "h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm placeholder:text-faint focus:border-brass focus:outline-none";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <label className="mb-1 block text-[0.6875rem] font-medium uppercase tracking-wide text-faint">
          Min ({unit})
        </label>
        <input
          type="number"
          inputMode="numeric"
          step={step}
          value={min}
          onChange={(e) => onMin(e.target.value)}
          placeholder="No min"
          className={field}
        />
      </div>
      <span className="mt-5 text-faint">–</span>
      <div className="flex-1">
        <label className="mb-1 block text-[0.6875rem] font-medium uppercase tracking-wide text-faint">
          Max ({unit})
        </label>
        <input
          type="number"
          inputMode="numeric"
          step={step}
          value={max}
          onChange={(e) => onMax(e.target.value)}
          placeholder="No max"
          className={field}
        />
      </div>
    </div>
  );
}

/* ── No-matches state ── */
function NoMatches({ onWiden }: { onWiden: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-tint text-danger">
        <SlidersHorizontal size={24} strokeWidth={1.8} />
      </div>
      <h2 className="font-display mt-5 text-xl font-semibold">
        No homes reach every point in time
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        The furthest point is the binding constraint. Try giving yourself a little
        more time on the road, or adjust your filters.
      </p>
      <div className="mt-6">
        <Button variant="brass" onClick={onWiden}>
          Add 15 minutes
        </Button>
      </div>
    </div>
  );
}
