import type { Landmark, Property } from "./types";

/* ─────────────────────────────────────────────────────────────
   Proximity / commute engine.

   Distances are true great-circle (Haversine) values computed from
   each listing's real lat/lng. Drive time is an ESTIMATE derived from
   that distance — straight-line km inflated by a detour factor, then
   divided by an average urban speed. It is deliberately labelled
   "est." everywhere in the UI.

   To upgrade to real routing, replace estimateDriveMinutes() with a
   Distance Matrix call (Google/Mapbox) and cache per property+landmark
   pair; every consumer below keeps working unchanged.
   ───────────────────────────────────────────────────────────── */

const EARTH_RADIUS_KM = 6371;
/* Road distance is longer than the crow flies — typical urban factor. */
const DETOUR_FACTOR = 1.35;
/* Blended average speed for Gulf/South-Asian metro driving (km/h). */
const AVG_SPEED_KMH = 34;

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function estimateDriveMinutes(km: number): number {
  return Math.max(1, Math.round(((km * DETOUR_FACTOR) / AVG_SPEED_KMH) * 60));
}

export interface CommuteLeg {
  landmark: Landmark;
  km: number;
  minutes: number;
}

/** Distance + estimated drive time from a property to each landmark. */
export function commuteLegs(
  property: Property,
  selected: Landmark[]
): CommuteLeg[] {
  return selected.map((landmark) => {
    const km = haversineKm(property, landmark);
    return { landmark, km, minutes: estimateDriveMinutes(km) };
  });
}

export type MatchMode = "all" | "any";

export interface CommuteVerdict {
  legs: CommuteLeg[];
  /** Longest leg — the binding constraint when you must reach them all. */
  worstMinutes: number;
  /** Shortest leg — what matters in "any" mode. */
  bestMinutes: number;
  avgMinutes: number;
  passes: boolean;
}

/**
 * Evaluate a property against the selected hubs.
 * "all" → every hub must be within maxMinutes (the working-family case).
 * "any" → at least one hub within maxMinutes.
 */
export function evaluateCommute(
  property: Property,
  selected: Landmark[],
  maxMinutes: number,
  mode: MatchMode
): CommuteVerdict {
  const legs = commuteLegs(property, selected);
  const times = legs.map((l) => l.minutes);
  const worstMinutes = times.length ? Math.max(...times) : 0;
  const bestMinutes = times.length ? Math.min(...times) : 0;
  const avgMinutes = times.length
    ? Math.round(times.reduce((s, t) => s + t, 0) / times.length)
    : 0;

  const passes = !times.length
    ? true
    : mode === "all"
      ? worstMinutes <= maxMinutes
      : bestMinutes <= maxMinutes;

  return { legs, worstMinutes, bestMinutes, avgMinutes, passes };
}

/**
 * Ranking score — lower is better. In "all" mode the worst leg dominates
 * (a home is only as good as its longest daily trip), with the average as
 * a tie-breaker so genuinely central properties win.
 */
export function commuteScore(v: CommuteVerdict, mode: MatchMode): number {
  return mode === "all"
    ? v.worstMinutes * 10 + v.avgMinutes
    : v.bestMinutes * 10 + v.avgMinutes;
}

/** Nearest hubs to a property — used on the detail page. */
export function nearestLandmarks(
  property: Property,
  all: Landmark[],
  count = 6
): CommuteLeg[] {
  return commuteLegs(property, all)
    .sort((a, b) => a.km - b.km)
    .slice(0, count);
}
