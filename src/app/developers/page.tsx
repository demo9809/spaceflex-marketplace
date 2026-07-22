import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import { developers, projects } from "@/lib/data/developers";
import { SectionHeading } from "@/components/site/section-heading";
import { RevealStagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Developers & New Projects",
  description:
    "Off-plan launches and developer profiles across Qatar — with pre-launch access for SpaceFlex members.",
};

export default function DevelopersPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <SectionHeading
        eyebrow="New Launches"
        title="Projects worth waiting for"
        description="We list a fraction of Qatar's launches — the ones whose developers have delivered before, on time, to spec."
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
                    {dev?.name} · {pr.city}, {pr.country}
                  </p>
                  <h2 className="font-display mt-1.5 text-xl font-semibold">
                    {pr.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {pr.types.join(" · ")}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                    <span className="text-muted">
                      From{" "}
                      <span className="font-medium text-ink">
                        {formatPrice(pr.priceFrom, pr.currency, true)}
                      </span>
                    </span>
                    <span className="text-muted">Handover {pr.handover}</span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </RevealStagger>

      <div className="mt-24">
        <SectionHeading
          eyebrow="Developer Directory"
          title="Track records, not renderings"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {developers.map((d) => (
            <Link
              key={d.id}
              href={`/developers/${d.slug}`}
              className="card-hover group relative overflow-hidden rounded-2xl border border-line bg-raised p-6 shadow-card"
            >
              <div className="flex items-center gap-4">
                <span className="font-display flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-lg font-semibold text-paper">
                  {d.logoInitials}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {d.name}
                  </h3>
                  <p className="text-xs text-muted">
                    {d.city} · Est. {d.founded}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="ml-auto text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                />
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                <div>
                  <dd className="font-display text-lg font-semibold">
                    {d.projects}
                  </dd>
                  <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                    Projects
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-lg font-semibold">
                    {d.unitsDelivered}
                  </dd>
                  <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                    Units
                  </dt>
                </div>
                <div>
                  <dd className="font-display flex items-center justify-center gap-1 text-lg font-semibold">
                    <Star size={13} className="fill-gold stroke-gold" />
                    {d.rating}
                  </dd>
                  <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                    Rating
                  </dt>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
