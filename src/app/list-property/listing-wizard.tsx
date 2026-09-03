"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  MapPin,
  Sparkles,
  Trash2,
  Video,
  FileText,
  PartyPopper,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const steps = ["Basics", "Details", "Location", "Media & publish"];

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Townhouse", "Duplex", "Office"];
const currencies = ["QAR"];
const furnishings = ["Unfurnished", "Semi-furnished", "Furnished"];
const conditions = ["New / off-plan", "Recently renovated", "Well maintained", "As-is"];
const countries: Record<string, string[]> = {
  Qatar: [
    "Doha",
    "Lusail",
    "Al Rayyan",
    "Al Wakrah",
    "Al Khor",
    "Umm Salal",
    "Al Daayen",
  ],
};
const amenityOptions = [
  "Pool", "Gym", "Concierge", "Covered parking", "Balcony", "Garden",
  "Maid's room", "Smart home", "Beach access", "Pet friendly", "Sea view",
  "Elevator", "Security 24/7", "Children's play area",
];

interface Draft {
  status: "sale" | "rent";
  type: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  beds: string;
  baths: string;
  area: string;
  year: string;
  furnishing: string;
  condition: string;
  parking: string;
  amenities: string[];
  country: string;
  city: string;
  community: string;
  address: string;
  videoUrl: string;
  plan: "standard" | "featured";
}

const empty: Draft = {
  status: "rent",
  type: "",
  title: "",
  description: "",
  price: "",
  currency: "QAR",
  beds: "2",
  baths: "2",
  area: "",
  year: "",
  furnishing: "Unfurnished",
  condition: "Well maintained",
  parking: "1",
  amenities: [],
  country: "Qatar",
  city: "Doha",
  community: "",
  address: "",
  videoUrl: "",
  plan: "standard",
};

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-muted hover:border-ink hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

export function ListingWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [published, setPublished] = useState(false);
  const [touchedNext, setTouchedNext] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return draft.type !== "" && draft.title.trim().length >= 10;
      case 1:
        return draft.price !== "" && Number(draft.price) > 0 && draft.area !== "";
      case 2:
        return draft.community.trim() !== "" && draft.address.trim() !== "";
      case 3:
        return photos.length > 0;
      default:
        return true;
    }
  }, [step, draft, photos]);

  function next() {
    if (!stepValid) {
      setTouchedNext(true);
      return;
    }
    setTouchedNext(false);
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
    } else {
      setPublished(true);
      window.scrollTo({ top: 0 });
    }
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = [...photos];
    Array.from(files)
      .slice(0, 20 - photos.length)
      .forEach((f) => {
        if (f.type.startsWith("image/")) {
          next.push({ name: f.name, url: URL.createObjectURL(f) });
        }
      });
    setPhotos(next);
  }

  if (published) {
    return (
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success-tint text-success">
          <PartyPopper size={34} strokeWidth={1.6} />
        </span>
        <h1 className="font-display text-h1 mt-8 font-medium tracking-tight">
          Listing submitted
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          <span className="font-medium text-ink">{draft.title}</span> is in
          review. Our editors check every submission — expect approval within
          one working day, then it goes live
          {draft.plan === "featured" && " with featured placement"}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/dashboard" size="lg">
            Go to dashboard
          </ButtonLink>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setDraft(empty);
              setPhotos([]);
              setStep(0);
              setPublished(false);
            }}
          >
            List another property
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site pb-40 pt-8 md:py-14">
     <div className="mx-auto max-w-3xl">
      <p className="eyebrow">Create a listing</p>
      <h1 className="font-display text-h2 mt-2 font-medium tracking-tight">
        List your property
      </h1>

      {/* Progress */}
      <ol className="mt-8 flex items-center gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-2">
            <span
              className={cn(
                "h-1.5 rounded-full transition-colors duration-300",
                i <= step ? "bg-brass" : "bg-line"
              )}
            />
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                i === step ? "text-ink" : "text-faint"
              )}
            >
              {i + 1}. {s}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-muted sm:hidden">
        Step {step + 1} of {steps.length} · {steps[step]}
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-raised p-6 shadow-card md:p-8">
        {/* ── STEP 1: BASICS ── */}
        {step === 0 && (
          <div className="space-y-7">


            <div>
              <Label>Property type</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((t) => (
                  <Chip key={t} active={draft.type === t} onClick={() => set("type", t)}>
                    {t}
                  </Chip>
                ))}
              </div>
              {touchedNext && draft.type === "" && (
                <p className="mt-2 text-xs font-medium text-danger">
                  Choose a property type.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lw-title">Listing title</Label>
              <Input
                id="lw-title"
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                maxLength={100}
                placeholder="e.g. Corner two-bedroom with marina view, Porto Arabia"
              />
              <p className="mt-1.5 flex justify-between text-xs text-faint">
                <span>
                  {touchedNext && draft.title.trim().length < 10 ? (
                    <span className="font-medium text-danger">
                      At least 10 characters.
                    </span>
                  ) : (
                    "Lead with the property's one unforgettable feature."
                  )}
                </span>
                <span>{draft.title.length}/100</span>
              </p>
            </div>

            <div>
              <Label htmlFor="lw-desc">Description</Label>
              <Textarea
                id="lw-desc"
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                maxLength={1000}
                placeholder="Layout, light, view, building, neighbourhood. Buyers read every word — skip the clichés."
                className="min-h-32"
              />
              <p className="mt-1.5 text-right text-xs text-faint">
                {draft.description.length}/1000
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2: DETAILS ── */}
        {step === 1 && (
          <div className="space-y-7">
            <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
              <div>
                <Label htmlFor="lw-price">
                  {draft.status === "sale" ? "Asking price" : "Monthly rent"}
                </Label>
                <Input
                  id="lw-price"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={draft.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. 3850000"
                />
                {touchedNext && (draft.price === "" || Number(draft.price) <= 0) && (
                  <p className="mt-1.5 text-xs font-medium text-danger">
                    Enter a price.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lw-currency">Currency</Label>
                <Select
                  id="lw-currency"
                  value={draft.currency}
                  onChange={(e) => set("currency", e.target.value)}
                >
                  {currencies.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="lw-beds">Bedrooms</Label>
                <Select
                  id="lw-beds"
                  value={draft.beds}
                  onChange={(e) => set("beds", e.target.value)}
                >
                  {["0", "1", "2", "3", "4", "5", "6+"].map((b) => (
                    <option key={b} value={b}>
                      {b === "0" ? "Studio / N.A." : b}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lw-baths">Bathrooms</Label>
                <Select
                  id="lw-baths"
                  value={draft.baths}
                  onChange={(e) => set("baths", e.target.value)}
                >
                  {["1", "2", "3", "4", "5", "6+"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lw-area">Size (sqft)</Label>
                <Input
                  id="lw-area"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={draft.area}
                  onChange={(e) => set("area", e.target.value)}
                  placeholder="1720"
                />
              </div>
              <div>
                <Label htmlFor="lw-year">Year built</Label>
                <Input
                  id="lw-year"
                  type="number"
                  inputMode="numeric"
                  value={draft.year}
                  onChange={(e) => set("year", e.target.value)}
                  placeholder="2023"
                />
              </div>
            </div>
            {touchedNext && draft.area === "" && (
              <p className="-mt-4 text-xs font-medium text-danger">
                Built size is required.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="lw-furnishing">Furnishing</Label>
                <Select
                  id="lw-furnishing"
                  value={draft.furnishing}
                  onChange={(e) => set("furnishing", e.target.value)}
                >
                  {furnishings.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lw-condition">Condition</Label>
                <Select
                  id="lw-condition"
                  value={draft.condition}
                  onChange={(e) => set("condition", e.target.value)}
                >
                  {conditions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lw-parking">Parking bays</Label>
                <Select
                  id="lw-parking"
                  value={draft.parking}
                  onChange={(e) => set("parking", e.target.value)}
                >
                  {["0", "1", "2", "3", "4", "5+"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label>
                Amenities{" "}
                <span className="font-normal text-faint">
                  ({draft.amenities.length} selected)
                </span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((a) => (
                  <Chip
                    key={a}
                    active={draft.amenities.includes(a)}
                    onClick={() =>
                      set(
                        "amenities",
                        draft.amenities.includes(a)
                          ? draft.amenities.filter((x) => x !== a)
                          : [...draft.amenities, a]
                      )
                    }
                  >
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: LOCATION ── */}
        {step === 2 && (
          <div className="space-y-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="lw-country">Country</Label>
                <Select
                  id="lw-country"
                  value={draft.country}
                  onChange={(e) => {
                    set("country", e.target.value);
                    set("city", countries[e.target.value][0]);
                  }}
                >
                  {Object.keys(countries).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lw-city">City</Label>
                <Select
                  id="lw-city"
                  value={draft.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  {countries[draft.country].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="lw-community">Community / district</Label>
              <Input
                id="lw-community"
                value={draft.community}
                onChange={(e) => set("community", e.target.value)}
                placeholder="e.g. The Pearl Island, Porto Arabia"
              />
              {touchedNext && draft.community.trim() === "" && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  Community is required.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lw-address">Address</Label>
              <Input
                id="lw-address"
                value={draft.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Building, street, unit (kept private until enquiry)"
              />
              {touchedNext && draft.address.trim() === "" && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  Address is required.
                </p>
              )}
            </div>

            <div className="relative flex aspect-[16/6] items-center justify-center overflow-hidden rounded-2xl border border-line bg-[#eef1ea]">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-lift">
                  <MapPin size={18} />
                </span>
                <p className="mt-2 rounded-full bg-raised/95 px-4 py-1.5 text-xs font-medium shadow-card">
                  {draft.community || "Pin appears here"}
                  {draft.community && `, ${draft.city}`}
                </p>
              </div>
            </div>
            <p className="text-xs text-faint">
              Exact address is shown only to enquiring buyers you approve.
            </p>
          </div>
        )}

        {/* ── STEP 4: MEDIA & PUBLISH ── */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <Label>
                Photos{" "}
                <span className="font-normal text-faint">
                  ({photos.length}/20 · first photo is the cover)
                </span>
              </Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
                aria-label="Upload photos"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong py-10 text-muted transition-colors hover:border-brass hover:bg-brass-tint/40 hover:text-ink"
              >
                <ImagePlus size={26} strokeWidth={1.6} />
                <span className="text-sm font-medium">
                  Drag photos here or tap to upload
                </span>
                <span className="text-xs text-faint">
                  JPG or PNG · shoot at dawn or dusk, lamps on
                </span>
              </button>
              {touchedNext && photos.length === 0 && (
                <p className="mt-2 text-xs font-medium text-danger">
                  Add at least one photo.
                </p>
              )}
              {photos.length > 0 && (
                <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {photos.map((ph, i) => (
                    <li key={ph.url} className="group relative">
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-line">
                        {/* object URLs can't go through next/image optimization */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ph.url}
                          alt={ph.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </span>
                      {i === 0 && (
                        <Badge tone="brass" className="absolute left-1.5 top-1.5">
                          Cover
                        </Badge>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos(photos.filter((x) => x.url !== ph.url))
                        }
                        aria-label={`Remove ${ph.name}`}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-raised text-muted shadow-card transition-colors hover:bg-danger-tint hover:text-danger"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <Label htmlFor="lw-video">
                <span className="flex items-center gap-1.5">
                  <Video size={14} className="text-brass" />
                  Video tour URL{" "}
                  <span className="font-normal text-faint">(optional)</span>
                </span>
              </Label>
              <Input
                id="lw-video"
                type="url"
                value={draft.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="YouTube or Vimeo link"
              />
            </div>

            {/* Plan */}
            <div>
              <Label>Visibility plan</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      id: "standard",
                      name: "Standard",
                      price: "Free",
                      desc: "Live in search after editorial review.",
                    },
                    {
                      id: "featured",
                      name: "Featured · 30 days",
                      price: "QAR 180",
                      desc: "Homepage carousel and top of search. Median time to offer: 9 days.",
                    },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set("plan", p.id)}
                    aria-pressed={draft.plan === p.id}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      draft.plan === p.id
                        ? "border-brass bg-brass-tint shadow-card"
                        : "border-line hover:border-ink"
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        {p.id === "featured" && (
                          <Sparkles size={14} className="text-brass" />
                        )}
                        {p.name}
                      </span>
                      <span className="font-display text-lg font-semibold">
                        {p.price}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review summary */}
            <div className="rounded-2xl bg-surface p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <FileText size={15} className="text-brass" />
                Review
              </p>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Listing</dt>
                  <dd className="truncate font-medium">{draft.title || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Type</dt>
                  <dd className="font-medium">
                    {draft.type || "—"} · Rent
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Price</dt>
                  <dd className="font-medium">
                    {draft.price
                      ? formatPrice(Number(draft.price), draft.currency, true) +
                        (draft.status === "rent" ? "/month" : "")
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Location</dt>
                  <dd className="truncate font-medium">
                    {draft.community ? `${draft.community}, ${draft.city}` : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Specs</dt>
                  <dd className="font-medium">
                    {draft.beds === "0" ? "Studio" : `${draft.beds} bed`} ·{" "}
                    {draft.baths} bath · {draft.area || "—"} sqft
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Amenities</dt>
                  <dd className="font-medium">{draft.amenities.length} selected</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-faint">
        Every listing passes editorial review before going live — typically
        within one working day.
      </p>

      {/* Nav — app-style sticky bar on mobile, inline on desktop */}
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-xl md:static md:z-auto md:mt-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl items-center gap-3 md:justify-between">
          {step > 0 ? (
            <Button
              variant="outline"
              size="lg"
              className="md:h-11 md:px-6"
              onClick={() => {
                setTouchedNext(false);
                setStep(step - 1);
                window.scrollTo({ top: 0 });
              }}
            >
              <ArrowLeft size={15} />
              Back
            </Button>
          ) : (
            <span className="hidden md:block" />
          )}
          <Button onClick={next} size="lg" className="flex-1 md:min-w-40 md:flex-none">
            {step === steps.length - 1 ? (
              <>
                <Check size={16} />
                Submit listing
              </>
            ) : (
              <>
                Continue · {steps[Math.min(step + 1, steps.length - 1)]}
                <ArrowRight size={15} />
              </>
            )}
          </Button>
        </div>
      </div>
     </div>
    </div>
  );
}
