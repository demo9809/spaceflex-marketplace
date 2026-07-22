# SpaceFlex Marketplace

Premium real estate marketplace for Qatar — West Bay, The Pearl, Lusail, Msheireb, Al Waab and the wider Doha metro.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Lucide icons**. All routes prerender statically; the app runs with zero backend against a realistic mock-data layer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
```

## Design system — "Modern Estate Editorial"

Brand color is taken directly from the SpaceFlex logo gradient (`#082822 → #133f2f`). All tokens live in [src/app/globals.css](src/app/globals.css) as CSS variables mapped into Tailwind via `@theme` — a `.dark` block already carries a full dark-mode palette.

| Token | Role |
|---|---|
| `--ink` `#0b241d` | Text & dark surfaces (brand green-black) |
| `--paper` `#f6f5ef` | Page background (warm ivory) |
| `--brass` `#166246` | Interactive accent (brand emerald)* |
| `--gold` `#ae8a4e` | Support accent — star ratings, glow details |
| `--line / --muted / --faint` | Hairlines and text hierarchy |

*The token is named `brass` from the first design iteration; its value is now the brand emerald. Rename across the codebase if it bothers you.

**Type**: Plus Jakarta Sans (display, weights 500–800) + Instrument Sans (UI body), loaded via `next/font`. All-sans by design — no serif. Fluid scale in `--text-display/h1/h2/h3/h4`, with optical tracking that tightens as type scales up (`-0.03em` → `-0.042em` at hero sizes).

**Motion**: dependency-free. Scroll reveals use IntersectionObserver with a scroll-listener fallback ([reveal.tsx](src/components/motion/reveal.tsx)); overlays use a `usePresence` mount/unmount CSS-transition hook ([use-presence.ts](src/lib/use-presence.ts)). `prefers-reduced-motion` disables everything.

## Map & integrations

The search map is an intentional illustrative panel ([map-panel.tsx](src/components/property/map-panel.tsx)) that normalises real lat/lng into a styled canvas — swap the component body for Mapbox GL when a token is available. Forms simulate success states client-side; wire them to an API in place.

## Route map

| Route | Purpose |
|---|---|
| `/` | Editorial homepage: hero search, featured collection, Private Office, cities, projects, agents, journal |
| `/properties` | Search: filters drawer, sort, grid/list/map views, shareable URL state |
| `/properties/[slug]` | Detail: gallery + lightbox, key facts, amenities, mortgage widget, agent contact, similar homes |
| `/agents`, `/agents/[slug]` | Verified agent directory and profiles with listings & reviews |
| `/developers`, `/developers/[slug]`, `/developers/projects/[slug]` | Off-plan projects, developer track records, pre-launch interest |
| `/journal`, `/journal/[slug]` | Editorial with drop-cap article layout |
| `/reports`, `/calculators` | Market reports (email-capture) and mortgage/yield tools |
| `/saved`, `/compare` | localStorage-backed collection and side-by-side comparison (via card scale icon) |
| `/signin`, `/signup`, `/dashboard` | Auth screens and buyer workspace (overview, saved, messages, viewings, settings) |
| `/list-with-us`, `/about`, `/contact`, `/legal` | Agent plans & pricing, company, contact desks, legal |

Mobile gets a native-app treatment: bottom tab bar, bottom-sheet filters, sticky action bar on property detail, thumb-first controls.
