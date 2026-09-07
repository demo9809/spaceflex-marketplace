import type { PropertyReview, PropertyRatingSummary } from "../types/leads-and-reviews";

export const initialPropertyReviews: PropertyReview[] = [
  // ── Property p1: The Terraces Penthouse, West Bay ──
  {
    id: "prev-101",
    propertyId: "p1",
    reviewerName: "Tariq Al-Mansoor",
    reviewerIdentifier: "tariq.m***@gmail.com",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-07-28",
    rating: 5,
    headline: "Unmatched skyline terrace and exceptional concierge services",
    comment:
      "Living in The Terraces for over a year has been extraordinary. The double-height glazing offers panoramic views of the West Bay skyline and the Arabian Gulf. Acoustics are soundproofed to perfection, and maintenance requests are handled within two hours. Private elevator access directly into the foyer makes entertaining effortless.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 5,
      valueForMoney: 4,
      management: 5,
    },
    pros: ["Private sky terrace", "24/7 dedicated valet", "High-speed private lift"],
    cons: ["Premium service fees"],
  },
  {
    id: "prev-102",
    propertyId: "p1",
    reviewerName: "Elena Rostova",
    reviewerIdentifier: "+974 55***921",
    verified: true,
    residentStatus: "Former Resident",
    date: "2026-05-14",
    rating: 5,
    headline: "Impeccable marble finishes and private swimming pool",
    comment:
      "One of the premier penthouse offerings in Doha. The Italian marble kitchen island, Sub-Zero appliances, and the wrap-around outdoor entertaining terrace with plunge pool are remarkable. Security and privacy standards are first class.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 5,
      valueForMoney: 4,
      management: 5,
    },
    pros: ["Sub-Zero kitchen", "Unobstructed gulf views", "Pristine gym"],
    cons: ["Tower parking ramp can be tight for large SUVs"],
  },
  {
    id: "prev-103",
    propertyId: "p1",
    reviewerName: "David Sterling",
    reviewerIdentifier: "d.sterling***@qatar.net",
    verified: true,
    residentStatus: "Verified Client",
    date: "2026-03-22",
    rating: 4,
    headline: "True architectural statement in West Bay",
    comment:
      "Spectacular natural daylight throughout all four bedroom suites. The master retreat is spacious with a spa-grade bathroom and oversized walk-in dressing room. The central location means 5 minutes to City Center and the Corniche.",
    categories: {
      location: 5,
      buildQuality: 4,
      amenities: 5,
      valueForMoney: 4,
      management: 4,
    },
    pros: ["Master suite dressing room", "Prime diplomatic district location"],
    cons: ["West Bay morning traffic on adjacent boulevard"],
  },

  // ── Property p2: Signature Garden Villa, West Bay Lagoon ──
  {
    id: "prev-201",
    propertyId: "p2",
    reviewerName: "Fatima Al-Sulaiti",
    reviewerIdentifier: "fatima.s***@investments.qa",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-08-04",
    rating: 5,
    headline: "Quiet waterfront sanctuary with direct lagoon access",
    comment:
      "West Bay Lagoon offers unmatched tranquility in Doha. Having direct private beach access with a boat mooring right from our garden is a dream for weekend water sports. The mature landscaping provides complete privacy from neighboring compounds.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 5,
      valueForMoney: 5,
      management: 5,
    },
    pros: ["Direct water access", "Private mature gardens", "Gated 24/7 community"],
    cons: ["Garden landscaping maintenance requires dedicated attention"],
  },
  {
    id: "prev-202",
    propertyId: "p2",
    reviewerName: "Marcus Vance",
    reviewerIdentifier: "+974 66***410",
    verified: true,
    residentStatus: "Verified Client",
    date: "2026-06-19",
    rating: 5,
    headline: "Spacious layout, expansive pool, and high ceilings",
    comment:
      "We relocated our family here last winter. The floor plan separates family living areas from formal entertaining salons nicely. The temperature-controlled infinity pool and outdoor pergola are fantastic during spring and autumn evenings.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 4,
      valueForMoney: 5,
      management: 5,
    },
    pros: ["Heated/cooled infinity pool", "Separate maid & driver quarters"],
    cons: ["A 10-minute drive to main international schools"],
  },

  // ── Property p3: Marina View Residence, The Pearl Island ──
  {
    id: "prev-301",
    propertyId: "p3",
    reviewerName: "Nasser Al-Kuwari",
    reviewerIdentifier: "+974 33***889",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-07-11",
    rating: 5,
    headline: "Vibrant Porto Arabia marina boardwalk lifestyle",
    comment:
      "Step right out of the lobby directly onto the marina promenade with restaurants, cafés, and yachts. The balcony view in the evening is unmatched. Tower management keeps the common pool deck, gym, and lobby in pristine condition.",
    categories: {
      location: 5,
      buildQuality: 4,
      amenities: 5,
      valueForMoney: 4,
      management: 5,
    },
    pros: ["Walking distance to restaurants", "Stunning marina sunset views"],
    cons: ["Weekend boardwalk visitors can be lively"],
  },
  {
    id: "prev-302",
    propertyId: "p3",
    reviewerName: "Sophie Laurent",
    reviewerIdentifier: "sophie.l***@orange.fr",
    verified: true,
    residentStatus: "Former Resident",
    date: "2026-04-02",
    rating: 4,
    headline: "Well-appointed kitchen and dedicated concierge",
    comment:
      "Enjoyed my two-year lease here immensely. Tower staff are polite and parcel delivery handling is seamless. The gym is well equipped with Technogym machines. Highly recommended for professionals working in West Bay or Lusail.",
    categories: {
      location: 5,
      buildQuality: 4,
      amenities: 4,
      valueForMoney: 4,
      management: 4,
    },
    pros: ["Technogym health club", "Concierge parcel locker"],
    cons: ["Visitor parking requires advance gate registration"],
  },

  // ── Property p4: Msheireb Downtown Townhouse ──
  {
    id: "prev-401",
    propertyId: "p4",
    reviewerName: "Dr. Khaled Ibrahim",
    reviewerIdentifier: "+974 50***772",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-08-15",
    rating: 5,
    headline: "World-class sustainable architecture and tram connectivity",
    comment:
      "Msheireb Downtown is the most thoughtfully planned urban neighborhood in the Middle East. The townhouse stays cool even in high summer thanks to traditional architectural shading and LEED Platinum insulation. The complimentary Msheireb tram stops right around the corner.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 5,
      valueForMoney: 5,
      management: 5,
    },
    pros: ["LEED Platinum eco efficiency", "Internal courtyard garden", "Metro interchange link"],
    cons: ["Strict architectural heritage modification guidelines"],
  },

  // ── Property p5: Fox Hills Loft, Lusail ──
  {
    id: "prev-501",
    propertyId: "p5",
    reviewerName: "Ziad Haddad",
    reviewerIdentifier: "ziad.h***@tech.qa",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-07-02",
    rating: 4,
    headline: "Modern industrial aesthetics with incredible natural light",
    comment:
      "The exposed concrete and matte black steel accents give this apartment a genuine European loft feel that is rare in Doha. Walking proximity to Crescent Park and the Lusail Tram makes commuting to Lusail Marina quick and painless.",
    categories: {
      location: 4,
      buildQuality: 5,
      amenities: 4,
      valueForMoney: 5,
      management: 4,
    },
    pros: ["High industrial ceilings", "Next to Crescent Park", "Underground EV charging"],
    cons: ["Commercial grocery store is a 5-minute drive"],
  },

  // ── Property p7: Viva Bahriya Beachfront, The Pearl ──
  {
    id: "prev-701",
    propertyId: "p7",
    reviewerName: "Amira Al-Thani",
    reviewerIdentifier: "+974 55***330",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-06-28",
    rating: 5,
    headline: "Private beach resort living 365 days a year",
    comment:
      "Viva Bahriya is much calmer and quieter than Porto Arabia. Direct access to the soft sandy beach, private cabanas, and a dedicated children's play area made this the perfect rental choice for our family.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 5,
      valueForMoney: 4,
      management: 5,
    },
    pros: ["Private residential beach", "Quiet serene ambiance", "Modern gym & steam room"],
    cons: ["Fewer retail shops inside Viva Bahriya compared to Porto Arabia"],
  },

  // ── Property p8: Al Waab Family Villa ──
  {
    id: "prev-801",
    propertyId: "p8",
    reviewerName: "Robert Jenkins",
    reviewerIdentifier: "r.jenkins***@aspire.qa",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-05-20",
    rating: 5,
    headline: "Minutes from Aspire Zone, international schools, and Villaggio",
    comment:
      "Ideal family home in a prestigious compound. The clubhouse has two tennis courts, an Olympic-length pool, and 24-hour on-call maintenance. Being 5 minutes from Aspire Park gives the kids plenty of open outdoor space.",
    categories: {
      location: 5,
      buildQuality: 4,
      amenities: 5,
      valueForMoney: 5,
      management: 5,
    },
    pros: ["Clubhouse sports facilities", "Immediate proximity to Aspire Zone"],
    cons: ["Traffic near Al Waab street during school pickup hours"],
  },

  // ── Property p10: Al Dafna Executive Duplex ──
  {
    id: "prev-1001",
    propertyId: "p10",
    reviewerName: "Hamad Al-Attiyah",
    reviewerIdentifier: "+974 66***119",
    verified: true,
    residentStatus: "Verified Client",
    date: "2026-04-18",
    rating: 5,
    headline: "Executive finishings and quiet residential neighborhood",
    comment:
      "Exceptional double-story duplex. High-spec German sanitary fittings, generous storage rooms, and covered parking bays for three vehicles. Close to embassies and premier business centers.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 4,
      valueForMoney: 5,
      management: 5,
    },
    pros: ["3 covered parking bays", "Double-height salon ceiling"],
    cons: ["No common compound pool"],
  },

  // ── Property p11: Lusail Marina Office Tower ──
  {
    id: "prev-1101",
    propertyId: "p11",
    reviewerName: "Karim Benali",
    reviewerIdentifier: "k.benali***@holding.qa",
    verified: true,
    residentStatus: "Current Tenant",
    date: "2026-08-10",
    rating: 5,
    headline: "Premier grade-A corporate headquarters with Lusail Marina outlook",
    comment:
      "Our firm leased an entire floor here. Fiber optic redundancy, LEED gold building standards, and 8 high-speed destination-dispatch elevators ensure zero wait times for our international clients and staff.",
    categories: {
      location: 5,
      buildQuality: 5,
      amenities: 5,
      valueForMoney: 4,
      management: 5,
    },
    pros: ["LEED Gold efficiency", "Smart elevator management", "Visitor parking allocation"],
    cons: ["Food & beverage options within the tower are still expanding"],
  },
];

export function computePropertyRatingSummary(
  propertyId: string,
  reviews: PropertyReview[]
): PropertyRatingSummary {
  const propReviews = reviews.filter((r) => r.propertyId === propertyId);
  const total = propReviews.length;

  if (total === 0) {
    return {
      propertyId,
      averageRating: 0,
      totalReviews: 0,
      verifiedReviewsCount: 0,
      distribution: {
        fiveStar: { count: 0, percentage: 0 },
        fourStar: { count: 0, percentage: 0 },
        threeStar: { count: 0, percentage: 0 },
        twoStar: { count: 0, percentage: 0 },
        oneStar: { count: 0, percentage: 0 },
      },
      categoryAverages: {
        location: 0,
        buildQuality: 0,
        amenities: 0,
        valueForMoney: 0,
        management: 0,
      },
    };
  }

  const verifiedReviewsCount = propReviews.filter((r) => r.verified).length;
  const sum = propReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / total) * 10) / 10;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of propReviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[star]++;
  }

  const categorySums = propReviews.reduce(
    (acc, r) => {
      acc.location += r.categories?.location || r.rating;
      acc.buildQuality += r.categories?.buildQuality || r.rating;
      acc.amenities += r.categories?.amenities || r.rating;
      acc.valueForMoney += r.categories?.valueForMoney || r.rating;
      acc.management += r.categories?.management || r.rating;
      return acc;
    },
    { location: 0, buildQuality: 0, amenities: 0, valueForMoney: 0, management: 0 }
  );

  return {
    propertyId,
    averageRating: avg,
    totalReviews: total,
    verifiedReviewsCount,
    distribution: {
      fiveStar: {
        count: counts[5],
        percentage: Math.round((counts[5] / total) * 100),
      },
      fourStar: {
        count: counts[4],
        percentage: Math.round((counts[4] / total) * 100),
      },
      threeStar: {
        count: counts[3],
        percentage: Math.round((counts[3] / total) * 100),
      },
      twoStar: {
        count: counts[2],
        percentage: Math.round((counts[2] / total) * 100),
      },
      oneStar: {
        count: counts[1],
        percentage: Math.round((counts[1] / total) * 100),
      },
    },
    categoryAverages: {
      location: Math.round((categorySums.location / total) * 10) / 10,
      buildQuality: Math.round((categorySums.buildQuality / total) * 10) / 10,
      amenities: Math.round((categorySums.amenities / total) * 10) / 10,
      valueForMoney: Math.round((categorySums.valueForMoney / total) * 10) / 10,
      management: Math.round((categorySums.management / total) * 10) / 10,
    },
  };
}
