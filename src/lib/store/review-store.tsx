"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AgencyReview,
  AgencyRatingSummary,
} from "../types/leads-and-reviews";
import { initialReviews, computeAgencyRatingSummary } from "../data/reviews";

interface AgencyReviewState {
  reviews: AgencyReview[];
  getAgencyReviews: (agencyId: string) => AgencyReview[];
  getAgencyRating: (agencyId: string) => AgencyRatingSummary;
  submitReview: (
    input: Omit<AgencyReview, "id" | "date">
  ) => Promise<AgencyReview>;
  hasReviewedAgency: (agencyId: string, identifier?: string) => boolean;
}

const AgencyReviewContext = createContext<AgencyReviewState | null>(null);

export function AgencyReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<AgencyReview[]>(initialReviews);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sf:agency_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored reviews with any new initial reviews that might not be in storage
          const storedIds = new Set(parsed.map((r: AgencyReview) => r.id));
          const missingInitials = initialReviews.filter((r) => !storedIds.has(r.id));
          setReviews([...parsed, ...missingInitials]);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("sf:agency_reviews", JSON.stringify(reviews));
      } catch {
        /* ignore */
      }
    }
  }, [reviews, hydrated]);

  const getAgencyReviews = useCallback(
    (agencyId: string): AgencyReview[] => {
      return reviews.filter((r) => r.agencyId === agencyId);
    },
    [reviews]
  );

  // Pre-calculate ratings lookup for single-source-of-truth fast queries
  const ratingsMap = useMemo(() => {
    const map = new Map<string, AgencyRatingSummary>();
    const agencyIds = Array.from(new Set(reviews.map((r) => r.agencyId)));
    for (const id of agencyIds) {
      map.set(id, computeAgencyRatingSummary(id, reviews));
    }
    return map;
  }, [reviews]);

  const getAgencyRating = useCallback(
    (agencyId: string): AgencyRatingSummary => {
      const existing = ratingsMap.get(agencyId);
      if (existing) return existing;
      return computeAgencyRatingSummary(agencyId, reviews);
    },
    [ratingsMap, reviews]
  );

  const submitReview = useCallback(
    async (
      input: Omit<AgencyReview, "id" | "date">
    ): Promise<AgencyReview> => {
      const newReview: AgencyReview = {
        ...input,
        id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        date: new Date().toISOString().split("T")[0],
      };

      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    },
    []
  );

  const hasReviewedAgency = useCallback(
    (agencyId: string, identifier?: string): boolean => {
      if (!identifier) return false;
      const clean = identifier.trim().toLowerCase();
      return reviews.some((r) => {
        if (r.agencyId !== agencyId) return false;
        return (
          r.reviewerIdentifier?.toLowerCase() === clean ||
          r.reviewerName.toLowerCase() === clean
        );
      });
    },
    [reviews]
  );

  return (
    <AgencyReviewContext.Provider
      value={{
        reviews,
        getAgencyReviews,
        getAgencyRating,
        submitReview,
        hasReviewedAgency,
      }}
    >
      {children}
    </AgencyReviewContext.Provider>
  );
}

export function useAgencyReviews() {
  const ctx = useContext(AgencyReviewContext);
  if (!ctx) {
    throw new Error("useAgencyReviews must be used within an AgencyReviewProvider");
  }
  return ctx;
}
