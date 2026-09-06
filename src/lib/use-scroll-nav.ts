"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export interface UseScrollNavOptions {
  /**
   * Scroll position (in px) from document top below which navigation
   * is guaranteed to always remain visible. Defaults to 60px.
   */
  topThreshold?: number;
  /**
   * Accumulated downward scroll (in px) required to hide navigation.
   * Prevents accidental hiding on micro-scrolls or finger taps. Defaults to 45px.
   */
  downThreshold?: number;
  /**
   * Accumulated upward scroll (in px) required to reveal navigation.
   * Gives an immediate, responsive response when the user scrolls back up. Defaults to 15px.
   */
  upThreshold?: number;
}

/**
 * Intelligent mobile scroll behavior hook for top header and bottom navigation.
 *
 * Features:
 * - Always visible at the top of the page.
 * - Smoothly hides on intentional downward scroll.
 * - Promptly reappears on intentional upward scroll.
 * - Ignores iOS rubber-banding elasticity at the top and bottom of the page.
 * - Frame-throttled via requestAnimationFrame for silky 60/120fps native-app performance.
 * - Keeps navigation visible when modals, menus, or drawers lock body scroll.
 * - Resets to fully visible upon route changes.
 */
export function useScrollNav(options: UseScrollNavOptions = {}): boolean {
  const {
    topThreshold = 60,
    downThreshold = 45,
    upThreshold = 15,
  } = options;

  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const accumDown = useRef(0);
  const accumUp = useRef(0);
  const rafId = useRef<number | null>(null);

  // Reset to visible whenever the route changes
  useEffect(() => {
    setVisible(true);
    accumDown.current = 0;
    accumUp.current = 0;
    if (typeof window !== "undefined") {
      lastScrollY.current = Math.max(
        0,
        window.scrollY || document.documentElement.scrollTop || 0
      );
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = Math.max(
      0,
      window.scrollY || document.documentElement.scrollTop || 0
    );

    const handleScrollUpdate = () => {
      const currentScrollY = Math.max(
        0,
        window.scrollY || document.documentElement.scrollTop || 0
      );

      // 1. If any modal, drawer, or sheet locks the body, keep navigation visible
      if (document.body.style.overflow === "hidden") {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        rafId.current = null;
        return;
      }

      // 2. Always fully visible near the top of the page
      if (currentScrollY <= topThreshold) {
        setVisible(true);
        accumDown.current = 0;
        accumUp.current = 0;
        lastScrollY.current = currentScrollY;
        rafId.current = null;
        return;
      }

      // 3. Ignore iOS bottom rubber-band bounce
      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      if (currentScrollY >= maxScrollY - 10) {
        lastScrollY.current = currentScrollY;
        rafId.current = null;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      if (delta > 0) {
        // Intentional downward scroll
        accumUp.current = 0;
        accumDown.current += delta;

        if (accumDown.current >= downThreshold) {
          setVisible(false);
          accumDown.current = 0;
        }
      } else if (delta < 0) {
        // Intentional upward scroll
        accumDown.current = 0;
        accumUp.current += Math.abs(delta);

        if (accumUp.current >= upThreshold) {
          setVisible(true);
          accumUp.current = 0;
        }
      }

      lastScrollY.current = currentScrollY;
      rafId.current = null;
    };

    const onScroll = () => {
      if (rafId.current === null) {
        rafId.current = window.requestAnimationFrame(handleScrollUpdate);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [topThreshold, downThreshold, upThreshold]);

  return visible;
}
