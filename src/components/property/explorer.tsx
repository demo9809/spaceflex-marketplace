"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
  Map as MapIcon,
  Search,
  X,
  Route,
} from "lucide-react";
import { usePresence } from "@/lib/use-presence";
import { properties } from "@/lib/data/properties";
import { landmarks } from "@/lib/data/landmarks";
import { evaluateCommute, commuteScore, type MatchMode } from "@/lib/geo";
import type { Property, PropertyCategory, PropertyType } from "@/lib/types";
import { PropertyCard } from "./property-card";
import { MapPanel } from "./map-panel";
import { CommuteFilter } from "./commute-filter";
import { CompareTray } from "@/components/site/compare-tray";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useScrollNav } from "@/lib/use-scroll-nav";

import {
  getPropertyTypesForCategory,
  getAmenitiesForCategory,
  getSpecConfigForCategory,
  sanitizeFiltersForCategory,
  TAXONOMY_CATEGORIES,
} from "@/lib/taxonomy";

type View = "grid" | "list" | "map";
type Sort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "views"
  | "commute";

const districts = [
  "West Bay",
  "West Bay Lagoon",
  "Al Dafna",
  "The Pearl Island",
  "Viva Bahriya, The Pearl",
  "Lusail Marina",
  "Fox Hills, Lusail",
  "Msheireb Downtown",
  "Onaiza",
  "Al Sadd",
  "Al Waab",
  "Al Gharrafa",
];

/* All listings are QAR — normalise rent to a comparable capital figure
   so a single price sort can span sale and rental stock. */
const comparableValue = (p: Property) =>
  p.price * (p.status === "rent" ? 300 : 1);

export function PropertyExplorer() {
  const router = useRouter();
  const params = useSearchParams();
  const navVisible = useScrollNav();

  const [status, setStatus] = useState<"all" | "sale" | "rent">(
    (params.get("status") as "sale" | "rent") ?? "all"
  );
  const [category, setCategory] = useState<PropertyCategory>(
    (params.get("category") as PropertyCategory) ?? "all"
  );
  const [district, setDistrict] = useState(params.get("district") ?? "all");
  const [type, setType] = useState(params.get("type") ?? "all");
  const [beds, setBeds] = useState(params.get("beds") ?? "any");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<View>("grid");
  const searchParam = params.get("search");
  const [searchModalOpen, setSearchModalOpen] = useState(searchParam === "open");
  const introRef = useRef<HTMLDivElement>(null);
  const [isPastIntro, setIsPastIntro] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const drawer = usePresence(filtersOpen);

  /* ── Dynamic Backend Taxonomy Computation ── */
  const availableTypes = useMemo(() => getPropertyTypesForCategory(category), [category]);
  const availableAmenities = useMemo(() => getAmenitiesForCategory(category), [category]);
  const specConfig = useMemo(() => getSpecConfigForCategory(category), [category]);

  /* Smart State Management: Automatically clear invalid filters when switching category */
  const handleCategoryChange = (newCat: PropertyCategory) => {
    const sanitized = sanitizeFiltersForCategory(newCat, type, amenities);
    setCategory(newCat);
    setType(sanitized.type);
    setAmenities(sanitized.amenities);
  };

  useEffect(() => {
    if (searchParam === "open") {
      setSearchModalOpen(true);
    }
  }, [searchParam]);

  useEffect(() => {
    const handleOpenModal = () => setSearchModalOpen(true);
    window.addEventListener("sf:open-search-modal", handleOpenModal);
    return () => window.removeEventListener("sf:open-search-modal", handleOpenModal);
  }, []);

  /* ── Multi-landmark commute filter ── */
  const [hubIds, setHubIds] = useState<string[]>(
    params.get("hubs")?.split(",").filter(Boolean) ?? []
  );
  const [maxCommute, setMaxCommute] = useState(
    Number(params.get("commute")) || 25
  );
  const [matchMode, setMatchMode] = useState<MatchMode>(
    (params.get("match") as MatchMode) ?? "all"
  );

  const selectedHubs = useMemo(
    () => landmarks.filter((l) => hubIds.includes(l.id)),
    [hubIds]
  );

  const toggleHub = (id: string) =>
    setHubIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  /* Detect when user scrolls past page intro on mobile */
  useEffect(() => {
    const onScroll = () => {
      if (introRef.current) {
        const rect = introRef.current.getBoundingClientRect();
        // Top-16 header is 64px tall on mobile
        setIsPastIntro(rect.bottom <= 64);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock page scroll while filter sheet or mobile search overlay is open */
  useEffect(() => {
    document.body.style.overflow = filtersOpen || searchModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen, searchModalOpen]);

  /* Keep URL shareable */
  useEffect(() => {
    const p = new URLSearchParams();
    if (status !== "all") p.set("status", status);
    if (category !== "all") p.set("category", category);
    if (district !== "all") p.set("district", district);
    if (type !== "all") p.set("type", type);
    if (beds !== "any") p.set("beds", beds);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (query) p.set("q", query);
    if (hubIds.length) {
      p.set("hubs", hubIds.join(","));
      p.set("commute", String(maxCommute));
      p.set("match", matchMode);
    }
    router.replace(`/properties${p.toString() ? `?${p}` : ""}`, {
      scroll: false,
    });
  }, [status, category, district, type, beds, minPrice, maxPrice, query, hubIds, maxCommute, matchMode, router]);

  const results = useMemo(() => {
    let list = properties.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all") {
        if (category === "commercial" && p.type !== "Office" && p.category !== "commercial") return false;
        if (category === "residential" && (p.type === "Office" || p.category === "commercial")) return false;
      }
      if (district !== "all" && p.community !== district) return false;
      if (type !== "all" && p.type !== type) return false;
      if (beds !== "any" && p.beds < Number(beds)) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (
        amenities.length &&
        !amenities.every((a) =>
          p.amenities.some((x) => x.toLowerCase().includes(a.toLowerCase()))
        )
      )
        return false;
      if (query) {
        const q = query.toLowerCase();
        const hay =
          `${p.title} ${p.community} ${p.city} ${p.country}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      /* Multi-landmark proximity: keep only homes that satisfy the
         selected hubs within the chosen drive-time budget. */
      if (selectedHubs.length) {
        const verdict = evaluateCommute(p, selectedHubs, maxCommute, matchMode);
        if (!verdict.passes) return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => comparableValue(a) - comparableValue(b));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => comparableValue(b) - comparableValue(a));
        break;
      case "newest":
        list = [...list].sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
      case "views":
        list = [...list].sort((a, b) => b.views - a.views);
        break;
      case "commute":
        list = [...list].sort(
          (a, b) =>
            commuteScore(
              evaluateCommute(a, selectedHubs, maxCommute, matchMode),
              matchMode
            ) -
            commuteScore(
              evaluateCommute(b, selectedHubs, maxCommute, matchMode),
              matchMode
            )
        );
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
        );
    }
    return list;
  }, [
    status,
    category,
    district,
    type,
    beds,
    query,
    amenities,
    minPrice,
    maxPrice,
    sort,
    selectedHubs,
    maxCommute,
    matchMode,
  ]);

  const activeChips = [
    status !== "all" && {
      label: status === "sale" ? "For Sale" : "For Rent",
      clear: () => setStatus("all"),
    },
    category !== "all" && {
      label: category === "commercial" ? "Commercial" : "Residential",
      clear: () => setCategory("all"),
    },
    district !== "all" && { label: district, clear: () => setDistrict("all") },
    type !== "all" && { label: type, clear: () => setType("all") },
    beds !== "any" && { label: `${beds}+ beds`, clear: () => setBeds("any") },
    (minPrice || maxPrice) && {
      label:
        minPrice && maxPrice
          ? `QAR ${Number(minPrice).toLocaleString()} - ${Number(maxPrice).toLocaleString()}`
          : minPrice
            ? `> QAR ${Number(minPrice).toLocaleString()}`
            : `< QAR ${Number(maxPrice).toLocaleString()}`,
      clear: () => {
        setMinPrice("");
        setMaxPrice("");
      },
    },
    ...amenities.map((a) => ({
      label: a,
      clear: () => setAmenities((s) => s.filter((x) => x !== a)),
    })),
    ...selectedHubs.map((l) => ({
      label: `≤${maxCommute}m to ${l.short}`,
      clear: () => toggleHub(l.id),
    })),
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="container-site pb-24 pt-8 md:pt-12">
      {/* Heading */}
      <div className="mb-6" ref={introRef}>
        <p className="eyebrow">Marketplace</p>
        <h1 className="font-display text-h1 mt-2 font-medium tracking-tight">
          {district !== "all" ? `Properties in ${district}` : "Every property"}
        </h1>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {results.length} curated{" "}
          {results.length === 1 ? "listing" : "listings"}
          {status !== "all" && ` for ${status === "sale" ? "sale" : "rent"}`}
        </p>
      </div>

      {/* Content Section Search & Filter Card (Mobile only when NOT sticky) */}
      <div className="mb-6 space-y-3 rounded-2xl border border-line bg-raised/60 p-3.5 shadow-sm md:hidden">
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location, district, or building…"
            aria-label="Search properties"
            className="h-10 bg-paper pl-9 pr-8 text-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              aria-label="Clear search text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Filters Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Status Pills */}
          <div className="flex shrink-0 gap-1 rounded-xl border border-line bg-paper p-1">
            {(
              [
                { value: "all", label: "All" },
                { value: "sale", label: "Sale" },
                { value: "rent", label: "Rent" },
              ] as const
            ).map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  status === s.value
                    ? "bg-ink text-paper"
                    : "text-muted hover:text-ink"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* District Select */}
          <Select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            aria-label="District"
            className="h-8 w-auto shrink-0 bg-paper px-2.5 py-1 text-xs"
          >
            <option value="all">All Districts</option>
            {districts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>

          {/* Filters Modal Button */}
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="ml-auto h-8 shrink-0 gap-1.5 bg-paper px-3 py-1 text-xs"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeChips.length > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brass text-[0.625rem] font-bold text-white">
                {activeChips.length}
              </span>
            )}
          </Button>
        </div>

        {/* Active Chips in Content Section */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-line/60 pt-2">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.clear}
                className="flex items-center gap-1.5 rounded-full bg-brass-tint px-2.5 py-1 text-[0.6875rem] font-medium text-ink transition-colors hover:bg-brass hover:text-white"
              >
                {chip.label}
                <X size={10} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Toolbar */}
      <div
        className={cn(
          "sticky z-50 transition-all duration-300 mb-8",
          isPastIntro
            ? "block -mx-[calc(50vw-50%)] px-[calc(50vw-50%)] border-b border-line bg-paper/95 py-3.5 backdrop-blur-xl shadow-sm"
            : "hidden md:block py-2 border-0 bg-transparent",
          navVisible ? "top-16 md:top-[4.5rem]" : "top-0 md:top-[4.5rem]"
        )}
      >
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
          {/* Mobile Full-Width Search Trigger Box */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            aria-label="Open full-screen search"
            className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-line bg-raised px-3.5 text-xs font-medium text-muted transition-colors hover:border-ink/40 md:hidden"
          >
            <Search size={15} className="shrink-0 text-faint" />
            <span className="truncate text-ink-soft">
              {query
                ? query
                : district !== "all"
                  ? district
                  : "Search location…"}
            </span>
          </button>

          {/* Desktop Search Input */}
          <div className="relative hidden w-44 lg:w-48 shrink-0 md:block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location…"
              aria-label="Search properties"
              className="h-10 text-xs pl-9 pr-3 rounded-xl"
            />
          </div>

          {/* Desktop Selects */}
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            aria-label="Listing type"
            className="h-10 hidden w-auto min-w-32 px-3 text-xs font-semibold rounded-xl border border-line bg-paper sm:block"
          >
            <option value="all">Buy & Rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </Select>

          <Select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as PropertyCategory)}
            aria-label="Category"
            className="h-10 hidden w-auto min-w-36 px-3 text-xs font-semibold rounded-xl border border-line bg-paper sm:block"
          >
            {TAXONOMY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            aria-label="District"
            className="h-10 hidden w-auto min-w-36 px-3 text-xs font-medium rounded-xl border border-line bg-paper sm:block"
          >
            <option value="all">All districts</option>
            {districts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort results"
            className="h-10 hidden w-auto min-w-40 px-3 text-xs font-medium rounded-xl border border-line bg-paper lg:block"
          >
            <option value="featured">Featured first</option>
            <option value="price-asc">Price · low to high</option>
            <option value="price-desc">Price · high to low</option>
            <option value="newest">Newest</option>
            <option value="views">Most viewed</option>
            {selectedHubs.length > 0 && (
              <option value="commute">Best commute</option>
            )}
          </Select>

          <ButtonLink
            href={`/drive-time${
              hubIds.length
                ? `?hubs=${hubIds.join(",")}&commute=${maxCommute}&match=${matchMode}`
                : ""
            }`}
            variant={selectedHubs.length ? "brass" : "outline"}
            className="h-10 px-3.5 text-xs font-semibold gap-2 shrink-0 flex items-center"
          >
            <Route size={15} />
            <span className="hidden sm:inline">Drive Time</span>
            {selectedHubs.length > 0 && (
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[0.6875rem] font-bold",
                  "bg-white/25 text-white"
                )}
              >
                {selectedHubs.length}
              </span>
            )}
          </ButtonLink>

          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="h-10 gap-1.5 px-3 text-xs font-semibold md:gap-2 md:px-4 shrink-0 flex items-center"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {activeChips.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[0.6875rem] font-bold text-white">
                {activeChips.length}
              </span>
            )}
          </Button>

          <div
            role="group"
            aria-label="View"
            className="ml-auto hidden rounded-full border border-line p-1 md:flex"
          >
            {(
              [
                { v: "grid", icon: LayoutGrid, label: "Grid view" },
                { v: "list", icon: Rows3, label: "List view" },
                { v: "map", icon: MapIcon, label: "Map view" },
              ] as const
            ).map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                aria-label={label}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  view === v
                    ? "bg-ink text-paper"
                    : "text-muted hover:bg-brass-tint hover:text-ink"
                )}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="hidden flex-wrap gap-2 px-1 pb-1 pt-2 md:flex">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.clear}
                className="flex items-center gap-1.5 rounded-full bg-brass-tint px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-brass hover:text-white"
              >
                {chip.label}
                <X size={11} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-strong py-24 text-center">
          <p className="font-display text-2xl font-medium">
            No properties match that search
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Try widening the price range, removing an amenity, or exploring a
            neighbouring district.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setStatus("all");
              setDistrict("all");
              setType("all");
              setBeds("any");
              setQuery("");
              setAmenities([]);
              setMaxPrice("");
              setHubIds([]);
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : view === "map" ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="order-2 flex max-h-[42rem] flex-col gap-5 overflow-y-auto pr-1 lg:order-1">
            {results.map((p) => (
              <PropertyCard key={p.id} property={p} layout="list" />
            ))}
          </div>
          <div className="order-1 lg:sticky lg:top-40 lg:order-2 lg:h-[42rem]">
            <MapPanel items={results} />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              : "grid gap-5"
          )}
        >
          {results.map((p, i) => (
            <PropertyCard
              key={p.id}
              property={p}
              layout={view}
              priority={i < 3}
              commute={
                selectedHubs.length
                  ? evaluateCommute(p, selectedHubs, maxCommute, matchMode)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Filter drawer */}
      {drawer.mounted && (
          <>
            <button
              aria-label="Close filters"
              className={cn(
                "fixed inset-0 z-[75] bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300",
                drawer.shown ? "opacity-100" : "opacity-0"
              )}
              onClick={() => setFiltersOpen(false)}
            />
            <aside
              role="dialog"
              aria-label="Advanced filters"
              className={cn(
                "fixed bottom-0 right-0 z-[80] flex max-h-[92svh] w-full flex-col rounded-t-3xl bg-raised shadow-modal transition-transform duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:top-0 md:h-full md:max-h-none md:w-[26rem] md:rounded-none",
                drawer.shown
                  ? "translate-y-0 md:translate-x-0"
                  : "translate-y-full md:translate-x-full md:translate-y-0"
              )}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-brass-tint"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
                {/* 1. FIRST FILTER: Property Category Toggle */}
                <div>
                  <Label>Property Use / Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {TAXONOMY_CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCategoryChange(c.id)}
                        aria-pressed={category === c.id}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors",
                          category === c.id
                            ? "border-ink bg-ink text-paper"
                            : "border-line text-muted hover:border-ink hover:text-ink"
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-line" />

                {/* Multi-landmark commute search */}
                <div id="commute-section" className="scroll-mt-4">
                  <CommuteFilter
                    selectedIds={hubIds}
                    onToggle={toggleHub}
                    onClear={() => setHubIds([])}
                    maxMinutes={maxCommute}
                    onMaxMinutes={setMaxCommute}
                    mode={matchMode}
                    onMode={setMatchMode}
                    city="Doha"
                  />
                </div>

                <div className="h-px bg-line" />

                <div>
                  <Label>Property type</Label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setType("all")}
                      aria-pressed={type === "all"}
                      className={cn(
                        "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors",
                        type === "all"
                          ? "border-ink bg-ink text-paper"
                          : "border-line text-muted hover:border-ink hover:text-ink"
                      )}
                    >
                      Any Type
                    </button>
                    {availableTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setType(t.name)}
                        aria-pressed={type === t.name}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors",
                          type === t.name
                            ? "border-ink bg-ink text-paper"
                            : "border-line text-muted hover:border-ink hover:text-ink"
                        )}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>{specConfig.specLabel}</Label>
                  <div className="flex flex-wrap gap-2">
                    {["any", "1", "2", "3", "4", "5"].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBeds(b)}
                        aria-pressed={beds === b}
                        className={cn(
                          "h-10 min-w-12 rounded-full border px-3 text-[0.8125rem] font-medium transition-colors",
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

                {/* Price Range Filter (Min & Max Price) */}
                <div>
                  <Label>Price Range (QAR)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div>
                      <span className="text-[0.6875rem] font-medium text-muted block mb-1">Minimum Price</span>
                      <Input
                        id="minprice"
                        type="number"
                        inputMode="numeric"
                        placeholder="e.g. 5,000"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <span className="text-[0.6875rem] font-medium text-muted block mb-1">Maximum Price</span>
                      <Input
                        id="maxprice"
                        type="number"
                        inputMode="numeric"
                        placeholder="e.g. 50,000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>District</Label>
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="all">All districts</option>
                    {districts.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableAmenities.map((a) => {
                      const on = amenities.some(
                        (x) => x.toLowerCase() === a.name.toLowerCase()
                      );
                      return (
                        <button
                          key={a.id}
                          onClick={() =>
                            setAmenities((s) =>
                              on
                                ? s.filter((x) => x.toLowerCase() !== a.name.toLowerCase())
                                : [...s, a.name]
                            )
                          }
                          aria-pressed={on}
                          className={cn(
                            "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors",
                            on
                              ? "border-brass bg-brass-tint text-ink"
                              : "border-line text-muted hover:border-ink hover:text-ink"
                          )}
                        >
                          {a.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-line px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStatus("all");
                    handleCategoryChange("all");
                    setType("all");
                    setBeds("any");
                    setAmenities([]);
                    setMinPrice("");
                    setMaxPrice("");
                    setHubIds([]);
                  }}
                >
                  Reset
                </Button>
                <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                  Show {results.length} results
                </Button>
              </div>
            </aside>
          </>
        )}

      {/* Mobile Full-Screen Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-paper md:hidden">
          {/* Header with Search Input and Done button */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location, district, or building…"
                autoFocus
                className="pl-9 pr-8 text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="text-sm font-semibold text-brass hover:underline shrink-0"
            >
              Done
            </button>
          </div>

          {/* Search options & quick selections */}
          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            {/* Listing type selector */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Listing Type
              </Label>
              <div className="flex gap-2">
                {(
                  [
                    { value: "all", label: "Buy & Rent" },
                    { value: "sale", label: "For Sale" },
                    { value: "rent", label: "For Rent" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatus(s.value)}
                    className={cn(
                      "flex-1 rounded-xl border py-2.5 text-xs font-medium transition-colors",
                      status === s.value
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Property Use selector */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Property Category
              </Label>
              <div className="flex gap-2">
                {TAXONOMY_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    className={cn(
                      "flex-1 rounded-xl border py-2.5 text-xs font-medium transition-colors",
                      category === c.id
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type pills */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Property Type
              </Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setType("all")}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    type === "all"
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-muted hover:border-ink hover:text-ink"
                  )}
                >
                  All Types
                </button>
                {availableTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.name)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      type === t.name
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Specification (Bedrooms / Workstations) pills */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                {specConfig.specLabel}
              </Label>
              <div className="flex gap-2">
                {["any", "1", "2", "3", "4"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBeds(b)}
                    className={cn(
                      "flex-1 rounded-xl border py-2 text-xs font-medium transition-colors",
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

            {/* Price Range inputs (Min & Max Price) */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Price Range (QAR)
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Min budget"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 text-xs"
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Max budget"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            {/* District quick picks */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                District
              </Label>
              <div className="flex flex-wrap gap-2">
                {["all", ...districts].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDistrict(d)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      district === d
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {d === "all" ? "All Districts" : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities selection */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Amenities
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.map((a) => {
                  const on = amenities.some(
                    (x) => x.toLowerCase() === a.name.toLowerCase()
                  );
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() =>
                        setAmenities((s) =>
                          on
                            ? s.filter((x) => x.toLowerCase() !== a.name.toLowerCase())
                            : [...s, a.name]
                        )
                      }
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        on
                          ? "border-brass bg-brass-tint text-ink"
                          : "border-line text-muted hover:border-ink hover:text-ink"
                      )}
                    >
                      {a.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort order selection */}
            <div>
              <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Sort Results
              </Label>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="w-full text-xs"
              >
                <option value="featured">Featured first</option>
                <option value="price-asc">Price · low to high</option>
                <option value="price-desc">Price · high to low</option>
                <option value="newest">Newest</option>
                <option value="views">Most viewed</option>
              </Select>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="border-t border-line bg-raised p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button
              className="w-full"
              onClick={() => setSearchModalOpen(false)}
            >
              Show {results.length} {results.length === 1 ? "Listing" : "Listings"}
            </Button>
          </div>
        </div>
      )}

      <CompareTray />
    </div>
  );
}
