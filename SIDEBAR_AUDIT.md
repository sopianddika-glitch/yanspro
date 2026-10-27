# Collapsible sidebar — 27 October 2026

The header page list has been replaced by a grouped left navigation. All 11 existing destination pages remain available, and the invoice editor highlights Invoices.

## Behavior

- At 1024 px and above, the sidebar occupies 256 px when expanded and 80 px when minimized. The header toggle and sidebar footer toggle both control it. The selected preference is stored in browser localStorage.
- Below 1024 px, navigation is a drawer capped at 288 px, with a 48 px minimum backdrop area on narrow screens. It closes after navigation, via the close button, Escape, or a backdrop click.
- Menu groups distinguish overview, business operations, and planning. Settings remains in a fixed footer, while the main menu scrolls independently on short screens.
- Active rows use an accent edge, tinted icon background, and status dot. Compact rows retain accessible names and show tooltips on hover or keyboard focus.
- The mobile drawer receives and traps keyboard focus; background workspace content becomes inert. Closing restores focus to the opener. Switching across the desktop breakpoint clears the drawer and backdrop.
- Minimize/expand preserves the currently mounted page and unsaved form input. Navigating to another page resets the main scroll position.
- Transitions use CSS only (180 ms for panel movement/width) and honor reduced-motion preferences. No runtime package was added.

## Validation

All **512 samples/assertions passed**:

- 396 development layout/navigation samples across all 11 pages, widths 320/375/768/1024/1440/1920, expanded/compact desktop modes, English/Indonesian, and light/dark themes.
- 99 equivalent layout/navigation samples on the final production bundle in English/light mode.
- 17 production interaction assertions: persistence after reload; invoice-editor active state; draft preservation; scroll reset; full-viewport transaction modal; keyboard tooltip; drawer initial focus/background inertness; forward/reverse Tab wrapping; Escape restoration; closed-drawer inertness; backdrop dismissal; desktop breakpoint backdrop cleanup/background unlocking; return to mobile; reduced motion.

No unexpected viewport overflow or page runtime errors were observed. Production console: zero errors and warnings. Intentionally scrollable tables/charts were excluded from horizontal-overflow failures.

`npm run typecheck`, `npm run build:docs`, and `npm run build:pages` passed. Main JavaScript gzip size changed from 193.01 kB to 193.63 kB; CSS gzip size changed from 11.16 kB to 12.05 kB. This measures bundle size, not real-device rendering performance.

Visually reviewed desktop, compact, mobile, and short-mobile screenshots. Local command bodies/screenshots are in ignored `output/playwright/`. Tests used isolated Chromium storage; native Safari/iOS, physical devices, and assistive-technology applications were not exercised.

## Publication

Publish the committed `docs/` build through the existing GitHub Pages source `main:/docs`. The separate custom Actions workflow remains subject to the previously observed GitHub account billing lock.
