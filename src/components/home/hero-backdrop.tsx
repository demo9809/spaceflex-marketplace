/* Animated "estate aurora" hero backdrop — brand greens with a gold
   ember, a slowly panning blueprint grid, and film grain. Pure CSS,
   GPU-composited transforms only; stills gracefully under
   prefers-reduced-motion via the global override. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#062019]">
      {/* Base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, #0e3a2b 0%, #082a20 45%, #062019 100%)",
        }}
      />

      {/* Aurora fields */}
      <div
        className="aurora left-[-15%] top-[-25%] h-[70vh] w-[70vw] opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgb(32 118 84 / 0.85), transparent 70%)",
          animation: "drift-a 26s ease-in-out infinite",
        }}
      />
      <div
        className="aurora right-[-20%] top-[5%] h-[65vh] w-[65vw] opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgb(18 92 78 / 0.9), transparent 70%)",
          animation: "drift-b 32s ease-in-out infinite",
        }}
      />
      <div
        className="aurora bottom-[-20%] left-[20%] h-[55vh] w-[55vw] opacity-45"
        style={{
          background:
            "radial-gradient(closest-side, rgb(174 138 78 / 0.55), transparent 70%)",
          animation: "drift-c 38s ease-in-out infinite",
        }}
      />

      {/* Blueprint grid, slowly panning */}
      <div className="blueprint-grid absolute inset-0" />

      {/* Legibility vignette + grain */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
