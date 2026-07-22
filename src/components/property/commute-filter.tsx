"use client";

import { useMemo, useState } from "react";
import { Search, X, Route } from "lucide-react";
import type { Landmark, LandmarkCategory } from "@/lib/types";
import { landmarks, landmarkCategories } from "@/lib/data/landmarks";
import { categoryIcon } from "@/lib/landmark-icons";
import type { MatchMode } from "@/lib/geo";
import { Label } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function CommuteFilter({
  selectedIds,
  onToggle,
  onClear,
  maxMinutes,
  onMaxMinutes,
  mode,
  onMode,
  city,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  maxMinutes: number;
  onMaxMinutes: (n: number) => void;
  mode: MatchMode;
  onMode: (m: MatchMode) => void;
  city: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<LandmarkCategory | "All">("All");

  const selected = useMemo(
    () => landmarks.filter((l) => selectedIds.includes(l.id)),
    [selectedIds]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landmarks
      .filter((l) => (activeCat === "All" ? true : l.category === activeCat))
      .filter((l) =>
        q ? `${l.name} ${l.city}`.toLowerCase().includes(q) : true
      )
      /* Surface hubs in the city being browsed first */
      .sort((a, b) => {
        if (city !== "all") {
          const aCity = a.city === city ? 0 : 1;
          const bCity = b.city === city ? 0 : 1;
          if (aCity !== bCity) return aCity - bCity;
        }
        return a.city.localeCompare(b.city) || a.name.localeCompare(b.name);
      })
      .slice(0, 40);
  }, [query, activeCat, city]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="mb-0 flex items-center gap-1.5">
          <Route size={14} className="text-brass" />
          Commute to my places
        </Label>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="mb-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>
      <p className="mb-3 text-xs leading-relaxed text-faint">
        Add the places you travel to often — office, school, the mall. We
        estimate drive time to each and keep only homes that work for all of
        them.
      </p>

      {/* Selected hubs */}
      {selected.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {selected.map((l) => {
            const Icon = categoryIcon[l.category];
            return (
              <li key={l.id}>
                <button
                  onClick={() => onToggle(l.id)}
                  className="flex items-center gap-1.5 rounded-full bg-ink py-1.5 pl-3 pr-2 text-xs font-medium text-paper transition-opacity hover:opacity-85"
                  aria-label={`Remove ${l.name}`}
                >
                  <Icon size={12} />
                  {l.short}
                  <X size={12} className="opacity-70" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Search + categories */}
      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search offices, schools, malls…"
          aria-label="Search landmarks"
          className="h-10 w-full rounded-xl border border-line bg-raised pl-9 pr-3 text-sm placeholder:text-faint focus:border-brass focus:outline-none"
        />
      </div>

      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
        {(["All", ...landmarkCategories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c as LandmarkCategory | "All")}
            aria-pressed={activeCat === c}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeCat === c
                ? "border-brass bg-brass-tint text-ink"
                : "border-line text-muted hover:border-ink hover:text-ink"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Landmark list */}
      <ul className="mt-2 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-line p-1">
        {results.length === 0 && (
          <li className="px-3 py-4 text-center text-xs text-faint">
            No landmarks match “{query}”.
          </li>
        )}
        {results.map((l: Landmark) => {
          const on = selectedIds.includes(l.id);
          const Icon = categoryIcon[l.category];
          return (
            <li key={l.id}>
              <button
                onClick={() => onToggle(l.id)}
                aria-pressed={on}
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
                  <span className="block truncate text-sm font-medium">
                    {l.name}
                  </span>
                  <span className="block truncate text-xs text-faint">
                    {l.category} · {l.city}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                    on
                      ? "border-brass bg-brass text-white"
                      : "border-line-strong"
                  )}
                  aria-hidden
                >
                  {on ? "✓" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Threshold + match mode — only meaningful with hubs chosen */}
      {selected.length > 0 && (
        <div className="mt-4 space-y-4 rounded-xl bg-surface p-4">
          <div>
            <div className="flex items-baseline justify-between">
              <Label className="mb-0">Max drive time</Label>
              <span className="text-sm font-medium">{maxMinutes} min</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={maxMinutes}
              onChange={(e) => onMaxMinutes(Number(e.target.value))}
              aria-label="Maximum drive time in minutes"
              className="mt-2 w-full accent-[var(--brass)]"
            />
          </div>

          {selected.length > 1 && (
            <div>
              <Label className="mb-1.5">Must be close to</Label>
              <div className="flex gap-2">
                {(
                  [
                    { v: "all", label: `All ${selected.length} places` },
                    { v: "any", label: "Any one of them" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    onClick={() => onMode(o.v as MatchMode)}
                    aria-pressed={mode === o.v}
                    className={cn(
                      "flex-1 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                      mode === o.v
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[0.6875rem] leading-relaxed text-faint">
            Drive times are estimated from straight-line distance and typical
            city traffic — not live routing.
          </p>
        </div>
      )}
    </div>
  );
}
