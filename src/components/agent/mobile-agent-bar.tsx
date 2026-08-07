"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { useScrollNav } from "@/lib/use-scroll-nav";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function MobileAgentBar({ agent }: { agent: Agent }) {
  const navVisible = useScrollNav();
  const phone = agent.phone || "+974 5555 0100";
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-brass/20">
            <Image
              src={agent.photo}
              alt={agent.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs text-ink truncate leading-tight">
              {agent.name}
            </p>
            <p className="truncate text-[0.6875rem] text-muted leading-tight mt-0.5">
              {agent.agency}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${cleanPhone}`}
            className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-xs font-semibold text-ink hover:bg-brass-tint hover:text-brass transition-all active:scale-95 cursor-pointer"
          >
            <Phone size={14} className="text-brass" />
            <span>Call</span>
          </a>
          <a
            href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi ${agent.name.split(" ")[0]}, I found your profile on SpaceFlex.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#20bd5a] transition-all active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon size={15} className="text-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
