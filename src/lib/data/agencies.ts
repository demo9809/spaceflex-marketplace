import type { Agency } from "../types";
import { properties } from "./properties";
import { agents } from "./agents";

export const agencies: Agency[] = [
  {
    id: "ag1",
    slug: "meridian-estates",
    name: "Meridian Estates",
    logo: "/agencies/meridian-estates.svg",
    logoInitials: "ME",
    city: "Doha",
    since: 2009,
    licenseNo: "QA-ULC-4471",
    activeListings: 68,
    verified: true,
    tagline: "Qatar's prime residential brokerage",
    description:
      "Founded in 2009, Meridian Estates is Qatar's premier residential real estate brokerage. Specializing in prime waterfront villas, branded towers, and diplomatic residences across Doha, our senior advisory team provides discreet private-client advisory, comprehensive tenancy management, and an unmatched portfolio of luxury homes.",
    specialization: [
      "Prime Residential",
      "Luxury Waterfront",
      "Diplomatic Leases",
      "Penthouses",
    ],
    areasServed: [
      "West Bay",
      "The Pearl Island",
      "West Bay Lagoon",
      "Lusail Marina",
    ],
    officeAddress: "Level 32, Tornado Tower, West Bay, Doha, Qatar",
    phone: "+974 4499 8000",
    email: "enquiries@meridianestates.qa",
    responseTime: "under 15 minutes",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "ag2",
    slug: "corniche-and-co",
    name: "Corniche & Co.",
    logo: "/agencies/corniche-and-co.svg",
    logoInitials: "C&",
    city: "Doha",
    since: 2012,
    licenseNo: "QA-ULC-2298",
    activeListings: 124,
    verified: true,
    tagline: "Private-client advisory across Qatar",
    description:
      "Corniche & Co. provides bespoke real estate advisory and curated leasing across Doha. Specializing in high-profile residential transactions, executive expat placements, and luxury residences, our multi-lingual team offers discreet, end-to-end guidance from initial viewings to contract registration.",
    specialization: [
      "Private-Client Advisory",
      "High-Net-Worth Estates",
      "Island Residences",
      "Expat Relocation",
    ],
    areasServed: [
      "The Pearl Island",
      "Lusail City",
      "West Bay",
      "Msheireb Downtown",
    ],
    officeAddress: "Porto Arabia Tower 14, The Pearl, Doha, Qatar",
    phone: "+974 4488 2200",
    email: "concierge@corniche.qa",
    responseTime: "under 20 minutes",
  },
  {
    id: "ag3",
    slug: "al-dafna-property-partners",
    name: "Al Dafna Property Partners",
    logo: "/agencies/al-dafna-property-partners.svg",
    logoInitials: "AD",
    city: "Doha",
    since: 2016,
    licenseNo: "QA-ULC-8810",
    activeListings: 41,
    verified: true,
    tagline: "Commercial and investment advisory, Qatar",
    description:
      "Al Dafna Property Partners is Qatar's trusted advisor for institutional leasing, corporate headquarters, and commercial investments. Established in 2016, we guide multinational corporations, financial institutions, and family offices through commercial lease acquisitions with complete regulatory compliance.",
    specialization: [
      "Commercial Real Estate",
      "Investment Advisory",
      "Corporate Headquarters",
      "Mixed-Use Portfolios",
    ],
    areasServed: ["Al Dafna", "West Bay", "Lusail Marina", "Al Sadd"],
    officeAddress: "Burj Al Dafna, Floor 18, Diplomatic District, Doha, Qatar",
    phone: "+974 4455 1100",
    email: "leasing@aldafna.qa",
    responseTime: "under 30 minutes",
  },
  {
    id: "ag4",
    slug: "salt-and-stone-realty",
    name: "Salt & Stone Realty",
    logo: "/agencies/salt-and-stone-realty.svg",
    logoInitials: "S&",
    city: "Doha",
    since: 2014,
    licenseNo: "QA-ULC-5231",
    activeListings: 52,
    verified: true,
    tagline: "Island residences, built for expat investors",
    description:
      "Salt & Stone Realty curates island residences and coastal homes designed for expatriate professionals and international investors. We provide transparent rental solutions, furnished long-term tenancies, and dedicated asset care backed by Qatar's highest regulatory standards.",
    specialization: [
      "Island Living",
      "Expat Investment",
      "Beachfront Villas",
      "Townhouses",
    ],
    areasServed: [
      "Qetaifan Islands",
      "The Pearl Island",
      "Lusail Waterfront",
      "Fox Hills",
    ],
    officeAddress: "Qetaifan Island South, Coastal Pavilion Suite 4, Lusail, Qatar",
    phone: "+974 4433 9900",
    email: "hello@saltstone.qa",
    responseTime: "under 25 minutes",
  },
];

/* Map the agent's free-text agency name to an agency record. */
const byName: Record<string, string> = {
  "Meridian Estates": "ag1",
  "Corniche & Co.": "ag2",
  "Al Dafna Property Partners": "ag3",
  "Salt & Stone Realty": "ag4",
};

export function getAgency(idOrSlug: string) {
  return agencies.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
}

export function agencyForAgent(agentId: string) {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return undefined;
  const id = agent.agencyId ?? byName[agent.agency];
  return id ? getAgency(id) : undefined;
}

export function agencyAgents(agencyId: string) {
  return agents.filter((a) => (a.agencyId ?? byName[a.agency]) === agencyId);
}

export function agencyListings(agencyId: string) {
  const memberIds = agencyAgents(agencyId).map((a) => a.id);
  return properties.filter(
    (p) => memberIds.includes(p.agentId) && p.listingKind !== "owner"
  );
}
