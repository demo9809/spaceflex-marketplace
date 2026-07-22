import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/data/properties";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "SpaceFlex is Qatar's curated marketplace for premium property — West Bay, The Pearl, Lusail and beyond.",
};

const values = [
  {
    title: "Curation over volume",
    text: "Fewer than one in five submitted listings makes the platform. A smaller, honest inventory beats an endless, stale one.",
  },
  {
    title: "Data in the open",
    text: "Price history, comparables, response times, review counts. What our research desk knows, buyers see.",
  },
  {
    title: "Qatar, in depth",
    text: "One market, understood properly — freehold zones, usufruct areas, service charges and commute realities, district by district.",
  },
  {
    title: "Agents as partners",
    text: "We charge transparently, deliver verified leads, and build the tools agents actually ask for.",
  },
];

const milestones = [
  { year: "2023", event: "Founded in Doha; first 200 curated listings" },
  { year: "2024", event: "The Pearl and Lusail desks; verified-agent program" },
  { year: "2025", event: "Al Rayyan and Al Wakrah coverage; QAR 4.2B in placed transactions" },
  { year: "2026", event: "Research desk, Private Office and this redesign" },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-site py-16 md:py-24">
        <p className="eyebrow">About SpaceFlex</p>
        <h1 className="font-display text-h1 mt-4 max-w-3xl font-medium tracking-tight text-balance">
          Property platforms optimised for clicks. We optimised for the
          decision.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          SpaceFlex began with a simple observation: Qatar&apos;s property
          portals were built to maximise listings, not confidence. We built the
          opposite — a curated, verified, data-forward marketplace for people
          making one of the largest decisions of their lives, often before they
          have set foot in the country.
        </p>
      </section>

      <section className="container-site pb-16 md:pb-24">
        <Reveal>
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
            <Image
              src={IMG.officeCalm}
              alt="The SpaceFlex team at work"
              fill
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-site grid gap-10 py-16 sm:grid-cols-2 md:py-24 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <p className="font-display text-5xl font-medium text-brass-tint [-webkit-text-stroke:1.5px_var(--brass)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display mt-4 text-xl font-semibold">
                {v.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site py-16 md:py-24">
        <h2 className="font-display text-h2 font-medium tracking-tight">
          The road so far
        </h2>
        <ol className="mt-10 space-y-0 border-l-2 border-brass-tint">
          {milestones.map((m) => (
            <li key={m.year} className="relative pb-10 pl-8 last:pb-0">
              <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-paper bg-brass" />
              <p className="font-display text-2xl font-semibold">{m.year}</p>
              <p className="mt-1 text-muted">{m.event}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="careers" className="container-site pb-20 md:pb-28">
        <div className="rounded-3xl bg-ink px-6 py-14 text-center text-paper md:px-16">
          <p className="eyebrow">Careers</p>
          <h2 className="font-display text-h2 mx-auto mt-3 max-w-xl font-medium text-balance">
            We hire people who read the service-charge history.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-paper/70">
            Research, engineering, design and market desks across Doha and
            Lusail. Remote-friendly for the right person.
          </p>
          <ButtonLink href="/contact" variant="inverted" size="lg" className="mt-8">
            Get in touch
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
