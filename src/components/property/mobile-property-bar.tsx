"use client";

import { Phone } from "lucide-react";
import { useScrollNav } from "@/lib/use-scroll-nav";
import { propertyPrice } from "@/lib/format";
import type { Property, Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function MobilePropertyBar({
  property,
  agent,
}: {
  property: Property;
  agent?: Agent;
}) {
  const navVisible = useScrollNav();
  const phone = agent?.phone || "+974 5555 0100";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const waPhone = phone.replace(/[^0-9]/g, "");

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]",
        navVisible
          ? "bottom-16"
          : "bottom-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
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

        {/* Direct Action Buttons: Call, WhatsApp, Request Viewing */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={`tel:${cleanPhone}`}
            title={`Call ${agent ? agent.name : "Agent"}`}
            aria-label={`Call ${agent ? agent.name : "Agent"}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink hover:bg-brass-tint hover:text-brass transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Phone size={16} className="text-brass" />
          </a>

          <a
            href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi ${agent ? agent.name.split(" ")[0] : "Agent"}, I'm interested in ${property.title} (${propertyPrice(property, true)}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp ${agent ? agent.name : "Agent"}`}
            aria-label={`WhatsApp ${agent ? agent.name : "Agent"}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs hover:bg-[#20bd5a] transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <WhatsAppIcon size={17} className="text-white" />
          </a>

          <a
            href="#enquire"
            className="inline-flex h-10 items-center justify-center rounded-full bg-ink px-4 text-xs font-semibold text-paper shadow-xs transition-all active:scale-95 shrink-0"
          >
            Request viewing
          </a>
        </div>
      </div>
    </div>
  );
}
