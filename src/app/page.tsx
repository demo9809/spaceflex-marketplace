import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  LineChart,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { HeroSearch } from "@/components/home/hero-search";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { DriveTimeBand } from "@/components/home/drive-time-band";
import { PropertyCard } from "@/components/property/property-card";
import { AgentCard } from "@/components/agent/agent-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion/reveal";
import { CompareTray } from "@/components/site/compare-tray";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { featuredProperties, IMG } from "@/lib/data/properties";
import { agents } from "@/lib/data/agents";
import { projects, developers } from "@/lib/data/developers";
import { articles } from "@/lib/data/articles";
import { formatPrice } from "@/lib/format";

const districtCollections = [
  { district: "West Bay", note: "Towers · Corniche · Diplomatic", image: IMG.towers },
  { district: "The Pearl Island", note: "Porto Arabia · Viva Bahriya", image: IMG.marina },
  { district: "Lusail Marina", note: "Marina · Place Vendôme · Tram", image: IMG.skyline },
  { district: "West Bay Lagoon", note: "Waterfront villas · Onaiza", image: IMG.desertVilla },
];

const pillars = [
  {
    icon: BadgeCheck,
    title: "Verified agents only",
    text: "Every advisor is licence-checked and reviewed. No ghost listings, no bait pricing — the listing you see is the home you visit.",
  },
  {
    icon: LineChart,
    title: "Institutional-grade data",
    text: "Price history, comparables and yield analytics on every listing, drawn from our regional research desk.",
  },
  {
    icon: Building2,
    title: "Every Qatar district, one search",
    text: "Every freehold and usufruct district in one search — West Bay, The Pearl, Lusail, Msheireb and beyond, with commute-aware filtering.",
  },
  {
    icon: ShieldCheck,
    title: "Discretion as standard",
    text: "Off-market dossiers, private viewings and NDA-ready processes for principals who prefer quiet transactions.",
  },
];

const stats = [
  { value: "3,000+", label: "Curated listings" },
  { value: "12", label: "Districts covered" },
  { value: "QAR 4.2B", label: "Sold last year" },
  { value: "98%", label: "Verified agents" },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative isolate -mt-16 flex min-h-[92svh] items-end overflow-hidden md:-mt-[4.5rem] md:min-h-[88vh]">
        <HeroBackdrop />

        <div className="container-site relative z-10 pb-14 pt-36 md:pb-24">
          <p className="rise rise-1 eyebrow !text-paper/80">
            Qatar · Premium Property
          </p>
          <h1 className="rise rise-2 font-display text-display mt-4 max-w-3xl font-medium text-paper text-balance">
            Homes worth the journey.
          </h1>
          <p className="rise rise-3 mt-5 max-w-xl text-base leading-relaxed text-paper/85 md:text-lg">
            A curated marketplace for exceptional residences and investments
            across Doha, Lusail, The Pearl and Al Rayyan — with the
            intelligence to buy well.
          </p>
          <div className="rise rise-4 mt-8">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-b border-line bg-surface">
        <div className="container-site grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <p className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading
          eyebrow="The Collection"
          title="Featured residences, hand-selected weekly"
          description="Our editors review every submission. Fewer than one in five listings makes the platform."
          href="/properties"
          linkLabel="Browse all properties"
        />
        <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.slice(0, 6).map((p, i) => (
            <StaggerItem key={p.id}>
              <PropertyCard property={p} priority={i < 3} />
            </StaggerItem>
          ))}
        </RevealStagger>
      </section>

      {/* ── DRIVE-TIME FEATURE BAND ── */}
      <DriveTimeBand />

      {/* ── EDITORIAL SPLIT — PRIVATE OFFICE ── */}
      <section className="bg-ink text-paper">
        <div className="container-site grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={IMG.hillsMansion}
                alt="West Bay Lagoon waterfront mansion"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4">
                <Badge tone="brass">SpaceFlex Exclusive</Badge>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="eyebrow">Private Office</p>
            <h2 className="font-display text-h2 mt-3 font-medium tracking-tight text-balance">
              The addresses that never reach the open market.
            </h2>
            <p className="mt-5 leading-relaxed text-paper/70">
              Our Private Office represents a small book of off-market
              residences — waterfront mansions in West Bay Lagoon, full-floor
              penthouses in the Corniche towers, sea-line homes on The Pearl. Dossiers
              are shared under NDA with qualified principals only.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-paper/50">
                  Current mandate
                </dt>
                <dd className="font-display mt-1 text-2xl">
                  {formatPrice(68000000, "QAR", true)}
                </dd>
                <dd className="text-sm text-paper/60">West Bay Lagoon, 7 BR</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-paper/50">
                  Placed privately in 2025
                </dt>
                <dd className="font-display mt-1 text-2xl">14 homes</dd>
                <dd className="text-sm text-paper/60">across Doha & Lusail</dd>
              </div>
            </dl>
            <div className="mt-8">
              <ButtonLink href="/contact" variant="inverted" size="lg">
                Enquire discreetly
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CITY COLLECTIONS ── */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading
          eyebrow="Destinations"
          title="Qatar's defining addresses"
        />
        <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {districtCollections.map((c) => (
            <StaggerItem key={c.district}>
              <Link
                href={`/properties?district=${encodeURIComponent(c.district)}`}
                className="card-hover img-zoom group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={c.image}
                  alt={`${c.district}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display flex items-center justify-between text-2xl font-medium text-paper">
                    {c.district}
                    <ArrowUpRight
                      size={20}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </h3>
                  <p className="mt-1 text-[0.8125rem] text-paper/75">{c.note}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </RevealStagger>
      </section>

      {/* ── PILLARS ── */}
      <section className="border-y border-line bg-surface">
        <div className="container-site py-20 md:py-28">
          <SectionHeading
            eyebrow="Why SpaceFlex"
            title="Built for buyers who do their homework"
            align="center"
          />
          <RevealStagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <StaggerItem key={p.title} className="text-center sm:text-left">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brass-tint text-brass sm:mx-0">
                  <p.icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.text}
                </p>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ── NEW PROJECTS ── */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading
          eyebrow="Off-Plan & New Launches"
          title="Tomorrow's addresses, before the public launch"
          href="/developers"
          linkLabel="All projects"
        />
        <RevealStagger className="grid gap-6 lg:grid-cols-3">
          {projects.map((pr) => {
            const dev = developers.find((d) => d.id === pr.developerId);
            return (
              <StaggerItem key={pr.id}>
                <Link
                  href={`/developers/projects/${pr.slug}`}
                  className="card-hover group block overflow-hidden rounded-2xl border border-line bg-raised shadow-card"
                >
                  <div className="img-zoom relative aspect-[16/10]">
                    <Image
                      src={pr.images[0]}
                      alt={pr.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge tone="inverted">{pr.status}</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">
                      {dev?.name} · {pr.city}
                    </p>
                    <h3 className="font-display mt-1.5 text-xl font-semibold">
                      {pr.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                      <span className="text-muted">From</span>
                      <span className="font-medium">
                        {formatPrice(pr.priceFrom, pr.currency, true)}
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </RevealStagger>
      </section>

      {/* ── AGENTS ── */}
      <section className="border-t border-line bg-surface">
        <div className="container-site py-20 md:py-28">
          <SectionHeading
            eyebrow="Advisory"
            title="Advisors who know the building, not just the district"
            href="/agents"
            linkLabel="Meet all agents"
          />
          <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agents.slice(0, 4).map((a) => (
              <StaggerItem key={a.id}>
                <AgentCard agent={a} />
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ── JOURNAL ── */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading
          eyebrow="The Journal"
          title="Intelligence before inventory"
          href="/journal"
          linkLabel="Read the Journal"
        />
        <RevealStagger className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((ar) => (
            <StaggerItem key={ar.id}>
              <Link
                href={`/journal/${ar.slug}`}
                className="card-hover group block overflow-hidden rounded-2xl border border-line bg-raised shadow-card"
              >
                <div className="img-zoom relative aspect-[16/10]">
                  <Image
                    src={ar.cover}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="eyebrow">{ar.category}</p>
                  <h3 className="font-display mt-2 text-xl font-semibold leading-snug text-balance">
                    {ar.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {ar.excerpt}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-faint">
                    {ar.author} · {ar.readMinutes} min read
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </RevealStagger>
      </section>

      {/* ── CTA ── */}
      <section className="container-site pb-20 md:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center text-paper md:px-16 md:py-24">
            <div className="grain absolute inset-0" />
            <div
              className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, #ae8a4e, transparent)",
              }}
            />
            <p className="eyebrow relative">For Agents & Owners</p>
            <h2 className="font-display text-h2 relative mx-auto mt-4 max-w-2xl font-medium text-balance">
              Your listing, in front of the region&apos;s most serious buyers.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-paper/70">
              Featured placement, verified-buyer leads, and a dashboard that
              shows exactly how your property performs. Median time to offer:
              nine days.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/list-property" variant="inverted" size="lg">
                List a property
              </ButtonLink>
              <ButtonLink
                href="/list-with-us#plans"
                variant="outline"
                size="lg"
                className="border-white/30 text-paper hover:border-white/70 hover:bg-white/5"
              >
                View agent plans
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      <CompareTray />
    </>
  );
}
