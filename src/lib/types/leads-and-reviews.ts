export type LeadAction = "call" | "whatsapp" | "viewing" | "enquiry";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "In Progress"
  | "Viewing Scheduled"
  | "Closed"
  | "Lost";

export type ContactPreference = "phone" | "whatsapp" | "email";

export type ContactTimeSlot = "Any time" | "Morning (9am - 12pm)" | "Afternoon (12pm - 4pm)" | "Evening (4pm - 7pm)";

export interface LeadContext {
  action: LeadAction;
  property?: {
    id: string;
    slug?: string;
    title: string;
    price?: number | string;
    currency?: string;
    community?: string;
    city?: string;
    image?: string;
  };
  agent?: {
    id: string;
    name: string;
    phone?: string;
    photo?: string;
    agency?: string;
    agencyId?: string;
  };
  agency?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    logoInitials?: string;
  };
  sourcePage?: string;
  defaultMessage?: string;
}

export interface Lead {
  id: string;
  customerName: string;
  phone: string;
  countryCode?: string;
  email?: string;
  contactPreference?: ContactPreference;
  preferredTime?: ContactTimeSlot;
  message: string;
  action: LeadAction;
  propertyId?: string;
  propertyName?: string;
  propertySlug?: string;
  agencyId?: string;
  agencyName?: string;
  agentId?: string;
  agentName?: string;
  sourcePage?: string;
  timestamp: string; // ISO string
  status: LeadStatus;
  viewingDate?: string;
  viewingTimeSlot?: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  countryCode: string;
  email?: string;
  contactPreference: ContactPreference;
}

export interface AgencyReview {
  id: string;
  agencyId: string;
  reviewerName: string;
  reviewerIdentifier?: string; // masked email or phone used to verify
  verified: boolean;
  date: string; // ISO string or relative date e.g. "2 weeks ago"
  rating: number; // 1 to 5
  headline: string;
  comment: string;
  categories: {
    communication: number; // 1 to 5
    professionalism: number; // 1 to 5
    propertyKnowledge: number; // 1 to 5
    responseTime: number; // 1 to 5
  };
  agentId?: string;
  agentName?: string;
  interactionType?: "viewing" | "rental" | "enquiry" | "consultation";
}

export interface AgencyRatingSummary {
  agencyId: string;
  averageRating: number;
  totalReviews: number;
  distribution: {
    fiveStar: { count: number; percentage: number };
    fourStar: { count: number; percentage: number };
    threeStar: { count: number; percentage: number };
    twoStar: { count: number; percentage: number };
    oneStar: { count: number; percentage: number };
  };
  categoryAverages: {
    communication: number;
    professionalism: number;
    propertyKnowledge: number;
    responseTime: number;
  };
}

export type ResidentStatus =
  | "Current Tenant"
  | "Former Resident"
  | "Verified Client"
  | "Recent Viewing";

export interface PropertyReview {
  id: string;
  propertyId: string;
  reviewerName: string;
  reviewerIdentifier?: string; // masked email or phone used to verify
  verified: boolean;
  residentStatus?: ResidentStatus;
  date: string; // ISO date string e.g. "2026-06-15"
  rating: number; // 1 to 5
  headline: string;
  comment: string;
  categories: {
    location: number; // 1 to 5
    buildQuality: number; // 1 to 5
    amenities: number; // 1 to 5
    valueForMoney: number; // 1 to 5
    management: number; // 1 to 5
  };
  pros?: string[];
  cons?: string[];
  leaseDuration?: string;
  helpfulCount?: number;
}

export interface PropertyRatingSummary {
  propertyId: string;
  averageRating: number;
  totalReviews: number;
  verifiedReviewsCount: number;
  distribution: {
    fiveStar: { count: number; percentage: number };
    fourStar: { count: number; percentage: number };
    threeStar: { count: number; percentage: number };
    twoStar: { count: number; percentage: number };
    oneStar: { count: number; percentage: number };
  };
  categoryAverages: {
    location: number;
    buildQuality: number;
    amenities: number;
    valueForMoney: number;
    management: number;
  };
}
