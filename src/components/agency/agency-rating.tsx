"use client";

import { Star } from "lucide-react";
import { useAgencyReviews } from "@/lib/store/review-store";
import { cn } from "@/lib/utils";

interface AgencyRatingProps {
  agencyId: string;
  variant?: "compact" | "small" | "badge" | "detailed" | "breakdown";
  className?: string;
  showCount?: boolean;
}

export function AgencyRating({
  agencyId,
  variant = "compact",
  className,
  showCount = true,
}: AgencyRatingProps) {
  const { getAgencyRating } = useAgencyReviews();
  const ratingData = getAgencyRating(agencyId);

  const { averageRating, totalReviews, distribution, categoryAverages } = ratingData;

  if (variant === "small") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-semibold text-xs text-ink",
          className
        )}
      >
        <Star size={12} className="fill-gold stroke-gold shrink-0" />
        <span>{averageRating.toFixed(1)}</span>
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-ink",
          className
        )}
      >
        <span className="flex items-center gap-0.5 font-bold text-ink">
          <Star size={13} className="fill-gold stroke-gold shrink-0" />
          <span>{averageRating.toFixed(1)}</span>
        </span>
        {showCount && (
          <span className="text-muted">({totalReviews} review{totalReviews === 1 ? "" : "s"})</span>
        )}
      </span>
    );
  }

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-xs font-medium text-ink",
          className
        )}
      >
        <Star size={12} className="fill-gold stroke-gold shrink-0" />
        <span className="font-bold">{averageRating.toFixed(1)}</span>
        {showCount && (
          <>
            <span className="text-muted/60">·</span>
            <span className="text-muted">{totalReviews} reviews</span>
          </>
        )}
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold tracking-tight text-ink">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={cn(
                    "shrink-0",
                    i < Math.round(averageRating)
                      ? "fill-gold stroke-gold"
                      : "stroke-line-strong text-transparent"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted">
              Based on {totalReviews} verified review{totalReviews === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "breakdown") {
    const bars = [
      { stars: 5, ...distribution.fiveStar },
      { stars: 4, ...distribution.fourStar },
      { stars: 3, ...distribution.threeStar },
      { stars: 2, ...distribution.twoStar },
      { stars: 1, ...distribution.oneStar },
    ];

    const categories = [
      { label: "Communication", score: categoryAverages.communication },
      { label: "Professionalism", score: categoryAverages.professionalism },
      { label: "Market Knowledge", score: categoryAverages.propertyKnowledge },
      { label: "Response Time", score: categoryAverages.responseTime },
    ];

    return (
      <div className={cn("space-y-6", className)}>
        {/* Overall Score */}
        <div className="flex items-center gap-4 border-b border-line pb-6">
          <div className="flex flex-col">
            <span className="font-display text-5xl font-bold tracking-tight text-ink">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold mt-1">
              Overall Rating
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={cn(
                    "shrink-0",
                    i < Math.round(averageRating)
                      ? "fill-gold stroke-gold"
                      : "stroke-line-strong text-transparent"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted">
              {totalReviews} verified client evaluation{totalReviews === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* 5-Star Distribution Bars */}
        <div className="space-y-2">
          {bars.map((b) => (
            <div key={b.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 shrink-0 font-medium text-muted">
                {b.stars} star{b.stars === 1 ? "" : "s"}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface border border-line/60">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: `${b.percentage}%` }}
                />
              </div>
              <span className="w-12 text-right text-[0.6875rem] text-muted font-medium">
                {b.percentage}%
              </span>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="border-t border-line pt-5">
          <p className="eyebrow mb-3">Service Criteria</p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <div key={c.label} className="rounded-xl border border-line bg-surface/60 p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted font-medium truncate">{c.label}</span>
                  <span className="font-bold text-ink ml-1">{c.score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
