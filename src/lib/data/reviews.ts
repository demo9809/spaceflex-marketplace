import type { AgencyReview, AgencyRatingSummary } from "../types/leads-and-reviews";

export const initialReviews: AgencyReview[] = [
  // ── ag1: Meridian Estates ──────────────────────────────────────────
  {
    id: "rev-me-1",
    agencyId: "ag1",
    reviewerName: "Nasser Al-Kuwari",
    reviewerIdentifier: "+974 55***789",
    verified: true,
    date: "2026-08-14",
    rating: 5,
    headline: "Seamless West Bay penthouse transaction",
    comment:
      "Yasmin Al-Thani and the Meridian Estates team represented the landlord with absolute integrity. Viewings were arranged discreetly around my schedule and the lease signing was completed within 48 hours without friction.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a1",
    agentName: "Yasmin Al-Thani",
    interactionType: "rental",
  },
  {
    id: "rev-me-2",
    agencyId: "ag1",
    reviewerName: "Sophie Laurent",
    reviewerIdentifier: "s***@diplomat.fr",
    verified: true,
    date: "2026-07-28",
    rating: 5,
    headline: "Unmatched knowledge of Lusail Marina towers",
    comment:
      "Meridian provided a complete comparative yield analysis for 3 properties before our physical visit. Their team pointed out building maintenance nuances that other brokers failed to mention.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 4,
    },
    agentId: "a1",
    agentName: "Yasmin Al-Thani",
    interactionType: "viewing",
  },
  {
    id: "rev-me-3",
    agencyId: "ag1",
    reviewerName: "David Sterling",
    reviewerIdentifier: "+974 66***120",
    verified: true,
    date: "2026-06-11",
    rating: 5,
    headline: "Reliable, transparent and licence-checked",
    comment:
      "Every document matched ULC registration requirements exactly. When dealing with luxury rentals in Doha, having a verified brokerage like Meridian gives true peace of mind.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    interactionType: "rental",
  },
  {
    id: "rev-me-4",
    agencyId: "ag1",
    reviewerName: "Mariam Al-Subaie",
    reviewerIdentifier: "m.al***@qf.org.qa",
    verified: true,
    date: "2026-05-19",
    rating: 4,
    headline: "Great portfolio, slight delay in initial callback",
    comment:
      "The viewing of the West Bay Lagoon villa was thorough and professional. Initial WhatsApp enquiry took a couple of hours to route, but once in touch with the lead advisor, everything was pristine.",
    categories: {
      communication: 4,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 4,
    },
    agentId: "a4",
    agentName: "Tariq Mansour",
    interactionType: "viewing",
  },

  // ── ag2: Corniche & Co. ──────────────────────────────────────────
  {
    id: "rev-cc-1",
    agencyId: "ag2",
    reviewerName: "Dr. Hamad Al-Attiyah",
    reviewerIdentifier: "+974 55***456",
    verified: true,
    date: "2026-08-22",
    rating: 5,
    headline: "Omar Haddad is the benchmark for private advisory",
    comment:
      "Corniche & Co. handled our West Bay Lagoon villa search with extreme diligence. Omar understands construction grades, beach setbacks, and municipal title verification down to the finest detail.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a2",
    agentName: "Omar Haddad",
    interactionType: "rental",
  },
  {
    id: "rev-cc-2",
    agencyId: "ag2",
    reviewerName: "Elena Rostova",
    reviewerIdentifier: "e***@investment.ch",
    verified: true,
    date: "2026-08-04",
    rating: 5,
    headline: "Outstanding expat relocation assistance",
    comment:
      "Priya Raghavan curated five exceptional apartments in Viva Bahriya and Porto Arabia. She negotiated flexible payment terms and even coordinated utility handovers seamlessly.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a3",
    agentName: "Priya Raghavan",
    interactionType: "rental",
  },
  {
    id: "rev-cc-3",
    agencyId: "ag2",
    reviewerName: "Fahad Al-Misnad",
    reviewerIdentifier: "+974 33***890",
    verified: true,
    date: "2026-07-15",
    rating: 4,
    headline: "High caliber listings and prompt communication",
    comment:
      "Very honest feedback regarding building service charges and traffic access during peak hours. You can tell Corniche & Co. cares about client relationships rather than quick turnover.",
    categories: {
      communication: 5,
      professionalism: 4,
      propertyKnowledge: 5,
      responseTime: 4,
    },
    agentId: "a2",
    agentName: "Omar Haddad",
    interactionType: "viewing",
  },
  {
    id: "rev-cc-4",
    agencyId: "ag2",
    reviewerName: "Kareem & Sarah Mitchell",
    reviewerIdentifier: "k***@gmail.com",
    verified: true,
    date: "2026-06-29",
    rating: 5,
    headline: "Transparent contract negotiations",
    comment:
      "The team provided a full breakdown of deposit rules and inventory check procedures before we transferred any commitment fees. Exceptional service.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 4,
      responseTime: 5,
    },
    agentId: "a3",
    agentName: "Priya Raghavan",
    interactionType: "rental",
  },
  {
    id: "rev-cc-5",
    agencyId: "ag2",
    reviewerName: "Ghanim Al-Sulaiti",
    reviewerIdentifier: "+974 50***312",
    verified: true,
    date: "2026-05-02",
    rating: 5,
    headline: "Discreet off-market access in Onaiza",
    comment:
      "Showed us two unlisted compound villas that met our exact family specifications. Highly recommended.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a2",
    agentName: "Omar Haddad",
    interactionType: "viewing",
  },

  // ── ag3: Al Dafna Property Partners ──────────────────────────────
  {
    id: "rev-ad-1",
    agencyId: "ag3",
    reviewerName: "Marcus Vance",
    reviewerIdentifier: "m***@vance-corp.qa",
    verified: true,
    date: "2026-08-10",
    rating: 5,
    headline: "Commercial and executive residential expertise",
    comment:
      "Khalid Al-Rashid assisted our corporate team in leasing executive residences in Msheireb Downtown. Everything was aligned with corporate compliance standards.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a5",
    agentName: "Khalid Al-Rashid",
    interactionType: "rental",
  },
  {
    id: "rev-ad-2",
    agencyId: "ag3",
    reviewerName: "Reem Al-Marri",
    reviewerIdentifier: "+974 55***980",
    verified: true,
    date: "2026-07-02",
    rating: 4,
    headline: "Professional consultation for downtown living",
    comment:
      "Good communication and very honest about parking facilities and metro proximity. Helpful inspection notes.",
    categories: {
      communication: 4,
      professionalism: 5,
      propertyKnowledge: 4,
      responseTime: 4,
    },
    agentId: "a5",
    agentName: "Khalid Al-Rashid",
    interactionType: "viewing",
  },
  {
    id: "rev-ad-3",
    agencyId: "ag3",
    reviewerName: "Tariq Boutros",
    reviewerIdentifier: "t***@boutros.com",
    verified: true,
    date: "2026-06-18",
    rating: 5,
    headline: "Fast turnaround on lease paperwork",
    comment:
      "Leased an office and residential duplex through Al Dafna. Their contract team answered every legal query within hours.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a5",
    agentName: "Khalid Al-Rashid",
    interactionType: "rental",
  },

  // ── ag4: Salt & Stone Realty ─────────────────────────────────────
  {
    id: "rev-ss-1",
    agencyId: "ag4",
    reviewerName: "Claire Dupont",
    reviewerIdentifier: "c***@totalenergies.com",
    verified: true,
    date: "2026-08-19",
    rating: 5,
    headline: "The Pearl's finest beachfront specialist",
    comment:
      "Ananya Mehta showed us multiple waterfront villas in Viva Bahriya with private beach access. She is patient, knowledgeable, and honest about marina maintenance schedules.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a6",
    agentName: "Ananya Mehta",
    interactionType: "rental",
  },
  {
    id: "rev-ss-2",
    agencyId: "ag4",
    reviewerName: "Sultan Al-Kuwari",
    reviewerIdentifier: "+974 77***443",
    verified: true,
    date: "2026-07-22",
    rating: 4,
    headline: "Accurate descriptions and punctual viewings",
    comment:
      "What you see in the photos is what you see in person. Salt & Stone does not list stale or unavailable inventory.",
    categories: {
      communication: 4,
      professionalism: 4,
      propertyKnowledge: 5,
      responseTime: 4,
    },
    agentId: "a6",
    agentName: "Ananya Mehta",
    interactionType: "viewing",
  },
  {
    id: "rev-ss-3",
    agencyId: "ag4",
    reviewerName: "Jameson Clarke",
    reviewerIdentifier: "j***@clarke.co.uk",
    verified: true,
    date: "2026-06-05",
    rating: 5,
    headline: "Great assistance with expat tenancy contracts",
    comment:
      "Handled the landlord negotiations and security deposit clauses impeccably. Very trustworthy firm.",
    categories: {
      communication: 5,
      professionalism: 5,
      propertyKnowledge: 5,
      responseTime: 5,
    },
    agentId: "a6",
    agentName: "Ananya Mehta",
    interactionType: "rental",
  },
];

/**
 * Single source of truth calculation:
 * Computes averageRating, totalReviews, star breakdown distribution, and category averages.
 */
export function computeAgencyRatingSummary(
  agencyId: string,
  reviews: AgencyReview[]
): AgencyRatingSummary {
  const agencyReviews = reviews.filter((r) => r.agencyId === agencyId);
  const total = agencyReviews.length;

  if (total === 0) {
    return {
      agencyId,
      averageRating: 5.0,
      totalReviews: 0,
      distribution: {
        fiveStar: { count: 0, percentage: 0 },
        fourStar: { count: 0, percentage: 0 },
        threeStar: { count: 0, percentage: 0 },
        twoStar: { count: 0, percentage: 0 },
        oneStar: { count: 0, percentage: 0 },
      },
      categoryAverages: {
        communication: 5.0,
        professionalism: 5.0,
        propertyKnowledge: 5.0,
        responseTime: 5.0,
      },
    };
  }

  const sumRating = agencyReviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = Number((sumRating / total).toFixed(1));

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let catComm = 0;
  let catProf = 0;
  let catKnow = 0;
  let catResp = 0;

  for (const r of agencyReviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[star] = (counts[star] || 0) + 1;

    catComm += r.categories?.communication || r.rating;
    catProf += r.categories?.professionalism || r.rating;
    catKnow += r.categories?.propertyKnowledge || r.rating;
    catResp += r.categories?.responseTime || r.rating;
  }

  return {
    agencyId,
    averageRating,
    totalReviews: total,
    distribution: {
      fiveStar: { count: counts[5], percentage: Math.round((counts[5] / total) * 100) },
      fourStar: { count: counts[4], percentage: Math.round((counts[4] / total) * 100) },
      threeStar: { count: counts[3], percentage: Math.round((counts[3] / total) * 100) },
      twoStar: { count: counts[2], percentage: Math.round((counts[2] / total) * 100) },
      oneStar: { count: counts[1], percentage: Math.round((counts[1] / total) * 100) },
    },
    categoryAverages: {
      communication: Number((catComm / total).toFixed(1)),
      professionalism: Number((catProf / total).toFixed(1)),
      propertyKnowledge: Number((catKnow / total).toFixed(1)),
      responseTime: Number((catResp / total).toFixed(1)),
    },
  };
}
