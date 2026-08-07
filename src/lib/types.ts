export type ListingStatus = "sale" | "rent";

export type PropertyCategory = "all" | "residential" | "commercial";

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Penthouse"
  | "Townhouse"
  | "Office"
  | "Duplex";

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  category?: "residential" | "commercial";
  status: ListingStatus;
  price: number;
  currency: "QAR" | "AED" | "SAR" | "INR" | "USD";
  rentPeriod?: "month" | "year";
  beds: number;
  baths: number;
  areaSqft: number;
  community: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  images: string[];
  amenities: string[];
  yearBuilt: number;
  furnishing: "Unfurnished" | "Semi-furnished" | "Furnished";
  parking: number;
  description: string;
  agentId: string;
  /* Who is behind this listing. Defaults to "agency" (a brokerage
     represented by its agent). "independent" = a solo licensed agent
     with no firm. "owner" = a private individual listing directly. */
  listingKind?: "agency" | "independent" | "owner";
  /* Present only when listingKind === "owner". */
  owner?: { name: string; since: number };
  featured?: boolean;
  exclusive?: boolean;
  offPlan?: boolean;
  daysOnMarket: number;
  views: number;
  rentYield?: number;
  floorPlan?: string;
}

export type LandmarkCategory =
  | "Work"
  | "Education"
  | "Retail"
  | "Transport"
  | "Health"
  | "Leisure";

export interface Landmark {
  id: string;
  name: string;
  /* Compact label for chips and result badges */
  short: string;
  category: LandmarkCategory;
  city: string;
  lat: number;
  lng: number;
}

export interface Agency {
  id: string;
  slug: string;
  name: string;
  logoInitials: string;
  city: string;
  since: number;
  licenseNo: string;
  activeListings: number;
  verified: boolean;
  tagline: string;
}

export interface Agent {
  id: string;
  agencyId?: string;
  slug: string;
  name: string;
  title: string;
  agency: string;
  photo: string;
  city: string;
  languages: string[];
  rating: number;
  reviews: number;
  transactions: number;
  yearsActive: number;
  responseTime: string;
  verified: boolean;
  specialties: string[];
  bio: string;
  phone?: string;
}

export interface Developer {
  id: string;
  slug: string;
  name: string;
  city: string;
  founded: number;
  projects: number;
  unitsDelivered: string;
  rating: number;
  logoInitials: string;
  cover: string;
  about: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  developerId: string;
  city: string;
  country: string;
  status: "Pre-launch" | "Under construction" | "Handover 2027" | "Ready";
  priceFrom: number;
  currency: Property["currency"];
  types: string[];
  handover: string;
  images: string[];
  amenities: string[];
  paymentPlan: string;
  about: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: string;
  authorRole: string;
  date: string;
  readMinutes: number;
  body: string[];
}
