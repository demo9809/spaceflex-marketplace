import { properties } from "./data/properties";
import { landmarks } from "./data/landmarks";
import type { LandmarkCategory } from "./types";

export type Suggestion =
  | { kind: "city"; id: string; label: string; sub: string; city: string }
  | {
      kind: "community";
      id: string;
      label: string;
      sub: string;
      city: string;
      community: string;
    }
  | {
      kind: "landmark";
      id: string;
      label: string;
      sub: string;
      category: LandmarkCategory;
      landmarkId: string;
    };

/* Build the searchable index once from live data. */
const cityIndex: Suggestion[] = [...new Set(properties.map((p) => p.city))].map(
  (city) => {
    const count = properties.filter((p) => p.city === city).length;
    return {
      kind: "city",
      id: `city-${city}`,
      label: city,
      sub: `${count} ${count === 1 ? "listing" : "listings"}`,
      city,
    };
  }
);

const communityIndex: Suggestion[] = [
  ...new Map(
    properties.map((p) => [`${p.community}|${p.city}`, p])
  ).values(),
].map((p) => ({
  kind: "community",
  id: `community-${p.community}-${p.city}`,
  label: p.community,
  sub: p.city,
  city: p.city,
  community: p.community,
}));

const landmarkIndex: Suggestion[] = landmarks.map((l) => ({
  kind: "landmark",
  id: `landmark-${l.id}`,
  label: l.name,
  sub: `${l.category} · ${l.city}`,
  category: l.category,
  landmarkId: l.id,
}));

const ALL = [...cityIndex, ...communityIndex, ...landmarkIndex];

/**
 * Rank matches: prefix hits beat substring hits, and cities beat
 * communities beat landmarks when scores tie.
 */
export function suggest(query: string, limit = 8): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const kindRank = { city: 0, community: 1, landmark: 2 } as const;

  return ALL.map((s) => {
    const label = s.label.toLowerCase();
    const sub = s.sub.toLowerCase();
    let score = -1;
    if (label.startsWith(q)) score = 0;
    else if (label.includes(q)) score = 1;
    else if (sub.includes(q)) score = 2;
    return { s, score };
  })
    .filter((x) => x.score >= 0)
    .sort(
      (a, b) =>
        a.score - b.score ||
        kindRank[a.s.kind] - kindRank[b.s.kind] ||
        a.s.label.localeCompare(b.s.label)
    )
    .slice(0, limit)
    .map((x) => x.s);
}

/** Destination for a chosen suggestion. */
export function suggestionHref(
  s: Suggestion,
  status: "sale" | "rent",
  extra: Record<string, string> = {}
): string {
  const p = new URLSearchParams({ status, ...extra });
  /* Every listing is in Qatar — a city hit just clears location filters */
  if (s.kind === "city") p.delete("district");
  if (s.kind === "community") p.set("district", s.community);
  if (s.kind === "landmark") {
    /* Typing a workplace or school starts a commute search */
    p.set("hubs", s.landmarkId);
    p.set("commute", "25");
    p.set("match", "all");
  }
  return `/properties?${p.toString()}`;
}
