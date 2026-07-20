"use client";

import { useState } from "react";
import { Check, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

interface Report {
  id: string;
  title: string;
  period: string;
  pages: number;
  highlights: string[];
  tier: string;
}

export function ReportCard({ report }: { report: Report }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const premium = report.tier.startsWith("Premium");

  return (
    <article className="card-hover flex h-full flex-col rounded-2xl border border-line bg-raised p-6 shadow-card md:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass-tint text-brass">
          <FileText size={22} strokeWidth={1.8} />
        </span>
        <Badge tone={premium ? "brass" : "success"}>{report.tier}</Badge>
      </div>
      <h2 className="font-display mt-5 text-2xl font-semibold">
        {report.title}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {report.period} · {report.pages} pages
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {report.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-ink-soft">
            <Check size={15} className="mt-0.5 shrink-0 text-brass" />
            {h}
          </li>
        ))}
      </ul>

      {sent ? (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-success-tint px-4 py-3 text-sm font-medium text-success">
          <Check size={16} />
          Sent — check your inbox for the download link.
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSent(true);
          }}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            aria-label={`Email to receive ${report.title}`}
            /* flex-1 only once the form is a row — in flex-col its
               basis:0 would override h-11 and collapse the field */
            className="w-full sm:flex-1"
          />
          <Button type="submit" className="shrink-0">
            <Download size={15} />
            {premium ? "Buy & download" : "Get report"}
          </Button>
        </form>
      )}
    </article>
  );
}
