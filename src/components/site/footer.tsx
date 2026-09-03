"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Explore rentals", href: "/properties" },
      { label: "New projects", href: "/developers" },
      { label: "Real estate agencies", href: "/agencies" },
      { label: "Compare properties", href: "/compare" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "The Journal", href: "/journal" },
      { label: "Market reports", href: "/reports" },
      { label: "Rental yield calculator", href: "/calculators" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SpaceFlex", href: "/about" },
      { label: "List with us", href: "/list-with-us" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about#careers" },
    ],
  },
  {
    title: "Districts",
    links: [
      { label: "West Bay", href: "/properties?district=West+Bay" },
      { label: "The Pearl Island", href: "/properties?district=The+Pearl+Island" },
      { label: "Lusail Marina", href: "/properties?district=Lusail+Marina" },
      { label: "Msheireb Downtown", href: "/properties?district=Msheireb+Downtown" },
      { label: "Al Waab", href: "/properties?district=Al+Waab" },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  /* The dashboard is an app surface — no marketing footer */
  if (pathname.startsWith("/dashboard")) return null;
  /* On the listing form, mobile is an app flow with a sticky action bar —
     hide the footer there; desktop keeps it. */
  const mobileHidden = pathname.startsWith("/list-property");

  return (
    <footer
      className={
        mobileHidden
          ? "hidden border-t border-line bg-surface md:block"
          : "border-t border-line bg-surface"
      }
    >
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Image
              src="/spaceflex-logo.svg"
              alt="SpaceFlex — Proptech Solutions"
              width={211}
              height={40}
              className="h-10 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The curated marketplace for premium property across Qatar.
              Verified agents, market intelligence, and homes worth the
              journey.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-faint">
              Doha · Lusail · The Pearl · Al Rayyan
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="eyebrow">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-xs text-faint md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SpaceFlex Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/legal" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/legal" className="transition-colors hover:text-ink">
              Terms
            </Link>
            <Link href="/legal" className="transition-colors hover:text-ink">
              Licensing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
