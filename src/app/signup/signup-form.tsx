"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

const roles = [
  { id: "buyer", label: "Buying" },
  { id: "renter", label: "Renting" },
  { id: "seller", label: "Selling" },
  { id: "agent", label: "I'm an agent" },
];

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState("buyer");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/dashboard");
      }}
    >
      <div>
        <Label>I&apos;m here for</Label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              aria-pressed={role === r.id}
              className={cn(
                "rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                role === r.id
                  ? "border-brass bg-brass-tint text-ink"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="su-name">Full name</Label>
        <Input id="su-name" required placeholder="Your name" autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="su-email">Email</Label>
        <Input
          id="su-email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="su-pass">Password</Label>
        <Input
          id="su-pass"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        Create account
      </Button>
    </form>
  );
}
