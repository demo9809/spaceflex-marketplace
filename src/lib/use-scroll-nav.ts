"use client";

/**
 * Hook to manage navigation visibility during scroll.
 * On mobile iOS / touch devices, artificially hiding the navigation bars on 15px scroll
 * creates layout thrashing and fights iOS Safari's native address-bar collapse gesture.
 * Returning a stable visible state allows iOS Safari to naturally collapse its browser
 * chrome without jumping, empty gaps, or sticky offset jitter.
 */
export function useScrollNav(): boolean {
  return true;
}
