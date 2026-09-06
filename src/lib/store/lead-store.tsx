"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  Lead,
  LeadContext,
  CustomerProfile,
} from "../types/leads-and-reviews";

interface LeadCaptureState {
  activeModal: {
    isOpen: boolean;
    context?: LeadContext;
  };
  leads: Lead[];
  savedProfile: CustomerProfile | null;
  openLeadModal: (context: LeadContext) => void;
  closeLeadModal: () => void;
  submitLead: (
    input: Omit<Lead, "id" | "timestamp" | "status">
  ) => Promise<Lead>;
  hasVerifiedInteraction: (agencyId: string, phoneOrEmail?: string) => boolean;
  clearSavedProfile: () => void;
}

const LeadCaptureContext = createContext<LeadCaptureState | null>(null);

export function LeadCaptureProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    context?: LeadContext;
  }>({
    isOpen: false,
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedProfile, setSavedProfile] = useState<CustomerProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem("sf:leads");
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedProfile = localStorage.getItem("sf:customer_profile");
      if (storedProfile) setSavedProfile(JSON.parse(storedProfile));
    } catch {
      /* ignore SSR / storage errors */
    }
    setHydrated(true);
  }, []);

  // Sync leads to localStorage
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("sf:leads", JSON.stringify(leads));
      } catch {
        /* storage limit */
      }
    }
  }, [leads, hydrated]);

  // Sync profile to localStorage
  useEffect(() => {
    if (hydrated && savedProfile) {
      try {
        localStorage.setItem(
          "sf:customer_profile",
          JSON.stringify(savedProfile)
        );
      } catch {
        /* storage limit */
      }
    }
  }, [savedProfile, hydrated]);

  const openLeadModal = useCallback((context: LeadContext) => {
    setActiveModal({ isOpen: true, context });
  }, []);

  const closeLeadModal = useCallback(() => {
    setActiveModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const submitLead = useCallback(
    async (
      input: Omit<Lead, "id" | "timestamp" | "status">
    ): Promise<Lead> => {
      const newLead: Lead = {
        countryCode: "+974",
        contactPreference: "whatsapp",
        preferredTime: "Any time",
        ...input,
        id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        status: input.action === "viewing" ? "Viewing Scheduled" : "New",
      };

      setLeads((prev) => [newLead, ...prev]);

      // Remember customer profile for seamless subsequent contacts
      const updatedProfile: CustomerProfile = {
        name: input.customerName,
        phone: input.phone,
        countryCode: input.countryCode || "+974",
        email: input.email,
        contactPreference: input.contactPreference || "whatsapp",
      };
      setSavedProfile(updatedProfile);

      return newLead;
    },
    []
  );

  const hasVerifiedInteraction = useCallback(
    (agencyId: string, phoneOrEmail?: string): boolean => {
      return leads.some((lead) => {
        if (lead.agencyId !== agencyId) return false;
        if (!phoneOrEmail) return true; // User has submitted on this browser

        const cleanInput = phoneOrEmail.trim().toLowerCase();
        const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
        const inputCleanPhone = cleanInput.replace(/[^0-9]/g, "");

        if (inputCleanPhone && cleanPhone.includes(inputCleanPhone)) return true;
        if (lead.email && lead.email.toLowerCase() === cleanInput) return true;

        return false;
      });
    },
    [leads]
  );

  const clearSavedProfile = useCallback(() => {
    setSavedProfile(null);
    try {
      localStorage.removeItem("sf:customer_profile");
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LeadCaptureContext.Provider
      value={{
        activeModal,
        leads,
        savedProfile,
        openLeadModal,
        closeLeadModal,
        submitLead,
        hasVerifiedInteraction,
        clearSavedProfile,
      }}
    >
      {children}
    </LeadCaptureContext.Provider>
  );
}

export function useLeadCapture() {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) {
    throw new Error("useLeadCapture must be used within a LeadCaptureProvider");
  }
  return ctx;
}
