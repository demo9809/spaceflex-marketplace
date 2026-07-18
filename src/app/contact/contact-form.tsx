"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-raised p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-tint text-success">
          <Check size={26} />
        </div>
        <p className="font-display mt-5 text-2xl font-semibold">
          Message received
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Thank you — the right desk will reply within one working day. Urgent?
          Call our Doha office on +974 4000 1200.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="ct-name">Name</Label>
          <Input id="ct-name" required placeholder="Your full name" />
        </div>
        <div>
          <Label htmlFor="ct-email">Email</Label>
          <Input id="ct-email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <Label htmlFor="ct-topic">Topic</Label>
        <Select id="ct-topic" defaultValue="">
          <option value="" disabled>
            Choose a topic
          </option>
          <option>Buying or renting</option>
          <option>Selling / listing a property</option>
          <option>Agent partnership</option>
          <option>Private Office (discreet)</option>
          <option>Press & media</option>
          <option>Something else</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="ct-msg">Message</Label>
        <Textarea
          id="ct-msg"
          required
          placeholder="Tell us what you're looking for…"
          className="min-h-36"
        />
      </div>
      <Button type="submit" size="lg">
        Send message
      </Button>
    </form>
  );
}
