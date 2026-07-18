"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const cities = ["Doha", "Dubai", "Riyadh", "Abu Dhabi", "Mumbai"];

export function HeroSearch() {
  const router = useRouter();
  const [status, setStatus] = useState<"sale" | "rent">("sale");
  const [query, setQuery] = useState("");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams({ status });
    if (query.trim()) params.set("q", query.trim());
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-2xl">
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

      <form
        onSubmit={submit}
        className="mt-3 flex items-center gap-2 rounded-2xl bg-paper p-2 shadow-modal md:rounded-full"
      >
        <MapPin size={18} className="ml-3 shrink-0 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="City, community, or landmark…"
          aria-label="Search location"
          className="h-11 w-full bg-transparent text-[0.9375rem] text-ink placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-all hover:bg-ink-soft active:scale-[0.98]"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.14em] text-paper/70">
          Trending
        </span>
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => {
              router.push(`/properties?city=${encodeURIComponent(c)}&status=${status}`);
            }}
            className="rounded-full border border-white/25 px-3.5 py-1.5 text-[0.8125rem] text-paper/90 backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
