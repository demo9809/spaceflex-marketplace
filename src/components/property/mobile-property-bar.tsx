"use client";

import { useScrollNav } from "@/lib/use-scroll-nav";
import { propertyPrice } from "@/lib/format";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MobilePropertyBar({ property }: { property: Property }) {
  const navVisible = useScrollNav();

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden",
        navVisible
          ? "bottom-16"
          : "bottom-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-lg font-semibold">
            {propertyPrice(property, true)}
          </p>
          <p className="truncate text-xs text-muted">{property.community}</p>
        </div>
        <a
          href="#facts"
          className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper"
        >
          Request viewing
        </a>
      </div>
    </div>
  );
}
