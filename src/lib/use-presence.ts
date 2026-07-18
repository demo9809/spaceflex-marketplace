"use client";

import { useEffect, useState } from "react";

/* Mount/unmount transition helper: `mounted` keeps the node in the tree
   through the exit animation; `shown` drives the CSS transition state. */
export function usePresence(open: boolean, duration = 420) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true))
      );
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [open, duration]);

  return { mounted, shown };
}
