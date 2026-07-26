"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* A pill-shaped filter trigger whose dropdown is rendered in a PORTAL and
   positioned with fixed coordinates. That keeps the panel out of any
   `overflow` / `transform` ancestor (e.g. the horizontally-scrolling top
   bar), so it can never be clipped. Repositions on scroll/resize; closes on
   outside click and Escape. `fullWidth` makes the trigger a block field for
   the left-hand setup column. */
export function FilterPopover({
  leading,
  label,
  value,
  active,
  fullWidth,
  panelWidth = 288,
  children,
}: {
  leading?: ReactNode;
  label: string;
  value?: string | null;
  active?: boolean;
  fullWidth?: boolean;
  panelWidth?: number;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: panelWidth });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = Math.min(panelWidth, window.innerWidth - 16);
      const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
      setPos({ top: r.bottom + 8, left, width });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, panelWidth]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className={cn("relative", fullWidth ? "w-full" : "shrink-0")}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex h-11 items-center gap-2 rounded-full border bg-raised pl-3.5 pr-3 text-sm transition-colors",
          fullWidth ? "w-full justify-between" : "",
          active
            ? "border-brass text-ink"
            : "border-line text-muted hover:border-line-strong"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {leading}
          <span
            className={cn(
              "truncate",
              value ? "font-medium text-ink" : "text-muted"
            )}
          >
            {value ?? label}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={cn(
            "shrink-0 text-faint transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
            className="z-[100] rounded-2xl border border-line bg-raised p-3 shadow-modal"
          >
            {children(() => setOpen(false))}
          </div>,
          document.body
        )}
    </div>
  );
}
