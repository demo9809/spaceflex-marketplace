"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  ArrowRight,
  Building2,
} from "lucide-react";
import { useAiAssistant, type ChatMessage } from "@/lib/store/ai-assistant-context";
import { propertyPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AiAssistantDrawer() {
  const { isOpen, closeAi, messages, isTyping, sendMessage, clearMessages } =
    useAiAssistant();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeAi();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAi]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeAi}
        aria-hidden="true"
        className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel (Desktop: Right Drawer, Mobile: Full-Screen) */}
      <div
        role="dialog"
        aria-label="SpaceFlex AI Assistant"
        className="fixed inset-y-0 right-0 z-[100] flex w-full flex-col bg-paper shadow-2xl transition-all duration-300 ease-out md:w-[420px] lg:w-[450px] animate-in slide-in-from-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0b241d] via-[#166246] via-[#248e67] to-[#d4af37] text-white shadow-md">
              <Sparkles size={18} fill="currentColor" className="animate-pulse text-amber-200" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-paper bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-ink text-base">
                  SpaceFlex AI
                </h3>
                <span className="rounded-full bg-brass-tint px-2 py-0.5 text-[0.625rem] font-bold text-brass uppercase tracking-wider">
                  Advisor
                </span>
              </div>
              <p className="text-xs text-muted">Personal Luxury Real Estate AI</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearMessages}
              title="Reset conversation"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-brass-tint hover:text-ink"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={closeAi}
              title="Close AI Assistant"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-brass-tint hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onPromptClick={(prompt) => sendMessage(prompt)}
              onCloseDrawer={closeAi}
            />
          ))}

          {/* Typing Loading Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 animate-in fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl border border-line bg-raised p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-brass">
                  <Sparkles size={13} className="animate-spin text-brass" />
                  <span>Searching premium Qatar listings…</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-brass animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-brass animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-brass animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-line bg-surface p-3 md:p-4">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SpaceFlex AI about property, location, ROI…"
              className="h-12 w-full rounded-2xl border border-line bg-paper pl-4 pr-12 text-sm font-medium placeholder:text-faint focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#166246] to-[#b39359] text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
          <p className="mt-2 text-center text-[0.625rem] text-faint">
            SpaceFlex AI Advisor · Real estate recommendations in Qatar
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Individual Message Bubble ── */
function MessageBubble({
  message,
  onPromptClick,
  onCloseDrawer,
}: {
  message: ChatMessage;
  onPromptClick: (p: string) => void;
  onCloseDrawer: () => void;
}) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-ink px-4 py-3 text-sm text-paper shadow-xs">
          <p className="leading-relaxed">{message.text}</p>
          <span className="mt-1 block text-right text-[0.625rem] opacity-60">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0b241d] via-[#166246] to-[#d4af37] text-amber-200 shadow-xs">
        <Sparkles size={15} fill="currentColor" />
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="rounded-2xl border border-line bg-raised p-4 shadow-xs">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink font-normal">
            {message.text}
          </p>
        </div>

        {/* Embedded Property Cards */}
        {message.properties && message.properties.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
              <Building2 size={12} className="text-brass" /> Recommended Properties
            </p>
            <div className="space-y-2">
              {message.properties.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.slug}`}
                  onClick={onCloseDrawer}
                  className="group flex gap-3 overflow-hidden rounded-2xl border border-line bg-paper p-2.5 shadow-xs transition-all hover:border-brass hover:shadow-md"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-1 top-1 rounded-md bg-ink/80 px-1.5 py-0.5 text-[0.5625rem] font-bold text-white uppercase">
                      {p.status === "sale" ? "Sale" : "Rent"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <p className="font-bold text-brass text-xs">
                        {propertyPrice(p)}
                      </p>
                      <h4 className="truncate text-xs font-semibold text-ink group-hover:text-brass transition-colors">
                        {p.title}
                      </h4>
                      <p className="truncate text-[0.6875rem] text-muted">
                        {p.community}, {p.city}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[0.625rem] text-faint">
                      <span>{p.beds} Beds · {p.baths} Baths · {p.areaSqft.toLocaleString()} sqft</span>
                      <span className="flex items-center gap-0.5 text-brass font-medium group-hover:translate-x-0.5 transition-transform">
                        View <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Quick Prompts */}
        {message.suggestedFollowups && message.suggestedFollowups.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestedFollowups.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onPromptClick(prompt)}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass hover:bg-brass-tint hover:text-brass text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
