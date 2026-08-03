"use client";

import { useEffect, useState, useRef } from "react";

export function useScrollNav() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const accumDelta = useRef(0);

  useEffect(() => {
    lastScrollY.current = Math.max(
      window.scrollY || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0
    );

    const onScroll = () => {
      const currentScrollY = Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

      // At the top of the page (or within top 20px), always show navigation
      if (currentScrollY <= 20) {
        setVisible(true);
        accumDelta.current = 0;
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Reset accumulator when scroll direction reverses
      if ((delta > 0 && accumDelta.current < 0) || (delta < 0 && accumDelta.current > 0)) {
        accumDelta.current = delta;
      } else {
        accumDelta.current += delta;
      }

      // 15px threshold before toggling to prevent flickering
      if (accumDelta.current > 15) {
        // Scrolled down -> hide
        setVisible(false);
        accumDelta.current = 0;
      } else if (accumDelta.current < -15) {
        // Scrolled up -> show
        setVisible(true);
        accumDelta.current = 0;
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return visible;
}
