"use client";

import { useState, useMemo } from "react";
import { Search, Building2, ShieldCheck, Users, X } from "lucide-react";
import type { Agency } from "@/lib/types";
import { AgencyCard } from "@/components/agency/agency-card";
import { Input } from "@/components/ui/field";
import { ButtonLink } from "@/components/ui/button";
import { RevealStagger, StaggerItem } from "@/components/motion/reveal";

export function AgencyDirectory({ agencies }: { agencies: Agency[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return agencies;
    const q = search.toLowerCase();
    return agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.licenseNo.toLowerCase().includes(q)
    );
  }, [agencies, search]);

  return (
    <div className="space-y-10">
      {/* Search Bar & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-raised p-3 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
          />
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search agencies by name or district…"
            className="h-10 pl-9 pr-8 text-xs bg-paper"
            aria-label="Search agencies"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck size={14} className="text-success" />
          <span>{filtered.length} licensed {filtered.length === 1 ? "agency" : "agencies"} verified</span>
        </div>
      </div>

      {/* Grid of Agency Cards */}
      {filtered.length > 0 ? (
        <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((agency) => (
            <StaggerItem key={agency.id}>
              <AgencyCard agency={agency} />
            </StaggerItem>
          ))}
        </RevealStagger>
      ) : (
        <div className="rounded-3xl border border-dashed border-line-strong py-16 text-center">
          <Building2 size={32} className="mx-auto text-muted mb-3" />
          <p className="font-display text-xl font-medium">No agencies found</p>
          <p className="mt-1 text-sm text-muted">
            Try adjusting your search terms or clearing the filter.
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 text-xs font-semibold text-brass hover:underline"
          >
            Reset search
          </button>
        </div>
      )}

      {/* Partner Callout */}
      <div className="rounded-3xl bg-ink px-6 py-12 md:py-16 text-center text-paper shadow-lift">
        <Users size={28} className="mx-auto text-brass-deep mb-3" />
        <h2 className="font-display text-h3 max-w-xl mx-auto font-medium text-balance">
          Are you a licensed real estate agency in Qatar?
        </h2>
        <p className="mt-2 text-sm text-paper/70 max-w-md mx-auto">
          List your firm&apos;s rental portfolio, empower your agents, and reach pre-qualified tenants across Qatar.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/list-with-us" variant="inverted" size="lg">
            Register your agency
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
