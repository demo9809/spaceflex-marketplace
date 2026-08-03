"use client";

import { useMemo } from "react";
import { Navigation, Home, Briefcase, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { CommuteMap } from "@/components/property/commute-map";
import { landmarks } from "@/lib/data/landmarks";
import { properties } from "@/lib/data/properties";
import { evaluateCommute } from "@/lib/geo";

const points = [
  { icon: Briefcase, text: "Pin the office, school and mall you visit most" },
  { icon: Clock, text: "Set one drive-time budget across every place" },
  { icon: Home, text: "See only the homes that reach them all" },
];

// Representative demo hubs in Qatar (West Bay, Education City, Pearl Marina)
const demoHubs = landmarks.filter((l) => ["l1", "l7", "l28"].includes(l.id));

export function DriveTimeBand() {
  const matches = useMemo(() => {
    return properties
      .map((p) => ({
        property: p,
        verdict: evaluateCommute(p, demoHubs, 25, "all"),
      }))
      .filter((m) => m.verdict.passes);
  }, []);

  return (
    <section className="container-site py-4 md:py-6">
      <Reveal>
        <div className="grid overflow-hidden rounded-3xl border border-line bg-raised shadow-card lg:grid-cols-[1.1fr_1.2fr]">
          {/* Copy Column */}
          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
            <p className="eyebrow flex items-center gap-2">
              <Navigation size={13} /> New · Commute Search
            </p>
            <h2 className="font-display text-h2 mt-3 font-medium tracking-tight text-balance">
              Search by how you actually live.
            </h2>
            <p className="mt-3 leading-relaxed text-muted text-sm md:text-base">
              A home is only as good as its longest daily trip. Tell us the
              places your week revolves around and we&apos;ll rank homes by the
              commute that really binds your day.
            </p>

            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass">
                    <p.icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className="text-sm font-medium text-ink">{p.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/drive-time" variant="brass" size="lg">
                <Navigation size={17} />
                Try Drive-Time Search
              </ButtonLink>
            </div>
          </div>

          {/* Interactive Qatar Map Demo Column */}
          <div className="relative min-h-[24rem] overflow-hidden bg-surface p-2 lg:min-h-full">
            <CommuteMap hubs={demoHubs} matches={matches} maxMinutes={25} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
