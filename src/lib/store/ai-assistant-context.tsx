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

interface AiAssistantState {
  isOpen: boolean;
  openAi: (initialQuery?: string) => void;
  closeAi: () => void;
  toggleAi: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
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

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const openAi = useCallback((initialQuery?: string) => {
    setIsOpen(true);
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

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
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
      setMessages((prev) => [...prev, aiMsg]);
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
        messages,
        isTyping,
        sendMessage: handleSendMessage,
        clearMessages,
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
      (p) => p.status === "sale" && (p.community.includes("Pearl") || p.community.includes("Lusail"))
    );
    return {
      text: "For high rental yield (projected 7.5%–9.2% net ROI), I recommend luxury apartments in Viva Bahriya (The Pearl) and Lusail Marina. These properties experience high occupancy from executive expats and diplomatic staff.",
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
    const matched = properties.filter((p) => p.status === "sale" && p.price <= 3500000);
    return {
      text: "Here are top-value investment properties and homes under QAR 3.5M across Qatar's premier communities.",
      properties: matched.slice(0, 3),
      suggestedFollowups: [
        "Filter for rent under QAR 15k/mo",
        "Show homes with zero down payment",
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
