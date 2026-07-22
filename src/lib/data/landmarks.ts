import type { Landmark } from "../types";

/* Real hubs across the markets we cover. Coordinates are approximate
   centroids — good enough for proximity filtering, and the same shape
   a Places API response would take. */
export const landmarks: Landmark[] = [
  // ── Doha ──
  { id: "l1", name: "West Bay Business District", short: "West Bay", category: "Work", city: "Doha", lat: 25.32, lng: 51.531 },
  { id: "l2", name: "Msheireb Downtown", short: "Msheireb", category: "Work", city: "Doha", lat: 25.2854, lng: 51.5264 },
  { id: "l3", name: "Education City", short: "Education City", category: "Education", city: "Doha", lat: 25.315, lng: 51.44 },
  { id: "l4", name: "Doha International Schools Cluster", short: "Intl. Schools", category: "Education", city: "Doha", lat: 25.2569, lng: 51.4522 },
  { id: "l5", name: "Villaggio Mall", short: "Villaggio", category: "Retail", city: "Doha", lat: 25.2586, lng: 51.4436 },
  { id: "l6", name: "Doha Festival City", short: "Festival City", category: "Retail", city: "Doha", lat: 25.38, lng: 51.46 },
  { id: "l7", name: "Hamad International Airport", short: "DOH Airport", category: "Transport", city: "Doha", lat: 25.2731, lng: 51.608 },
  { id: "l8", name: "Sidra Medicine", short: "Sidra", category: "Health", city: "Doha", lat: 25.32, lng: 51.44 },
  { id: "l9", name: "Lusail Boulevard", short: "Lusail Blvd", category: "Leisure", city: "Doha", lat: 25.4, lng: 51.49 },

  // ── Dubai ──
  { id: "l10", name: "DIFC — Financial Centre", short: "DIFC", category: "Work", city: "Dubai", lat: 25.2138, lng: 55.2824 },
  { id: "l11", name: "Dubai Internet & Media City", short: "Media City", category: "Work", city: "Dubai", lat: 25.095, lng: 55.16 },
  { id: "l12", name: "Business Bay", short: "Business Bay", category: "Work", city: "Dubai", lat: 25.1857, lng: 55.2721 },
  { id: "l13", name: "Jumeirah Schools Cluster", short: "Jumeirah Schools", category: "Education", city: "Dubai", lat: 25.17, lng: 55.23 },
  { id: "l14", name: "The Dubai Mall", short: "Dubai Mall", category: "Retail", city: "Dubai", lat: 25.1972, lng: 55.2796 },
  { id: "l15", name: "Mall of the Emirates", short: "MoE", category: "Retail", city: "Dubai", lat: 25.1181, lng: 55.2 },
  { id: "l16", name: "Dubai International Airport", short: "DXB", category: "Transport", city: "Dubai", lat: 25.2532, lng: 55.3657 },
  { id: "l17", name: "Jumeirah Beach", short: "Jumeirah Beach", category: "Leisure", city: "Dubai", lat: 25.2048, lng: 55.2419 },

  // ── Abu Dhabi ──
  { id: "l18", name: "ADGM — Al Maryah Island", short: "ADGM", category: "Work", city: "Abu Dhabi", lat: 24.5, lng: 54.39 },
  { id: "l19", name: "Corniche & Central Business", short: "Corniche", category: "Work", city: "Abu Dhabi", lat: 24.47, lng: 54.34 },
  { id: "l20", name: "Yas Island", short: "Yas Island", category: "Leisure", city: "Abu Dhabi", lat: 24.49, lng: 54.6 },

  // ── Riyadh ──
  { id: "l21", name: "King Abdullah Financial District", short: "KAFD", category: "Work", city: "Riyadh", lat: 24.762, lng: 46.642 },
  { id: "l22", name: "Olaya Business District", short: "Olaya", category: "Work", city: "Riyadh", lat: 24.69, lng: 46.685 },
  { id: "l23", name: "Diplomatic Quarter", short: "DQ", category: "Work", city: "Riyadh", lat: 24.6748, lng: 46.6252 },
  { id: "l24", name: "King Khalid International Airport", short: "RUH Airport", category: "Transport", city: "Riyadh", lat: 24.957, lng: 46.6988 },

  // ── Jeddah ──
  { id: "l25", name: "Jeddah Corniche", short: "Corniche", category: "Leisure", city: "Jeddah", lat: 21.6, lng: 39.11 },
  { id: "l26", name: "King Abdulaziz Airport", short: "JED Airport", category: "Transport", city: "Jeddah", lat: 21.68, lng: 39.156 },

  // ── Mumbai ──
  { id: "l27", name: "Bandra Kurla Complex", short: "BKC", category: "Work", city: "Mumbai", lat: 19.066, lng: 72.869 },
  { id: "l28", name: "Lower Parel Business District", short: "Lower Parel", category: "Work", city: "Mumbai", lat: 18.996, lng: 72.825 },
  { id: "l29", name: "Mumbai International Airport", short: "BOM Airport", category: "Transport", city: "Mumbai", lat: 19.09, lng: 72.865 },

  // ── Gurugram ──
  { id: "l30", name: "DLF Cyber City", short: "Cyber City", category: "Work", city: "Gurugram", lat: 28.495, lng: 77.089 },
  { id: "l31", name: "Golf Course Road Hub", short: "Golf Course Rd", category: "Work", city: "Gurugram", lat: 28.4595, lng: 77.0966 },
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
