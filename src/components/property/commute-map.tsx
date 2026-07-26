"use client";

import { useEffect, useRef } from "react";
import type { Landmark } from "@/lib/types";
import type { CommuteMatch } from "@/lib/geo";
import { propertyPrice } from "@/lib/format";
import { useGoogleMaps } from "@/lib/use-google-maps";
import { CommuteMapIllustrative } from "./commute-map-illustrative";

export type { CommuteMatch } from "@/lib/geo";

/* Straight-line metres reachable within `minutes` — mirrors the engine's
   estimate (min = km·detour/speed·60) so ring radii track the filter. */
const reachMetres = (minutes: number) => (minutes * 34) / 60 / 1.35 * 1000;

const letter = (i: number) => String.fromCharCode(65 + i);

/* The standard Google map look ("original"), just with business-POI and
   transit label clutter dialled down so our own price pins lead. */
const MAP_STYLE = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

function svgUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function priceIcon(text: string, active: boolean) {
  const w = Math.max(46, text.length * 7.2 + 18);
  const bg = active ? "#0b241d" : "#ffffff";
  const fg = active ? "#ffffff" : "#0b241d";
  const stroke = active ? "#0b241d" : "#166246";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="30" viewBox="0 0 ${w} 30">
    <rect x="1" y="1" width="${w - 2}" height="24" rx="12" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
    <path d="M${w / 2 - 5} 24 L${w / 2} 29 L${w / 2 + 5} 24 Z" fill="${bg}"/>
    <text x="${w / 2}" y="17" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="${fg}" text-anchor="middle">${text}</text>
  </svg>`;
  return { url: svgUri(svg), w };
}

function hubIcon(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
    <path d="M20 47 C20 47 34 30 34 18 A14 14 0 1 0 6 18 C6 30 20 47 20 47 Z" fill="#166246" stroke="#ffffff" stroke-width="2"/>
    <circle cx="20" cy="18" r="9" fill="#0b241d"/>
    <text x="20" y="22" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
  </svg>`;
  return svgUri(svg);
}

export function CommuteMap({
  hubs,
  matches,
  maxMinutes,
}: {
  hubs: Landmark[];
  matches: CommuteMatch[];
  maxMinutes: number;
}) {
  const status = useGoogleMaps();

  if (status === "ready") {
    return <GoogleCommuteMap hubs={hubs} matches={matches} maxMinutes={maxMinutes} />;
  }
  if (status === "loading") {
    return (
      <div className="relative h-full min-h-[26rem] w-full overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <div className="skeleton absolute inset-0 opacity-60" />
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          Loading map…
        </p>
      </div>
    );
  }
  /* unconfigured or error → dependency-free fallback */
  return (
    <CommuteMapIllustrative hubs={hubs} matches={matches} maxMinutes={maxMinutes} />
  );
}

function GoogleCommuteMap({
  hubs,
  matches,
  maxMinutes,
}: {
  hubs: Landmark[];
  matches: CommuteMatch[];
  maxMinutes: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlaysRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoRef = useRef<any>(null);

  /* Init the map once */
  useEffect(() => {
    const g = window.google;
    if (!g || !containerRef.current || mapRef.current) return;
    mapRef.current = new g.maps.Map(containerRef.current, {
      center: { lat: 25.3, lng: 51.5 },
      zoom: 10,
      styles: MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      gestureHandling: "cooperative",
      clickableIcons: false,
    });
    infoRef.current = new g.maps.InfoWindow();
  }, []);

  /* Redraw hubs, reach rings and property pins whenever inputs change */
  useEffect(() => {
    const g = window.google;
    const map = mapRef.current;
    if (!g || !map) return;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
    infoRef.current?.close();

    const bounds = new g.maps.LatLngBounds();

    hubs.forEach((h, i) => {
      const pos = { lat: h.lat, lng: h.lng };
      const marker = new g.maps.Marker({
        position: pos,
        map,
        title: h.name,
        zIndex: 1000,
        icon: {
          url: hubIcon(letter(i)),
          scaledSize: new g.maps.Size(40, 48),
          anchor: new g.maps.Point(20, 47),
        },
      });
      const ring = new g.maps.Circle({
        map,
        center: pos,
        radius: reachMetres(maxMinutes),
        strokeColor: "#166246",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#166246",
        fillOpacity: 0.05,
        clickable: false,
      });
      overlaysRef.current.push(marker, ring);
      bounds.extend(pos);
    });

    matches.forEach((m) => {
      const p = m.property;
      const pos = { lat: p.lat, lng: p.lng };
      const label = propertyPrice(p, true).replace(/\s?\/\s?(month|year)/, "");
      const { url, w } = priceIcon(label, false);
      const marker = new g.maps.Marker({
        position: pos,
        map,
        title: p.title,
        icon: {
          url,
          scaledSize: new g.maps.Size(w, 30),
          anchor: new g.maps.Point(w / 2, 29),
        },
      });
      marker.addListener("click", () => {
        infoRef.current.setContent(
          `<div style="max-width:220px;font-family:system-ui,sans-serif">
            <div style="font-weight:700;font-size:15px;color:#0b241d">${propertyPrice(p, true)}</div>
            <div style="font-size:13px;color:#0b241d;margin-top:2px">${p.title}</div>
            <div style="font-size:12px;color:#5e6e63">${p.community}, ${p.city}</div>
            <div style="font-size:12px;color:#166246;margin-top:4px">${m.verdict.worstMinutes} min to the furthest place</div>
            <a href="/properties/${p.slug}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#166246">View home →</a>
          </div>`
        );
        infoRef.current.open({ map, anchor: marker });
      });
      overlaysRef.current.push(marker);
      bounds.extend(pos);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 80);
      /* Never zoom in past a sensible city level for a single point */
      const listener = g.maps.event.addListenerOnce(map, "idle", () => {
        if (map.getZoom() > 14) map.setZoom(14);
      });
      overlaysRef.current.push({ setMap: () => g.maps.event.removeListener(listener) });
    }
  }, [hubs, matches, maxMinutes]);

  return (
    <div className="relative h-full min-h-[26rem] w-full overflow-hidden rounded-3xl border border-line shadow-card">
      <div ref={containerRef} className="h-full w-full" />
      <p className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-raised/90 px-2.5 py-1 text-[0.625rem] text-faint shadow-card backdrop-blur-sm">
        Drive times est.
      </p>
    </div>
  );
}
