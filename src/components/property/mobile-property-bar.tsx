"use client";

import { Phone, CalendarDays } from "lucide-react";
import { useScrollNav } from "@/lib/use-scroll-nav";
import { propertyPrice } from "@/lib/format";
import type { Property, Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useLeadCapture } from "@/lib/store/lead-store";
import { agencyForAgent } from "@/lib/data/agencies";

export function MobilePropertyBar({
  property,
  agent,
}: {
  property: Property;
  agent?: Agent;
}) {
  const navVisible = useScrollNav();
  const { openLeadModal } = useLeadCapture();

  const agency = agent
    ? agencyForAgent(agent.id) ||
      agencyForAgent(agent.name) ||
      agencyForAgent(agent.agency)
    : undefined;

  const handleCall = () => {
    openLeadModal({
      action: "call",
      agent: agent
        ? {
            id: agent.id,
            name: agent.name,
            phone: agent.phone,
            photo: agent.photo,
          }
        : undefined,
      agency: agency
        ? {
            id: agency.id,
            name: agency.name,
            slug: agency.slug,
          }
        : undefined,
      property: {
        id: property.id,
        title: property.title,
        price: propertyPrice(property, true),
      },
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const handleWhatsApp = () => {
    const advisorFirst = agent ? agent.name.split(" ")[0] : "Agent";
    openLeadModal({
      action: "whatsapp",
      agent: agent
        ? {
            id: agent.id,
            name: agent.name,
            phone: agent.phone,
            photo: agent.photo,
          }
        : undefined,
      agency: agency
        ? {
            id: agency.id,
            name: agency.name,
            slug: agency.slug,
          }
        : undefined,
      property: {
        id: property.id,
        title: property.title,
        price: propertyPrice(property, true),
      },
      defaultMessage: `Hi ${advisorFirst}, I'm interested in ${property.title} (${propertyPrice(property, true)}). I'd like more details.`,
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const handleRequestViewing = () => {
    openLeadModal({
      action: "viewing",
      agent: agent
        ? {
            id: agent.id,
            name: agent.name,
            phone: agent.phone,
            photo: agent.photo,
          }
        : undefined,
      agency: agency
        ? {
            id: agency.id,
            name: agency.name,
            slug: agency.slug,
          }
        : undefined,
      property: {
        id: property.id,
        title: property.title,
        price: propertyPrice(property, true),
      },
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-xl md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out will-change-transform",
        navVisible
          ? "translate-y-0 pointer-events-auto"
          : "translate-y-full pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between gap-2.5">
        {/* Price & Community */}
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-base font-bold text-ink leading-tight">
            {propertyPrice(property, true)}
          </p>
          <p className="truncate text-[0.6875rem] text-muted leading-tight mt-0.5">
            {property.community}
          </p>
        </div>

        {/* Lead Capture Routed Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCall}
            title={`Call ${agent ? agent.name : "Agent"}`}
            aria-label={`Call ${agent ? agent.name : "Agent"}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink hover:bg-brass-tint hover:text-brass transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Phone size={16} className="text-brass" />
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            title={`WhatsApp ${agent ? agent.name : "Agent"}`}
            aria-label={`WhatsApp ${agent ? agent.name : "Agent"}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs hover:bg-[#20bd5a] transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <WhatsAppIcon size={17} className="text-white" />
          </button>

          <button
            type="button"
            onClick={handleRequestViewing}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-paper shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <CalendarDays size={13} className="text-brass" />
            <span>Request viewing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
