# Component catalogue

`/components` shows every `registry:ui` and `registry:block` item from `registry.json` as a card in a bento grid: title, description, a copyable `npx shadcn add @dither/<name>` command, and one labelled cell per variant. New components appear automatically once they have a registry item and a demo.

## Sub-features

- `catalogue-pickup` every showcased registry item has a card, in registry order, and nothing else does.
- `catalogue-cells` each variant cell is sized by its content and nothing paints outside it.
- `catalogue-style` every rendered element stays on the four inks, square, unblurred and untweened.
- `catalogue-copy` the Copy button copies the install command and shows `Copied`.
- `catalogue-responsive` one column under 768px, no sideways page scroll at 375px.

## How to get to it (user POV)

- Open `http://localhost:3000/components`.
- From the desktop, Start > `Components`, or the `Components` link on the taskbar.

## Driving it with dither.mjs

Preconditions:

- `doctor` is healthy.
- `node scripts/generate-showcase-index.mjs` reports `<n> showcased item(s)` with the number of ui and block items in `registry.json`.

- **Pickup.** Run `node scripts/generate-showcase-index.mjs`. It exits 0 and names the item count. A missing demo exits 1 naming `components/showcase/demos/<name>.tsx`.
- **Cells, style, responsive.** Run `node .claude/skills/verify-dither-ui/dither.mjs audit 1440 900 375`. Every `/components` line reads `offPalette 0, rounded 0, tweened 0, translucent 0, overflow 0`, console errors are 0, and `audit.json` shows `cells` equal to the total variant count shown in the page header.
- **One card by eye.** Run `node .claude/skills/verify-dither-ui/dither.mjs shot <name> phosphor-light` and the same with `cyan-pixel-dark`. Look at both PNGs: every variant visible, nothing clipped, labels legible.
- **Copy.** The headless browser has no clipboard permission. Verify by hand in a real browser, or treat it as unverified and say so.

## Gotchas

- While `next dev` is already running, adding a demo does not regenerate the index. Run `node scripts/generate-showcase-index.mjs` by hand; `predev`, `prebuild` and `registry:build` run it automatically.
- `cn` merges conflicting classes, so a drifting class in a component can render correctly and pass the audit. `npm run check:style` catches it in source. Run both.
- `--radius` is 0 in every theme, so `rounded-md` renders square. Only the static check sees it.
- A demo that renders a floating composition (error dialogs) portals into an inert frame inside its cell; it is static on purpose.
