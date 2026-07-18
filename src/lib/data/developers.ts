import type { Developer, Project } from "../types";
import { IMG } from "./properties";

export const developers: Developer[] = [
  {
    id: "d1",
    slug: "qetaifan-collective",
    name: "Qetaifan Collective",
    city: "Doha",
    founded: 2010,
    projects: 12,
    unitsDelivered: "4,800+",
    rating: 4.7,
    logoInitials: "QC",
    cover: IMG.towers,
    about:
      "Qetaifan Collective is Qatar's design-led waterfront developer, responsible for some of Lusail's most recognisable residential districts. The group builds long-hold assets it continues to manage after handover.",
  },
  {
    id: "d2",
    slug: "meraas-line-developments",
    name: "Shoreline Developments",
    city: "Dubai",
    founded: 2004,
    projects: 28,
    unitsDelivered: "16,000+",
    rating: 4.8,
    logoInitials: "SD",
    cover: IMG.marina,
    about:
      "Shoreline is one of the UAE's most awarded private developers, known for low-density coastal masterplans and hospitality-grade residential management across Dubai and Abu Dhabi.",
  },
  {
    id: "d3",
    slug: "najd-urban",
    name: "Najd Urban",
    city: "Riyadh",
    founded: 2015,
    projects: 9,
    unitsDelivered: "3,200+",
    rating: 4.6,
    logoInitials: "NU",
    cover: IMG.desertVilla,
    about:
      "Najd Urban builds contemporary Saudi neighbourhoods aligned with Vision 2030 — walkable districts in Riyadh and Jeddah with regional architecture and modern infrastructure.",
  },
];

export const projects: Project[] = [
  {
    id: "pr1",
    slug: "solara-lusail-waterfront",
    name: "Solara Waterfront Residences",
    developerId: "d1",
    city: "Lusail",
    country: "Qatar",
    status: "Under construction",
    priceFrom: 2900000,
    currency: "QAR",
    types: ["1–4 BR apartments", "Sky villas"],
    handover: "Q4 2027",
    images: [IMG.skyline, IMG.cityApt, IMG.poolDeck, IMG.kitchenStone],
    amenities: ["Private marina berths", "Residents' beach club", "25m lap pool", "Padel courts", "Co-working lounge", "Concierge"],
    paymentPlan: "20% on booking · 40% during construction · 40% on handover",
    about:
      "Solara is Qetaifan Collective's flagship on Lusail's final waterfront parcel — three sculpted towers over a landscaped beach club, with interiors by a Copenhagen studio and full smart-district integration. Early phases released to SpaceFlex members before public launch.",
  },
  {
    id: "pr2",
    slug: "cove-saadiyat-collection",
    name: "The Cove, Saadiyat Collection",
    developerId: "d2",
    city: "Abu Dhabi",
    country: "UAE",
    status: "Pre-launch",
    priceFrom: 4600000,
    currency: "AED",
    types: ["3–5 BR beach villas", "Garden townhouses"],
    handover: "Q2 2028",
    images: [IMG.whiteVilla, IMG.villaPool, IMG.bedHotel, IMG.bathSpa],
    amenities: ["Private beach", "Wellness house", "Kids' academy", "Organic market", "Guardhouse", "EV charging"],
    paymentPlan: "10% on booking · 50% during construction · 40% on handover",
    about:
      "Ninety-two villas on a protected stretch of Saadiyat's coastline, minutes from the museum district. Architecture references dune topography; every home holds a sea axis. Register interest for the pre-launch allocation.",
  },
  {
    id: "pr3",
    slug: "wadi-north-riyadh",
    name: "Wadi North District",
    developerId: "d3",
    city: "Riyadh",
    country: "Saudi Arabia",
    status: "Handover 2027",
    priceFrom: 1850000,
    currency: "SAR",
    types: ["Townhouses", "Courtyard villas"],
    handover: "Q3 2027",
    images: [IMG.houseCourt, IMG.frontLawn, IMG.interiorBright],
    amenities: ["Central wadi park", "Cycling loop", "Mosque & school", "Retail spine", "Smart infrastructure"],
    paymentPlan: "15% on booking · balance on Saudi mortgage programs",
    about:
      "A 240-hectare northern Riyadh district arranged around a restored wadi, blending Najdi courtyard typologies with modern construction. Strong early uptake from Saudi professionals returning under Vision 2030 programs.",
  },
];

export function getDeveloper(slug: string) {
  return developers.find((d) => d.slug === slug || d.id === slug);
}
export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
export function developerProjects(devId: string) {
  return projects.filter((p) => p.developerId === devId);
}
