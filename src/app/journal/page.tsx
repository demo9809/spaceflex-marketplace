import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/data/articles";
import { SectionHeading } from "@/components/site/section-heading";
import { RevealStagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Market intelligence, buyer guides and neighbourhood stories from the SpaceFlex research desk.",
};

export default function JournalPage() {
  const [lead, ...rest] = articles;

  return (
    <div className="container-site py-14 md:py-20">
      <SectionHeading
        eyebrow="The Journal"
        title="Read before you buy"
        description="Research-desk analysis, honest neighbourhood guides, and the numbers behind the region's property markets."
      />

      {/* Lead story */}
      <Link
        href={`/journal/${lead.slug}`}
        className="card-hover group grid overflow-hidden rounded-3xl border border-line bg-raised shadow-card lg:grid-cols-2"
      >
        <div className="img-zoom relative aspect-[16/10] lg:aspect-auto lg:min-h-96">
          <Image
            src={lead.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="eyebrow">{lead.category}</p>
          <h2 className="font-display text-h2 mt-3 font-medium tracking-tight text-balance">
            {lead.title}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{lead.excerpt}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-faint">
            {lead.author}, {lead.authorRole} ·{" "}
            {new Date(lead.date).toLocaleDateString("en", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {lead.readMinutes} min read
          </p>
        </div>
      </Link>

      <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((ar) => (
          <StaggerItem key={ar.id}>
            <Link
              href={`/journal/${ar.slug}`}
              className="card-hover group block h-full overflow-hidden rounded-2xl border border-line bg-raised shadow-card"
            >
              <div className="img-zoom relative aspect-[16/10]">
                <Image
                  src={ar.cover}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
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
    </div>
  );
}
