"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { useSaved } from "@/lib/store/saved";

const nav = [
  { label: "Buy", href: "/properties?status=sale" },
  { label: "Rent", href: "/properties?status=rent" },
  { label: "New Projects", href: "/developers" },
  { label: "Agents", href: "/agents" },
];

const insights = [
  { label: "The Journal", href: "/journal", note: "Market stories & guides" },
  { label: "Market Reports", href: "/reports", note: "Quarterly research" },
  { label: "Calculators", href: "/calculators", note: "Mortgage & yield tools" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { saved } = useSaved();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[60]">
      {/* Background layer carries the blur so the fixed mobile menu
          below is not trapped by a backdrop-filter containing block. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-all duration-300",
          open
            ? "bg-paper"
            : scrolled
              ? "bg-paper/85 shadow-[0_1px_0_var(--line)] backdrop-blur-xl"
              : "bg-paper"
        )}
      />
      <div className="container-site relative flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link href="/" aria-label="SpaceFlex home" className="shrink-0">
          <Image
            src="/spaceflex-logo.svg"
            alt="SpaceFlex — Proptech Solutions"
            width={169}
            height={32}
            priority
            className="h-7 w-auto md:h-8"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brass-tint hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brass-tint hover:text-ink"
              aria-haspopup="true"
            >
              Insights
              <ChevronDown
                size={14}
                className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
              />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-line bg-raised p-2 shadow-lift">
                {insights.map((i) => (
                  <Link
                    key={i.label}
                    href={i.href}
                    className="block rounded-xl px-4 py-3 transition-colors hover:bg-brass-tint"
                  >
                    <span className="block text-sm font-medium">{i.label}</span>
                    <span className="block text-xs text-muted">{i.note}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/saved"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brass-tint md:flex"
            aria-label={`Saved properties (${saved.length})`}
          >
            <Heart size={18} />
            {saved.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brass px-1 text-[0.625rem] font-bold text-white">
                {saved.length}
              </span>
            )}
          </Link>
          <Link
            href="/signin"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brass-tint hover:text-ink md:block"
          >
            Sign in
          </Link>
          <ButtonLink href="/list-property" size="sm">
            <span className="lg:hidden">List property</span>
            <span className="hidden lg:inline">List a property</span>
          </ButtonLink>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brass-tint lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — fixed to viewport, above the tab bar */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-paper transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <nav aria-label="Mobile" className="container-site flex flex-col py-6">
          {[...nav, ...insights.map(({ label, href }) => ({ label, href }))].map(
            (item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "border-b border-line py-4 font-display text-2xl transition-all duration-300",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                )}
                style={{ transitionDelay: `${60 + i * 40}ms` }}
              >
                {item.label}
              </Link>
            )
          )}
          <div className="mt-8 flex flex-col gap-3 pb-24">
            <ButtonLink href="/list-property" size="lg">
              List a property
            </ButtonLink>
            <ButtonLink href="/signin" variant="outline" size="lg">
              Sign in
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
