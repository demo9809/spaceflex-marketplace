"use client";

import { useState, useMemo } from "react";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  PenSquare,
  Filter,
  UserCheck,
  Building2,
} from "lucide-react";
import type { Agency, Agent } from "@/lib/types";
import { useAgencyReviews } from "@/lib/store/review-store";
import { AgencyRating } from "./agency-rating";
import { WriteReviewModal } from "./write-review-modal";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

interface AgencyReviewsSectionProps {
  agency: Agency;
  team: Agent[];
}

export function AgencyReviewsSection({ agency, team }: AgencyReviewsSectionProps) {
  const { getAgencyReviews, getAgencyRating } = useAgencyReviews();
  const reviews = getAgencyReviews(agency.id);
  const ratingData = getAgencyRating(agency.id);

  const [selectedFilter, setSelectedFilter] = useState<number | "all">("all");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const filteredReviews = useMemo(() => {
    if (selectedFilter === "all") return reviews;
    return reviews.filter((r) => Math.round(r.rating) === selectedFilter);
  }, [reviews, selectedFilter]);

  return (
    <section aria-labelledby="agency-reviews" className="mt-20 border-t border-line pt-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <SectionHeading
          eyebrow="Verified Reputation"
          title={`Client reviews for ${agency.name}`}
          description={`Licence-checked reviews from tenants and investors who conducted viewings and leases with ${agency.name}.`}
        />

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-xs font-semibold text-paper shadow-xs transition-all hover:bg-ink/90 active:scale-95 cursor-pointer shrink-0"
        >
          <PenSquare size={14} />
          <span>Write a Review</span>
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        {/* Left Column: Overall score & breakdown card */}
        <div className="rounded-3xl border border-line bg-raised p-6 md:p-8 shadow-card h-fit lg:sticky lg:top-24">
          <AgencyRating variant="breakdown" agencyId={agency.id} />

          <div className="mt-6 rounded-2xl bg-surface/70 p-4 border border-line/60">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-ink">
                  SpaceFlex Verified Review Policy
                </p>
                <p className="mt-1 text-[0.6875rem] text-muted leading-relaxed">
                  Only individuals with verified viewing enquiries, lease contracts, or direct advisor consultations are eligible for the verified reviewer badge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Filters + Review Cards */}
        <div className="space-y-6">
          {/* Star Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-line">
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium transition-colors cursor-pointer",
                selectedFilter === "all"
                  ? "bg-ink text-paper"
                  : "bg-surface text-muted hover:text-ink border border-line"
              )}
            >
              All Reviews ({reviews.length})
            </button>

            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
              if (count === 0 && selectedFilter !== stars) return null;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setSelectedFilter(stars)}
                  className={cn(
                    "flex items-center gap-1 h-8 rounded-full px-3 text-xs font-medium transition-colors cursor-pointer",
                    selectedFilter === stars
                      ? "bg-ink text-paper"
                      : "bg-surface text-muted hover:text-ink border border-line"
                  )}
                >
                  <span>{stars}</span>
                  <Star size={11} className="fill-gold stroke-gold" />
                  <span className="text-muted">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Review List */}
          {filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="rounded-2xl border border-line bg-raised p-5 sm:p-6 shadow-xs transition-shadow hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-sm text-ink">
                          {rev.reviewerName}
                        </span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success-tint px-2 py-0.5 text-[0.625rem] font-medium text-success">
                            <CheckCircle2 size={11} /> Verified Client
                          </span>
                        )}
                      </div>

                      {rev.agentName && (
                        <p className="text-[0.6875rem] text-muted mt-0.5 flex items-center gap-1">
                          <span>Worked with advisor:</span>
                          <span className="font-medium text-ink">{rev.agentName}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={cn(
                              i < rev.rating
                                ? "fill-gold stroke-gold"
                                : "stroke-line-strong text-transparent"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[0.6875rem] text-faint mt-1">{rev.date}</span>
                    </div>
                  </div>

                  {rev.headline && (
                    <h4 className="font-display text-base font-semibold text-ink mt-3">
                      {rev.headline}
                    </h4>
                  )}

                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    {rev.comment}
                  </p>

                  {/* Category Ratings Strip */}
                  {rev.categories && (
                    <div className="mt-4 pt-3 border-t border-line/60 flex flex-wrap gap-2 text-[0.6875rem]">
                      <span className="rounded-md bg-surface px-2 py-1 text-muted">
                        Communication: <strong className="text-ink">{rev.categories.communication}/5</strong>
                      </span>
                      <span className="rounded-md bg-surface px-2 py-1 text-muted">
                        Professionalism: <strong className="text-ink">{rev.categories.professionalism}/5</strong>
                      </span>
                      <span className="rounded-md bg-surface px-2 py-1 text-muted">
                        Knowledge: <strong className="text-ink">{rev.categories.propertyKnowledge}/5</strong>
                      </span>
                      <span className="rounded-md bg-surface px-2 py-1 text-muted">
                        Response: <strong className="text-ink">{rev.categories.responseTime}/5</strong>
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line-strong py-12 text-center">
              <p className="text-sm font-medium text-ink">No reviews match this filter</p>
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className="mt-2 text-xs text-brass hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      <WriteReviewModal
        agency={agency}
        team={team}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </section>
  );
}
