"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Heart,
  Search,
  MessageCircle,
  Bell,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { useSaved } from "@/lib/store/saved";
import { useAuth } from "@/lib/store/auth";
import { properties } from "@/lib/data/properties";
import { PropertyCard } from "@/components/property/property-card";
import { MessagesPanel } from "./messages";
import { SignInForm } from "@/app/signin/signin-form";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: Search },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "viewings", label: "Viewings", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings },
];

const viewings = [
  {
    property: "Marina Sky Residence, Lusail",
    slug: "lusail-marina-sky-residence",
    date: "Sat 25 Jul",
    time: "10:30",
    agent: "Yasmin Al-Thani",
    status: "Confirmed",
  },
  {
    property: "Qanat Quartier Canal Townhouse",
    slug: "the-pearl-townhouse-qanat-quartier",
    date: "Sat 25 Jul",
    time: "14:00",
    agent: "James Whitfield",
    status: "Pending",
  },
];

export function DashboardView() {
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("tab") ?? "overview";
  const { saved } = useSaved();
  const { authed, hydrated, signOut } = useAuth();
  const savedItems = properties.filter((p) => saved.includes(p.id));

  if (!hydrated) {
    return (
      <div className="container-site py-14" aria-busy="true">
        <div className="skeleton h-8 w-52 rounded-full" />
        <div className="skeleton mt-6 h-64 w-full rounded-3xl" />
      </div>
    );
  }

  /* Demo gate: any credentials unlock the workspace */
  if (!authed) {
    return (
      <div className="container-site flex min-h-[calc(100dvh-9rem)] items-center justify-center py-10 md:min-h-[70vh]">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Members</p>
          <h1 className="font-display text-h2 mt-2 font-medium tracking-tight">
            Sign in to continue
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your inbox, saved homes and viewings live behind your account.
          </p>
          <div className="mt-8">
            <SignInForm redirect={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-6 md:py-14">
      {/* Heading collapses on mobile in Messages so the chat fills the screen */}
      <div
        className={cn(
          "flex-wrap items-end justify-between gap-4",
          tab === "messages" ? "hidden md:flex" : "flex"
        )}
      >
        <div>
          <p className="eyebrow">Buyer workspace</p>
          <h1 className="font-display text-h2 mt-2 font-medium tracking-tight">
            Good afternoon, Alex
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-raised transition-colors hover:bg-brass-tint"
            aria-label="Notifications (2 unread)"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
          </button>
          <button
            onClick={signOut}
            className="flex h-11 items-center gap-2 rounded-full border border-line bg-raised px-4 text-sm font-medium transition-colors hover:border-danger hover:bg-danger-tint hover:text-danger"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className={cn(
          "no-scrollbar flex gap-1 overflow-x-auto border-b border-line",
          tab === "messages" ? "mt-0 md:mt-8" : "mt-8"
        )}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => router.replace(`/dashboard?tab=${t.id}`)}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-brass text-ink"
                : "border-transparent text-muted hover:text-ink"
            )}
          >
            <t.icon size={15} />
            {t.label}
            {t.id === "messages" && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[0.6875rem] font-bold text-white">
                1
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-line bg-raised p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Saved properties
            </p>
            <p className="font-display mt-1 text-4xl font-semibold">
              {savedItems.length}
            </p>
            <ButtonLink href="/saved" variant="outline" size="sm" className="mt-4">
              View collection
            </ButtonLink>
          </div>
          <div className="rounded-2xl border border-line bg-raised p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Saved searches
            </p>
            <p className="font-display mt-1 text-4xl font-semibold">2</p>
            <p className="mt-2 text-sm text-muted">
              “Lusail · 2BR+ · under QAR 4.5M” has 3 new matches.
            </p>
          </div>
          <div className="rounded-2xl bg-ink p-6 text-paper shadow-card">
            <p className="text-xs uppercase tracking-[0.14em] text-paper/60">
              Next viewing
            </p>
            <p className="font-display mt-1 text-2xl font-semibold">
              Sat 25 Jul · 10:30
            </p>
            <p className="mt-1 text-sm text-paper/70">
              Marina Sky Residence with Yasmin Al-Thani
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-display mt-4 text-h3 font-medium">
              New matches for your search
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties
                .filter((p) => p.city === "Doha" && p.status === "sale")
                .slice(0, 3)
                .map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SAVED ── */}
      {tab === "saved" &&
        (savedItems.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-line-strong py-20 text-center">
            <p className="font-display text-2xl font-medium">No saved homes yet</p>
            <ButtonLink href="/properties" className="mt-6">
              Browse properties
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {savedItems.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ))}

      {/* ── MESSAGES ── */}
      {tab === "messages" && <MessagesPanel />}

      {/* ── VIEWINGS ── */}
      {tab === "viewings" && (
        <div className="mt-8 space-y-4">
          {viewings.map((v) => (
            <div
              key={v.property}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-raised p-5 shadow-card"
            >
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-brass-tint">
                <span className="text-xs font-medium uppercase text-muted">
                  {v.date.split(" ")[1]}
                </span>
                <span className="font-display text-xl font-semibold leading-none">
                  {v.date.split(" ")[2]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/properties/${v.slug}`}
                  className="font-medium hover:text-brass"
                >
                  {v.property}
                </Link>
                <p className="text-sm text-muted">
                  {v.time} · with {v.agent}
                </p>
              </div>
              <Badge tone={v.status === "Confirmed" ? "success" : "outline"}>
                {v.status}
              </Badge>
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === "settings" && (
        <div className="mt-8 max-w-xl space-y-5">
          {[
            {
              title: "Email alerts",
              desc: "New matches for saved searches, weekly digest.",
              on: true,
            },
            {
              title: "Price-change notifications",
              desc: "When a saved property changes price or status.",
              on: true,
            },
            {
              title: "WhatsApp updates",
              desc: "Viewing confirmations and agent replies.",
              on: false,
            },
            {
              title: "Quiet hours",
              desc: "No notifications between 21:00 and 08:00.",
              on: true,
            },
          ].map((s) => (
            <div
              key={s.title}
              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-raised p-5"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
              <button
                role="switch"
                aria-checked={s.on}
                aria-label={s.title}
                className={cn(
                  "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                  s.on ? "bg-brass" : "bg-line-strong"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 h-5 w-5 rounded-full bg-white shadow-card transition-all",
                    s.on ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={signOut}>
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
