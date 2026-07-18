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

export function ContactCard({
  agent,
  context,
}: {
  agent: Agent;
  context: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-card">
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
            <Input
              id="cc-phone"
              type="tel"
              required
              placeholder="+974 5555 0100"
            />
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
            <Button type="button" variant="outline" className="w-full">
              <Phone size={15} />
              Call
            </Button>
            <Button type="button" variant="outline" className="w-full">
              <MessageCircle size={15} />
              WhatsApp
            </Button>
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
