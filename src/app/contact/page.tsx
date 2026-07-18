import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the SpaceFlex team — buyer support, agent partnerships, press and the Private Office.",
};

const offices = [
  {
    city: "Doha · HQ",
    lines: ["Tornado Tower, Level 22", "West Bay, Doha, Qatar"],
    phone: "+974 4000 1200",
  },
  {
    city: "Dubai",
    lines: ["Index Tower, Level 9", "DIFC, Dubai, UAE"],
    phone: "+971 4 550 8800",
  },
];

export default function ContactPage() {
  return (
    <div className="container-site grid gap-14 py-14 md:py-20 lg:grid-cols-[1fr_24rem]">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="font-display text-h1 mt-2 font-medium tracking-tight">
          Talk to a human
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          Buyer questions, agent partnerships, press, or a discreet Private
          Office enquiry — this form reaches the right desk. We reply within
          one working day.
        </p>
        <div className="mt-10 max-w-xl">
          <ContactForm />
        </div>
      </div>

      <aside className="space-y-6 lg:pt-24">
        {offices.map((o) => (
          <div
            key={o.city}
            className="rounded-2xl border border-line bg-raised p-6 shadow-card"
          >
            <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
              <MapPin size={16} className="text-brass" />
              {o.city}
            </h2>
            {o.lines.map((l) => (
              <p key={l} className="mt-1 text-sm text-muted">
                {l}
              </p>
            ))}
            <p className="mt-3 flex items-center gap-2 text-sm font-medium">
              <Phone size={14} className="text-brass" />
              {o.phone}
            </p>
          </div>
        ))}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Mail size={14} className="text-brass" />
            hello@spaceflex.com
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Clock size={14} className="text-brass" />
            Sun–Thu, 08:00–18:00 AST
          </p>
        </div>
      </aside>
    </div>
  );
}
