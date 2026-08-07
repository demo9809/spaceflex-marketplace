"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
}

export const COUNTRIES: CountryCode[] = [
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦", placeholder: "5555 0100" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪", placeholder: "50 123 4567" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", placeholder: "50 123 4567" },
  { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼", placeholder: "5012 3456" },
  { code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲", placeholder: "9123 4567" },
  { code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭", placeholder: "3912 3456" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", placeholder: "7911 123456" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", placeholder: "(555) 000-0000" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", placeholder: "98765 43210" },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰", placeholder: "300 1234567" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬", placeholder: "100 123 4567" },
  { code: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴", placeholder: "7 9123 4567" },
  { code: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧", placeholder: "70 123 456" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷", placeholder: "6 12 34 56 78" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪", placeholder: "151 12345678" },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷", placeholder: "501 123 4567" },
];

export function PhoneInput({
  id = "phone-input",
  name = "phone",
  defaultValue = "",
  placeholder,
  required,
  className,
}: {
  id?: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState(defaultValue);

  return (
    <div
      className={cn(
        "group relative flex w-full items-center rounded-xl border border-line bg-raised transition-all duration-200 hover:border-line-strong focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/20",
        className
      )}
    >
      {/* Country Code Picker Dropdown Trigger */}
      <div className="relative flex shrink-0 items-center border-r border-line/80 bg-surface/60 px-3 h-11 text-sm font-medium text-ink rounded-l-xl select-none">
        <span className="mr-1.5 text-base leading-none" aria-hidden="true">
          {selectedCountry.flag}
        </span>
        <span className="font-semibold text-xs text-ink">{selectedCountry.dialCode}</span>
        <ChevronDown size={13} className="ml-1 text-muted transition-transform group-hover:translate-y-0.5" />

        {/* Native Select Overlay for 100% Mobile & Keyboard Compatibility */}
        <select
          aria-label="Select Country Code"
          value={selectedCountry.code}
          onChange={(e) => {
            const found = COUNTRIES.find((c) => c.code === e.target.value);
            if (found) setSelectedCountry(found);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none text-base"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number Input */}
      <input
        id={id}
        name={name}
        type="tel"
        required={required}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder={placeholder || selectedCountry.placeholder}
        className="h-11 w-full bg-transparent px-3 text-sm text-ink placeholder:text-faint focus:outline-none"
      />
    </div>
  );
}
