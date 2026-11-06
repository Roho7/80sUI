# CTA keycap button

`CtaButton` is a C64-style keycap: a face over a WebGL dither shine that sweeps corner to corner at 10fps, surrounded by four border walls that meet in mitred corners. On hover the pointer is quantized to 5 levels per axis and the walls shift width from one side to the other once per frame step, so the key tilts toward the cursor while its outer size stays fixed.

## Sub-features

- `cta-rest` rest walls are top 1, right 2.5, bottom 3, left 2.5 `--pixel`s with a flush outline.
- `cta-shine` one shine canvas per key, drawing only on 100ms steps, paused offscreen.
- `cta-tilt` hover moves wall width toward the far side; leaving restores the rest walls.
- `cta-press` pressing flattens the walls and swaps their tones so the key reads as sunk.
- `cta-sizes` `sm`, `default`, `lg`; `asChild` renders a link; disabled has no shine.
- `cta-reduced-motion` no shine canvas and no tilt under `prefers-reduced-motion: reduce`.

## How to get to it (user POV)

- `/components`, card `CTA Button` (`article#cta-button`): sizes, disabled, as link (`Get started`) and the glint preset hero (`Get UI95`).

## Driving it with dither.mjs

Preconditions:

- `doctor` is healthy.

- **Rest, tilt, release.** Run `node .claude/skills/verify-ui95/dither.mjs journey cta-button`. It reads the computed wall widths of `button "Get UI95"` at rest (`2,5,6,5` px), after hovering 3px inside the top-left corner (left and top walls thinner, right and bottom thicker), after the bottom-right corner (mirrored), and after leaving (back to rest), and checks the outer box never changes size. Screenshots `rest.png`, `hover-top-left.png` and `hover-bottom-right.png` land in the evidence directory.
- **Look at it.** Open `hover-top-left.png`. The face sits toward the top-left with a deep dark skirt on the right and bottom.
- **Press.** Headless `:active` lasts only while the mouse is down. Hold it in a journey with `page.mouse.down()`, read the walls, then `page.mouse.up()`. The pressed walls are top 2, right 2.5, bottom 2.5, left 2 `--pixel`s with the light and dark tones swapped.
- **Reduced motion.** Create the page with `reducedMotion: "reduce"` in a journey. `button.locator("canvas")` has count 0 and hovering leaves the walls at rest.

## Gotchas

- Tilt updates on a 100ms timer. Wait at least one step (`waitForTimeout(350)`) before reading walls after a pointer move.
- The label is the same color as the shine front. Where the band is solid, letters disappear for a frame; this is a known open design issue, not a regression.
- Half-step tilt positions move walls by 1px, half of `--pixel`. That is intentional.
- The shine colors are fixed to the keycap tokens. Passing `colorBack` or `colorFront` through `shine` has no effect by design.
