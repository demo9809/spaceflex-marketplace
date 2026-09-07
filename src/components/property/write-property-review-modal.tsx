"use client";

import { useState } from "react";
import {
  Star,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Home,
  Clock,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
} from "lucide-react";
import { usePropertyReviews } from "@/lib/store/review-store";
import { useLeadCapture } from "@/lib/store/lead-store";
import type { Property } from "@/lib/types";
import type { ResidentStatus } from "@/lib/types/leads-and-reviews";
import { cn } from "@/lib/utils";

interface WritePropertyReviewModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor - Significant issues",
  2: "Fair - Below expectations",
  3: "Good - Meets expectations",
  4: "Very Good - Highly satisfied",
  5: "Exceptional - Outstanding living experience",
};

const RESIDENT_STATUS_OPTIONS: {
  value: ResidentStatus;
  label: string;
  description: string;
  icon: typeof Home;
}[] = [
  {
    value: "Current Tenant",
    label: "Current Resident",
    description: "I currently live in or lease this property",
    icon: Home,
  },
  {
    value: "Former Resident",
    label: "Former Resident",
    description: "I previously leased or lived here",
    icon: Clock,
  },
  {
    value: "Verified Client",
    label: "Verified Viewer / Buyer",
    description: "I toured and evaluated this property",
    icon: UserCheck,
  },
];

export function WritePropertyReviewModal({
  property,
  isOpen,
  onClose,
}: WritePropertyReviewModalProps) {
  const { submitPropertyReview } = usePropertyReviews();
  const { hasVerifiedPropertyInteraction, savedProfile } = useLeadCapture();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [name, setName] = useState(savedProfile?.name || "");
  const [identifier, setIdentifier] = useState(
    savedProfile?.phone || savedProfile?.email || ""
  );
  const [anonymize, setAnonymize] = useState(false);
  const [residentStatus, setResidentStatus] =
    useState<ResidentStatus>("Current Tenant");
  const [leaseDuration, setLeaseDuration] = useState("1 year");

  const [headline, setHeadline] = useState("");
  const [comment, setComment] = useState("");
  const [pro, setPro] = useState("");
  const [con, setCon] = useState("");

  // Categories
  const [catLocation, setCatLocation] = useState(5);
  const [catQuality, setCatQuality] = useState(5);
  const [catAmenities, setCatAmenities] = useState(5);
  const [catValue, setCatValue] = useState(5);
  const [catManagement, setCatManagement] = useState(5);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Verification check: User has contacted or booked viewing for this property
  const isVerified =
    hasVerifiedPropertyInteraction(property.id, identifier) ||
    Boolean(savedProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const reviewerDisplayName = anonymize
      ? `Verified ${
          residentStatus === "Current Tenant"
            ? "Resident"
            : residentStatus === "Former Resident"
            ? "Former Tenant"
            : "Client"
        } in ${property.community}`
      : name.trim();

    if (!reviewerDisplayName) {
      setError("Please enter your name or choose to post anonymously.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 20) {
      setError(
        "Please provide a thoughtful review (at least 20 characters) to help the SpaceFlex community."
      );
      return;
    }

    setSubmitting(true);

    try {
      await submitPropertyReview({
        propertyId: property.id,
        reviewerName: reviewerDisplayName,
        reviewerIdentifier: identifier.trim() || undefined,
        residentStatus,
        verified: isVerified,
        rating,
        headline: headline.trim() || `${property.title} Review`,
        comment: comment.trim(),
        leaseDuration: leaseDuration || undefined,
        pros: pro.trim() ? [pro.trim()] : undefined,
        cons: con.trim() ? [con.trim()] : undefined,
        categories: {
          location: catLocation,
          buildQuality: catQuality,
          amenities: catAmenities,
          valueForMoney: catValue,
          management: catManagement,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch {
      setError("Failed to publish review. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4 animate-in fade-in duration-200"
    >
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] border border-line bg-paper shadow-modal sm:rounded-3xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line bg-surface/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-tint text-brass">
              <Building2 size={14} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Property Rating & Review
              </p>
              <p className="line-clamp-1 text-xs font-medium text-ink">
                {property.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 no-scrollbar">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-tint text-success ring-8 ring-success-tint/40">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                Review Published!
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to SpaceFlex verified residency
                records. Your rating has updated this property&apos;s score.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Share Your Experience
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Verified reviews help future residents make informed living
                  decisions in Qatar.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-danger/20 bg-danger-tint p-3 text-xs text-danger font-medium">
                  {error}
                </div>
              )}

              {/* Overall Star Rating */}
              <div className="rounded-2xl border border-line bg-surface/50 p-4 text-center space-y-2">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Overall Property Rating
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
                          size={30}
                          className={cn(
                            "transition-colors",
                            active
                              ? "fill-amber-400 text-amber-500"
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

              {/* Resident Status Radio Cards */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Your Resident Status <span className="text-danger">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {RESIDENT_STATUS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = residentStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setResidentStatus(opt.value)}
                        className={cn(
                          "flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer",
                          selected
                            ? "border-brass bg-brass-tint/30 ring-1 ring-brass/30"
                            : "border-line bg-surface/40 hover:border-line-strong"
                        )}
                      >
                        <div className="flex items-center gap-1.5 font-medium text-xs text-ink">
                          <Icon
                            size={14}
                            className={cn(
                              selected ? "text-brass" : "text-muted"
                            )}
                          />
                          <span>{opt.label}</span>
                        </div>
                        <span className="text-[0.6875rem] text-muted mt-1 leading-tight">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verification Status Indicator */}
              <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface/60 p-3 text-xs">
                {isVerified ? (
                  <>
                    <ShieldCheck
                      size={18}
                      className="text-success shrink-0 mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-success font-semibold">
                        Verified SpaceFlex Interaction
                      </p>
                      <p className="text-muted text-[0.6875rem] leading-tight">
                        Your review will carry the verified tenant/client badge
                        and boost overall property confidence.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldCheck
                      size={18}
                      className="text-muted shrink-0 mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-ink font-medium">
                        Verification Matching
                      </p>
                      <p className="text-muted text-[0.6875rem] leading-tight">
                        Enter the phone or email used when requesting a viewing
                        or contacting the agent to automatically receive a
                        Verified Review badge.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-ink">
                      Your Name
                    </label>
                    <label className="flex items-center gap-1 text-[0.6875rem] text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anonymize}
                        onChange={(e) => setAnonymize(e.target.checked)}
                        className="rounded border-line accent-brass"
                      />
                      <span>Anonymize</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={anonymize}
                    value={
                      anonymize
                        ? `Verified Resident (${property.community})`
                        : name
                    }
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Al-Sayed"
                    className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink">
                    Phone or Email{" "}
                    <span className="text-[0.6875rem] text-muted font-normal">
                      (for verification)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+974 5555 0123"
                    className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              {/* Lease Duration & Headline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-xs font-semibold text-ink">
                    Tenancy Length
                  </label>
                  <select
                    value={leaseDuration}
                    onChange={(e) => setLeaseDuration(e.target.value)}
                    className="h-10 w-full rounded-xl border border-line bg-raised px-2.5 text-xs text-ink focus:border-brass focus:outline-none"
                  >
                    <option value="Under 6 months">Under 6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                    <option value="3+ years">3+ years</option>
                    <option value="Tour / Viewing">Tour / Viewing</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Quiet tower with great amenities and sea views"
                    className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink">
                  Detailed Review <span className="text-danger">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your daily experience: acoustic soundproofing, HVAC performance, elevators, parking, building maintenance, and community atmosphere..."
                  className="w-full rounded-xl border border-line bg-raised p-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none resize-none"
                />
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="flex items-center gap-1 text-xs font-semibold text-ink">
                    <ThumbsUp size={12} className="text-success" />
                    <span>Top Highlight (Pro)</span>
                  </label>
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => setPro(e.target.value)}
                    placeholder="e.g. Spacious balcony & swift maintenance"
                    className="h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1 text-xs font-semibold text-ink">
                    <ThumbsDown size={12} className="text-amber-500" />
                    <span>Area for Improvement (Con)</span>
                  </label>
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => setCon(e.target.value)}
                    placeholder="e.g. Visitor parking fills fast on weekends"
                    className="h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Category Ratings */}
              <div className="rounded-2xl border border-line bg-surface/40 p-4 space-y-3">
                <p className="text-xs font-semibold text-ink">
                  Category Breakdown (1 - 5)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <CategorySlider
                    label="Location & Access"
                    value={catLocation}
                    onChange={setCatLocation}
                  />
                  <CategorySlider
                    label="Build & Finishes"
                    value={catQuality}
                    onChange={setCatQuality}
                  />
                  <CategorySlider
                    label="Amenities & Pool/Gym"
                    value={catAmenities}
                    onChange={setCatAmenities}
                  />
                  <CategorySlider
                    label="Value for Money"
                    value={catValue}
                    onChange={setCatValue}
                  />
                  <CategorySlider
                    label="Facility Management"
                    value={catManagement}
                    onChange={setCatManagement}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-muted hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-xs font-semibold text-paper shadow-sm transition-all hover:bg-ink/90 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Publishing..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function CategorySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-raised px-3 py-2 border border-line/60">
      <span className="text-muted text-[0.75rem] font-medium">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
            aria-label={`${s} for ${label}`}
          >
            <Star
              size={14}
              className={cn(
                s <= value
                  ? "fill-amber-400 text-amber-500"
                  : "stroke-line text-transparent"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
