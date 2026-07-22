import type { Landmark } from "../types";

/* Qatar's real hubs — business districts, schools, malls, transport,
   healthcare and leisure. Coordinates are approximate centroids: good
   enough for proximity filtering, and the same shape a Places API
   response would take. */
export const landmarks: Landmark[] = [
  // ── Work ──
  { id: "l1", name: "West Bay Business District", short: "West Bay", category: "Work", city: "Doha", lat: 25.32, lng: 51.531 },
  { id: "l2", name: "Msheireb Downtown", short: "Msheireb", category: "Work", city: "Doha", lat: 25.2854, lng: 51.5264 },
  { id: "l3", name: "Lusail Marina District", short: "Lusail Marina", category: "Work", city: "Doha", lat: 25.3785, lng: 51.5264 },
  { id: "l4", name: "Qatar Financial Centre", short: "QFC", category: "Work", city: "Doha", lat: 25.3184, lng: 51.5271 },
  { id: "l5", name: "Energy City, Lusail", short: "Energy City", category: "Work", city: "Doha", lat: 25.3899, lng: 51.5131 },
  { id: "l6", name: "Qatar Science & Technology Park", short: "QSTP", category: "Work", city: "Doha", lat: 25.3197, lng: 51.4384 },

  // ── Education ──
  { id: "l7", name: "Education City (Qatar Foundation)", short: "Education City", category: "Education", city: "Doha", lat: 25.315, lng: 51.44 },
  { id: "l8", name: "Doha International Schools Cluster", short: "Intl. Schools", category: "Education", city: "Doha", lat: 25.2569, lng: 51.4522 },
  { id: "l9", name: "American School of Doha", short: "ASD", category: "Education", city: "Doha", lat: 25.2612, lng: 51.4404 },
  { id: "l10", name: "Qatar University", short: "Qatar Univ.", category: "Education", city: "Doha", lat: 25.3773, lng: 51.4903 },

  // ── Retail ──
  { id: "l11", name: "Villaggio Mall", short: "Villaggio", category: "Retail", city: "Doha", lat: 25.2586, lng: 51.4436 },
  { id: "l12", name: "Doha Festival City", short: "Festival City", category: "Retail", city: "Doha", lat: 25.38, lng: 51.46 },
  { id: "l13", name: "Place Vendôme, Lusail", short: "Place Vendôme", category: "Retail", city: "Doha", lat: 25.3906, lng: 51.4967 },
  { id: "l14", name: "Mall of Qatar", short: "Mall of Qatar", category: "Retail", city: "Doha", lat: 25.3238, lng: 51.3872 },
  { id: "l15", name: "Souq Waqif", short: "Souq Waqif", category: "Retail", city: "Doha", lat: 25.2874, lng: 51.5333 },
  { id: "l16", name: "Lagoona Mall", short: "Lagoona", category: "Retail", city: "Doha", lat: 25.3609, lng: 51.5225 },

  // ── Transport ──
  { id: "l17", name: "Hamad International Airport", short: "DOH Airport", category: "Transport", city: "Doha", lat: 25.2731, lng: 51.608 },
  { id: "l18", name: "Msheireb Metro Interchange", short: "Msheireb Metro", category: "Transport", city: "Doha", lat: 25.2867, lng: 51.5289 },
  { id: "l19", name: "Lusail Tram Terminus", short: "Lusail Tram", category: "Transport", city: "Doha", lat: 25.4016, lng: 51.4894 },
  { id: "l20", name: "Hamad Port", short: "Hamad Port", category: "Transport", city: "Doha", lat: 25.0072, lng: 51.6083 },

  // ── Health ──
  { id: "l21", name: "Sidra Medicine", short: "Sidra", category: "Health", city: "Doha", lat: 25.32, lng: 51.44 },
  { id: "l22", name: "Hamad Medical City", short: "Hamad Medical", category: "Health", city: "Doha", lat: 25.2861, lng: 51.5054 },
  { id: "l23", name: "Aspetar Sports Hospital", short: "Aspetar", category: "Health", city: "Doha", lat: 25.2637, lng: 51.4437 },

  // ── Leisure ──
  { id: "l24", name: "Katara Cultural Village", short: "Katara", category: "Leisure", city: "Doha", lat: 25.359, lng: 51.525 },
  { id: "l25", name: "Doha Corniche", short: "Corniche", category: "Leisure", city: "Doha", lat: 25.3016, lng: 51.5307 },
  { id: "l26", name: "Aspire Park & Zone", short: "Aspire Park", category: "Leisure", city: "Doha", lat: 25.2612, lng: 51.4436 },
  { id: "l27", name: "Lusail Boulevard", short: "Lusail Blvd", category: "Leisure", city: "Doha", lat: 25.4, lng: 51.49 },
  { id: "l28", name: "The Pearl Marina Promenade", short: "Pearl Marina", category: "Leisure", city: "Doha", lat: 25.3697, lng: 51.5511 },
  { id: "l29", name: "National Museum of Qatar", short: "National Museum", category: "Leisure", city: "Doha", lat: 25.2867, lng: 51.5453 },
  { id: "l30", name: "Al Bidda Park", short: "Al Bidda Park", category: "Leisure", city: "Doha", lat: 25.2969, lng: 51.5261 },
];

export const landmarkCategories = [
  "Work",
  "Education",
  "Retail",
  "Transport",
  "Health",
  "Leisure",
] as const;

export function getLandmark(id: string) {
  return landmarks.find((l) => l.id === id);
}

export function landmarksByCity(city?: string) {
  if (!city || city === "all") return landmarks;
  return landmarks.filter((l) => l.city === city);
}
