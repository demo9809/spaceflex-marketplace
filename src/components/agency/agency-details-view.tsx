"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ShieldCheck,
  Building2,
  Star,
  Phone,
  Mail,
  Share2,
  Heart,
  MapPin,
  Calendar,
  Users,
  Check,
  ArrowUpRight,
  Clock,
  Sparkles,
  Building,
} from "lucide-react";
import type { Agency, Agent, Property } from "@/lib/types";
import { PropertyCard } from "@/components/property/property-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { useAgencyReviews } from "@/lib/store/review-store";
import { useLeadCapture } from "@/lib/store/lead-store";
import { useSaved } from "@/lib/store/saved";
import { AgencyReviewsSection } from "./agency-reviews-section";
import { cn } from "@/lib/utils";

interface AgencyDetailsViewProps {
  agency: Agency;
  team: Agent[];
  listings: Property[];
}

export function AgencyDetailsView({
  agency,
  team,
  listings,
}: AgencyDetailsViewProps) {
  const { getAgencyRating } = useAgencyReviews();
  const ratingData = getAgencyRating(agency.id);
  const { openLeadModal } = useLeadCapture();
  const { isSaved, toggleSaved } = useSaved();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "properties" | "advisors" | "reviews" | "about"
  >("overview");

  const agencySaved = isSaved(`agency-${agency.id}`);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${agency.name} — Real Estate Agency on SpaceFlex`,
          url,
        });
        return;
      } catch {
        /* fallback to copy */
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContactAgency = () => {
    openLeadModal({
      action: "enquiry",
      agency: {
        id: agency.id,
        name: agency.name,
        slug: agency.slug,
        logo: agency.logo,
        logoInitials: agency.logoInitials,
      },
      agent: team[0]
        ? {
            id: team[0].id,
            name: team[0].name,
            phone: team[0].phone,
            photo: team[0].photo,
            agency: agency.name,
            agencyId: agency.id,
          }
        : undefined,
      defaultMessage: `Hello, I would like to speak with a licensed advisor at ${agency.name} regarding property opportunities in Qatar.`,
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const handleCallAgency = () => {
    openLeadModal({
      action: "call",
      agency: {
        id: agency.id,
        name: agency.name,
        slug: agency.slug,
        logo: agency.logo,
      },
      agent: team[0]
        ? {
            id: team[0].id,
            name: team[0].name,
            phone: agency.phone || team[0].phone,
            photo: team[0].photo,
            agency: agency.name,
          }
        : undefined,
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* ── 1. Compact, Premium Hero Section ── */}
      <section id="overview" className="border-b border-line bg-surface/60">
        <div className="container-site py-8 md:py-12">
          {/* Breadcrumb row */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/agencies" className="hover:text-ink transition-colors">
              Agencies
            </Link>
            <span>/</span>
            <span className="text-ink font-medium truncate">{agency.name}</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Agency Identity */}
            <div className="flex flex-col sm:flex-row items-start gap-5 max-w-3xl">
              {/* Logo frame */}
              {agency.logo ? (
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-xs ring-4 ring-brass/10">
                  <Image
                    src={agency.logo}
                    alt={agency.name}
                    fill
                    priority
                    sizes="96px"
                    className="object-contain p-1"
                  />
                </div>
              ) : (
                <span className="font-display flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-ink text-2xl font-semibold text-paper shadow-lift">
                  {agency.logoInitials}
                </span>
              )}

              <div className="min-w-0 flex-1">
                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {agency.verified && (
                    <Badge tone="brass">
                      <BadgeCheck size={12} /> Verified Brokerage
                    </Badge>
                  )}
                  <Badge tone="outline">
                    <Building2 size={12} /> Licensed Agency
                  </Badge>
                  <span className="text-xs text-muted">Est. {agency.since}</span>
                </div>

                {/* Name & Tagline */}
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-ink">
                  {agency.name}
                </h1>
                <p className="mt-1 text-sm text-muted leading-relaxed max-w-xl">
                  {agency.tagline}
                </p>

                {/* Operating locations */}
                {agency.areasServed && agency.areasServed.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    <MapPin size={13} className="text-brass shrink-0" />
                    <span>Serving:</span>
                    <span className="font-medium text-ink">
                      {agency.areasServed.join(" • ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Prominent Rating Hero Card & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 w-full lg:w-80">
              {/* Prominent Rating Card */}
              <div
                onClick={() => scrollToSection("reviews")}
                className="group cursor-pointer rounded-2xl border border-line bg-raised p-4 transition-all hover:border-brass hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-ink">
                      {ratingData.averageRating.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < Math.round(ratingData.averageRating)
                              ? "fill-gold stroke-gold"
                              : "stroke-line-strong"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[0.6875rem] font-semibold text-brass group-hover:underline">
                    View all →
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Based on <strong className="font-semibold text-ink">{ratingData.totalReviews} verified reviews</strong>
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[0.6875rem] text-success font-medium">
                  <ShieldCheck size={13} />
                  <span>100% verified client transactions</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleContactAgency}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-xs sm:text-sm font-semibold text-paper shadow-xs transition-all hover:bg-ink/90 active:scale-[0.99] cursor-pointer"
                >
                  <Phone size={15} className="text-brass" />
                  <span>Contact Agency</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection("properties")}
                    className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink hover:bg-brass-tint hover:text-brass transition-all cursor-pointer"
                  >
                    <span>View Properties ({listings.length || agency.activeListings})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSaved(`agency-${agency.id}`)}
                    title={agencySaved ? "Saved to favourites" : "Save agency"}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border border-line transition-all active:scale-95 cursor-pointer shrink-0",
                      agencySaved
                        ? "bg-danger-tint text-danger border-danger/30"
                        : "bg-surface text-muted hover:text-ink hover:bg-raised"
                    )}
                  >
                    <Heart size={16} className={agencySaved ? "fill-danger" : ""} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    title="Share agency profile"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted hover:text-ink hover:bg-raised transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    {copied ? <Check size={15} className="text-success" /> : <Share2 size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Compact Customer-Facing Trust & Credentials Bar ── */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 border-t border-line/80 pt-6">
            <div className="rounded-xl border border-line bg-raised/70 p-3 text-center sm:text-left">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted block">
                Licence & Compliance
              </span>
              <p className="mt-1 font-semibold text-xs text-ink truncate flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck size={13} className="text-success shrink-0" />
                <span>{agency.licenseNo}</span>
              </p>
            </div>

            <div className="rounded-xl border border-line bg-raised/70 p-3 text-center sm:text-left">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted block">
                Active Listings
              </span>
              <p className="mt-1 font-display text-lg font-bold text-ink leading-tight">
                {listings.length || agency.activeListings}
              </p>
            </div>

            <div className="rounded-xl border border-line bg-raised/70 p-3 text-center sm:text-left">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted block">
                Licensed Advisors
              </span>
              <p className="mt-1 font-display text-lg font-bold text-ink leading-tight">
                {team.length}
              </p>
            </div>

            <div className="rounded-xl border border-line bg-raised/70 p-3 text-center sm:text-left">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted block">
                Experience
              </span>
              <p className="mt-1 font-display text-lg font-bold text-ink leading-tight">
                {new Date().getFullYear() - agency.since}+ years
              </p>
            </div>

            <div className="rounded-xl border border-line bg-raised/70 p-3 text-center sm:text-left col-span-2 sm:col-span-1">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted block">
                Response Speed
              </span>
              <p className="mt-1 text-xs font-semibold text-ink flex items-center justify-center sm:justify-start gap-1">
                <Clock size={13} className="text-brass shrink-0" />
                <span>{agency.responseTime || "< 15 mins"}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Sticky In-Page Section Navigation Tabs ── */}
      <div className="sticky top-[4rem] md:top-[4.5rem] z-30 border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="container-site flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2.5">
          {[
            { id: "overview", label: "Overview" },
            { id: "properties", label: `Properties (${listings.length || agency.activeListings})` },
            { id: "advisors", label: `Advisors (${team.length})` },
            { id: "reviews", label: `Reviews (${ratingData.totalReviews})` },
            { id: "about", label: "About & Credentials" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                scrollToSection(tab.id);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink hover:bg-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Page Content Flow ── */}
      <div className="container-site py-10 md:py-16 space-y-16 md:space-y-24">
        {/* ── 4. FEATURED PROPERTIES (Primary Customer Destination) ── */}
        <section id="properties" className="scroll-mt-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <SectionHeading
              eyebrow="Active Portfolio"
              title={`Live rentals from ${agency.name}`}
            />
            {listings.length > 0 && (
              <Link
                href={`/properties?city=${encodeURIComponent(agency.city)}`}
                className="text-xs font-semibold text-brass hover:underline shrink-0"
              >
                View all rentals in Qatar →
              </Link>
            )}
          </div>

          {listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-line bg-surface/50 p-8 text-center max-w-lg mx-auto">
              <Building size={28} className="mx-auto text-muted" />
              <h3 className="mt-3 font-semibold text-sm text-ink">
                No active public listings currently
              </h3>
              <p className="mt-1 text-xs text-muted">
                Contact {agency.name} directly to access off-market residences and private portfolio leases.
              </p>
              <button
                type="button"
                onClick={handleContactAgency}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-ink px-4 text-xs font-semibold text-paper"
              >
                Inquire About Off-Market Listings
              </button>
            </div>
          )}
        </section>

        {/* ── 5. MEET THE ADVISORS ── */}
        {team.length > 0 && (
          <section id="advisors" className="scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <SectionHeading
                eyebrow="Advisory Team"
                title={`${team.length} licensed advisor${team.length === 1 ? "" : "s"} ready to assist`}
              />
              <span className="text-xs text-muted">
                All advisors regulated under Licence {agency.licenseNo}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((advisor) => (
                <div
                  key={advisor.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-raised p-5 shadow-xs transition-all hover:shadow-card"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <Link
                        href={`/agents/${advisor.slug}`}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-brass/20"
                      >
                        <Image
                          src={advisor.photo}
                          alt={advisor.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/agents/${advisor.slug}`}
                          className="flex items-center gap-1.5 font-semibold text-sm text-ink hover:text-brass transition-colors"
                        >
                          <span className="truncate">{advisor.name}</span>
                          {advisor.verified && (
                            <BadgeCheck size={14} className="text-brass shrink-0" />
                          )}
                        </Link>
                        <p className="text-xs text-muted truncate mt-0.5">
                          {advisor.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted">
                          <Star size={12} className="fill-gold stroke-gold" />
                          <span className="font-semibold text-ink">{advisor.rating}</span>
                          <span>·</span>
                          <span>{advisor.reviews} reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    {advisor.specialties && advisor.specialties.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {advisor.specialties.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-surface px-2 py-0.5 text-[0.625rem] font-medium text-muted border border-line/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {advisor.bio}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between gap-2">
                    <Link
                      href={`/agents/${advisor.slug}`}
                      className="text-xs font-semibold text-muted hover:text-ink transition-colors"
                    >
                      View Profile →
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        openLeadModal({
                          action: "call",
                          agency: { id: agency.id, name: agency.name, slug: agency.slug },
                          agent: {
                            id: advisor.id,
                            name: advisor.name,
                            phone: advisor.phone,
                            photo: advisor.photo,
                            agency: agency.name,
                          },
                        })
                      }
                      className="flex h-8 items-center gap-1 rounded-lg bg-brass-tint px-2.5 text-xs font-semibold text-brass hover:bg-brass hover:text-white transition-all cursor-pointer"
                    >
                      <Phone size={12} />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 6. CLIENT REVIEWS SECTION ── */}
        <div id="reviews" className="scroll-mt-32">
          <AgencyReviewsSection agency={agency} team={team} />
        </div>

        {/* ── 7. ABOUT THE AGENCY & CREDENTIALS ── */}
        <section id="about" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Credentials & Background"
            title={`About ${agency.name}`}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Left: Philosophy & Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-line bg-raised p-6 md:p-8 space-y-4">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Company Overview
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {agency.description ||
                    `${agency.name} is a premier Qatar-licensed real estate agency based in ${agency.city}. We specialize in high-end residential and investment transactions, operating under full regulatory oversight.`}
                </p>

                {agency.specialization && (
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                      Core Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {agency.specialization.map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-line px-3 py-1 text-xs font-medium text-ink"
                        >
                          <Sparkles size={12} className="text-brass" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Areas Served Card */}
              {agency.areasServed && (
                <div className="rounded-3xl border border-line bg-raised p-6 md:p-8">
                  <h3 className="font-display text-base font-semibold text-ink mb-3">
                    Districts & Communities Served
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {agency.areasServed.map((area) => (
                      <Link
                        key={area}
                        href={`/properties?district=${encodeURIComponent(area)}`}
                        className="group flex flex-col p-3 rounded-2xl border border-line bg-surface/50 hover:bg-brass-tint hover:border-brass/40 transition-all"
                      >
                        <span className="font-semibold text-xs text-ink group-hover:text-brass truncate">
                          {area}
                        </span>
                        <span className="text-[0.6875rem] text-muted group-hover:text-brass/80 mt-0.5">
                          Browse rentals →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Regulatory & Office Details Card */}
            <div className="rounded-3xl border border-line bg-surface p-6 md:p-8 space-y-5 h-fit shadow-card">
              <div className="flex items-center gap-2 pb-4 border-b border-line">
                <ShieldCheck size={20} className="text-success" />
                <div>
                  <h4 className="font-semibold text-sm text-ink leading-tight">
                    Regulatory Verification
                  </h4>
                  <span className="text-[0.6875rem] text-muted">
                    Ministry of Commerce & Industry
                  </span>
                </div>
              </div>

              <dl className="space-y-4 text-xs">
                <div>
                  <dt className="text-muted text-[0.6875rem] uppercase tracking-wider">
                    Official Licence No.
                  </dt>
                  <dd className="font-semibold text-ink mt-0.5">
                    {agency.licenseNo}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted text-[0.6875rem] uppercase tracking-wider">
                    Registered Brokerage Name
                  </dt>
                  <dd className="font-semibold text-ink mt-0.5">
                    {agency.name} W.L.L.
                  </dd>
                </div>

                <div>
                  <dt className="text-muted text-[0.6875rem] uppercase tracking-wider">
                    Main Office Address
                  </dt>
                  <dd className="font-semibold text-ink mt-0.5 leading-relaxed">
                    {agency.officeAddress || "Doha, Qatar"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted text-[0.6875rem] uppercase tracking-wider">
                    Direct Contact
                  </dt>
                  <dd className="font-semibold text-ink mt-0.5">
                    {agency.phone || "+974 4499 8000"}
                  </dd>
                  <dd className="text-muted mt-0.5">
                    {agency.email || "contact@spaceflex.qa"}
                  </dd>
                </div>

                <div className="pt-3 border-t border-line">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-tint px-2.5 py-1 text-[0.6875rem] font-medium text-success">
                    <Check size={12} />
                    Verified Partner & Bonded
                  </span>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── 8. HIGH-CONVERSION BOTTOM CTA ── */}
        <section className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-12 md:p-16 text-paper shadow-lift">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brass/20 px-3 py-1 text-xs font-semibold text-brass-tint">
              <Sparkles size={12} />
              Verified SpaceFlex Partnership
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance">
              Find your ideal residence with {agency.name}
            </h2>
            <p className="text-sm sm:text-base text-paper/70 leading-relaxed max-w-xl">
              Connect directly with verified advisors for tailored viewings, lease registrations, and exclusive off-market listings across Qatar.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleContactAgency}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-paper px-6 text-sm font-semibold text-ink transition-all hover:bg-paper/90 active:scale-[0.99] cursor-pointer"
              >
                <Phone size={15} className="text-brass" />
                <span>Contact {agency.name}</span>
              </button>
              <button
                type="button"
                onClick={handleCallAgency}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-paper/20 bg-paper/10 px-6 text-sm font-semibold text-paper transition-all hover:bg-paper/20 cursor-pointer"
              >
                <span>Call Directly</span>
              </button>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-brass/15 blur-3xl" />
        </section>
      </div>
    </div>
  );
}
