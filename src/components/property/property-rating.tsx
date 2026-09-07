"use client";

import { usePropertyReviews } from "@/lib/store/review-store";
import { Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyRatingProps {
  propertyId: string;
  variant?: "card" | "header" | "compact" | "badge";
  className?: string;
  onClick?: () => void;
}

export function PropertyRating({
  propertyId,
  variant = "card",
  className,
  onClick,
}: PropertyRatingProps) {
  const { getPropertyRating } = usePropertyReviews();
  const summary = getPropertyRating(propertyId);

  const hasReviews = summary.totalReviews > 0;

  if (!hasReviews) {
    if (variant === "header") {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas-subtle/80 px-2.5 py-1 text-xs font-medium text-muted",
            className
          )}
        >
          <Sparkles size={12} className="text-brass shrink-0" />
          <span>New listing · No reviews yet</span>
        </span>
      );
    }

    if (variant === "card") {
      return (
        <span
          className={cn(
            "inline-flex items-center text-[0.75rem] font-medium text-muted/80 tracking-tight",
            className
          )}
          title="This property has not received any reviews yet"
        >
          New listing
        </span>
      );
    }

    if (variant === "compact") {
      return (
        <span
          className={cn(
            "text-[0.6875rem] text-muted tracking-tight",
            className
          )}
        >
          New
        </span>
      );
    }

    return null;
  }

  // Formatting reviews label
  const reviewCountText =
    variant === "header"
      ? `${summary.totalReviews} ${
          summary.totalReviews === 1 ? "review" : "reviews"
        }`
      : `(${summary.totalReviews})`;

  const handleHeaderClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const el = document.getElementById("reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={handleHeaderClick}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-line bg-canvas/90 px-3 py-1 text-xs font-medium text-ink transition-all hover:border-brass/50 hover:bg-brass-tint/40 cursor-pointer shadow-2xs",
          className
        )}
        title="Jump to tenant & customer reviews"
      >
        <span className="flex items-center gap-1 font-semibold text-ink">
          <Star
            size={13}
            className="fill-amber-400 text-amber-500 drop-shadow-xs shrink-0"
          />
          {summary.averageRating.toFixed(1)}
        </span>
        <span className="text-muted group-hover:text-ink transition-colors">
          · {reviewCountText}
        </span>
        {summary.verifiedReviewsCount > 0 && (
          <span className="text-[0.6875rem] text-brass font-medium bg-brass-tint px-1.5 py-0.5 rounded-full">
            {summary.verifiedReviewsCount} verified
          </span>
        )}
      </button>
    );
  }

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md bg-canvas/90 backdrop-blur-xs px-2 py-0.5 text-xs font-medium text-ink shadow-2xs",
          className
        )}
      >
        <Star size={11} className="fill-amber-400 text-amber-500 shrink-0" />
        <span className="font-semibold">{summary.averageRating.toFixed(1)}</span>
        <span className="text-muted text-[0.6875rem]">{reviewCountText}</span>
      </span>
    );
  }

  const tooltipText = `Rated ${summary.averageRating.toFixed(1)} out of 5 based on ${summary.totalReviews} reviews (${summary.verifiedReviewsCount} verified)`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-[0.75rem] text-muted",
        className
      )}
      title={tooltipText}
    >
      <span className="flex items-center gap-0.5 font-medium text-ink">
        <Star
          size={11}
          className="fill-amber-400 text-amber-500 shrink-0 -translate-y-px"
        />
        {summary.averageRating.toFixed(1)}
      </span>
      <span className="text-muted/90 text-[0.6875rem]">
        {reviewCountText}
      </span>
    </div>
  );
}
