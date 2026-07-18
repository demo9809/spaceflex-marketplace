import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Star,
  Clock,
  Globe2,
  Building,
  Award,
} from "lucide-react";
import { agents, getAgent, agentListings } from "@/lib/data/agents";
import { PropertyCard } from "@/components/property/property-card";
import { ContactCard } from "@/components/agent/contact-card";
import { Badge } from "@/components/ui/badge";
import { CompareTray } from "@/components/site/compare-tray";

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return {};
  return {
    title: `${agent.name} — ${agent.agency}`,
    description: agent.bio.slice(0, 160),
  };
}

const reviews = [
  {
    name: "R. Al-Kuwari",
    text: "Handled our West Bay purchase end-to-end while we were abroad. Documents, valuation, handover — flawless.",
    rating: 5,
    date: "June 2026",
  },
  {
    name: "M. Fernandes",
    text: "Straight answers on service charges and building quality that other agents glossed over. Would use again.",
    rating: 5,
    date: "April 2026",
  },
  {
    name: "S. Iqbal",
    text: "Responsive and honest about which listings weren't worth our time. That candour won our trust.",
    rating: 4,
    date: "February 2026",
  },
];

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const listings = agentListings(agent.id);

  const stats = [
    { icon: Building, label: "Transactions", value: String(agent.transactions) },
    { icon: Award, label: "Years active", value: String(agent.yearsActive) },
    { icon: Globe2, label: "Languages", value: agent.languages.join(" · ") },
    { icon: Clock, label: "Response", value: agent.responseTime.replace("Responds in ", "") },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_24rem]">
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-3xl ring-4 ring-brass-tint">
              <Image
                src={agent.photo}
                alt={agent.name}
                fill
                sizes="144px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-h2 font-medium tracking-tight">
                  {agent.name}
                </h1>
                {agent.verified && (
                  <Badge tone="brass">
                    <BadgeCheck size={12} /> Verified
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-muted">
                {agent.title} · {agent.agency} · {agent.city}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm">
                <Star size={15} className="fill-gold stroke-gold" />
                <span className="font-semibold">{agent.rating}</span>
                <span className="text-muted">({agent.reviews} reviews)</span>
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
                {agent.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {agent.specialties.map((s) => (
                  <Badge key={s} tone="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <dl className="grid h-fit grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-raised p-4"
              >
                <s.icon size={17} className="text-brass" strokeWidth={1.8} />
                <dt className="mt-2.5 text-xs uppercase tracking-[0.12em] text-muted">
                  {s.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-site grid gap-14 py-14 md:py-20 lg:grid-cols-[1fr_24rem]">
        <div>
          <section aria-labelledby="agent-listings">
            <h2 id="agent-listings" className="font-display text-h3 font-medium">
              Active listings ({listings.length})
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>

          <section aria-labelledby="agent-reviews" className="mt-16">
            <h2 id="agent-reviews" className="font-display text-h3 font-medium">
              Client reviews
            </h2>
            <div className="mt-6 space-y-4">
              {reviews.map((r) => (
                <blockquote
                  key={r.name}
                  className="rounded-2xl border border-line bg-raised p-6"
                >
                  <div
                    className="flex gap-0.5"
                    aria-label={`${r.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < r.rating
                            ? "fill-gold stroke-gold"
                            : "stroke-line-strong"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    “{r.text}”
                  </p>
                  <footer className="mt-3 text-xs uppercase tracking-[0.14em] text-faint">
                    {r.name} · {r.date} · Verified transaction
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ContactCard agent={agent} context={`a property in ${agent.city}`} />
        </aside>
      </div>

      <CompareTray />
    </>
  );
}
