"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Scroll-reveal built on IntersectionObserver + CSS transitions.
   Elements render visible by default and only animate when the
   observer is available, so content can never be lost. */

function useReveal<T extends HTMLElement>(stagger: boolean) {
  const ref = useRef<T | null>(null);
  const [hidden, setHidden] = useState(false);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (stagger && node.parentElement) {
      setOrder(Array.prototype.indexOf.call(node.parentElement.children, node));
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // already on screen — don't animate

    setHidden(true);
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setHidden(false);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) show();
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    /* Fallback for environments where IO never fires */
    const onScroll = () => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.95) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [stagger]);

  return { ref, hidden, order };
}

const transitionClass =
  "transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, hidden } = useReveal<HTMLDivElement>(false);
  return (
    <div
      ref={ref}
      className={cn(transitionClass, className)}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? `translateY(${y}px)` : "translateY(0)",
        transitionDelay: `${delay * 1000}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function RevealStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, hidden, order } = useReveal<HTMLDivElement>(true);
  return (
    <div
      ref={ref}
      className={cn(transitionClass, className)}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(24px)" : "translateY(0)",
        transitionDelay: hidden ? "0ms" : `${Math.min(order * 70, 350)}ms`,
      }}
    >
      {children}
    </div>
  );
}
