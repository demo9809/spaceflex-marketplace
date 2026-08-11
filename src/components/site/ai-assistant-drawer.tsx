"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  ArrowRight,
  Building2,
  Mic,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
  Plus,
  MessageSquare,
  ChevronRight,
  Filter,
  MapPin,
} from "lucide-react";
import { useAiAssistant, type ChatMessage } from "@/lib/store/ai-assistant-context";
import { propertyPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const CATEGORIES = ["For You", "Villas", "Apartments", "Investment", "Beachfront"] as const;

const SUGGESTIONS_BY_CATEGORY: Record<string, string[]> = {
  "For You": [
    "Find me a luxury villa under QAR 4.5M in Lusail.",
    "Show beachfront apartments in Viva Bahriya, The Pearl.",
    "Recommend high rental yield investment properties (>8% ROI).",
    "Find family residences near top international schools.",
  ],
  Villas: [
    "Find me a villa under QAR 4M in Lusail.",
    "Luxury standalone villa with private pool and garden.",
    "Family compound villa in Al Waab near Education City.",
    "Modern townhouse for sale in Fox Hills Lusail.",
  ],
  Apartments: [
    "Sea view 2-bedroom apartment in Viva Bahriya.",
    "Serviced 1-bedroom apartment in West Bay skyline.",
    "Furnished apartment for rent under QAR 12k/month.",
    "Penthouse with private balcony & marina views.",
  ],
  Investment: [
    "High rental yield investment properties (>8% net ROI).",
    "Off-plan projects with 5-year flexible payment plan.",
    "Prime commercial space in Msheireb Downtown.",
    "Residency-eligible luxury properties above QAR 3.65M.",
  ],
  Beachfront: [
    "Waterfront chalet in Qetaifan Island North.",
    "Direct beach access apartment in Viva Bahriya.",
    "Marina berth apartment in Porto Arabia.",
    "Seaview penthouses in Pearl Qatar.",
  ],
};

export function AiAssistantDrawer() {
  const {
    isOpen,
    closeAi,
    messages,
    isTyping,
    sendMessage,
    clearMessages,
    activeTab,
    setActiveTab,
    historySessions,
    loadHistorySession,
    deleteHistorySession,
    startNewChat,
    isWide,
    toggleWide,
    activeCategory,
    setActiveCategory,
  } = useAiAssistant();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
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
    if (isOpen && activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Speech recognition simulation or Web Speech API
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      try {
        const SpeechRec = (window as unknown as { SpeechRecognition: new () => { start: () => void; onresult: (e: { results: Array<Array<{ transcript: string }>> }) => void; onerror: () => void; onend: () => void } }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: new () => { start: () => void; onresult: (e: { results: Array<Array<{ transcript: string }>> }) => void; onerror: () => void; onend: () => void } }).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        return;
      } catch {
        // Fallback simulation
      }
    }

    // Simulated mic action if native speech API is unavailable
    setIsListening(true);
    setTimeout(() => {
      setInput("Villas to buy in Lusail under QAR 4.5M");
      setIsListening(false);
    }, 2000);
  };

  const isInitialWelcome = messages.length <= 1;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeAi}
        aria-hidden="true"
        className="fixed inset-0 z-[99] bg-black/40 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none transition-opacity duration-300 animate-in fade-in"
      />

      {/* Floating Drawer Panel (Desktop: Right Floating Panel with margins & rounded corners, Mobile: Full-Screen) */}
      <div
        role="dialog"
        aria-label="SpaceFlex AI Assistant"
        className={cn(
          "fixed z-[100] flex flex-col bg-paper transition-all duration-300 ease-out shadow-[0_20px_60px_-15px_rgba(8,40,34,0.25)] md:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.25),0_0_1px_rgba(0,0,0,0.2)] border border-line/80",
          // Mobile layout: full height attached right
          "top-0 bottom-0 right-0 w-full",
          // Desktop layout: floating card with matching top, bottom, and right side gaps!
          "md:top-4 md:bottom-4 md:right-4 md:w-[440px] lg:w-[480px] md:rounded-[28px] md:overflow-hidden",
          isWide && "md:w-[620px] lg:w-[680px]",
          "animate-in slide-in-from-right-8"
        )}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-line/70 bg-surface/80 backdrop-blur-md px-4 py-3 shrink-0">
          {/* Chat / History Pill Segment Control */}
          <div className="flex items-center gap-1 rounded-full bg-line/40 p-1 border border-line/50">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                activeTab === "chat"
                  ? "bg-paper text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              )}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer",
                activeTab === "history"
                  ? "bg-paper text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              )}
            >
              History
              {historySessions.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brass-tint text-[0.625rem] font-bold text-brass">
                  {historySessions.length}
                </span>
              )}
            </button>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center gap-1">
            {activeTab === "chat" && (
              <button
                type="button"
                onClick={clearMessages}
                title="Reset conversation"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-brass-tint hover:text-brass cursor-pointer"
              >
                <RotateCcw size={15} />
              </button>
            )}

            <button
              type="button"
              onClick={toggleWide}
              title={isWide ? "Collapse drawer width" : "Expand drawer width"}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-brass-tint hover:text-brass cursor-pointer"
            >
              {isWide ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>

            <button
              type="button"
              onClick={closeAi}
              title="Close AI Assistant"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-brass-tint hover:text-brass cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === "history" ? (
          /* History Session View */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <div>
                <h3 className="font-display font-bold text-ink text-sm">Chat History</h3>
                <p className="text-[0.6875rem] text-muted">Your past property consultations</p>
              </div>
              <button
                type="button"
                onClick={startNewChat}
                className="flex items-center gap-1.5 rounded-full bg-brass px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus size={14} /> New Chat
              </button>
            </div>

            {historySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-muted mb-3">
                  <MessageSquare size={20} />
                </div>
                <p className="text-sm font-semibold text-ink">No saved chats yet</p>
                <p className="mt-1 text-xs text-muted max-w-[240px]">
                  Start asking SpaceFlex AI about property, location, and ROI to build your history.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {historySessions.map((session) => (
                  <div
                    key={session.id}
                    className="group relative flex items-center justify-between rounded-2xl border border-line bg-surface/40 p-3.5 transition-all hover:border-brass/50 hover:bg-paper hover:shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => loadHistorySession(session.id)}
                      className="flex flex-1 flex-col text-left pr-8 cursor-pointer"
                    >
                      <span className="font-semibold text-xs text-ink group-hover:text-brass transition-colors line-clamp-1">
                        {session.title}
                      </span>
                      <span className="text-[0.6875rem] text-muted line-clamp-1 mt-0.5">
                        {session.preview}
                      </span>
                      <span className="text-[0.625rem] text-faint mt-1">
                        {session.date}
                      </span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => deleteHistorySession(session.id)}
                        title="Delete chat session"
                        className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-danger-tint hover:text-danger transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={16} className="text-faint group-hover:text-brass transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Chat Stream View */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar flex flex-col">
            {isInitialWelcome ? (
              /* Hostinger Reference Style Initial Welcome State */
              <div className="flex-1 flex flex-col justify-between py-2 space-y-5 animate-in fade-in">
                {/* Centered AI Greeting Hero */}
                <div className="flex flex-col items-center justify-center text-center pt-5 px-2">
                  <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full overflow-hidden ring-4 ring-indigo-200/80 shadow-[0_8px_24px_rgba(99,102,241,0.35)]">
                    <Image
                      src="/ai-avatar.png"
                      alt="SpaceFlex AI"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink flex items-center gap-1.5">
                    Hello Guest 👋
                  </h2>
                  <p className="mt-1 text-xs font-medium text-muted max-w-[280px]">
                    How can I help you today?
                  </p>
                </div>

                {/* Smart Action Prompts List */}
                <div className="space-y-2.5 px-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Sparkles size={12} className="text-brass" />
                      Suggested Prompts
                    </span>
                    <span className="text-[0.625rem] text-faint flex items-center gap-1">
                      <Filter size={10} /> {activeCategory}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(SUGGESTIONS_BY_CATEGORY[activeCategory] || SUGGESTIONS_BY_CATEGORY["For You"]).map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full flex items-center justify-between rounded-2xl border border-line bg-surface/50 p-3 text-left transition-all hover:border-brass/40 hover:bg-brass-tint/60 hover:shadow-xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-paper text-brass border border-line shadow-2xs group-hover:bg-brass group-hover:text-white transition-colors">
                            <Sparkles size={13} fill="currentColor" className="text-brass group-hover:text-white" />
                          </div>
                          <span className="text-xs font-medium text-ink truncate">
                            {prompt}
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-faint group-hover:text-brass shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Pill Filters */}
                <div className="pt-1">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 border cursor-pointer",
                          activeCategory === cat
                            ? "bg-brass text-white border-brass shadow-xs"
                            : "bg-surface text-muted border-line hover:border-brass/40 hover:text-ink"
                        )}
                      >
                        {cat === "For You" ? `✨ ${cat}` : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Active Chat Stream Messages */
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onPromptClick={handlePromptClick}
                    onCloseDrawer={closeAi}
                  />
                ))}

                {/* Typing Loading Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3 animate-in fade-in">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brass-tint text-brass">
                      <Bot size={16} />
                    </div>
                    <div className="rounded-2xl border border-line bg-surface/80 p-3.5 shadow-xs">
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
            )}
          </div>
        )}

        {/* Input Bar (Modern Inset Rounded Card Container) */}
        {activeTab === "chat" && (
          <div className="shrink-0 border-t border-line/60 bg-surface/50 p-3 md:p-4">
            <div className="relative rounded-3xl border-2 border-line bg-paper p-3 transition-all duration-200 focus-within:border-brass/60 focus-within:ring-4 focus-within:ring-brass/10 shadow-xs">
              <form onSubmit={handleSend} className="flex flex-col gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                  placeholder="Ask SpaceFlex AI anything..."
                  className="w-full resize-none bg-transparent text-sm font-medium text-ink placeholder:text-faint focus:outline-none no-scrollbar"
                />
                <div className="flex items-center justify-end pt-1 border-t border-line/40">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMic}
                      title="Voice Search"
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer",
                        isListening
                          ? "bg-rose-500 text-white animate-pulse shadow-md ring-4 ring-rose-500/20"
                          : "bg-surface text-muted hover:bg-brass-tint hover:text-brass"
                      )}
                    >
                      <Mic size={17} />
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      aria-label="Send message"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#0b241d] via-[#166246] to-[#248e67] text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <p className="mt-2 text-center text-[0.625rem] text-faint">
              SpaceFlex AI can make mistakes. Double-check property details.
            </p>
          </div>
        )}
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
        <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#0b241d] px-4 py-3 text-sm text-paper shadow-xs">
          <p className="leading-relaxed font-medium">{message.text}</p>
          <span className="mt-1 block text-right text-[0.625rem] opacity-60">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden ring-2 ring-indigo-400/50 shadow-xs">
        <Image
          src="/ai-avatar.png"
          alt="SpaceFlex AI"
          width={32}
          height={32}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink font-normal">
            {message.text}
          </p>
        </div>

        {/* Embedded Property Result Cards (AI Recommendation Component) */}
        {message.properties && message.properties.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-0.5">
              <p className="text-[0.6875rem] font-extrabold uppercase tracking-widest text-indigo-950/80 flex items-center gap-1.5">
                <span className="text-amber-500 font-bold text-xs" aria-hidden="true">✦</span>
                RECOMMENDED FOR YOU
              </p>
              <span className="text-[0.625rem] font-semibold text-muted bg-surface/80 px-2 py-0.5 rounded-full border border-line/60">
                {message.properties.length} {message.properties.length === 1 ? "property" : "properties"}
              </span>
            </div>

            <div className="space-y-2.5">
              {message.properties.map((p) => {
                const isCommercial = p.category === "commercial" || p.type === "Office" || p.beds === 0;
                const factsString = isCommercial
                  ? `${p.type}   ·   ${p.fitOut || p.furnishing}   ·   ${p.areaSqft.toLocaleString()} sqft`
                  : `${p.beds} Beds   ·   ${p.baths} Baths   ·   ${p.areaSqft.toLocaleString()} sqft`;

                return (
                  <Link
                    key={p.id}
                    href={`/properties/${p.slug}`}
                    onClick={onCloseDrawer}
                    className="group relative flex flex-col md:flex-row items-stretch gap-3 md:gap-3.5 overflow-hidden rounded-[16px] border border-line/90 bg-paper p-2.5 md:p-3 shadow-2xs transition-all duration-200 hover:border-brass/50 hover:bg-surface/50 hover:shadow-card cursor-pointer"
                  >
                    {/* LEFT: Landscape Image with refined status badge */}
                    <div className="relative w-full md:w-[136px] md:h-auto aspect-[16/10] md:aspect-[4/3] shrink-0 overflow-hidden rounded-[14px] bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-white border border-white/10">
                        {p.status === "sale" ? "Sale" : "Rent"}
                      </span>
                    </div>

                    {/* RIGHT: Full-width Content Column (Price -> Name -> Location -> Facts -> View property) */}
                    <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                      <div>
                        {/* 1. Price */}
                        <p className="font-display text-sm md:text-base font-bold text-[#166246] tracking-tight whitespace-nowrap">
                          {propertyPrice(p)}
                        </p>

                        {/* 2. Property Name */}
                        <h4 className="mt-0.5 line-clamp-1 md:line-clamp-2 text-xs font-bold text-ink transition-colors group-hover:text-brass leading-snug">
                          {p.title}
                        </h4>

                        {/* 3. Location */}
                        <p className="mt-0.5 flex items-center gap-1 text-[0.6875rem] text-muted truncate">
                          <MapPin size={11} className="shrink-0 text-faint" />
                          <span className="truncate">{p.community}, {p.city}</span>
                        </p>

                        {/* 4. Property Facts */}
                        <p className="mt-1 text-[0.6875rem] font-medium text-muted/80 truncate">
                          {factsString}
                        </p>
                      </div>

                      {/* 5. View property → (directly below facts) */}
                      <div className="pt-1.5 flex items-center">
                        <span className="flex items-center gap-1 text-xs font-bold text-[#166246] transition-all group-hover:translate-x-1 group-hover:text-brass whitespace-nowrap">
                          View property <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Suggested Follow-up Queries */}
        {message.suggestedFollowups && message.suggestedFollowups.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {message.suggestedFollowups.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onPromptClick(prompt)}
                className="rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-medium text-muted transition-all hover:border-brass/40 hover:bg-brass-tint/40 hover:text-ink text-left cursor-pointer"
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
