import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "brass" | "success" | "danger" | "inverted" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-brass-tint text-ink",
  brass: "bg-brass text-white",
  success: "bg-success-tint text-success",
  danger: "bg-danger-tint text-danger",
  inverted: "bg-ink/80 text-paper backdrop-blur-sm",
  outline: "border border-line-strong text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
