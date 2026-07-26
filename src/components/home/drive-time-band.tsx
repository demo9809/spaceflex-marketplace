import { Navigation, Home, GraduationCap, Briefcase, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const points = [
  { icon: Briefcase, text: "Pin the office, school and mall you visit most" },
  { icon: Clock, text: "Set one drive-time budget across every place" },
  { icon: Home, text: "See only the homes that reach them all" },
];

export function DriveTimeBand() {
  return (
    <section className="container-site py-20 md:py-28">
      <Reveal>
        <div className="grid overflow-hidden rounded-3xl border border-line bg-raised shadow-card lg:grid-cols-2">
          {/* Copy */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <p className="eyebrow flex items-center gap-2">
              <Navigation size={13} /> New · Commute Search
            </p>
            <h2 className="font-display text-h2 mt-3 font-medium tracking-tight text-balance">
              Search by how you actually live.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              A home is only as good as its longest daily trip. Tell us the
              places your week revolves around and we&apos;ll rank homes by the
              commute that really binds your day.
            </p>

            <ul className="mt-7 space-y-3.5">
              {points.map((p) => (
                <li key={p.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass">
                    <p.icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className="text-sm font-medium text-ink">{p.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <ButtonLink href="/drive-time" variant="brass" size="lg">
                <Navigation size={17} />
                Find homes by drive time
              </ButtonLink>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative min-h-[22rem] overflow-hidden bg-brand-deep lg:min-h-full">
            <div className="grain absolute inset-0" />
            {/* map grid */}
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(255 255 255 / 0.6) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.6) 1px, transparent 1px)",
                backgroundSize: "46px 46px",
                maskImage:
                  "radial-gradient(80% 80% at 50% 45%, black 40%, transparent 100%)",
              }}
            />
            {/* gold glow */}
            <div
              className="pointer-events-none absolute -right-16 top-6 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{
                background: "radial-gradient(closest-side, #ae8a4e, transparent)",
              }}
            />

            {/* dashed route */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <ellipse
                cx="34"
                cy="40"
                rx="20"
                ry="18"
                fill="rgb(92 174 140 / 0.12)"
                stroke="rgb(124 196 166 / 0.6)"
                strokeWidth="0.5"
                strokeDasharray="1.6 1.6"
              />
              <polyline
                points="34,40 66,34 56,68"
                fill="none"
                stroke="rgb(255 255 255 / 0.5)"
                strokeWidth="0.6"
                strokeDasharray="2 1.8"
                strokeLinecap="round"
              />
            </svg>

            {/* Hub A */}
            <Marker top="40%" left="34%" letter="A" tone="brass">
              <Briefcase size={15} />
            </Marker>
            {/* Hub B */}
            <Marker top="34%" left="66%" letter="B" tone="brass">
              <GraduationCap size={15} />
            </Marker>
            {/* Matching home */}
            <Marker top="68%" left="56%" tone="ink">
              <Home size={15} />
            </Marker>

            {/* floating time chips */}
            <span className="absolute left-[42%] top-[30%] rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-ink shadow-lift">
              12 min
            </span>
            <span className="absolute left-[63%] top-[52%] rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-ink shadow-lift">
              9 min
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Marker({
  top,
  left,
  letter,
  tone,
  children,
}: {
  top: string;
  left: string;
  letter?: string;
  tone: "brass" | "ink";
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ top, left }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white shadow-lift ${
            tone === "brass" ? "bg-brass" : "bg-ink"
          }`}
        >
          {children}
        </div>
        {letter && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-paper text-[0.625rem] font-bold text-ink ring-2 ring-brand-deep">
            {letter}
          </span>
        )}
      </div>
    </div>
  );
}
