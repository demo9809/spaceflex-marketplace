import type { Agency } from "../types";
import { properties } from "./properties";
import { agents } from "./agents";

export const agencies: Agency[] = [
  {
    id: "ag1",
    slug: "meridian-estates",
    name: "Meridian Estates",
    logoInitials: "ME",
    city: "Doha",
    since: 2009,
    licenseNo: "QA-ULC-4471",
    activeListings: 68,
    verified: true,
    tagline: "Qatar's prime residential brokerage",
  },
  {
    id: "ag2",
    slug: "corniche-and-co",
    name: "Corniche & Co.",
    logoInitials: "C&",
    city: "Doha",
    since: 2012,
    licenseNo: "QA-ULC-2298",
    activeListings: 124,
    verified: true,
    tagline: "Private-client advisory across Qatar",
  },
  {
    id: "ag3",
    slug: "al-dafna-property-partners",
    name: "Al Dafna Property Partners",
    logoInitials: "AD",
    city: "Doha",
    since: 2016,
    licenseNo: "QA-ULC-8810",
    activeListings: 41,
    verified: true,
    tagline: "Commercial and investment advisory, Qatar",
  },
  {
    id: "ag4",
    slug: "salt-and-stone-realty",
    name: "Salt & Stone Realty",
    logoInitials: "S&",
    city: "Doha",
    since: 2014,
    licenseNo: "QA-ULC-5231",
    activeListings: 52,
    verified: true,
    tagline: "Island residences, built for expat investors",
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
