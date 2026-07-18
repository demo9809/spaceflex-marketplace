import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "brass" | "inverted";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-soft active:scale-[0.985]",
  brass:
    "bg-brass text-white hover:bg-brass-deep active:scale-[0.985]",
  outline:
    "border border-line-strong text-ink hover:border-ink hover:bg-raised active:scale-[0.985]",
  ghost: "text-ink hover:bg-brass-tint active:scale-[0.985]",
  inverted:
    "bg-paper text-ink hover:bg-white active:scale-[0.985]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-6 text-sm",
  lg: "h-[3.25rem] px-8 text-[0.9375rem]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
