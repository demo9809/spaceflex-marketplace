"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Scale } from "lucide-react";
import { useSaved } from "@/lib/store/saved";
import { usePresence } from "@/lib/use-presence";
import { properties } from "@/lib/data/properties";
import { cn } from "@/lib/utils";

export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useSaved();
  const items = properties.filter((p) => compare.includes(p.id));
  const { mounted, shown } = usePresence(items.length > 0);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:bottom-6",
        shown ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      )}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-raised/95 p-3 shadow-modal backdrop-blur-xl">
        <div className="flex -space-x-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="group/thumb relative h-11 w-11 overflow-hidden rounded-xl border-2 border-raised"
            >
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="44px"
                className="object-cover"
              />
              <button
                onClick={() => toggleCompare(p.id)}
                aria-label={`Remove ${p.title} from comparison`}
                className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity group-hover/thumb:opacity-100"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
        <p className="flex-1 text-sm font-medium">
          {items.length} {items.length === 1 ? "property" : "properties"}
          <span className="hidden text-muted sm:inline"> selected to compare</span>
        </p>
        <button
          onClick={clearCompare}
          className="text-xs font-medium text-muted transition-colors hover:text-ink"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          <Scale size={14} />
          Compare
        </Link>
      </div>
    </div>
  );
}
