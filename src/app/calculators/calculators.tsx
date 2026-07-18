"use client";

import { useMemo, useState } from "react";
import { Landmark, TrendingUp } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/field";
import { formatPrice } from "@/lib/format";

const currencies = ["QAR", "AED", "SAR", "INR", "USD"];

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-xl bg-ink p-4 text-paper"
          : "rounded-xl bg-brass-tint p-4"
      }
    >
      <p
        className={`text-xs uppercase tracking-[0.14em] ${accent ? "text-paper/60" : "text-muted"}`}
      >
        {label}
      </p>
      <p className="font-display mt-1 text-xl font-semibold md:text-2xl">
        {value}
      </p>
    </div>
  );
}

export function Calculators() {
  /* Mortgage */
  const [currency, setCurrency] = useState("QAR");
  const [price, setPrice] = useState(3850000);
  const [down, setDown] = useState(25);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const mortgage = useMemo(() => {
    const principal = price * (1 - down / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthly =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return {
      monthly,
      principal,
      totalInterest: monthly * n - principal,
      downAmount: price * (down / 100),
    };
  }, [price, down, rate, years]);

  /* Yield */
  const [yPrice, setYPrice] = useState(750000);
  const [yRent, setYRent] = useState(4500);
  const [yCosts, setYCosts] = useState(12);

  const yieldCalc = useMemo(() => {
    const annualRent = yRent * 12;
    const net = annualRent * (1 - yCosts / 100);
    return {
      gross: (annualRent / yPrice) * 100,
      net: (net / yPrice) * 100,
      breakEvenYears: yPrice / net,
      annualNet: net,
    };
  }, [yPrice, yRent, yCosts]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── Mortgage ── */}
      <section
        aria-labelledby="calc-mortgage"
        className="rounded-3xl border border-line bg-raised p-6 shadow-card md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brass-tint text-brass">
            <Landmark size={20} strokeWidth={1.8} />
          </span>
          <h2 id="calc-mortgage" className="font-display text-2xl font-semibold">
            Mortgage calculator
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="m-currency">Currency</Label>
            <Select
              id="m-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="m-price">Property price</Label>
            <Input
              id="m-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <Label className="mb-0">Down payment</Label>
              <span className="text-sm font-medium">
                {down}% · {formatPrice(Math.round(mortgage.downAmount), currency, true)}
              </span>
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
          <div>
            <Label htmlFor="m-rate">Interest rate %</Label>
            <Input
              id="m-rate"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="m-years">Term (years)</Label>
            <Input
              id="m-years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat
            accent
            label="Monthly payment"
            value={formatPrice(Math.round(mortgage.monthly), currency, true)}
          />
          <Stat
            label="Loan amount"
            value={formatPrice(Math.round(mortgage.principal), currency, true)}
          />
          <Stat
            label="Total interest"
            value={formatPrice(Math.round(mortgage.totalInterest), currency, true)}
          />
        </div>
      </section>

      {/* ── Yield ── */}
      <section
        id="yield"
        aria-labelledby="calc-yield"
        className="rounded-3xl border border-line bg-raised p-6 shadow-card md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brass-tint text-brass">
            <TrendingUp size={20} strokeWidth={1.8} />
          </span>
          <h2 id="calc-yield" className="font-display text-2xl font-semibold">
            Rental yield calculator
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="y-price">Purchase price (USD)</Label>
            <Input
              id="y-price"
              type="number"
              value={yPrice}
              onChange={(e) => setYPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="y-rent">Monthly rent (USD)</Label>
            <Input
              id="y-rent"
              type="number"
              value={yRent}
              onChange={(e) => setYRent(Number(e.target.value))}
            />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <Label className="mb-0">Running costs (service, mgmt, voids)</Label>
              <span className="text-sm font-medium">{yCosts}% of rent</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={yCosts}
              onChange={(e) => setYCosts(Number(e.target.value))}
              aria-label="Running costs percentage"
              className="mt-2 w-full accent-[var(--brass)]"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat accent label="Net yield" value={`${yieldCalc.net.toFixed(1)}%`} />
          <Stat label="Gross yield" value={`${yieldCalc.gross.toFixed(1)}%`} />
          <Stat
            label="Break-even"
            value={`${yieldCalc.breakEvenYears.toFixed(0)} yrs`}
          />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Net annual income ≈ {formatPrice(Math.round(yieldCalc.annualNet), "USD", true)}.
          Excludes financing, purchase fees and taxation — model those with your
          advisor before committing.
        </p>
      </section>
    </div>
  );
}
