# Find Homes by Drive Time — Design Spec

**Date:** 2026-07-25
**Status:** Approved (design), pending implementation plan
**Owner:** SpaceFlex marketplace

## Summary

Turn the existing (but buried) commute filter into a **dedicated, discoverable
drive-time search experience** at `/drive-time`, with prominent navigation into
it from four places. Users add the real-world places their day revolves around
(office, school, mall, gym), set a drive-time budget, and immediately see the
homes that work for all — or any — of them, on a branded map and as live result
cards.

The commute **engine already exists** and is unchanged by this work
(`src/lib/geo.ts`, `src/lib/data/landmarks.ts`). This project is presentation
and navigation: a new destination page, a commute-aware map, and entry points.

## Goals

- A standalone, linkable, promotable drive-time page that feels like a first-
  class feature, not a hidden filter.
- Strong discovery: header nav, hero entry, homepage feature band, and the
  existing `/properties` "Commute" button all lead here.
- Modern UX fully aligned to the SpaceFlex design system (forest-green/ivory/
  gold, editorial type, glass, brand motion).
- Zero new runtime dependencies.

## Non-goals (YAGNI)

- No real tile map / Mapbox / Leaflet. The illustrative map stays, upgraded.
- No geocoder or arbitrary address / map-click pin drop. Places are chosen from
  the curated landmark set (the engine only knows curated lat/lng).
- No change to the drive-time math or the landmark dataset.
- No live routing API (drive times remain labelled estimates, as today).

## Decisions (locked during brainstorming)

| Question | Decision |
| --- | --- |
| Feature shape | Dedicated destination page |
| Input model | Flexible multi-place (N hubs, shared budget, all/any) |
| Map | Enhanced illustrative map (no dependency) |
| Entry points | All four: header nav, hero, homepage band, properties toolbar |
| Route | `/drive-time` |
| Nav label | "Drive Time" |
| Results | Live inline results + handoff to the full `/properties` explorer |

## Architecture

### Route
`src/app/drive-time/page.tsx` — server component shell (metadata, intro copy),
renders the client `DriveTimeSearch`.

### State & URL
`DriveTimeSearch` (client) owns:
- `hubIds: string[]` — selected landmark ids
- `maxCommute: number` — shared budget in minutes (default 25)
- `matchMode: "all" | "any"` — default "all"

URL is kept shareable with exactly the param shape the explorer already reads:
`/drive-time?hubs=l1,l7&commute=25&match=all`. Because the shape matches,
`/drive-time` and `/properties` are interoperable — state carries across the
handoff losslessly.

### Data flow
```
landmarks + selectedHubs ─┐
                          ├─ evaluateCommute(property, hubs, max, mode) per home
properties ───────────────┘        │
                                   ├─ passes → included in matches
                                   └─ commuteScore → "best commute" ordering
matches ─┬─ CommuteMap (markers, rings, pins)
         └─ PropertyCard[] (with commute verdict badges)
```

All filtering/scoring uses the existing `evaluateCommute` / `commuteScore` from
`geo.ts`. No new geo logic.

## Page layout

Full-height two-column experience beneath the sticky header; stacks on mobile.

```
Eyebrow: SEARCH BY COMMUTE
H1: Find homes by drive time
Sub: Add the places your day revolves around — we keep only the homes that reach them all.

┌─ LEFT  (setup, ~40%, scrolls) ─┬─ RIGHT (~60%, sticky) ─────────┐
│ • Place search + category tabs │ • CommuteMap                    │
│ • Selected place pills (A/B/C) │   – lettered hub markers        │
│ • Drive-time budget slider     │   – soft reach rings            │
│ • All / Any toggle (2+ places) │   – connector lines to matches  │
│ • Live matching PropertyCards  │   – priced home pins + preview  │
│                                │ • Live "N homes within reach"   │
│                                │ • "Open all N in full search →" │
└────────────────────────────────┴─────────────────────────────────┘
```

### Empty state (no places selected)
Mirrors the reference: a friendly two-step panel layered over the map —
"① Tell us the places you want to be near · ② Set your budget & criteria" — so
the page reads as intentional, never broken. Trending / suggested hubs (e.g.
West Bay, Education City, Villaggio) offered as one-tap starters.

### No-matches state (places selected, nothing passes)
Explains the binding constraint and offers concrete fixes: widen the budget,
switch "all places" → "any one", or remove the tightest place. Never a dead end.

## Components

### New

**`src/components/property/drive-time-search.tsx`** — `DriveTimeSearch` (client).
Orchestrates state, URL sync, matching, layout. Reuses the *logic* of the
existing `CommuteFilter` but re-composed for a spacious full-page left column
(the current `CommuteFilter` is tuned for a 26rem drawer). Selected places are
labelled A / B / C… to echo the reference's lettered points.

**`src/components/property/commute-map.tsx`** — `CommuteMap`. A sibling to
`MapPanel` in the same illustrative philosophy, but commute-aware:
- Selected hubs plotted as lettered brand-green markers with soft "reach" rings.
- Connector lines from hubs to homes that satisfy the budget.
- Priced pins for matching homes; hover/tap opens the existing-style preview card.
- Normalises lat/lng of hubs + matches into the panel viewport (same technique
  as `MapPanel`). Fully themed, offline, reduced-motion aware.

**Homepage feature band** (e.g. `src/components/home/drive-time-band.tsx`) — a
branded section: eyebrow + heading + supporting copy + a two-step illustration
echoing the reference tile + CTA to `/drive-time`.

### Reused unchanged
`src/lib/geo.ts`, `src/lib/data/landmarks.ts`, `src/lib/landmark-icons.ts`,
`PropertyCard` (with its `commute` prop + badges), `Button`/`ButtonLink`,
`field` primitives, all design tokens.

### Light edits
- `src/components/site/header.tsx` — add "Drive Time" to `nav` (desktop + mobile
  menu inherit it automatically).
- `src/components/home/hero-search.tsx` — add a slim "Find homes by drive time"
  pill/link beneath the search bar, routing to `/drive-time`.
- `src/app/page.tsx` — place the drive-time band among existing homepage sections.
- `src/components/property/explorer.tsx` — repoint the toolbar "Commute" button
  to link to `/drive-time` (carrying any active hubs in the URL). The drawer's
  commute section stays for in-results refinement.

## Handoff to the explorer

Primary CTA on the drive-time page: **"Open all N homes in full search"** →
`/properties?hubs=…&commute=…&match=…&sort=commute`. The explorer already
supports every one of these params, renders map view, best-commute sort, and
per-card commute badges — so the full results experience is the proven explorer,
not a re-implementation.

## Design system alignment

- Colours via tokens only (`--brass` emerald, `--gold`, `--ink`, `--paper`,
  `--surface`, `--line`). Dark mode inherited from token architecture.
- Type: `font-display` + `eyebrow` + fluid `text-h1`/`text-h2` scale.
- Motion: `--ease-out-expo`, `rise`/`rise-*` reveal on load, `card-hover`.
- Radius/elevation via `--radius-*` and `--shadow-*`.
- Reduced-motion honoured (global rule already in `globals.css`).

## Responsive & accessibility

- **Desktop:** two columns, right column sticky.
- **Mobile:** single column; map and results in a toggle (Map / List), with a
  sticky bottom bar showing "N homes within reach" + the full-search CTA.
- Place pickers: `aria-pressed` toggle buttons, searchable listbox semantics.
- Map pins: real `<button>`s with `aria-label` (title + price + drive time),
  keyboard focusable, visible focus ring (global `:focus-visible`).
- Live counts announced via `aria-live="polite"`.

## Edge cases

- No places selected → empty two-step state with suggested starters.
- Places selected, zero matches → guidance state (widen budget / any-one / drop
  tightest place).
- Single place → hide the All/Any toggle (meaningless with one place).
- Deep-linked URL with hubs → hydrate state from params on load.
- Drive times always labelled "est." (straight-line + typical traffic, not live
  routing), consistent with existing copy.

## Testing / verification

- Verify in the browser preview (dev server): page renders, adding places
  updates map + count + cards live, budget/mode changes refilter, empty and
  no-match states appear correctly, all four entry points navigate to
  `/drive-time`, and the "full search" CTA lands on `/properties` with commute
  params applied and best-commute sort active.
- Check console/network clean, responsive (mobile stack + toggle), and dark mode.

## Rollout

Additive — no data migration, no breaking changes to existing routes. The old
buried drawer path continues to work; the toolbar button simply now leads to the
better experience.
