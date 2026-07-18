"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";

export function InterestForm({ projectName }: { projectName: string }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-card">
      <div className="border-b border-line bg-brass-tint px-5 py-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={15} className="text-brass" />
          Pre-launch interest
        </p>
        <p className="mt-0.5 text-xs text-muted">
          Members receive allocations before public release.
        </p>
      </div>
      {sent ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-tint text-success">
            <Check size={22} />
          </div>
          <p className="font-display mt-4 text-lg font-semibold">
            You&apos;re on the list
          </p>
          <p className="mt-1 text-sm text-muted">
            Our developer desk will share the {projectName} allocation pack
            within one working day.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <Label htmlFor="if-name">Name</Label>
            <Input id="if-name" required placeholder="Your full name" />
          </div>
          <div>
            <Label htmlFor="if-email">Email</Label>
            <Input
              id="if-email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="if-budget">Budget range</Label>
            <Select id="if-budget" defaultValue="">
              <option value="" disabled>
                Select budget
              </option>
              <option>Up to $500K</option>
              <option>$500K – $1M</option>
              <option>$1M – $3M</option>
              <option>$3M+</option>
            </Select>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Register interest
          </Button>
          <p className="text-center text-[0.6875rem] text-faint">
            No obligation. One email with the allocation pack, nothing more.
          </p>
        </form>
      )}
    </div>
  );
}
