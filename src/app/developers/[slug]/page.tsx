import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import {
  developers,
  getDeveloper,
  developerProjects,
} from "@/lib/data/developers";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

export function generateStaticParams() {
  return developers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = getDeveloper(slug);
  if (!dev) return {};
  return { title: dev.name, description: dev.about.slice(0, 160) };
}

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dev = getDeveloper(slug);
  if (!dev) notFound();
  const projs = developerProjects(dev.id);

  return (
    <>
      <section className="relative isolate -mt-16 flex min-h-[46vh] items-end overflow-hidden md:-mt-[4.5rem]">
        <Image
          src={dev.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/55" />
        <div className="container-site relative z-10 pb-12 pt-40">
          <div className="flex items-end gap-5">
            <span className="font-display flex h-20 w-20 items-center justify-center rounded-3xl bg-paper text-2xl font-semibold text-ink shadow-lift">
              {dev.logoInitials}
            </span>
            <div>
              <h1 className="font-display text-h1 font-medium tracking-tight text-paper">
                {dev.name}
              </h1>
              <p className="mt-1 flex items-center gap-3 text-sm text-paper/80">
                {dev.city} · Est. {dev.founded}
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-gold stroke-gold" />
                  {dev.rating}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-site py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            <p className="eyebrow">About the developer</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {dev.about}
            </p>

            <h2 className="font-display text-h3 mt-14 font-medium">
              Current projects
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {projs.map((pr) => (
                <Link
                  key={pr.id}
                  href={`/developers/projects/${pr.slug}`}
                  className="card-hover group block overflow-hidden rounded-2xl border border-line bg-raised shadow-card"
                >
                  <div className="img-zoom relative aspect-[16/10]">
                    <Image
                      src={pr.images[0]}
                      alt={pr.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge tone="inverted">{pr.status}</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold">
                      {pr.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      From {formatPrice(pr.priceFrom, pr.currency, true)} ·
                      Handover {pr.handover}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold">
              Delivery record
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Projects completed</dt>
                <dd className="font-medium">{dev.projects}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Units delivered</dt>
                <dd className="font-medium">{dev.unitsDelivered}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Buyer rating</dt>
                <dd className="font-medium">{dev.rating} / 5</dd>
              </div>
            </dl>
            <ButtonLink href="/contact" className="mt-6 w-full">
              Contact developer desk
            </ButtonLink>
          </aside>
        </div>
      </div>
    </>
  );
}
