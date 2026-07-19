"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* Demo authentication: any credentials sign the visitor in; the flag
   persists in localStorage. Replace with a real auth provider later. */

interface AuthState {
  authed: boolean;
  hydrated: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("sf:auth") === "1");
    setHydrated(true);
  }, []);

  const signIn = useCallback(() => {
    localStorage.setItem("sf:auth", "1");
    setAuthed(true);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("sf:auth");
    setAuthed(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, hydrated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
