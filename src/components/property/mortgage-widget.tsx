"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";
import { formatPrice } from "@/lib/format";

export function MortgageWidget({
  price,
  currency,
}: {
  price: number;
  currency: string;
}) {
  const [down, setDown] = useState(25);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const monthly = useMemo(() => {
    const principal = price * (1 - down / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [price, down, rate, years]);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="font-display text-lg font-semibold">Estimate financing</h3>
      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-baseline justify-between">
            <Label className="mb-0">Down payment</Label>
            <span className="text-sm font-medium">{down}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            aria-label="Down payment percentage"
            className="mt-2 w-full accent-[var(--brass)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mw-rate">Rate %</Label>
            <Input
              id="mw-rate"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="mw-years">Term (years)</Label>
            <Input
              id="mw-years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-brass-tint p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          Estimated monthly payment
        </p>
        <p className="font-display mt-1 text-2xl font-semibold">
          {Number.isFinite(monthly)
            ? formatPrice(Math.round(monthly), currency)
            : "—"}
        </p>
        <p className="mt-1 text-xs text-muted">
          Indicative only. Speak to a partner lender for a formal offer.
        </p>
      </div>
    </div>
  );
}
