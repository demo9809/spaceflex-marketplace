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
  PropertyReview,
  PropertyRatingSummary,
} from "../types/leads-and-reviews";
import { initialReviews, computeAgencyRatingSummary } from "../data/reviews";
import {
  initialPropertyReviews,
  computePropertyRatingSummary,
} from "../data/property-reviews";

// ── Agency Reviews ──
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

// ── Property Reviews ──
interface PropertyReviewState {
  propertyReviews: PropertyReview[];
  getPropertyReviews: (propertyId: string) => PropertyReview[];
  getPropertyRating: (propertyId: string) => PropertyRatingSummary;
  submitPropertyReview: (
    input: Omit<PropertyReview, "id" | "date">
  ) => Promise<PropertyReview>;
  hasReviewedProperty: (propertyId: string, identifier?: string) => boolean;
  markReviewHelpful: (propertyId: string, reviewId: string) => void;
}

const PropertyReviewContext = createContext<PropertyReviewState | null>(null);

export function AgencyReviewProvider({ children }: { children: ReactNode }) {
  // ── Agency State ──
  const [reviews, setReviews] = useState<AgencyReview[]>(initialReviews);
  const [agencyHydrated, setAgencyHydrated] = useState(false);

  // ── Property State ──
  const [propertyReviews, setPropertyReviews] =
    useState<PropertyReview[]>(initialPropertyReviews);
  const [propertyHydrated, setPropertyHydrated] = useState(false);

  // Hydrate Agency Reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sf:agency_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const storedIds = new Set(parsed.map((r: AgencyReview) => r.id));
          const missingInitials = initialReviews.filter(
            (r) => !storedIds.has(r.id)
          );
          setReviews([...parsed, ...missingInitials]);
        }
      }
    } catch {
      /* ignore */
    }
    setAgencyHydrated(true);
  }, []);

  // Sync Agency Reviews to localStorage
  useEffect(() => {
    if (agencyHydrated) {
      try {
        localStorage.setItem("sf:agency_reviews", JSON.stringify(reviews));
      } catch {
        /* ignore */
      }
    }
  }, [reviews, agencyHydrated]);

  // Hydrate Property Reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sf:property_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const storedIds = new Set(parsed.map((r: PropertyReview) => r.id));
          const missingInitials = initialPropertyReviews.filter(
            (r) => !storedIds.has(r.id)
          );
          setPropertyReviews([...parsed, ...missingInitials]);
        }
      }
    } catch {
      /* ignore */
    }
    setPropertyHydrated(true);
  }, []);

  // Sync Property Reviews to localStorage
  useEffect(() => {
    if (propertyHydrated) {
      try {
        localStorage.setItem(
          "sf:property_reviews",
          JSON.stringify(propertyReviews)
        );
      } catch {
        /* ignore */
      }
    }
  }, [propertyReviews, propertyHydrated]);

  // Agency methods
  const getAgencyReviews = useCallback(
    (agencyId: string): AgencyReview[] => {
      return reviews.filter((r) => r.agencyId === agencyId);
    },
    [reviews]
  );

  const agencyRatingsMap = useMemo(() => {
    const map = new Map<string, AgencyRatingSummary>();
    const agencyIds = Array.from(new Set(reviews.map((r) => r.agencyId)));
    for (const id of agencyIds) {
      map.set(id, computeAgencyRatingSummary(id, reviews));
    }
    return map;
  }, [reviews]);

  const getAgencyRating = useCallback(
    (agencyId: string): AgencyRatingSummary => {
      const existing = agencyRatingsMap.get(agencyId);
      if (existing) return existing;
      return computeAgencyRatingSummary(agencyId, reviews);
    },
    [agencyRatingsMap, reviews]
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

  // Property methods
  const getPropertyReviews = useCallback(
    (propertyId: string): PropertyReview[] => {
      return propertyReviews.filter((r) => r.propertyId === propertyId);
    },
    [propertyReviews]
  );

  const propertyRatingsMap = useMemo(() => {
    const map = new Map<string, PropertyRatingSummary>();
    const propertyIds = Array.from(
      new Set(propertyReviews.map((r) => r.propertyId))
    );
    for (const id of propertyIds) {
      map.set(id, computePropertyRatingSummary(id, propertyReviews));
    }
    return map;
  }, [propertyReviews]);

  const getPropertyRating = useCallback(
    (propertyId: string): PropertyRatingSummary => {
      const existing = propertyRatingsMap.get(propertyId);
      if (existing) return existing;
      return computePropertyRatingSummary(propertyId, propertyReviews);
    },
    [propertyRatingsMap, propertyReviews]
  );

  const submitPropertyReview = useCallback(
    async (
      input: Omit<PropertyReview, "id" | "date">
    ): Promise<PropertyReview> => {
      const newReview: PropertyReview = {
        ...input,
        id: `prev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        date: new Date().toISOString().split("T")[0],
      };

      setPropertyReviews((prev) => [newReview, ...prev]);
      return newReview;
    },
    []
  );

  const hasReviewedProperty = useCallback(
    (propertyId: string, identifier?: string): boolean => {
      if (!identifier) return false;
      const clean = identifier.trim().toLowerCase();
      return propertyReviews.some((r) => {
        if (r.propertyId !== propertyId) return false;
        return (
          r.reviewerIdentifier?.toLowerCase() === clean ||
          r.reviewerName.toLowerCase() === clean
        );
      });
    },
    [propertyReviews]
  );

  const markReviewHelpful = useCallback(
    (propertyId: string, reviewId: string) => {
      setPropertyReviews((prev) =>
        prev.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              helpfulCount: (r.helpfulCount || 0) + 1,
            };
          }
          return r;
        })
      );
    },
    []
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
      <PropertyReviewContext.Provider
        value={{
          propertyReviews,
          getPropertyReviews,
          getPropertyRating,
          submitPropertyReview,
          hasReviewedProperty,
          markReviewHelpful,
        }}
      >
        {children}
      </PropertyReviewContext.Provider>
    </AgencyReviewContext.Provider>
  );
}

export function useAgencyReviews() {
  const ctx = useContext(AgencyReviewContext);
  if (!ctx) {
    throw new Error(
      "useAgencyReviews must be used within an AgencyReviewProvider"
    );
  }
  return ctx;
}

export function usePropertyReviews() {
  const ctx = useContext(PropertyReviewContext);
  if (!ctx) {
    throw new Error(
      "usePropertyReviews must be used within an AgencyReviewProvider"
    );
  }
  return ctx;
}
