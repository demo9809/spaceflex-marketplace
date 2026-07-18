"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/store/saved";

export function SaveButton({
  id,
  className,
  size = 18,
}: {
  id: string;
  className?: string;
  size?: number;
}) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(id);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95",
        className
      )}
    >
      <Heart
        size={size}
        className={cn(
          "transition-colors duration-200",
          saved ? "fill-danger stroke-danger" : "stroke-ink"
        )}
      />
    </button>
  );
}
