"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  Check,
  MessageCircle,
  Phone,
  Star,
  CalendarDays,
} from "lucide-react";
import type { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function ContactCard({
  agent,
  context,
}: {
  agent: Agent;
  context: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <div id="enquire" className="overflow-hidden rounded-2xl border border-line bg-raised shadow-card scroll-mt-24">
      <div className="flex items-center gap-4 border-b border-line p-5">
        <Link
          href={`/agents/${agent.slug}`}
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-brass-tint"
        >
          <Image
            src={agent.photo}
            alt={agent.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/agents/${agent.slug}`}
            className="flex items-center gap-1.5 font-medium hover:text-brass"
          >
            {agent.name}
            {agent.verified && (
              <BadgeCheck size={15} className="shrink-0 text-brass" />
            )}
          </Link>
          <p className="truncate text-xs text-muted">{agent.agency}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <Star size={11} className="fill-gold stroke-gold" />
            {agent.rating} · {agent.reviews} reviews
          </p>
        </div>
      </div>

      {sent ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-tint text-success">
            <Check size={22} />
          </div>
          <p className="font-display mt-4 text-lg font-semibold">
            Enquiry sent
          </p>
          <p className="mt-1 text-sm text-muted">
            {agent.name.split(" ")[0]} typically {agent.responseTime.toLowerCase()}.
            We&apos;ve emailed you a copy.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <Label htmlFor="cc-name">Name</Label>
            <Input id="cc-name" required placeholder="Your full name" />
          </div>
          <div>
            <Label htmlFor="cc-phone">Phone</Label>
            <PhoneInput id="cc-phone" required />
          </div>
          <div>
            <Label htmlFor="cc-msg">Message</Label>
            <Textarea
              id="cc-msg"
              defaultValue={`Hello ${agent.name.split(" ")[0]}, I'd like to arrange a viewing of ${context}.`}
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            <CalendarDays size={16} />
            Request viewing
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${(agent.phone || "+974 5555 0100").replace(/[^0-9+]/g, "")}`}
              className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-ink hover:bg-brass-tint hover:text-brass transition-all cursor-pointer"
            >
              <Phone size={15} className="text-brass" />
              <span>Call</span>
            </a>
            <a
              href={`https://wa.me/${(agent.phone || "+974 5555 0100").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${agent.name.split(" ")[0]}, I'd like to enquire about ${context}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 text-xs font-semibold text-white hover:bg-[#20bd5a] transition-all cursor-pointer shadow-2xs"
            >
              <WhatsAppIcon size={16} className="text-white" />
              <span>WhatsApp</span>
            </a>
          </div>
          <p className="text-center text-[0.6875rem] leading-relaxed text-faint">
            By enquiring you agree to our terms. Your number is only shared
            with this verified agent.
          </p>
        </form>
      )}
    </div>
  );
}
