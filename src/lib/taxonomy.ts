import type { PropertyCategory, PropertyType } from "./types";

export interface TaxonomyCategory {
  id: PropertyCategory;
  slug: string;
  name: string;
  specLabel: string;
  specUnit: string;
}

export interface TaxonomyPropertyType {
  id: string;
  slug: string;
  name: PropertyType | string;
  category: "residential" | "commercial";
}

export interface TaxonomyAmenity {
  id: string;
  slug: string;
  name: string;
  categories: ("residential" | "commercial")[];
}

/* ── Single Source of Truth Taxonomy (Backend Simulation / Admin Panel Taxonomy) ── */

export const TAXONOMY_CATEGORIES: TaxonomyCategory[] = [
  {
    id: "all",
    slug: "all",
    name: "All Categories",
    specLabel: "Bedrooms / Rooms",
    specUnit: "rooms",
  },
  {
    id: "residential",
    slug: "residential",
    name: "Residential",
    specLabel: "Minimum Bedrooms",
    specUnit: "beds",
  },
  {
    id: "commercial",
    slug: "commercial",
    name: "Commercial",
    specLabel: "Minimum Rooms / Workstations",
    specUnit: "workstations",
  },
];

export const TAXONOMY_PROPERTY_TYPES: TaxonomyPropertyType[] = [
  // Residential
  { id: "pt_apt", slug: "apartment", name: "Apartment", category: "residential" },
  { id: "pt_villa", slug: "villa", name: "Villa", category: "residential" },
  { id: "pt_penthouse", slug: "penthouse", name: "Penthouse", category: "residential" },
  { id: "pt_townhouse", slug: "townhouse", name: "Townhouse", category: "residential" },
  { id: "pt_duplex", slug: "duplex", name: "Duplex", category: "residential" },
  { id: "pt_studio", slug: "studio", name: "Studio", category: "residential" },
  { id: "pt_compound", slug: "compound-villa", name: "Compound Villa", category: "residential" },

  // Commercial
  { id: "pt_office", slug: "office", name: "Office", category: "commercial" },
  { id: "pt_retail", slug: "retail-shop", name: "Retail Shop", category: "commercial" },
  { id: "pt_biz_ctr", slug: "business-center", name: "Business Center", category: "commercial" },
  { id: "pt_coworking", slug: "coworking-space", name: "Co-working Space", category: "commercial" },
  { id: "pt_shared_office", slug: "shared-office", name: "Shared Office", category: "commercial" },
  { id: "pt_warehouse", slug: "warehouse", name: "Warehouse", category: "commercial" },
  { id: "pt_industrial", slug: "industrial-unit", name: "Industrial Unit", category: "commercial" },
  { id: "pt_showroom", slug: "showroom", name: "Showroom", category: "commercial" },
];

export const TAXONOMY_AMENITIES: TaxonomyAmenity[] = [
  // Residential
  { id: "am_pool", slug: "swimming-pool", name: "Swimming Pool", categories: ["residential"] },
  { id: "am_gym", slug: "gym", name: "Gym", categories: ["residential", "commercial"] },
  { id: "am_concierge", slug: "concierge", name: "Concierge", categories: ["residential", "commercial"] },
  { id: "am_smarthome", slug: "smart-home", name: "Smart Home", categories: ["residential"] },
  { id: "am_furnished", slug: "furnished", name: "Furnished", categories: ["residential", "commercial"] },
  { id: "am_beach", slug: "beach-access", name: "Beach Access", categories: ["residential"] },
  { id: "am_play", slug: "children-play-area", name: "Children's Play Area", categories: ["residential"] },
  { id: "am_pets", slug: "pet-friendly", name: "Pet Friendly", categories: ["residential"] },
  { id: "am_balcony", slug: "balcony", name: "Balcony", categories: ["residential"] },
  { id: "am_maid", slug: "maid-room", name: "Maid Room", categories: ["residential"] },

  // Commercial
  { id: "am_conf", slug: "conference-room", name: "Conference Room", categories: ["commercial"] },
  { id: "am_vparking", slug: "visitor-parking", name: "Visitor Parking", categories: ["commercial", "residential"] },
  { id: "am_reception", slug: "reception", name: "Reception", categories: ["commercial"] },
  { id: "am_pantry", slug: "pantry", name: "Pantry", categories: ["commercial"] },
  { id: "am_internet", slug: "high-speed-internet", name: "High-Speed Internet", categories: ["commercial"] },
  { id: "am_ac", slug: "central-ac", name: "Central AC", categories: ["commercial", "residential"] },
  { id: "am_access247", slug: "247-access", name: "24/7 Access", categories: ["commercial"] },
  { id: "am_sec", slug: "security-system", name: "Security System", categories: ["commercial", "residential"] },
];

/* ── Taxonomy Query API Methods ── */

/**
 * Get available Property Types dynamically based on selected Category.
 */
export function getPropertyTypesForCategory(category: PropertyCategory): TaxonomyPropertyType[] {
  if (category === "all") return TAXONOMY_PROPERTY_TYPES;
  return TAXONOMY_PROPERTY_TYPES.filter((t) => t.category === category);
}

/**
 * Get available Amenities dynamically based on selected Category.
 */
export function getAmenitiesForCategory(category: PropertyCategory): TaxonomyAmenity[] {
  if (category === "all") return TAXONOMY_AMENITIES;
  return TAXONOMY_AMENITIES.filter((a) => a.categories.includes(category));
}

/**
 * Get Specification Config (Labels & Unit) dynamically based on selected Category.
 */
export function getSpecConfigForCategory(category: PropertyCategory): TaxonomyCategory {
  const found = TAXONOMY_CATEGORIES.find((c) => c.id === category);
  return found ?? TAXONOMY_CATEGORIES[0];
}

/**
 * Smart State Management:
 * When switching category, automatically remove invalid property type and invalid amenities.
 */
export function sanitizeFiltersForCategory(
  newCategory: PropertyCategory,
  currentType: string,
  currentAmenities: string[]
): {
  type: string;
  amenities: string[];
} {
  if (newCategory === "all") {
    return { type: currentType, amenities: currentAmenities };
  }

  // 1. Sanitize Property Type
  const validTypes = getPropertyTypesForCategory(newCategory).map((t) => t.name.toLowerCase());
  const typeIsValid = currentType === "all" || validTypes.includes(currentType.toLowerCase());
  const sanitizedType = typeIsValid ? currentType : "all";

  // 2. Sanitize Amenities
  const validAmenities = getAmenitiesForCategory(newCategory).map((a) => a.name.toLowerCase());
  const sanitizedAmenities = currentAmenities.filter((a) =>
    validAmenities.some((v) => v.includes(a.toLowerCase()) || a.toLowerCase().includes(v))
  );

  return {
    type: sanitizedType,
    amenities: sanitizedAmenities,
  };
}
