"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Navigation,
  Plus,
  SlidersHorizontal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  X,
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
import { useScrollNav } from "@/lib/use-scroll-nav";
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

const getLetter = (i: number) => String.fromCharCode(65 + i);

export function DriveTimeSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const navVisible = useScrollNav();
  const initHubs = params.get("hubs")?.split(",").filter(Boolean) ?? [];

  const [status, setStatus] = useState<Status>(
    (params.get("status") as Status) ?? "all"
  );
  
  /* Dynamic list of point of interest IDs */
  const [hubIds, setHubIds] = useState<string[]>(initHubs);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(initHubs.length > 0);

  const [type, setType] = useState(params.get("type") ?? "all");
  const [beds, setBeds] = useState(params.get("beds") ?? "any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [maxCommute, setMaxCommute] = useState(Number(params.get("commute")) || 30);

  const selectedHubs = useMemo(
    () => hubIds.map((id) => landmarks.find((l) => l.id === id)).filter(Boolean) as Landmark[],
    [hubIds]
  );

  const hasResults = isSubmitted && selectedHubs.length > 0;

  const addHub = (id: string) => {
    if (!id || hubIds.includes(id)) return;
    setHubIds((prev) => [...prev, id]);
  };

  const removeHub = (index: number) => {
    setHubIds((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setIsSubmitted(false);
      return next;
    });
  };

  const updateHub = (index: number, id: string) => {
    setHubIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  };

  const addStarter = (id: string) => {
    addHub(id);
  };

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

      {/* Dynamic Points of Interest */}
      {selectedHubs.map((hub, i) => (
        <div key={`${hub.id}-${i}`} className="flex items-center gap-1.5 w-full">
          <div className="flex-1 min-w-0">
            <FilterPopover
              leading={letterBadge(getLetter(i))}
              label={`Point of interest ${getLetter(i)}`}
              value={hub.short}
              active={true}
              fullWidth={fullWidth}
              panelWidth={340}
            >
              {(close) => (
                <LandmarkPicker
                  selectedId={hub.id}
                  excludeIds={hubIds.filter((id) => id !== hub.id)}
                  onSelect={(id) => {
                    updateHub(i, id);
                    close();
                  }}
                  onClear={() => {
                    removeHub(i);
                    close();
                  }}
                />
              )}
            </FilterPopover>
          </div>
          {fullWidth && (
            <button
              type="button"
              onClick={() => removeHub(i)}
              aria-label={`Remove ${hub.short}`}
              className="flex h-11 w-10 shrink-0 items-center justify-center rounded-2xl border border-line bg-raised text-muted transition-colors hover:border-danger hover:bg-danger-tint hover:text-danger"
            >
              <X size={15} />
            </button>
          )}
        </div>
      ))}

      {/* Add Point of Interest Button */}
      <FilterPopover
        leading={<Plus size={15} className="text-brass" />}
        label={selectedHubs.length === 0 ? "Add point of interest" : "+ Add point of interest"}
        value={null}
        active={false}
        fullWidth={fullWidth}
        panelWidth={340}
      >
        {(close) => (
          <LandmarkPicker
            excludeIds={hubIds}
            onSelect={(id) => {
              addHub(id);
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
      {/* Top filter bar — only in results mode */}
      {hasResults && (
        <div
          className={cn(
            "sticky z-40 border-b border-line bg-paper/90 backdrop-blur-xl transition-[top] duration-300 md:top-[4.5rem]",
            navVisible ? "top-16" : "top-0"
          )}
        >
          <div className="container-site">
            <ScrollableRow>{renderFields(false)}</ScrollableRow>
          </div>
        </div>
      )}

      <div className="container-site pb-24 pt-6">
        {!hasResults ? (
          /* ── SETUP MODE — modern elegant SetupPanel on left, full height map on right ── */
          <div className="grid gap-8 lg:grid-cols-[minmax(0,25rem)_1fr]">
            <SetupPanel
              selectedHubs={selectedHubs}
              hubIds={hubIds}
              maxCommute={maxCommute}
              setMaxCommute={setMaxCommute}
              status={status}
              setStatus={setStatus}
              type={type}
              setType={setType}
              beds={beds}
              setBeds={setBeds}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              matches={matches}
              onAddHub={addHub}
              onRemoveHub={removeHub}
              onSearch={() => setIsSubmitted(true)}
              returnLink={returnLink}
            />

            {/* Full Height Map Column (Setup Mode) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="h-[28rem] sm:h-[34rem] lg:h-[calc(100vh-8rem)] lg:min-h-[38rem] overflow-hidden rounded-3xl border border-line shadow-card">
                <CommuteMap hubs={selectedHubs} matches={matches} maxMinutes={maxCommute} />
              </div>
            </div>
          </div>
        ) : (
          /* ── RESULTS MODE — results on the left, full height map on the right ── */
          <>
            <div className="flex items-center justify-between gap-4">
              {returnLink}
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brass hover:bg-brass-tint"
              >
                <SlidersHorizontal size={13} className="text-brass" />
                Edit Places & Setup
              </button>
            </div>

            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_minmax(0,32rem)]">
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

              {/* Full Height Map Column (Results Mode) */}
              <div className="lg:sticky lg:top-[8.5rem] lg:self-start">
                <div className="h-[28rem] sm:h-[34rem] lg:h-[calc(100vh-10rem)] lg:min-h-[38rem] overflow-hidden rounded-3xl border border-line shadow-card">
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
      {hasResults && matches.length > 0 && (
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

/* ── Landmark autocomplete used inside the popovers ── */
function LandmarkPicker({
  selectedId = "",
  excludeIds = [],
  onSelect,
  onClear,
}: {
  selectedId?: string;
  excludeIds?: string[];
  onSelect: (id: string) => void;
  onClear?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<LandmarkCategory | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landmarks
      .filter((l) => !excludeIds.includes(l.id))
      .filter((l) => (cat === "All" ? true : l.category === cat))
      .filter((l) => (q ? `${l.name} ${l.city}`.toLowerCase().includes(q) : true))
      .slice(0, 30);
  }, [query, cat, excludeIds]);

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

      {selectedId && onClear && (
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

/* ── Interactive Scrollable Row with Left & Right Arrow Controls ── */
function ScrollableRow({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  const scrollBy = (offset: number) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center w-full group">
      {/* Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-240)}
          aria-label="Scroll filter bar left"
          className="absolute -left-2 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-md transition-all hover:bg-brass-tint hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth py-3 w-full"
      >
        {children}
      </div>

      {/* Right Scroll Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy(240)}
          aria-label="Scroll filter bar right"
          className="absolute -right-2 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-md transition-all hover:bg-brass-tint hover:scale-105 active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

/* ── Modern, Elegant Setup Panel Builder ── */
function SetupPanel({
  selectedHubs,
  hubIds,
  maxCommute,
  setMaxCommute,
  status,
  setStatus,
  type,
  setType,
  beds,
  setBeds,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  matches,
  onAddHub,
  onRemoveHub,
  onSearch,
  returnLink,
}: {
  selectedHubs: Landmark[];
  hubIds: string[];
  maxCommute: number;
  setMaxCommute: (n: number) => void;
  status: Status;
  setStatus: (s: Status) => void;
  type: string;
  setType: (t: string) => void;
  beds: string;
  setBeds: (b: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  matches: CommuteMatch[];
  onAddHub: (id: string) => void;
  onRemoveHub: (i: number) => void;
  onSearch: () => void;
  returnLink: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landmarks
      .filter((l) => !hubIds.includes(l.id))
      .filter((l) => (q ? `${l.name} ${l.city} ${l.category}`.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [query, hubIds]);

  return (
    <div className="space-y-6">
      <div>
        {returnLink}
        <p className="eyebrow mt-4 flex items-center gap-1.5 text-brass">
          <Navigation size={13} /> Commute Intelligence
        </p>
        <h1 className="font-display text-h3 mt-1.5 font-medium tracking-tight text-balance">
          Find homes by drive time
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Add your daily destinations — we&apos;ll pinpoint homes that keep all your trips within budget.
        </p>
      </div>

      {/* STEP 1: Add Points of Interest Card */}
      <div className="rounded-3xl border border-line bg-raised p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[0.6875rem] font-bold text-white">
              1
            </span>
            Points of Interest ({selectedHubs.length})
          </label>
        </div>

        {/* Live Search Input with Dropdown */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 text-faint"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search office, school, mall, landmark in Qatar…"
              className="h-11 w-full rounded-2xl border border-line bg-paper pl-10 pr-4 text-sm font-medium placeholder:text-faint focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-line bg-paper p-2 shadow-xl backdrop-blur-xl">
              <p className="px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-faint">
                Suggested Places in Qatar
              </p>
              <ul className="max-h-56 overflow-y-auto space-y-0.5">
                {searchResults.map((l) => {
                  const Icon = categoryIcon[l.category];
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        onMouseDown={() => {
                          onAddHub(l.id);
                          setQuery("");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brass-tint"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-brass">
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink">
                            {l.name}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {l.category} · {l.city}
                          </span>
                        </span>
                        <Plus size={15} className="text-brass shrink-0" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Selected Hub Cards List */}
        {selectedHubs.length > 0 ? (
          <div className="space-y-2">
            {selectedHubs.map((hub, i) => {
              const Icon = categoryIcon[hub.category];
              return (
                <div
                  key={`${hub.id}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-3 shadow-xs transition-colors hover:border-brass/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass text-xs font-bold text-white shadow-xs">
                      {getLetter(i)}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {hub.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {hub.category} · {hub.city}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveHub(i)}
                    aria-label={`Remove ${hub.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-danger-tint hover:text-danger"
                  >
                    <X size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line-strong p-4 text-xs text-muted">
            <MapPin size={18} className="text-brass shrink-0" />
            <span>
              Search above or tap popular locations below to calculate your drive times.
            </span>
          </div>
        )}

        {/* Popular Qatar Locations */}
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-faint mb-2">
            Popular Qatar Destinations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {starterIds
              .map((id) => landmarks.find((l) => l.id === id))
              .filter((l): l is Landmark => Boolean(l && !hubIds.includes(l.id)))
              .map((lm) => {
                const Icon = categoryIcon[lm.category];
                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => onAddHub(lm.id)}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass hover:bg-brass-tint"
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

      {/* STEP 2: Drive Time Budget Card */}
      <div className="rounded-3xl border border-line bg-raised p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[0.6875rem] font-bold text-white">
              2
            </span>
            Max Drive Time Budget
          </label>
          <span className="font-display text-base font-bold text-ink">
            {maxCommute} minutes
          </span>
        </div>

        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={maxCommute}
          onChange={(e) => setMaxCommute(Number(e.target.value))}
          aria-label="Maximum drive time"
          className="w-full accent-[var(--brass)] cursor-pointer"
        />

        <div className="flex gap-1.5 pt-1">
          {[15, 20, 30, 45, 60].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMaxCommute(m)}
              aria-pressed={maxCommute === m}
              className={cn(
                "flex-1 rounded-xl border py-1.5 text-xs font-semibold transition-all",
                maxCommute === m
                  ? "border-brass bg-brass text-white shadow-xs"
                  : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
              )}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      {/* STEP 3: Optional Property Preferences (Collapsible Card) */}
      <div className="rounded-3xl border border-line bg-raised p-5 shadow-card space-y-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[0.6875rem] font-bold text-white">
              3
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Property Preferences (Optional)
            </span>
          </div>
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showFilters && (
          <div className="space-y-4 pt-2 border-t border-line/60">
            {/* Listing Type Segmented Control */}
            <div>
              <p className="text-xs font-medium text-muted mb-2">Listing Type</p>
              <div className="flex rounded-xl border border-line bg-paper p-1">
                {(
                  [
                    { v: "all", label: "Buy & Rent" },
                    { v: "sale", label: "Buy" },
                    { v: "rent", label: "Rent" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setStatus(o.v)}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all",
                      status === o.v
                        ? "bg-ink text-paper shadow-xs"
                        : "text-muted hover:text-ink"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Pills */}
            <div>
              <p className="text-xs font-medium text-muted mb-2">Property Type</p>
              <div className="flex flex-wrap gap-1.5">
                {["all", "Apartment", "Villa", "Penthouse", "Townhouse"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      type === t
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {t === "all" ? "Any Type" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms Row */}
            <div>
              <p className="text-xs font-medium text-muted mb-2">Bedrooms</p>
              <div className="flex gap-1.5">
                {["any", "1", "2", "3", "4"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBeds(b)}
                    className={cn(
                      "flex-1 rounded-xl border py-1.5 text-xs font-semibold transition-colors",
                      beds === b
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {b === "any" ? "Any" : `${b}+ Beds`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Inputs */}
            <div>
              <p className="text-xs font-medium text-muted mb-2">Price Range (QAR)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-xs placeholder:text-faint focus:border-brass focus:outline-none"
                />
                <span className="text-faint">–</span>
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-xs placeholder:text-faint focus:border-brass focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <Button
        variant="brass"
        size="lg"
        className="w-full justify-center gap-2 text-base font-semibold shadow-md py-4 rounded-2xl"
        disabled={selectedHubs.length === 0}
        onClick={onSearch}
      >
        {selectedHubs.length === 0 ? (
          "📍 Search a place above to begin"
        ) : (
          <>
            Show Homes ({matches.length} {matches.length === 1 ? "home" : "homes"})
            <ArrowRight size={18} />
          </>
        )}
      </Button>
    </div>
  );
}
