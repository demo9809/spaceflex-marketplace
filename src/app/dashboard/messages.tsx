"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, Send } from "lucide-react";
import { agents } from "@/lib/data/agents";
import { cn } from "@/lib/utils";

interface Msg {
  from: "me" | "agent";
  text: string;
  time: string;
}

interface Thread {
  id: string;
  agentId: string;
  property: string;
  unread?: boolean;
  messages: Msg[];
}

const initialThreads: Thread[] = [
  {
    id: "t1",
    agentId: "a1",
    property: "Marina Sky Residence, Lusail",
    unread: true,
    messages: [
      { from: "me", text: "Hi Yasmin, is the Marina Sky two-bedroom still available? We're relocating in September.", time: "Tue 14:02" },
      { from: "agent", text: "Hello! Yes, it's available — and the owner has just serviced the AC units ahead of handover. Would you like a viewing this week?", time: "Tue 14:31" },
      { from: "me", text: "Yes please. Could we also see the service-charge history?", time: "Tue 15:10" },
      { from: "agent", text: "Of course — attaching the last three years now. The owner can do Thursday 6pm for a second viewing — shall I confirm?", time: "Today 09:12" },
    ],
  },
  {
    id: "t2",
    agentId: "a4",
    property: "Porto Arabia Marina Apartment",
    messages: [
      { from: "me", text: "Hi James, does the Porto Arabia unit come with a parking bay?", time: "Mon 11:20" },
      { from: "agent", text: "It does — one allocated bay on P2, plus visitor parking. Sending the floor plan and the service-charge history now.", time: "Mon 12:05" },
    ],
  },
  {
    id: "t3",
    agentId: "a3",
    property: "Boulevard Loft Residence, Downtown",
    messages: [
      { from: "agent", text: "Lease draft attached — clause 4 covers the early-exit terms we discussed.", time: "Fri 16:44" },
      { from: "me", text: "Thanks Priya, I'll review over the weekend.", time: "Fri 17:02" },
    ],
  },
];

const cannedReplies = [
  "Noted — let me confirm with the owner and get right back to you.",
  "Good question. I'll pull the exact figures and send them over shortly.",
  "I can arrange that. Does tomorrow afternoon or Saturday morning suit you better?",
  "Received! I'll share the documents within the hour.",
];

function nowLabel() {
  return new Date().toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MessagesPanel() {
  const [threads, setThreads] = useState(initialThreads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyIdx = useRef(0);

  const active = threads.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeId, threads, typing]);

  function openThread(id: string) {
    setActiveId(id);
    setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, unread: false } : t)));
  }

  function send() {
    const trimmed = text.trim();
    if (!trimmed || !active) return;
    const id = active.id;
    setThreads((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, messages: [...t.messages, { from: "me" as const, text: trimmed, time: nowLabel() }] }
          : t
      )
    );
    setText("");
    setTyping(true);
    const reply = cannedReplies[replyIdx.current++ % cannedReplies.length];
    setTimeout(() => {
      setTyping(false);
      setThreads((ts) =>
        ts.map((t) =>
          t.id === id
            ? { ...t, messages: [...t.messages, { from: "agent" as const, text: reply, time: nowLabel() }] }
            : t
        )
      );
    }, 1800);
  }

  const list = (
    <div className={cn("overflow-y-auto md:border-r md:border-line", active && "hidden md:block")}>
      {threads.map((t) => {
        const agent = agents.find((a) => a.id === t.agentId)!;
        const last = t.messages[t.messages.length - 1];
        return (
          <button
            key={t.id}
            onClick={() => openThread(t.id)}
            aria-current={t.id === activeId}
            className={cn(
              "flex w-full items-center gap-3 border-b border-line p-4 text-left transition-colors hover:bg-brass-tint/50",
              t.id === activeId && "bg-brass-tint/60"
            )}
          >
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
              <Image src={agent.photo} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm", t.unread ? "font-semibold" : "font-medium")}>
                {agent.name}
              </span>
              <span className="block truncate text-xs text-brass">{t.property}</span>
              <span className={cn("mt-0.5 block truncate text-xs", t.unread ? "text-ink" : "text-muted")}>
                {last.from === "me" && "You: "}
                {last.text}
              </span>
            </span>
            {t.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brass" />}
          </button>
        );
      })}
    </div>
  );

  const thread = active ? (
    <div className="flex min-h-0 flex-col">
      {/* Thread header */}
      {(() => {
        const agent = agents.find((a) => a.id === active.agentId)!;
        return (
          <div className="flex items-center gap-3 border-b border-line p-4">
            <button
              onClick={() => setActiveId(null)}
              aria-label="Back to conversations"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-brass-tint md:hidden"
            >
              <ArrowLeft size={17} />
            </button>
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image src={agent.photo} alt="" fill sizes="40px" className="object-cover" />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                {agent.name}
                <BadgeCheck size={14} className="text-brass" />
              </p>
              <p className="truncate text-xs text-muted">{active.property}</p>
            </div>
            <span className="ml-auto hidden rounded-full bg-success-tint px-3 py-1 text-xs font-medium text-success sm:block">
              {agent.responseTime}
            </span>
          </div>
        );
      })()}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/60 p-4">
        {active.messages.map((m, i) => (
          <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.from === "me"
                  ? "rounded-br-md bg-ink text-paper"
                  : "rounded-bl-md border border-line bg-raised shadow-card"
              )}
            >
              <p>{m.text}</p>
              <p className={cn("mt-1 text-[0.6875rem]", m.from === "me" ? "text-paper/60" : "text-faint")}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start" aria-label="Agent is typing">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-raised px-4 py-3 shadow-card">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          aria-label="Message text"
          className="h-11 flex-1 rounded-full border border-line bg-raised px-4 text-sm placeholder:text-faint focus:border-brass focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-all hover:bg-ink-soft disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  ) : (
    <div className="hidden flex-col items-center justify-center p-10 text-center md:flex">
      <p className="font-display text-xl font-semibold">Select a conversation</p>
      <p className="mt-1 max-w-xs text-sm text-muted">
        Messages with agents stay here — viewing requests, documents and follow-ups.
      </p>
    </div>
  );

  return (
    <div className="mt-4 grid h-[calc(100dvh-14.5rem)] min-h-[22rem] overflow-hidden rounded-2xl border border-line bg-raised shadow-card md:mt-8 md:h-[34rem] md:grid-cols-[19rem_1fr]">
      {list}
      {thread}
    </div>
  );
}
