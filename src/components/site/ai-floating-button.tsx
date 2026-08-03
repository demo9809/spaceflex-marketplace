"use client";

import { Sparkles } from "lucide-react";
import { useAiAssistant } from "@/lib/store/ai-assistant-context";
import { cn } from "@/lib/utils";

export function AiFloatingButton() {
  const { openAi, isOpen } = useAiAssistant();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={() => openAi()}
      aria-label="Open SpaceFlex AI Assistant"
      className={cn(
        "fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 rounded-full p-2 pr-5 text-white transition-all duration-300 hover:scale-105 active:scale-95 group",
        "bg-gradient-to-r from-[#0b241d] via-[#166246] via-[#248e67] to-[#d4af37]",
        "shadow-[0_0_30px_rgba(22,98,70,0.55),0_0_15px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(22,98,70,0.75),0_0_20px_rgba(212,175,55,0.5)] border border-white/20"
      )}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md">
        <Sparkles size={20} fill="currentColor" className="animate-pulse text-amber-200" />
        <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping opacity-60" />
      </div>
      <div className="flex flex-col text-left pr-0.5">
        <span className="text-[0.625rem] font-extrabold uppercase tracking-wider text-amber-300/90 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          AI Advisor
        </span>
        <span className="font-display text-xs font-bold text-white tracking-tight">
          Ask SpaceFlex AI
        </span>
      </div>
    </button>
  );
}
