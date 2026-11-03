# dither-ui design

A shadcn registry of retro, e-ink, Win95-flavoured components. Web only. Installed like beui: `npx shadcn add @dither/window`.

## Decisions

1. **Fixed structure, swappable palettes.** Every theme shares the same window chrome, 1-bit borders, pixel + mono fonts, dithered fills and stepped motion. Themes change colors only.
2. **DOM is the truth, WebGL is an effects layer.** Components are real shadcn + Radix + Tailwind. One `EinkProvider` owns one WebGL2 context. Without the provider, or under `prefers-reduced-motion`, components render as static retro UI.
3. **Two layers.**
   - Layer 1 primitives are drop-in reskins of shadcn: same file names, exports and variant names.
   - Layer 2 compositions (`window`, `error-dialog`, ...) import only Layer 1, the engine and the tokens.
4. **Tokens.**
   - The full stock shadcn token set in shadcn's own format (`:root`, `.dark`, oklch, `@theme inline`).
   - Plus library-native tokens. The shader quantizes only to `--ink-0..3` and `--desktop`.

## Tokens

| Token | Meaning |
|---|---|
| `--ink-0` .. `--ink-3` | The theme's 4-color palette, darkest to lightest. The shader palette. |
| `--desktop` | Wallpaper or backdrop accent, the one color outside the inks. |
| `--bevel-hi`, `--bevel-lo` | Raised and sunken edge colors. |
| `--titlebar`, `--titlebar-foreground` | Active window title bar. |
| `--pixel` | Base pixel unit. Every border and offset shadow is a multiple of it. |
| `--eink-fps` | Frame rate of refresh sequences and stepped motion. |
| `--font-pixel`, `--font-mono` | Display and body fonts. |

Themes are selected with `data-theme` on `<html>`: `phosphor` (olive monochrome) and `cyan-pixel` (cream, black, cyan desktop).

Shades between inks are dither, never a fifth color: `dither-25`, `dither-50`, `dither-75` utilities mask a Bayer tile over `background-color`.

## Refresh model

```ts
type RefreshKind = "partial" | "region" | "full"
type RefreshPhase = "flash" | "invert" | "noise" | "clear"

const REFRESH_SEQUENCES: Record<RefreshKind, readonly RefreshPhase[]>
```

| Kind | E-ink name | Phases | Triggered by |
|---|---|---|---|
| `partial` | A2 / DU | noise, clear | hover, typing, slider drag, checkbox |
| `region` | GC16 | flash, invert, noise, clear | dialog open/close, tab switch, drop after drag |
| `full` | GC | flash, invert, flash, invert, noise, clear over the viewport | theme switch, every Nth region refresh |

- Each phase lasts one frame at `--eink-fps`.
- Dirty regions are batched per frame, and regions that overlap are merged.
- **Ghosting.** A partial refresh leaves a dithered snapshot of the element's previous DOM state. Ghosts accumulate until a region or full refresh over them clears them.
- **Dragging.** Position snaps at `--eink-fps` and leaves a ghost trail. Drop triggers a region refresh.

## Rendering

- **Overlay.** One fixed, full-viewport canvas with `pointer-events: none` draws refresh phases clipped to dirty rects.
- **`DitherImage`.** Renders through the same WebGL context: ordered Bayer dithering, quantized to the inks, then blitted to the image's own 2D canvas. When theme inks change, it re-renders.

## Registry

| Item | Type | Contents |
|---|---|---|
| `theme` | `registry:style` | Tokens, both themes, fonts, dither utilities |
| `eink` | `registry:lib` | Provider, engine, `useEinkRefresh`, `useSteppedDrag` |
| `dither-image` | `registry:ui` | Image dithering component |
| `button`, `checkbox`, `slider`, `progress`, `dialog` | `registry:ui` | Layer 1 primitives |
| `window`, `error-dialog` | `registry:block` | Layer 2 compositions |

Each item's `registryDependencies` pull in what it needs, so `shadcn add @dither/window` brings in everything below it.
