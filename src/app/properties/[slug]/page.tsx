import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  Ruler,
  CalendarDays,
  Car,
  Sofa,
  MapPin,
  Eye,
  TrendingUp,
  Check,
  Share2,
  ChevronRight,
} from "lucide-react";
import { getProperty, properties, similarProperties } from "@/lib/data/properties";
import { getAgent } from "@/lib/data/agents";
import { propertyPrice, pricePerSqft, formatArea } from "@/lib/format";
import { Gallery } from "@/components/property/gallery";
import { MortgageWidget } from "@/components/property/mortgage-widget";
import { ListedBy } from "@/components/property/listed-by";
import { GettingAround } from "@/components/property/getting-around";
import { PropertyMap } from "@/components/property/property-map";
import { ContactCard } from "@/components/agent/contact-card";
import { PropertyCard } from "@/components/property/property-card";
import { SaveButton } from "@/components/property/save-button";
import { MobilePropertyBar } from "@/components/property/mobile-property-bar";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { CompareTray } from "@/components/site/compare-tray";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  return {
    title: `${property.title} — ${propertyPrice(property, true)}`,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const agent = getAgent(property.agentId)!;
  const similar = similarProperties(property);

  const facts = [
    property.beds > 0 && {
      icon: BedDouble,
      label: "Bedrooms",
      value: String(property.beds),
    },
    { icon: Bath, label: "Bathrooms", value: String(property.baths) },
    { icon: Ruler, label: "Built area", value: formatArea(property.areaSqft) },
    { icon: CalendarDays, label: "Year built", value: String(property.yearBuilt) },
    { icon: Car, label: "Parking", value: `${property.parking} bays` },
    { icon: Sofa, label: "Furnishing", value: property.furnishing },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string }[];

  return (
    <>
      <div className="container-site pt-4 md:pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 hidden md:block">
          <ol className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
            <li>
              <Link href="/properties" className="transition-colors hover:text-ink">
                Properties
              </Link>
            </li>
            <ChevronRight size={13} aria-hidden />
            <li>
              <Link
                href={`/properties?city=${encodeURIComponent(property.city)}`}
                className="transition-colors hover:text-ink"
              >
                {property.city}
              </Link>
            </li>
            <ChevronRight size={13} aria-hidden />
            <li aria-current="page" className="text-ink">
              {property.community}
            </li>
          </ol>
        </nav>

        <div className="relative">
          <Gallery images={property.images} title={property.title} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
          {/* ── Main column ── */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">
                    {property.status === "sale" ? "For Sale" : "For Rent"}
                  </Badge>
                  <Badge tone="outline">{property.type}</Badge>
                  {property.exclusive && <Badge tone="brass">Exclusive</Badge>}
                </div>
                <h1 className="font-display text-h2 mt-3 font-medium tracking-tight text-balance">
                  {property.title}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin size={14} />
                  {property.community}, {property.city}, {property.country}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SaveButton
                  id={property.id}
                  className="border border-line bg-raised"
                />
                <button
                  aria-label="Share property"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-raised shadow-card transition-all hover:scale-110"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Price block */}
            <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-2xl border border-line bg-surface p-5">
              <p className="font-display text-3xl font-semibold tracking-tight">
                {propertyPrice(property)}
              </p>
              <p className="text-sm text-muted">{pricePerSqft(property)}</p>
              {property.rentYield && (
                <p className="flex items-center gap-1 text-sm font-medium text-success">
                  <TrendingUp size={14} />
                  {property.rentYield}% est. yield
                </p>
              )}
              <p className="ml-auto flex items-center gap-1 text-xs text-faint">
                <Eye size={13} />
                {property.views.toLocaleString("en")} views ·{" "}
                {property.daysOnMarket} days on market
              </p>
            </div>

            {/* Key facts */}
            <section aria-labelledby="facts" className="mt-10">
              <h2 id="facts" className="font-display text-h3 font-medium">
                Key facts
              </h2>
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl border border-line bg-raised p-4"
                  >
                    <f.icon size={18} className="text-brass" strokeWidth={1.8} />
                    <dt className="mt-3 text-xs uppercase tracking-[0.12em] text-muted">
                      {f.label}
                    </dt>
                    <dd className="mt-0.5 font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Description */}
            <section aria-labelledby="about" className="mt-10">
              <h2 id="about" className="font-display text-h3 font-medium">
                About this property
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                {property.description}
              </p>
            </section>

            {/* Listed by */}
            <ListedBy property={property} agent={agent} />

            {/* Amenities */}
            <section aria-labelledby="amenities" className="mt-10">
              <h2 id="amenities" className="font-display text-h3 font-medium">
                Amenities
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass-tint text-brass">
                      <Check size={13} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            {/* Location */}
            <section aria-labelledby="location" className="mt-10">
              <h2 id="location" className="font-display text-h3 font-medium">
                Location
              </h2>
              <PropertyMap property={property} />
            </section>

            {/* Commute / connectivity */}
            <GettingAround property={property} />

            {/* Mortgage — mobile placement */}
            {property.status === "sale" && (
              <div className="mt-10 lg:hidden">
                <MortgageWidget
                  price={property.price}
                  currency={property.currency}
                />
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ContactCard agent={agent} context={property.title} />
            {property.status === "sale" && (
              <div className="hidden lg:block">
                <MortgageWidget
                  price={property.price}
                  currency={property.currency}
                />
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="container-site py-20 md:py-24">
          <SectionHeading
            eyebrow="Keep exploring"
            title="Similar residences"
            href={`/properties?city=${encodeURIComponent(property.city)}`}
            linkLabel={`More in ${property.city}`}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky action bar */}
      <MobilePropertyBar property={property} agent={agent} />

      <CompareTray />
    </>
  );
}
