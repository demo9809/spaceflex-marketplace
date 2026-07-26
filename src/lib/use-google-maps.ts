"use client";

import { useEffect, useState } from "react";

/* Lightweight, dependency-free loader for the Google Maps JavaScript API.
   The key comes from NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. When it is absent the
   status settles on "unconfigured" and callers fall back to the illustrative
   map, so the page always works — a real key simply upgrades the experience.

   The script is injected once and shared across every consumer via a module
   promise, so multiple maps on a page never load the API twice. */

export type MapsStatus = "loading" | "ready" | "error" | "unconfigured";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = "google-maps-js";

declare global {
  interface Window {
    // Loosely typed: the Maps SDK ships no types and we add no @types package.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

let loadPromise: Promise<void> | null = null;

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.google?.maps) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    /* Classic load (no loading=async): by the load event google.maps and
       its constructors (Map, Marker, Circle, InfoWindow) are fully present,
       which is what the imperative map code below relies on. */
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject());
    document.head.appendChild(script);
  });
  return loadPromise;
}

export function useGoogleMaps(): MapsStatus {
  const [status, setStatus] = useState<MapsStatus>(
    API_KEY ? "loading" : "unconfigured"
  );

  useEffect(() => {
    if (!API_KEY) return;
    let alive = true;
    /* loadMaps() resolves immediately when the SDK is already present, so
       the state update always lands in a microtask, never synchronously. */
    loadMaps()
      .then(() => alive && setStatus("ready"))
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, []);

  return status;
}
