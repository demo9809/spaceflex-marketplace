import type { Property } from "./types";

export function formatPrice(
  price: number,
  currency: string,
  compact = false
): string {
  if (compact) {
    const fmt = new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    });
    return `${currency} ${fmt.format(price)}`;
  }
  return `${currency} ${new Intl.NumberFormat("en").format(price)}`;
}

export function propertyPrice(p: Property, compact = false): string {
  const base = formatPrice(p.price, p.currency, compact);
  return p.status === "rent" ? `${base}/${p.rentPeriod ?? "month"}` : base;
}

export function pricePerSqft(p: Property): string {
  return `${p.currency} ${Math.round(p.price / p.areaSqft).toLocaleString("en")} / sqft`;
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString("en")} sqft`;
}
