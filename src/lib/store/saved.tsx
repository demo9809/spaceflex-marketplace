"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface SavedState {
  saved: string[];
  compare: string[];
  toggleSaved: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isSaved: (id: string) => boolean;
  inCompare: (id: string) => boolean;
}

const SavedContext = createContext<SavedState | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("sf:saved") ?? "[]"));
      setCompare(JSON.parse(localStorage.getItem("sf:compare") ?? "[]"));
    } catch {
      /* fresh state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("sf:saved", JSON.stringify(saved));
  }, [saved, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("sf:compare", JSON.stringify(compare));
  }, [compare, hydrated]);

  const toggleSaved = useCallback((id: string) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length >= 4 ? s : [...s, id]
    );
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  return (
    <SavedContext.Provider
      value={{
        saved,
        compare,
        toggleSaved,
        toggleCompare,
        clearCompare,
        isSaved: (id) => saved.includes(id),
        inCompare: (id) => compare.includes(id),
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}
