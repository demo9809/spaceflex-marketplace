"use client";

import { useState } from "react";
import { Star, X, CheckCircle2, ShieldCheck, BadgeCheck } from "lucide-react";
import { useAgencyReviews } from "@/lib/store/review-store";
import { useLeadCapture } from "@/lib/store/lead-store";
import type { Agency, Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WriteReviewModalProps {
  agency: Agency;
  team: Agent[];
  isOpen: boolean;
  onClose: () => void;
}

export function WriteReviewModal({
  agency,
  team,
  isOpen,
  onClose,
}: WriteReviewModalProps) {
  const { submitReview } = useAgencyReviews();
  const { hasVerifiedInteraction, savedProfile } = useLeadCapture();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(savedProfile?.name || "");
  const [identifier, setIdentifier] = useState(savedProfile?.phone || savedProfile?.email || "");
  const [headline, setHeadline] = useState("");
  const [comment, setComment] = useState("");
  const [agentId, setAgentId] = useState("");

  const [comm, setComm] = useState(5);
  const [prof, setProf] = useState(5);
  const [know, setKnow] = useState(5);
  const [resp, setResp] = useState(5);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isVerified = hasVerifiedInteraction(agency.id, identifier) || Boolean(savedProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 15) {
      setError("Please provide a detailed review (at least 15 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const selectedAgent = team.find((a) => a.id === agentId);

      await submitReview({
        agencyId: agency.id,
        reviewerName: name.trim(),
        reviewerIdentifier: identifier.trim() || undefined,
        verified: isVerified,
        rating,
        headline: headline.trim() || "Verified Agency Review",
        comment: comment.trim(),
        categories: {
          communication: comm,
          professionalism: prof,
          propertyKnowledge: know,
          responseTime: resp,
        },
        agentId: selectedAgent?.id,
        agentName: selectedAgent?.name,
        interactionType: "rental",
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setError("Failed to post review. Please try again.");
      setSubmitting(false);
    }
  };

  const RATING_LABELS: Record<number, string> = {
    1: "Poor experience",
    2: "Fair service",
    3: "Average / acceptable",
    4: "Very good experience",
    5: "Exceptional service",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs transition-all sm:items-center sm:p-4"
    >
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-line bg-paper shadow-modal sm:rounded-3xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-surface/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Star size={14} className="fill-gold stroke-gold" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Agency Review · {agency.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink cursor-pointer"
            aria-label="Close review dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 no-scrollbar">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-tint text-success ring-8 ring-success-tint/40">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                Review Published!
              </h3>
              <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                Thank you for rating {agency.name}. Your verified review has updated the agency&apos;s reputation across the platform.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Rate your experience with {agency.name}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Your feedback helps tenants identify verified, reliable brokerages in Qatar.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-danger/20 bg-danger-tint p-3 text-xs text-danger font-medium">
                  {error}
                </div>
              )}

              {/* Star Rating Selector */}
              <div className="rounded-2xl border border-line bg-surface/50 p-4 text-center space-y-2">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Overall Score
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                        aria-label={`${star} star`}
                      >
                        <Star
                          size={28}
                          className={cn(
                            "transition-colors",
                            active
                              ? "fill-gold stroke-gold"
                              : "stroke-line-strong text-transparent"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-medium text-ink">
                  {RATING_LABELS[hoverRating || rating]}
                </p>
              </div>

              {/* Verification Signal Pill */}
              <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs">
                {isVerified ? (
                  <>
                    <ShieldCheck size={16} className="text-success shrink-0" />
                    <span className="text-success font-medium">
                      Verified Client · Enquiry history verified with {agency.name}
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} className="text-muted shrink-0" />
                    <span className="text-muted">
                      Verification: Enter your enquiry phone/email to earn the Verified Reviewer badge.
                    </span>
                  </>
                )}
              </div>

              {/* Name & Phone/Email Verification Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink">
                    Your Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nasser Al-Kuwari"
                    className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink">
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+974 5555 0100"
                    className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              {/* Advisor worked with (optional) */}
              {team.length > 0 && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink">
                    Which advisor did you work with? (Optional)
                  </label>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink focus:border-brass focus:outline-none"
                  >
                    <option value="">Select advisor (optional)</option>
                    {team.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Review Title / Headline */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Seamless West Bay penthouse transaction"
                  className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                />
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink">
                  Detailed Review <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the property condition, responsiveness, honesty, contract negotiation, and overall experience…"
                  className="w-full rounded-xl border border-line bg-raised p-3 text-xs text-ink leading-relaxed placeholder:text-faint focus:border-brass focus:outline-none resize-none"
                />
              </div>

              {/* Category Ratings */}
              <div className="rounded-2xl border border-line bg-surface/40 p-3 space-y-2.5">
                <p className="text-xs font-semibold text-ink">
                  Service Criteria Ratings
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between bg-paper p-2 rounded-lg border border-line">
                    <span className="text-muted">Communication</span>
                    <select
                      value={comm}
                      onChange={(e) => setComm(Number(e.target.value))}
                      className="bg-transparent font-bold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value={5}>5 ★</option>
                      <option value={4}>4 ★</option>
                      <option value={3}>3 ★</option>
                      <option value={2}>2 ★</option>
                      <option value={1}>1 ★</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-paper p-2 rounded-lg border border-line">
                    <span className="text-muted">Professionalism</span>
                    <select
                      value={prof}
                      onChange={(e) => setProf(Number(e.target.value))}
                      className="bg-transparent font-bold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value={5}>5 ★</option>
                      <option value={4}>4 ★</option>
                      <option value={3}>3 ★</option>
                      <option value={2}>2 ★</option>
                      <option value={1}>1 ★</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-paper p-2 rounded-lg border border-line">
                    <span className="text-muted">Market Knowledge</span>
                    <select
                      value={know}
                      onChange={(e) => setKnow(Number(e.target.value))}
                      className="bg-transparent font-bold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value={5}>5 ★</option>
                      <option value={4}>4 ★</option>
                      <option value={3}>3 ★</option>
                      <option value={2}>2 ★</option>
                      <option value={1}>1 ★</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-paper p-2 rounded-lg border border-line">
                    <span className="text-muted">Response Time</span>
                    <select
                      value={resp}
                      onChange={(e) => setResp(Number(e.target.value))}
                      className="bg-transparent font-bold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value={5}>5 ★</option>
                      <option value={4}>4 ★</option>
                      <option value={3}>3 ★</option>
                      <option value={2}>2 ★</option>
                      <option value={1}>1 ★</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-ink text-xs font-semibold text-paper shadow-lift hover:bg-ink/90 transition-all cursor-pointer"
              >
                {submitting ? "Publishing Review…" : "Publish Verified Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
