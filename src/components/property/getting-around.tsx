import { Car, Route } from "lucide-react";
import type { Property } from "@/lib/types";
import { landmarks } from "@/lib/data/landmarks";
import { nearestLandmarks } from "@/lib/geo";
import { categoryIcon } from "@/lib/landmark-icons";

/* Nearest hubs to this home — the detail-page counterpart to the
   multi-landmark commute filter in search. */
export function GettingAround({ property }: { property: Property }) {
  /* Only hubs in the same city stay meaningful as a daily commute */
  const pool = landmarks.filter((l) => l.city === property.city);
  const legs = nearestLandmarks(property, pool.length ? pool : landmarks, 6);

  if (!legs.length) return null;

  return (
    <section aria-labelledby="getting-around" className="mt-10">
      <h2
        id="getting-around"
        className="font-display text-h3 flex items-center gap-2 font-medium"
      >
        Getting around
      </h2>
      <p className="mt-2 text-sm text-muted">
        Estimated drive times from this address to nearby hubs.
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {legs.map((leg) => {
          const Icon = categoryIcon[leg.landmark.category];
          return (
            <li
              key={leg.landmark.id}
              className="flex items-center gap-3 rounded-2xl border border-line bg-raised p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass">
                <Icon size={17} strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {leg.landmark.name}
                </p>
                <p className="text-xs text-muted">{leg.landmark.category}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display flex items-center gap-1 text-base font-semibold">
                  <Car size={13} className="text-faint" />
                  {leg.minutes}m
                </p>
                <p className="text-[0.6875rem] text-faint">
                  {leg.km.toFixed(1)} km
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-center gap-2 text-xs text-faint">
        <Route size={13} className="shrink-0" />
        Estimates based on distance and typical city traffic — not live
        routing. Search by your own places using the Commute filter.
      </p>
    </section>
  );
}
