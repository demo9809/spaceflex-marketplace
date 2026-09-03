"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { properties } from "@/lib/data/properties";
import type { Property } from "@/lib/types";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  properties?: Property[];
  suggestedFollowups?: string[];
  timestamp: string;
}

export interface HistorySession {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: ChatMessage[];
}

interface AiAssistantState {
  isOpen: boolean;
  openAi: (initialQuery?: string) => void;
  closeAi: () => void;
  toggleAi: () => void;
  activeTab: "chat" | "history";
  setActiveTab: (tab: "chat" | "history") => void;
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  historySessions: HistorySession[];
  loadHistorySession: (id: string) => void;
  deleteHistorySession: (id: string) => void;
  startNewChat: () => void;
  isWide: boolean;
  toggleWide: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const AiAssistantContext = createContext<AiAssistantState | null>(null);

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-1",
  sender: "ai",
  text: "Hi, I'm SpaceFlex AI. Tell me what you're looking for and I'll help you find the perfect property.",
  suggestedFollowups: [
    "Find me a villa under QAR 4M in Lusail.",
    "Show me family homes near good schools.",
    "I need an investment property with high rental yield.",
    "Find a beachfront apartment.",
    "Recommend properties within my budget.",
  ],
  timestamp: "Just now",
};

const DEFAULT_HISTORY_SESSIONS: HistorySession[] = [
  {
    id: "hist-1",
    title: "Villas in Lusail under QAR 4.5M",
    preview: "Found 3 prime villas in Fox Hills and North Island...",
    date: "Today, 10:42 AM",
    messages: [
      {
        id: "msg-h1-1",
        sender: "user",
        text: "Find me a villa under QAR 4M in Lusail.",
        timestamp: "10:41 AM",
      },
      {
        id: "msg-h1-2",
        sender: "ai",
        text: "Here are prime villas and townhouses in Lusail under QAR 4.5M. Lusail offers world-class infrastructure and sustainable smart-city design.",
        properties: properties.filter((p) => p.type === "Villa" || p.type === "Townhouse").slice(0, 2),
        timestamp: "10:42 AM",
      },
    ],
  },
  {
    id: "hist-2",
    title: "Beachfront Apartments in Viva Bahriya",
    preview: "Recommended 2-bedroom units with direct sea views...",
    date: "Yesterday",
    messages: [
      {
        id: "msg-h2-1",
        sender: "user",
        text: "Show beachfront apartments in Viva Bahriya",
        timestamp: "Yesterday",
      },
      {
        id: "msg-h2-2",
        sender: "ai",
        text: "Here are premier beachfront residences in Viva Bahriya featuring direct beach access and private marina views.",
        properties: properties.filter((p) => p.community.includes("Pearl")).slice(0, 2),
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "hist-3",
    title: "High Yield Investment Units",
    preview: "Analyzed rental ROI projected at 8.4% net yield...",
    date: "Aug 4, 2026",
    messages: [
      {
        id: "msg-h3-1",
        sender: "user",
        text: "I need an investment property with high rental yield.",
        timestamp: "Aug 4",
      },
      {
        id: "msg-h3-2",
        sender: "ai",
        text: "For high rental yield (projected 7.5%–9.2% net ROI), I recommend luxury apartments in Viva Bahriya and Lusail Marina.",
        properties: properties.slice(0, 2),
        timestamp: "Aug 4",
      },
    ],
  },
];

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [historySessions, setHistorySessions] = useState<HistorySession[]>(DEFAULT_HISTORY_SESSIONS);
  const [isTyping, setIsTyping] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [activeCategory, setActiveCategory] = useState("For You");

  const openAi = useCallback((initialQuery?: string) => {
    setIsOpen(true);
    setActiveTab("chat");
    if (initialQuery) {
      setTimeout(() => {
        handleSendMessage(initialQuery);
      }, 300);
    }
  }, []);

  const closeAi = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAi = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleWide = useCallback(() => {
    setIsWide((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  }, []);

  const startNewChat = useCallback(() => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setActiveTab("chat");
  }, []);

  const loadHistorySession = useCallback((id: string) => {
    const found = historySessions.find((s) => s.id === id);
    if (found) {
      setMessages(found.messages);
      setActiveTab("chat");
    }
  }, [historySessions]);

  const deleteHistorySession = useCallback((id: string) => {
    setHistorySessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI thinking and streaming response
    setTimeout(() => {
      const response = processAiQuery(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.text,
        properties: response.properties,
        suggestedFollowups: response.suggestedFollowups,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prevMessages) => {
        const nextMessages = [...prevMessages, aiMsg];
        // Automatically append to history
        setHistorySessions((prevHist) => [
          {
            id: `hist-${Date.now()}`,
            title: text.slice(0, 36) + (text.length > 36 ? "…" : ""),
            preview: response.text.slice(0, 60) + "…",
            date: "Just now",
            messages: nextMessages,
          },
          ...prevHist,
        ]);
        return nextMessages;
      });

      setIsTyping(false);
    }, 1200);
  };

  return (
    <AiAssistantContext.Provider
      value={{
        isOpen,
        openAi,
        closeAi,
        toggleAi,
        activeTab,
        setActiveTab,
        messages,
        isTyping,
        sendMessage: handleSendMessage,
        clearMessages,
        historySessions,
        loadHistorySession,
        deleteHistorySession,
        startNewChat,
        isWide,
        toggleWide,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistant() {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) throw new Error("useAiAssistant must be used within AiAssistantProvider");
  return ctx;
}

/* ── Simulated Intelligent Response Engine for Demo ── */
function processAiQuery(userQuery: string): {
  text: string;
  properties?: Property[];
  suggestedFollowups?: string[];
} {
  const query = userQuery.toLowerCase();

  // Scenario 1: Ambiguous query (e.g. "I need a villa")
  if (query === "i need a villa" || query === "villa" || query === "villas") {
    return {
      text: "I'd be glad to help you find a luxury villa in Qatar! To narrow down the best options for you, could you tell me:\n\n• Are you looking to **buy** or **rent**?\n• What is your preferred **budget range**?\n• Which area do you prefer (e.g. **Lusail**, **West Bay Lagoon**, or **Al Waab**)?",
      suggestedFollowups: [
        "Villas to buy in Lusail under QAR 5M",
        "Luxury waterfront villa for rent",
        "Family villa near Education City",
      ],
    };
  }

  // Scenario 2: Lusail Villa under QAR 4M
  if (query.includes("lusail") && (query.includes("villa") || query.includes("4m"))) {
    const matched = properties.filter(
      (p) =>
        (p.community.toLowerCase().includes("lusail") || p.city.toLowerCase().includes("lusail")) &&
        (p.type === "Villa" || p.type === "Townhouse") &&
        p.price <= 4500000
    );
    return {
      text: "Here are prime villas and townhouses in Lusail under QAR 4.5M. Lusail offers world-class infrastructure, sustainable smart-city design, and strong long-term capital appreciation.",
      properties: matched.length > 0 ? matched : properties.filter((p) => p.type === "Villa").slice(0, 2),
      suggestedFollowups: [
        "What are the payment plans available?",
        "Compare Lusail vs Pearl Qatar",
        "Show beachfront options",
      ],
    };
  }

  // Scenario 3: Family homes / Schools
  if (query.includes("school") || query.includes("family")) {
    const matched = properties.filter(
      (p) =>
        p.beds >= 3 &&
        (p.community.toLowerCase().includes("waab") ||
          p.community.toLowerCase().includes("rayyan") ||
          p.community.toLowerCase().includes("pearl"))
    );
    return {
      text: "I've curated top family residences located within a short drive of international schools (such as Qatar Academy and ISL Qatar). These homes feature quiet gated communities, private gardens, and swimming pools.",
      properties: matched.slice(0, 3),
      suggestedFollowups: [
        "Filter for 4+ bedrooms",
        "Check drive times from West Bay",
        "Show villas with private pool",
      ],
    };
  }

  // Scenario 4: High Rental Yield / Investment
  if (query.includes("yield") || query.includes("investment") || query.includes("rental")) {
    const matched = properties.filter(
      (p) => p.community.includes("Pearl") || p.community.includes("Lusail")
    );
    return {
      text: "For prime rentals, I recommend luxury residences in Viva Bahriya (The Pearl) and Lusail Marina. These properties experience high occupancy from executive expats and diplomatic staff.",
      properties: matched.slice(0, 3),
      suggestedFollowups: [
        "Calculate estimated monthly rental income",
        "Are non-Qataris eligible for residency?",
        "Show 1-bedroom investment units",
      ],
    };
  }

  // Scenario 5: Beachfront / Pearl
  if (query.includes("beach") || query.includes("waterfront") || query.includes("sea")) {
    const matched = properties.filter(
      (p) => p.community.includes("Pearl") || p.title.toLowerCase().includes("beach")
    );
    return {
      text: "Here are premier beachfront and marina-front residences in Porto Arabia and Viva Bahriya featuring direct beach access, private yacht berths, and panoramic Gulf views.",
      properties: matched.slice(0, 3),
      suggestedFollowups: [
        "Show apartments with private balcony",
        "What are the marina berth fees?",
        "Show 3-bedroom penthouses",
      ],
    };
  }

  // Scenario 6: Budget recommendation
  if (query.includes("budget") || query.includes("price") || query.includes("qar")) {
    const matched = properties.filter((p) => p.price <= 20000);
    return {
      text: "Here are top-value rental residences under QAR 20,000/month across Qatar's premier communities.",
      properties: matched.slice(0, 3),
      suggestedFollowups: [
        "Filter for rent under QAR 15k/mo",
        "Show homes near metro stations",
        "Compare price per sqft by district",
      ],
    };
  }

  // Generic Search Fallback — Smart matching against properties
  const searchWords = query.split(" ").filter((w) => w.length > 2);
  const matchedProps = properties.filter((p) => {
    const haystack = `${p.title} ${p.community} ${p.city} ${p.type} ${p.description}`.toLowerCase();
    return searchWords.some((w) => haystack.includes(w));
  });

  if (matchedProps.length > 0) {
    return {
      text: `Based on your request, I found ${matchedProps.length} matching properties in our curated collection:`,
      properties: matchedProps.slice(0, 3),
      suggestedFollowups: [
        "Show more details on these",
        "Refine by bedrooms",
        "Check commute times",
      ],
    };
  }

  return {
    text: "I searched our premium database across West Bay, Pearl Qatar, Lusail, and Msheireb. Here are top recommended residences matching your lifestyle preferences:",
    properties: properties.slice(0, 3),
    suggestedFollowups: [
      "Find me a villa under QAR 4M in Lusail",
      "Show beachfront apartments",
      "Investment properties with high ROI",
    ],
  };
}
