# Responsive layout audit — 27 October 2026

## Changes

- Constrained dashboard grid tracks and children so content fits 320–375 px screens instead of being clipped by the main scroll container.
- Used the dynamic viewport height for the application shell and constrained dialogs, including scrollable profile forms and native date inputs.
- Kept the POS cart in a drawer below 1024 px, sized product columns from available space, and prevented the assistant button from covering checkout controls.
- Allowed large currency amounts and long identifiers to wrap in product, budget, goal, transaction, invoice, and enterprise views.
- Sized notifications to the viewport, reserved bottom scrolling space for the floating assistant, and added safe-area spacing.
- Restored navigation to the existing Reports and Clients pages. Added an accessible navigation-toggle name and Escape dismissal with focus restoration.
- Removed the global minimum-height override on Recharts internals, gave the expense chart a definite height, and supplied initial chart dimensions.
- Shared concurrent encryption-key creation and prevented obsolete asynchronous saves from overwriting newer state. Storage-write failures now show an error notification; legacy data is removed only after its replacement is stored.
- Refreshed the committed static `docs/` fallback.

## Validation

- `npm run typecheck` passed.
- `npm run build:pages` and `npm run build:docs` passed.
- Chromium production preview: **207 geometry samples, zero unexpected horizontal-overflow failures**. This comprises 11 pages and six Settings detail panels at widths 320, 375, 768, 1024, 1440, and 1920 px in both English and Indonesian, plus three POS/dialog samples. Tables and explicitly scrollable charts are allowed to scroll inside their containers.
- Visually inspected screenshots of the mobile/desktop dashboard and desktop POS. Checked the tablet cart drawer and the product dialog at 320 × 480 px; its Save button remained visible.
- Created a test product with a long name and price `$1,234,567,890,123.00` in an isolated browser session. It remained available after reload and its price was no longer clipped.
- Twenty simultaneous encryptions on a newly created key all produced ciphertext and decrypted to their original values.
- Navigation Escape dismissal restored focus to the toggle.
- Eleven additional 320 px dark-theme page samples passed; the final production navigation Escape behavior was rechecked after the focus guard change.

Local browser evidence and the audit command body are in ignored `output/playwright/`; test data is confined to the isolated browser profile and is not included in the deployment.

## Scope limits

Geometry samples are layout checks, not proof of every business workflow. Native iOS/Safari, Android keyboard/safe-area behavior, physical devices, camera permissions, AI requests, printing, and Electron packaging were not exercised. Autosave remains browser-local and asynchronous; this change does not add cross-device synchronization or guarantee completion when a browser is terminated during a save. The build reports an outdated Browserslist database warning.
