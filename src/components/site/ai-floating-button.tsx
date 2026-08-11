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
        "fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 rounded-full p-2 pr-5 transition-all duration-300 hover:scale-[1.03] active:scale-95 group cursor-pointer",
        // Soft cool-toned Gemini-style gradient (sky, indigo, purple with subtle warm accent)
        "bg-[linear-gradient(110deg,#e0f2fe_0%,#e0e7ff_40%,#f3e8ff_75%,#fef3c7_100%)]",
        // Glass frosted effect & luminous subtle glow
        "backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgba(99,102,241,0.18),0_2px_8px_rgba(168,85,247,0.12)] hover:shadow-[0_12px_36px_rgba(99,102,241,0.28),0_4px_16px_rgba(168,85,247,0.2)]",
        "ring-1 ring-indigo-200/60 hover:ring-indigo-300"
      )}
    >
      {/* Icon Badge */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-500 text-white shadow-xs transition-transform duration-300 group-hover:rotate-6">
        <Sparkles size={18} fill="currentColor" className="text-amber-200" />
        <span className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping opacity-40" />
      </div>

      {/* Label */}
      <div className="flex flex-col text-left pr-0.5">
        <span className="text-[0.625rem] font-extrabold uppercase tracking-wider text-indigo-950/80 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
          AI Advisor
        </span>
        <span className="font-display text-xs font-bold text-slate-900 tracking-tight">
          Ask SpaceFlex AI
        </span>
      </div>
    </button>
  );
}
