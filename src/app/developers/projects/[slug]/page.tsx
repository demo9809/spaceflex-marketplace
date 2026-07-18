import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, CalendarDays, Landmark, ChevronRight } from "lucide-react";
import { projects, getProject, getDeveloper } from "@/lib/data/developers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/property/gallery";
import { formatPrice } from "@/lib/format";
import { InterestForm } from "./interest-form";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pr = getProject(slug);
  if (!pr) return {};
  return { title: pr.name, description: pr.about.slice(0, 160) };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pr = getProject(slug);
  if (!pr) notFound();
  const dev = getDeveloper(pr.developerId)!;

  return (
    <div className="container-site pt-4 md:pt-6">
      <nav aria-label="Breadcrumb" className="mb-4 hidden md:block">
        <ol className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
          <li>
            <Link href="/developers" className="transition-colors hover:text-ink">
              New Projects
            </Link>
          </li>
          <ChevronRight size={13} aria-hidden />
          <li>
            <Link
              href={`/developers/${dev.slug}`}
              className="transition-colors hover:text-ink"
            >
              {dev.name}
            </Link>
          </li>
          <ChevronRight size={13} aria-hidden />
          <li aria-current="page" className="text-ink">
            {pr.name}
          </li>
        </ol>
      </nav>

      <div className="relative">
        <Gallery images={pr.images} title={pr.name} />
      </div>

      <div className="grid gap-10 py-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brass">{pr.status}</Badge>
            <Badge tone="outline">{pr.city}, {pr.country}</Badge>
          </div>
          <h1 className="font-display text-h1 mt-3 font-medium tracking-tight">
            {pr.name}
          </h1>
          <p className="mt-2 text-muted">
            by{" "}
            <Link
              href={`/developers/${dev.slug}`}
              className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-4 hover:text-brass"
            >
              {dev.name}
            </Link>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-raised p-4">
              <Landmark size={17} className="text-brass" strokeWidth={1.8} />
              <p className="mt-2.5 text-xs uppercase tracking-[0.12em] text-muted">
                From
              </p>
              <p className="mt-0.5 font-medium">
                {formatPrice(pr.priceFrom, pr.currency, true)}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-raised p-4">
              <CalendarDays size={17} className="text-brass" strokeWidth={1.8} />
              <p className="mt-2.5 text-xs uppercase tracking-[0.12em] text-muted">
                Handover
              </p>
              <p className="mt-0.5 font-medium">{pr.handover}</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-line bg-raised p-4 sm:col-span-1">
              <Check size={17} className="text-brass" strokeWidth={1.8} />
              <p className="mt-2.5 text-xs uppercase tracking-[0.12em] text-muted">
                Unit mix
              </p>
              <p className="mt-0.5 text-sm font-medium">{pr.types.join(" · ")}</p>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="font-display text-h3 font-medium">The project</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              {pr.about}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-h3 font-medium">Amenities</h2>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {pr.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass-tint text-brass">
                    <Check size={13} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-2xl bg-ink p-6 text-paper md:p-8">
            <h2 className="font-display text-xl font-semibold">Payment plan</h2>
            <p className="mt-2 text-paper/75">{pr.paymentPlan}</p>
            <Button variant="inverted" className="mt-5">
              Download brochure (PDF)
            </Button>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <InterestForm projectName={pr.name} />
        </aside>
      </div>
    </div>
  );
}
