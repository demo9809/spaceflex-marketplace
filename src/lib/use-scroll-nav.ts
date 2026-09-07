"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export interface UseScrollNavOptions {
  /**
   * Scroll position (in px) from document top below which navigation
   * is guaranteed to always remain visible. Defaults to 70px.
   */
  topThreshold?: number;
  /**
   * Accumulated downward scroll (in px) required to hide navigation.
   * Prevents accidental hiding on micro-scrolls or finger taps. Defaults to 65px.
   */
  downThreshold?: number;
  /**
   * Accumulated upward scroll (in px) required to reveal navigation.
   * Requires a deliberate upward scroll gesture. Defaults to 40px.
   */
  upThreshold?: number;
  /**
   * Minimum time (in ms) that must elapse between visibility state changes.
   * Prevents rapid oscillation / stutter / flickering during inertia deceleration. Defaults to 250ms.
   */
  minToggleIntervalMs?: number;
}

/**
 * Intelligent mobile scroll behavior hook for top header and bottom navigation.
 *
 * Features:
 * - Always visible at the top of the page.
 * - Smoothly hides on intentional, sustained downward scroll.
 * - Promptly reappears on intentional upward scroll.
 * - Completely immune to micro-jitters, touch bounces, and address-bar resize noise.
 * - Ignores iOS rubber-banding elasticity at the top and bottom of the page.
 * - Hysteresis dwell cooldown (250ms) to eliminate flickering.
 * - Frame-throttled via requestAnimationFrame for silky 60/120fps native performance.
 * - Keeps navigation visible when modals, menus, drawers, or mobile keyboards are active.
 * - Resets to fully visible upon route changes.
 */
export function useScrollNav(options: UseScrollNavOptions = {}): boolean {
  const {
    topThreshold = 70,
    downThreshold = 65,
    upThreshold = 40,
    minToggleIntervalMs = 250,
  } = options;

  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const accumDown = useRef(0);
  const accumUp = useRef(0);
  const rafId = useRef<number | null>(null);
  const lastToggleTime = useRef<number>(0);
  const visibleRef = useRef(true);

  // Keep ref synchronized with state to read current state synchronously in rAF
  visibleRef.current = visible;

  // Reset to visible whenever the route changes
  useEffect(() => {
    setVisible(true);
    visibleRef.current = true;
    accumDown.current = 0;
    accumUp.current = 0;
    lastToggleTime.current = 0;
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
      const now = performance.now();
      const rawScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;

      // 1. If user is in iOS top rubber-band overscroll (negative scrollY) or at top
      if (rawScrollY <= 0) {
        if (!visibleRef.current) {
          setVisible(true);
          visibleRef.current = true;
          lastToggleTime.current = now;
        }
        accumDown.current = 0;
        accumUp.current = 0;
        lastScrollY.current = 0;
        rafId.current = null;
        return;
      }

      const currentScrollY = rawScrollY;

      // 2. If any modal, drawer, or sheet locks the body, or an input is focused, keep navigation visible
      if (
        document.body.style.overflow === "hidden" ||
        document.body.classList.contains("overflow-hidden") ||
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        if (!visibleRef.current) {
          setVisible(true);
          visibleRef.current = true;
          lastToggleTime.current = now;
        }
        lastScrollY.current = currentScrollY;
        rafId.current = null;
        return;
      }

      // 3. Always fully visible near the top of the page
      if (currentScrollY <= topThreshold) {
        if (!visibleRef.current) {
          setVisible(true);
          visibleRef.current = true;
          lastToggleTime.current = now;
        }
        accumDown.current = 0;
        accumUp.current = 0;
        lastScrollY.current = currentScrollY;
        rafId.current = null;
        return;
      }

      // 4. Ignore iOS bottom rubber-band bounce
      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      if (currentScrollY >= maxScrollY - 30) {
        lastScrollY.current = currentScrollY;
        rafId.current = null;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Check toggle cooldown to completely prevent rapid flickering / stuttering
      const canToggle = now - lastToggleTime.current >= minToggleIntervalMs;

      if (delta > 0) {
        // Downward scroll
        accumUp.current = 0;
        accumDown.current += delta;

        if (
          accumDown.current >= downThreshold &&
          canToggle &&
          visibleRef.current
        ) {
          setVisible(false);
          visibleRef.current = false;
          lastToggleTime.current = now;
          accumDown.current = 0;
        }
      } else if (delta < 0) {
        // Upward scroll
        accumDown.current = 0;
        accumUp.current += Math.abs(delta);

        if (
          accumUp.current >= upThreshold &&
          canToggle &&
          !visibleRef.current
        ) {
          setVisible(true);
          visibleRef.current = true;
          lastToggleTime.current = now;
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
  }, [topThreshold, downThreshold, upThreshold, minToggleIntervalMs]);

  return visible;
}
