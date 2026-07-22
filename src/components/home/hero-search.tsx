"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MapPin,
  Building,
  Clock,
  CornerDownLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { suggest, suggestionHref, type Suggestion } from "@/lib/search-suggest";
import { categoryIcon } from "@/lib/landmark-icons";
import { cn } from "@/lib/utils";

const trending = ["West Bay", "The Pearl Island", "Lusail Marina", "Msheireb Downtown", "Al Sadd"];
const types = ["Apartment", "Villa", "Penthouse", "Townhouse", "Duplex", "Office"];
const RECENT_KEY = "sf:recent-searches";

function SuggestionIcon({ s }: { s: Suggestion }) {
  if (s.kind === "city") return <MapPin size={15} />;
  if (s.kind === "community") return <Building size={15} />;
  const Icon = categoryIcon[s.category];
  return <Icon size={15} />;
}

export function HeroSearch() {
  const router = useRouter();
  const [status, setStatus] = useState<"sale" | "rent">("sale");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState("any");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<Suggestion[]>([]);

  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => suggest(query), [query]);
  /* With no query typed, offer recent searches instead */
  const items = query.trim() ? results : recent;

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => setActive(0), [query]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const extra = () => {
    const x: Record<string, string> = {};
    if (type !== "all") x.type = type;
    if (beds !== "any") x.beds = beds;
    return x;
  };

  function remember(s: Suggestion) {
    const next = [s, ...recent.filter((r) => r.id !== s.id)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — non-critical */
    }
  }

  function go(s: Suggestion) {
    remember(s);
    setOpen(false);
    router.push(suggestionHref(s, status, extra()));
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (open && items[active]) return go(items[active]);
    const p = new URLSearchParams({ status, ...extra() });
    if (query.trim()) p.set("q", query.trim());
    router.push(`/properties?${p.toString()}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      /* Handle explicitly — don't depend on implicit form submission */
      e.preventDefault();
      go(items[active]);
    }
  }

  return (
    <div className="w-full max-w-3xl text-left">
      {/* Utility row — listing type left, refinements right */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Listing type"
          className="inline-flex rounded-full bg-white/15 p-1 backdrop-blur-md"
        >
          {(["sale", "rent"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-all duration-200",
                status === s
                  ? "bg-paper text-ink shadow-card"
                  : "text-paper/85 hover:text-paper"
              )}
            >
              {s === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Property type"
            className="select-arrow-light h-9 appearance-none rounded-full border border-white/25 bg-white/10 pl-4 pr-9 text-[0.8125rem] text-paper backdrop-blur-sm transition-colors hover:border-white/50 focus:outline-none [&>option]:text-ink"
          >
            <option value="all">Any type</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            aria-label="Minimum bedrooms"
            className="select-arrow-light h-9 appearance-none rounded-full border border-white/25 bg-white/10 pl-4 pr-9 text-[0.8125rem] text-paper backdrop-blur-sm transition-colors hover:border-white/50 focus:outline-none [&>option]:text-ink"
          >
            <option value="any">Any beds</option>
            {["1", "2", "3", "4", "5"].map((b) => (
              <option key={b} value={b}>
                {b}+ beds
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              const p = new URLSearchParams({ status, ...extra() });
              router.push(`/properties?${p.toString()}`);
            }}
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 text-[0.8125rem] text-paper backdrop-blur-sm transition-colors hover:border-white/50"
          >
            <SlidersHorizontal size={13} />
            All filters
          </button>
        </div>
      </div>

      {/* Search + suggestions */}
      <div ref={boxRef} className="relative mt-3">
        <form
          onSubmit={submit}
          className="flex items-center gap-2 rounded-2xl bg-paper p-2 shadow-modal md:rounded-full"
        >
          <MapPin size={18} className="ml-3 shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="City, community, office or school…"
            aria-label="Search location or landmark"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="hero-suggestions"
            role="combobox"
            className="h-11 w-full bg-transparent text-[0.9375rem] text-ink placeholder:text-faint focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-brass-tint hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
          <button
            type="submit"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-all hover:bg-ink-soft active:scale-[0.98]"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {open && items.length > 0 && (
          <ul
            id="hero-suggestions"
            role="listbox"
            className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-raised py-2 text-left shadow-modal"
          >
            {!query.trim() && (
              <li className="flex items-center gap-1.5 px-4 pb-1 pt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-faint">
                <Clock size={11} /> Recent
              </li>
            )}
            {items.map((s, i) => (
              <li key={s.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(s)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i === active ? "bg-brass-tint" : "hover:bg-surface"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      i === active
                        ? "bg-brass text-white"
                        : "bg-surface text-muted"
                    )}
                  >
                    <SuggestionIcon s={s} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {s.label}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {s.kind === "landmark" ? `Commute · ${s.sub}` : s.sub}
                    </span>
                  </span>
                  {i === active && (
                    <CornerDownLeft
                      size={13}
                      className="shrink-0 text-faint"
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            ))}
            <li className="mt-1 border-t border-line px-4 pt-2">
              <p className="text-[0.6875rem] leading-relaxed text-faint">
                Pick an office or school to search by drive time.
              </p>
            </li>
          </ul>
        )}
      </div>

      {/* Trending */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.14em] text-paper/70">
          Trending
        </span>
        {trending.map((c) => (
          <button
            key={c}
            onClick={() =>
              router.push(
                `/properties?district=${encodeURIComponent(c)}&status=${status}`
              )
            }
            className="rounded-full border border-white/25 px-3.5 py-1.5 text-[0.8125rem] text-paper/90 backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
