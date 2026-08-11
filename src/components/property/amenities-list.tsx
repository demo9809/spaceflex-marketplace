"use client";

import {
  Waves,
  Sparkles,
  Users,
  Coffee,
  Car,
  Clock,
  Dumbbell,
  Sun,
  ShieldCheck,
  Smartphone,
  Layers,
  Tv,
  Sofa,
  Check,
  Eye,
  Trees,
  Zap,
  UserCheck,
  ArrowUpRight,
  Wifi,
  Wind,
  Compass,
  Building,
  Flame,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function getAmenityIcon(amenity: string): LucideIcon {
  const lower = amenity.toLowerCase();

  if (lower.includes("marina") || lower.includes("sea") || lower.includes("waterfront")) return Waves;
  if (lower.includes("view") || lower.includes("panoramic") || lower.includes("corniche") || lower.includes("city")) return Eye;
  if (lower.includes("fitted") || lower.includes("fit-out") || lower.includes("finish")) return Sparkles;
  if (lower.includes("meeting") || lower.includes("boardroom") || lower.includes("conference")) return Users;
  if (lower.includes("pantry") || lower.includes("kitchen") || lower.includes("dining")) return Coffee;
  if (lower.includes("valet") || lower.includes("parking") || lower.includes("bay")) return Car;
  if (lower.includes("24/7") || lower.includes("access") || lower.includes("concierge") || lower.includes("service")) return Clock;
  if (lower.includes("raised") || lower.includes("floor") || lower.includes("level")) return Layers;
  if (lower.includes("pool") || lower.includes("spa") || lower.includes("hammam")) return Waves;
  if (lower.includes("gym") || lower.includes("fitness") || lower.includes("workout")) return Dumbbell;
  if (lower.includes("beach") || lower.includes("sun")) return Sun;
  if (lower.includes("smart") || lower.includes("automation")) return Smartphone;
  if (lower.includes("security") || lower.includes("guard") || lower.includes("gated")) return ShieldCheck;
  if (lower.includes("maid") || lower.includes("staff") || lower.includes("driver")) return UserCheck;
  if (lower.includes("elevator") || lower.includes("lift")) return ArrowUpRight;
  if (lower.includes("cinema") || lower.includes("theatre") || lower.includes("tv")) return Tv;
  if (lower.includes("majlis") || lower.includes("lounge") || lower.includes("clubhouse")) return Sofa;
  if (lower.includes("park") || lower.includes("garden") || lower.includes("lawn")) return Trees;
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("fibre")) return Wifi;
  if (lower.includes("solar") || lower.includes("power") || lower.includes("energy")) return Zap;
  if (lower.includes("ac") || lower.includes("cooling") || lower.includes("climate")) return Wind;

  return Check;
}

export function AmenitiesList({
  amenities,
  isCommercial = false,
}: {
  amenities: string[];
  isCommercial?: boolean;
}) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <section aria-labelledby="amenities" className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 id="amenities" className="font-display text-h3 font-medium">
          {isCommercial ? "Building Amenities & Features" : "Amenities & Features"}
        </h2>
        <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
          {amenities.length} items
        </span>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item) => {
          const Icon = getAmenityIcon(item);
          return (
            <li
              key={item}
              className="group flex items-center gap-3.5 rounded-2xl border border-line bg-raised p-3.5 transition-all duration-200 hover:border-brass/40 hover:bg-surface hover:shadow-card"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass transition-transform duration-200 group-hover:scale-105">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span className="text-sm font-medium text-ink transition-colors group-hover:text-brass">
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
