"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { propertyPrice } from "@/lib/format";
import { useGoogleMaps } from "@/lib/use-google-maps";

/* The standard Google map look, with business-POI and transit label
   clutter dialled down — matches the drive-time map. */
const MAP_STYLE = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const PIN = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
    <path d="M20 47 C20 47 34 30 34 18 A14 14 0 1 0 6 18 C6 30 20 47 20 47 Z" fill="#166246" stroke="#ffffff" stroke-width="2"/>
    <circle cx="20" cy="18" r="6" fill="#ffffff"/>
  </svg>`
)}`;

/* Real Google map for a single property's location. Falls back to a
   dependency-free placeholder when no Maps key is configured, so the
   detail page always renders. */
export function PropertyMap({ property }: { property: Property }) {
  const status = useGoogleMaps();

  if (status === "ready") return <GooglePropertyMap property={property} />;

  return (
    <div className="relative mt-5 flex aspect-[16/7] items-center justify-center overflow-hidden rounded-2xl border border-line bg-[var(--map-canvas)]">
      {status === "loading" && (
        <div className="skeleton absolute inset-0 opacity-50" />
      )}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lift">
          <MapPin size={20} />
        </span>
        <p className="mt-3 rounded-full bg-raised/95 px-4 py-1.5 text-sm font-medium shadow-card">
          {property.community}, {property.city}
        </p>
      </div>
    </div>
  );
}

function GooglePropertyMap({ property }: { property: Property }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const g = window.google;
    if (!g || !containerRef.current || mapRef.current) return;
    const pos = { lat: property.lat, lng: property.lng };
    mapRef.current = new g.maps.Map(containerRef.current, {
      center: pos,
      zoom: 14,
      styles: MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      gestureHandling: "cooperative",
      clickableIcons: false,
    });
    const marker = new g.maps.Marker({
      position: pos,
      map: mapRef.current,
      title: property.title,
      icon: {
        url: PIN,
        scaledSize: new g.maps.Size(40, 48),
        anchor: new g.maps.Point(20, 47),
      },
    });
    const info = new g.maps.InfoWindow({
      content: `<div style="font-family:system-ui,sans-serif;max-width:200px">
        <div style="font-weight:700;font-size:14px;color:#0b241d">${propertyPrice(property, true)}</div>
        <div style="font-size:12px;color:#5e6e63">${property.community}, ${property.city}</div>
      </div>`,
    });
    marker.addListener("click", () => info.open({ map: mapRef.current, anchor: marker }));
  }, [property]);

  return (
    <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-2xl border border-line">
      <div ref={containerRef} className="absolute inset-0" />
      <p className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-raised/95 px-3 py-1.5 text-sm font-medium shadow-card backdrop-blur-sm">
        {property.community}, {property.city}
      </p>
    </div>
  );
}
