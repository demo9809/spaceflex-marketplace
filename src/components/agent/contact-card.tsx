"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Check,
  Phone,
  CalendarDays,
} from "lucide-react";
import type { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useLeadCapture } from "@/lib/store/lead-store";
import { agencyForAgent } from "@/lib/data/agencies";
import { AgencyRating } from "@/components/agency/agency-rating";

export function ContactCard({
  agent,
  context,
}: {
  agent: Agent;
  context: string;
}) {
  const { openLeadModal, submitLead, savedProfile } = useLeadCapture();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `Hello ${agent.name.split(" ")[0]}, I'd like to arrange a viewing of ${context}.`
  );
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Match the agency for this agent
  const agency =
    agencyForAgent(agent.id) ||
    agencyForAgent(agent.name) ||
    agencyForAgent(agent.agency);

  // Pre-fill with stored session customer profile if available
  useEffect(() => {
    if (savedProfile) {
      if (savedProfile.name) setName(savedProfile.name);
      if (savedProfile.phone) setPhone(savedProfile.phone);
    }
  }, [savedProfile]);

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openLeadModal({
      action: "call",
      agent: {
        id: agent.id,
        name: agent.name,
        phone: agent.phone,
        photo: agent.photo,
      },
      agency: agency
        ? {
            id: agency.id,
            name: agency.name,
            slug: agency.slug,
          }
        : undefined,
      property: {
        id: context,
        title: context,
      },
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openLeadModal({
      action: "whatsapp",
      agent: {
        id: agent.id,
        name: agent.name,
        phone: agent.phone,
        photo: agent.photo,
      },
      agency: agency
        ? {
            id: agency.id,
            name: agency.name,
            slug: agency.slug,
          }
        : undefined,
      property: {
        id: context,
        title: context,
      },
      defaultMessage: `Hi ${agent.name.split(" ")[0]}, I'm interested in ${context}. I would like to know more.`,
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      // If empty, open the lead modal to guide the user with full date/time picking
      openLeadModal({
        action: "viewing",
        agent: {
          id: agent.id,
          name: agent.name,
          phone: agent.phone,
          photo: agent.photo,
        },
        agency: agency
          ? {
              id: agency.id,
              name: agency.name,
              slug: agency.slug,
            }
          : undefined,
        property: {
          id: context,
          title: context,
        },
        defaultMessage: message,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      return;
    }

    try {
      setSubmitting(true);
      await submitLead({
        customerName: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
        action: "viewing",
        propertyId: context,
        propertyName: context,
        agencyId: agency?.id,
        agencyName: agency?.name || agent.agency,
        agentId: agent.id,
        agentName: agent.name,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="enquire"
      className="overflow-hidden rounded-2xl border border-line bg-raised shadow-card scroll-mt-24"
    >
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
          {agency ? (
            <Link
              href={`/agencies/${agency.slug}`}
              className="block truncate text-xs text-muted hover:text-brass transition-colors"
            >
              {agency.name}
            </Link>
          ) : (
            <p className="truncate text-xs text-muted">{agent.agency}</p>
          )}

          {/* Unified dynamic agency rating */}
          <div className="mt-1 flex items-center gap-1.5">
            {agency ? (
              <AgencyRating
                agencyId={agency.id}
                variant="small"
                showCount={true}
              />
            ) : (
              <p className="flex items-center gap-1 text-xs text-muted">
                ★ {agent.rating} · {agent.reviews} reviews
              </p>
            )}
          </div>
        </div>
      </div>

      {sent ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-tint text-success">
            <Check size={22} />
          </div>
          <p className="font-display mt-4 text-lg font-semibold">
            Viewing request submitted
          </p>
          <p className="mt-1 text-sm text-muted">
            {agent.name.split(" ")[0]} typically {agent.responseTime.toLowerCase()}.
            A licensed advisor from {agency?.name || agent.agency} will contact you shortly to confirm the appointment.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-xs font-semibold text-brass hover:underline cursor-pointer"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="cc-name">Name</Label>
            <Input
              id="cc-name"
              required
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cc-phone">Phone</Label>
            <PhoneInput
              id="cc-phone"
              required
              value={phone}
              onChange={setPhone}
            />
          </div>
          <div>
            <Label htmlFor="cc-msg">Message</Label>
            <Textarea
              id="cc-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            <CalendarDays size={16} />
            {submitting ? "Sending enquiry..." : "Request viewing"}
          </Button>

          {/* Direct contact buttons routed through Lead Capture modal */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCallClick}
              className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-ink hover:bg-brass-tint hover:text-brass transition-all cursor-pointer active:scale-95"
            >
              <Phone size={15} className="text-brass" />
              <span>Call</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 text-xs font-semibold text-white hover:bg-[#20bd5a] transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <WhatsAppIcon size={16} className="text-white" />
              <span>WhatsApp</span>
            </button>
          </div>
          <p className="text-center text-[0.6875rem] leading-relaxed text-faint">
            By contacting you agree to our terms. Contact info is only shared
            with this verified Qatar-licensed brokerage.
          </p>
        </form>
      )}
    </div>
  );
}
