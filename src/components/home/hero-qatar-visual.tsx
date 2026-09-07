"use client";

import { useId } from "react";

/**
 * HeroQatarVisual — High-fidelity animated abstract Qatar visual for the hero.
 *
 * Visual Features (strictly matching the reference):
 * - Flowing generative parametric ribbon wave in Qatar Maroon (#8A1538) and deep crimson
 * - Distinctive 9-point serrated Qatar flag architectural geometry integrated seamlessly into the wave
 * - Multi-layered wireframe lines with luminous crests and subtle ambient glow
 * - Slow, organic breathing/undulation and continuous traveling light pulses along the curves
 * - Confined to the right side of the hero, leaving text and search 100% unobstructed
 * - Graceful responsive adaptation on mobile
 */
export function HeroQatarVisual() {
  const id = useId();

  // Generate an expanded, dense harmonic bundle of flowing parametric ribbon curves
  // 1. Upper sweeping wave lines (fanning towards upper-right)
  const upperStrands = [
    { d: "M 120 380 C 320 350, 480 200, 680 150 C 800 120, 910 100, 1020 80", stroke: "url(#maroon-bright)", width: 1.6, opacity: 0.95, pulse: true },
    { d: "M 135 381 C 335 352, 495 208, 695 160 C 815 132, 920 114, 1018 96", stroke: "url(#maroon-glow)", width: 1.3, opacity: 0.85 },
    { d: "M 150 382 C 350 354, 510 216, 710 170 C 830 144, 930 128, 1015 112", stroke: "url(#maroon-glow)", width: 1.2, opacity: 0.8 },
    { d: "M 165 383 C 365 356, 525 224, 725 180 C 845 156, 940 142, 1012 128", stroke: "url(#maroon-glow)", width: 1.1, opacity: 0.75 },
    { d: "M 180 384 C 380 358, 540 232, 740 190 C 860 168, 950 156, 1010 144", stroke: "url(#maroon-glow)", width: 1.0, opacity: 0.7 },
    { d: "M 195 385 C 395 360, 555 240, 755 200 C 875 180, 960 170, 1008 160", stroke: "url(#maroon-glow)", width: 1.0, opacity: 0.65 },
    { d: "M 210 386 C 410 362, 570 248, 770 210 C 890 192, 970 184, 1005 176", stroke: "url(#maroon-glow)", width: 0.9, opacity: 0.6 },
    { d: "M 225 387 C 425 364, 585 256, 785 220 C 905 204, 980 198, 1002 192", stroke: "url(#maroon-glow)", width: 0.9, opacity: 0.55 },
    { d: "M 240 388 C 440 366, 600 264, 800 230 C 920 216, 990 212, 1000 208", stroke: "url(#maroon-glow)", width: 0.8, opacity: 0.5 },
  ];

  // 2. Mid ribbon bundle (weaving around and accentuating the Qatar serrated core)
  const midStrands = [
    { d: "M 100 376 C 280 348, 440 260, 620 245 C 750 235, 870 250, 990 280", stroke: "url(#maroon-bright)", width: 1.5, opacity: 0.9, pulse: true },
    { d: "M 115 377 C 295 350, 455 272, 635 260 C 765 252, 880 274, 988 310", stroke: "url(#maroon-glow)", width: 1.2, opacity: 0.8 },
    { d: "M 130 378 C 310 352, 470 284, 650 275 C 780 269, 890 298, 985 340", stroke: "url(#maroon-glow)", width: 1.1, opacity: 0.75 },
    { d: "M 145 379 C 325 354, 485 296, 665 290 C 795 286, 900 322, 982 370", stroke: "url(#maroon-glow)", width: 1.1, opacity: 0.7 },
    { d: "M 160 380 C 340 356, 500 308, 680 305 C 810 303, 910 346, 980 400", stroke: "url(#maroon-bright)", width: 1.4, opacity: 0.85, pulse: true },
    { d: "M 175 381 C 355 358, 515 320, 695 320 C 825 320, 920 370, 978 430", stroke: "url(#maroon-glow)", width: 1.0, opacity: 0.65 },
    { d: "M 190 382 C 370 360, 530 332, 710 335 C 840 337, 930 394, 975 460", stroke: "url(#maroon-glow)", width: 1.0, opacity: 0.6 },
    { d: "M 205 383 C 385 362, 545 344, 725 350 C 855 354, 940 418, 972 490", stroke: "url(#maroon-glow)", width: 0.9, opacity: 0.55 },
    { d: "M 220 384 C 400 364, 560 356, 740 365 C 870 371, 950 442, 970 520", stroke: "url(#maroon-glow)", width: 0.9, opacity: 0.5 },
  ];

  // 3. Lower sweeping fan lines (fanning towards lower-right)
  const lowerStrands = [
    { d: "M 110 378 C 290 355, 450 360, 610 395 C 750 425, 870 495, 968 575", stroke: "url(#maroon-bright)", width: 1.5, opacity: 0.9, pulse: true },
    { d: "M 125 379 C 305 358, 465 374, 625 415 C 765 448, 880 525, 965 610", stroke: "url(#maroon-glow)", width: 1.2, opacity: 0.8 },
    { d: "M 140 380 C 320 361, 480 388, 640 435 C 780 471, 890 555, 962 645", stroke: "url(#maroon-glow)", width: 1.1, opacity: 0.75 },
    { d: "M 155 381 C 335 364, 495 402, 655 455 C 795 494, 900 585, 958 680", stroke: "url(#maroon-glow)", width: 1.0, opacity: 0.7 },
    { d: "M 170 382 C 350 367, 510 416, 670 475 C 810 517, 910 615, 955 715", stroke: "url(#maroon-glow)", width: 0.9, opacity: 0.6 },
    { d: "M 185 383 C 365 370, 525 430, 685 495 C 825 540, 920 645, 952 750", stroke: "url(#maroon-glow)", width: 0.8, opacity: 0.5 },
  ];

  // 4. Crossing counter-curves (giving the delicate wireframe harmonic mesh look)
  const meshStrands = [
    { d: "M 320 220 C 440 280, 580 390, 800 500", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.45 },
    { d: "M 360 195 C 480 270, 630 395, 840 520", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.4 },
    { d: "M 400 175 C 520 260, 680 400, 880 540", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.4 },
    { d: "M 440 160 C 560 252, 730 408, 920 560", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.35 },
    { d: "M 480 150 C 600 248, 780 418, 960 580", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.35 },
    { d: "M 520 144 C 640 246, 830 430, 1000 600", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.3 },
    { d: "M 560 140 C 680 246, 880 445, 1030 620", stroke: "url(#maroon-deep)", width: 0.8, opacity: 0.25 },
  ];

  // 9 Distinct Triangular Teeth of the Qatar Flag:
  // Points (peaks) extend rightward to X ~ 738, inner corners (valleys) at X ~ 688
  // Flowing back seamlessly into the folded architectural ribbon tail
  const serratedPoints = `
    M 684 195
    L 734 211 L 687 227
    L 738 243 L 689 259
    L 741 275 L 691 291
    L 743 307 L 693 323
    L 744 339 L 694 355
    L 743 371 L 693 387
    L 740 403 L 690 419
    L 735 435 L 685 451
    L 728 467 L 678 483
    C 620 465, 555 395, 560 335
    C 565 275, 620 210, 684 195 Z
  `;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 z-[2] h-full w-full overflow-hidden select-none"
    >
      {/* Soft ambient Qatar maroon radial luminescence behind the ribbon */}
      <div
        className="qatar-glow-pulse absolute -right-24 top-1/2 h-[75vh] w-[60vw] -translate-y-1/2 rounded-full opacity-65 blur-3xl pointer-events-none md:h-[95vh] md:w-[50vw]"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(160, 26, 68, 0.5) 0%, rgba(138, 21, 56, 0.35) 40%, rgba(92, 11, 36, 0.2) 65%, rgba(6, 32, 25, 0) 80%)",
        }}
      />

      {/* Main Animated SVG Canvas */}
      <svg
        className="qatar-visual-container absolute -right-16 top-16 h-[65vh] w-[140%] max-w-none opacity-45 sm:opacity-65 md:h-[115%] md:w-[78%] md:opacity-100 lg:w-[65%] xl:w-[58%] md:top-1/2 md:-translate-y-1/2 md:right-0"
        viewBox="0 0 1000 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid meet"
      >
        <defs>
          {/* Vivid Qatar Maroon Gradient */}
          <linearGradient id="maroon-glow" x1="100" y1="360" x2="1020" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8A1538" stopOpacity="0.0" />
            <stop offset="20%" stopColor="#8A1538" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#B3204D" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#8A1538" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#580D24" stopOpacity="0.15" />
          </linearGradient>

          {/* Luminous Highlight Gradient (Catch-light along the crests) */}
          <linearGradient id="maroon-bright" x1="120" y1="360" x2="1030" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C42A58" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#E23E6F" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#FFF2F5" stopOpacity="0.98" />
            <stop offset="78%" stopColor="#D83063" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8A1538" stopOpacity="0.25" />
          </linearGradient>

          {/* Deep Shadow Counter-Strands */}
          <linearGradient id="maroon-deep" x1="280" y1="160" x2="1030" y2="640" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8A1538" stopOpacity="0.05" />
            <stop offset="45%" stopColor="#700E2B" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3B0515" stopOpacity="0.0" />
          </linearGradient>

          {/* Qatar Flag 9-Serrated Core Gradient (Crisp pure white with soft pearlescent gradient) */}
          <linearGradient id="qatar-serrated-grad" x1="560" y1="190" x2="745" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="40%" stopColor="#FAF2F4" stopOpacity="0.94" />
            <stop offset="75%" stopColor="#EFE3E6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E0C8CF" stopOpacity="0.7" />
          </linearGradient>

          {/* Serration Outline Gradient */}
          <linearGradient id="serrated-stroke" x1="560" y1="190" x2="745" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFEBF0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C42A58" stopOpacity="0.5" />
          </linearGradient>

          {/* Traveling Light Shimmer Gradient */}
          <linearGradient id="traveling-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            <animate attributeName="x1" from="-100%" to="200%" dur="8s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="300%" dur="8s" repeatCount="indefinite" />
          </linearGradient>

          {/* Drop shadow & glow filter for the 9 serrated teeth */}
          <filter id="serrated-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#8A1538" floodOpacity="0.75" />
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FFFFFF" floodOpacity="0.45" />
          </filter>

          {/* Soft bloom for luminous strands */}
          <filter id="soft-bloom" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── LAYER 1: Deep crossing counter-lines (Background Depth) ── */}
        <g className="qatar-layer-deep" opacity="0.85">
          {meshStrands.map((line, i) => (
            <path
              key={`cross-${i}`}
              d={line.d}
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* ── LAYER 2: Upper and mid wave strands (behind the serration) ── */}
        <g className="qatar-layer-back">
          {upperStrands.map((line, i) => (
            <path
              key={`upper-${i}`}
              d={line.d}
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          {midStrands.slice(0, 4).map((line, i) => (
            <path
              key={`mid-back-${i}`}
              d={line.d}
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* ── LAYER 3: Qatar 9-Serrated Flag Geometry ── */}
        <g className="qatar-serrated-core" filter="url(#serrated-glow)">
          {/* Outer diffuse halo */}
          <path
            d={serratedPoints}
            fill="url(#qatar-serrated-grad)"
            fillOpacity="0.3"
            transform="scale(1.025) translate(-14, -7)"
            filter="blur(14px)"
          />

          {/* Main solid serrated architectural facet */}
          <path
            d={serratedPoints}
            fill="url(#qatar-serrated-grad)"
            stroke="url(#serrated-stroke)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Internal architectural contour lines within the white body */}
          <path
            d="M 595 290 C 625 265, 660 245, 692 245"
            stroke="rgba(138, 21, 56, 0.35)"
            strokeWidth="1.1"
            fill="none"
          />
          <path
            d="M 580 325 C 620 310, 658 305, 696 310"
            stroke="rgba(138, 21, 56, 0.3)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 585 365 C 622 358, 660 368, 696 378"
            stroke="rgba(138, 21, 56, 0.3)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 602 405 C 635 410, 662 430, 688 445"
            stroke="rgba(138, 21, 56, 0.35)"
            strokeWidth="1.1"
            fill="none"
          />
        </g>

        {/* ── LAYER 4: Foreground wave strands (weaving in front of serration) ── */}
        <g className="qatar-layer-front">
          {midStrands.slice(4).map((line, i) => (
            <path
              key={`mid-front-${i}`}
              d={line.d}
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          {lowerStrands.map((line, i) => (
            <path
              key={`lower-${i}`}
              d={line.d}
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* ── LAYER 5: Moving light pulses along primary curves ── */}
        <g className="qatar-layer-pulses" filter="url(#soft-bloom)">
          {/* Upper Crest Light Pulse */}
          <path
            d="M 120 380 C 320 350, 480 200, 680 150 C 800 120, 910 100, 1020 80"
            stroke="url(#traveling-light)"
            strokeWidth="2.5"
            fill="none"
            className="qatar-light-pulse-1"
          />
          {/* Mid Flow Light Pulse */}
          <path
            d="M 160 380 C 340 356, 500 308, 680 305 C 810 303, 910 346, 980 400"
            stroke="url(#traveling-light)"
            strokeWidth="2.2"
            fill="none"
            className="qatar-light-pulse-2"
          />
          {/* Lower Sweep Light Pulse */}
          <path
            d="M 110 378 C 290 355, 450 360, 610 395 C 750 425, 870 495, 968 575"
            stroke="url(#traveling-light)"
            strokeWidth="2.2"
            fill="none"
            className="qatar-light-pulse-3"
          />
        </g>
      </svg>
    </div>
  );
}
