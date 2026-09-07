"use client";

import { useState, useMemo } from "react";
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquarePlus,
  Sparkles,
  SlidersHorizontal,
  Home,
  Clock,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import type { Property } from "@/lib/types";
import type { PropertyReview, ResidentStatus } from "@/lib/types/leads-and-reviews";
import { usePropertyReviews } from "@/lib/store/review-store";
import { WritePropertyReviewModal } from "./write-property-review-modal";
import { cn } from "@/lib/utils";

interface PropertyReviewsSectionProps {
  property: Property;
  className?: string;
}

const STAR_KEYS = [
  { stars: 5, key: "fiveStar" as const },
  { stars: 4, key: "fourStar" as const },
  { stars: 3, key: "threeStar" as const },
  { stars: 2, key: "twoStar" as const },
  { stars: 1, key: "oneStar" as const },
];

export function PropertyReviewsSection({
  property,
  className,
}: PropertyReviewsSectionProps) {
  const { getPropertyReviews, getPropertyRating, markReviewHelpful } =
    usePropertyReviews();

  const reviews = getPropertyReviews(property.id);
  const summary = getPropertyRating(property.id);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "verified" | "5star" | "4star">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"recent" | "highest">("recent");
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>(
    {}
  );

  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (filter === "verified") {
      list = list.filter((r) => r.verified);
    } else if (filter === "5star") {
      list = list.filter((r) => r.rating === 5);
    } else if (filter === "4star") {
      list = list.filter((r) => r.rating === 4);
    }

    if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return list;
  }, [reviews, filter, sortBy]);

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulClicked[reviewId]) return;
    markReviewHelpful(property.id, reviewId);
    setHelpfulClicked((prev) => ({ ...prev, [reviewId]: true }));
  };

  const residentStatusLabel = (status?: ResidentStatus) => {
    switch (status) {
      case "Current Tenant":
        return { label: "Current Resident", icon: Home };
      case "Former Resident":
        return { label: "Former Resident", icon: Clock };
      case "Verified Client":
        return { label: "Verified Client", icon: UserCheck };
      case "Recent Viewing":
        return { label: "Recent Viewing", icon: UserCheck };
      default:
        return { label: "Resident", icon: Home };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section
      id="reviews"
      aria-label="Property Reviews & Ratings"
      className={cn("scroll-mt-24 space-y-6", className)}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Resident & Tenant Reviews
            </h2>
            {summary.totalReviews > 0 && (
              <span className="rounded-full bg-brass-tint px-2.5 py-0.5 text-xs font-semibold text-brass">
                {summary.totalReviews}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            Independent ratings and living feedback from verified tenants in Qatar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-paper shadow-2xs transition-all hover:bg-ink/90 active:scale-95 cursor-pointer shrink-0"
        >
          <MessageSquarePlus size={15} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* When no reviews yet: Clean Neutral State */}
      {summary.totalReviews === 0 ? (
        <div className="rounded-2xl border border-line bg-surface/40 p-8 sm:p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brass-tint text-brass mb-3">
            <Sparkles size={22} />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink">
            No reviews yet for this listing
          </h3>
          <p className="mt-1 max-w-md mx-auto text-xs text-muted leading-relaxed">
            This is a new or newly cataloged listing on SpaceFlex. Be the first
            resident, tenant, or verified viewer to share authentic feedback
            about living here.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-brass hover:text-brass cursor-pointer"
            >
              <MessageSquarePlus size={14} />
              <span>Share Resident Feedback</span>
            </button>
          </div>

          <div className="mt-6 border-t border-line/60 pt-4 max-w-sm mx-auto flex items-center justify-center gap-2 text-[0.75rem] text-muted">
            <ShieldCheck size={14} className="text-brass shrink-0" />
            <span>SpaceFlex verifies viewing and tenancy records for all submitted reviews.</span>
          </div>
        </div>
      ) : (
        /* Has Reviews: Editorial Rating Overview */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border border-line bg-surface/50 p-5 sm:p-6">
            {/* Score Summary */}
            <div className="lg:col-span-4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-line pb-5 lg:pb-0 lg:pr-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                  {summary.averageRating.toFixed(1)}
                </span>
                <span className="text-sm font-medium text-muted">/ 5.0</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={cn(
                      star <= Math.round(summary.averageRating)
                        ? "fill-amber-400 text-amber-500"
                        : "stroke-line text-transparent"
                    )}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-muted">
                Based on{" "}
                <strong className="text-ink font-semibold">
                  {summary.totalReviews} customer & tenant reviews
                </strong>
              </p>

              {summary.verifiedReviewsCount > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-success font-medium">
                  <ShieldCheck size={15} className="shrink-0" />
                  <span>
                    {summary.verifiedReviewsCount} of {summary.totalReviews}{" "}
                    reviews verified by SpaceFlex
                  </span>
                </div>
              )}
            </div>

            {/* Rating Distribution Bars */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-1.5 border-b lg:border-b-0 lg:border-r border-line pb-5 lg:pb-0 lg:pr-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Rating Distribution
              </p>
              {STAR_KEYS.map(({ stars, key }) => {
                const bar = summary.distribution[key];
                return (
                  <div
                    key={stars}
                    className="flex items-center gap-2 text-xs text-muted"
                  >
                    <span className="w-8 shrink-0 flex items-center gap-0.5 text-ink font-medium">
                      {stars} <Star size={10} className="fill-amber-400 text-amber-500" />
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-raised overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${bar.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-[0.6875rem] text-muted">
                      {bar.count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Living Quality Scores
              </p>
              {summary.categoryAverages && (
                <div className="space-y-1.5 text-xs">
                  <CategoryRow
                    label="Location & Access"
                    score={summary.categoryAverages.location}
                  />
                  <CategoryRow
                    label="Build & Finishes"
                    score={summary.categoryAverages.buildQuality}
                  />
                  <CategoryRow
                    label="Amenities & Facilities"
                    score={summary.categoryAverages.amenities}
                  />
                  <CategoryRow
                    label="Value for Money"
                    score={summary.categoryAverages.valueForMoney}
                  />
                  <CategoryRow
                    label="Facility Management"
                    score={summary.categoryAverages.management}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer",
                  filter === "all"
                    ? "bg-ink text-paper"
                    : "bg-surface text-muted hover:text-ink border border-line"
                )}
              >
                All ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("verified")}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer",
                  filter === "verified"
                    ? "bg-ink text-paper"
                    : "bg-surface text-muted hover:text-ink border border-line"
                )}
              >
                <ShieldCheck size={13} className="text-success" />
                <span>Verified ({summary.verifiedReviewsCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter("5star")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer",
                  filter === "5star"
                    ? "bg-ink text-paper"
                    : "bg-surface text-muted hover:text-ink border border-line"
                )}
              >
                5 Stars ({summary.distribution.fiveStar.count})
              </button>
              <button
                type="button"
                onClick={() => setFilter("4star")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer",
                  filter === "4star"
                    ? "bg-ink text-paper"
                    : "bg-surface text-muted hover:text-ink border border-line"
                )}
              >
                4 Stars ({summary.distribution.fourStar.count})
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <SlidersHorizontal size={13} />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "recent" | "highest")
                }
                className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-ink focus:border-brass focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Individual Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="rounded-xl border border-line/60 bg-surface/30 p-6 text-center text-xs text-muted">
                No reviews found matching the current filter.
              </div>
            ) : (
              filteredReviews.map((review) => {
                const statusInfo = residentStatusLabel(review.residentStatus);
                const isHelpful = Boolean(helpfulClicked[review.id]);
                const helpfulCount = (review.helpfulCount || 0) + (isHelpful ? 1 : 0);

                return (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-line bg-surface/40 p-5 transition-colors hover:border-line-strong space-y-3"
                  >
                    {/* Header: Author, Badge, Date */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-semibold text-sm text-ink">
                            {review.reviewerName}
                          </span>

                          {/* Verified Badge Indicator */}
                          {review.verified ? (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-success-tint px-2 py-0.5 text-[0.6875rem] font-semibold text-success"
                              title="Verified by SpaceFlex viewing/lease records"
                            >
                              <ShieldCheck size={12} className="shrink-0" />
                              <span>Verified {statusInfo.label}</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-[0.6875rem] text-muted border border-line"
                              title="Community review pending full lease verification"
                            >
                              <ShieldAlert size={12} className="shrink-0 text-muted" />
                              <span>Community Review</span>
                            </span>
                          )}

                          {review.leaseDuration && (
                            <span className="text-[0.6875rem] text-muted flex items-center gap-1">
                              · {review.leaseDuration}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted">
                          <span className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                className={cn(
                                  s <= review.rating
                                    ? "fill-amber-400 text-amber-500"
                                    : "stroke-line text-transparent"
                                )}
                              />
                            ))}
                          </span>
                          <span className="font-semibold text-ink">
                            {review.headline}
                          </span>
                        </div>
                      </div>

                      <time
                        dateTime={review.date}
                        className="text-[0.75rem] text-muted shrink-0"
                      >
                        {formatDate(review.date)}
                      </time>
                    </div>

                    {/* Review Body */}
                    <p className="text-xs text-ink/90 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Pros & Cons Pills */}
                    {((review.pros && review.pros.length > 0) ||
                      (review.cons && review.cons.length > 0)) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {review.pros?.map((p, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-lg bg-success-tint/40 border border-success/20 px-2 py-1 text-[0.6875rem] text-success font-medium"
                          >
                            <span className="font-bold">+</span> {p}
                          </span>
                        ))}
                        {review.cons?.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-[0.6875rem] text-amber-700 dark:text-amber-400 font-medium"
                          >
                            <span className="font-bold">-</span> {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Helpful Action */}
                    <div className="flex items-center justify-between border-t border-line/50 pt-3 text-xs">
                      <div className="flex items-center gap-3 text-[0.6875rem] text-muted">
                        <span>Resident residency verified in Qatar</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(review.id)}
                        disabled={isHelpful}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer",
                          isHelpful
                            ? "text-success font-semibold"
                            : "text-muted hover:text-ink hover:bg-surface"
                        )}
                        title="Mark this review as helpful"
                      >
                        <ThumbsUp size={12} />
                        <span>
                          Helpful ({helpfulCount})
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      <WritePropertyReviewModal
        property={property}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </section>
  );
}

function CategoryRow({ label, score }: { label: string; score: number }) {
  const pct = (score / 5) * 100;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted text-[0.75rem] truncate">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-raised overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-400"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-6 text-right font-semibold text-ink text-[0.75rem]">
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
