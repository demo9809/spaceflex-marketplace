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
    city: "Dubai",
    since: 2012,
    licenseNo: "AE-RERA-2298",
    activeListings: 124,
    verified: true,
    tagline: "Private-client advisory across the UAE",
  },
  {
    id: "ag3",
    slug: "najd-property-partners",
    name: "Najd Property Partners",
    logoInitials: "NP",
    city: "Riyadh",
    since: 2016,
    licenseNo: "SA-REGA-8810",
    activeListings: 41,
    verified: true,
    tagline: "Kingdom advisory, Vision 2030 corridors",
  },
  {
    id: "ag4",
    slug: "salt-and-stone-realty",
    name: "Salt & Stone Realty",
    logoInitials: "S&",
    city: "Mumbai",
    since: 2014,
    licenseNo: "IN-MahaRERA-A5231",
    activeListings: 52,
    verified: true,
    tagline: "India prime, built for NRI investors",
  },
];

/* Map the agent's free-text agency name to an agency record. */
const byName: Record<string, string> = {
  "Meridian Estates": "ag1",
  "Corniche & Co.": "ag2",
  "Najd Property Partners": "ag3",
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
