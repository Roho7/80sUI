# dither-ui design

A shadcn registry of retro, 1-bit, Win95-flavoured components. Web only. Installed like beui: `npx shadcn add @dither/window`.

## Decisions

1. **Fixed structure, swappable palettes.** Every theme shares the same window chrome, 1-bit borders, pixel + mono fonts and dithered fills. Themes change colors only.
2. **DOM only, no effects layer.** Components are real shadcn + Radix + Tailwind with no provider, overlay canvas or refresh animation. Dithering is CPU ordered Bayer: `DitherImage` quantizes to the inks in `lib/dither` and re-renders when the theme's inks change.
3. **Two layers.**
   - Layer 1 primitives are drop-in reskins of shadcn: same file names, exports and variant names.
   - Layer 2 compositions (`window`, `error-dialog`, ...) import only Layer 1, their own hooks and the tokens.
4. **Tokens.**
   - The full stock shadcn token set in shadcn's own format (`:root`, `.dark`, oklch, `@theme inline`).
   - Plus library-native tokens. Dithering quantizes only to `--ink-0..3`.

## Tokens

| Token | Meaning |
|---|---|
| `--ink-0` .. `--ink-3` | The theme's 4-color palette, darkest to lightest. The dither palette. |
| `--desktop` | Wallpaper or backdrop accent, the one color outside the inks. |
| `--bevel-hi`, `--bevel-lo` | Raised and sunken edge colors. |
| `--titlebar`, `--titlebar-foreground` | Active window title bar. |
| `--pixel` | Base pixel unit. Every border and offset shadow is a multiple of it, and window drags snap to it. |
| `--font-pixel`, `--font-mono` | Display and body fonts. |

Themes are selected with `data-theme` on `<html>`: `phosphor` (olive monochrome) and `cyan-pixel` (cream, black, cyan desktop).

Shades between inks are dither, never a fifth color: `dither-25`, `dither-50`, `dither-75` utilities mask a Bayer tile over `background-color`.

## Rendering

- **`DitherImage`.** Draws the source into a small canvas, applies ordered Bayer (4x4 or 8x8) thresholds on the CPU, quantizes to the four inks and puts the result on its own canvas. A `MutationObserver` on `<html>` `class`, `data-theme` and `style` re-renders it when the inks change. `isAnimated` reseeds the matrix offset at 12 fps.
- **`Window`.** With `defaultPosition` it is absolutely positioned and its title bar drags it with `useWindowDrag`, snapped to `--pixel`. Without one it renders in flow and does not drag.

## Registry

| Item | Type | Contents |
|---|---|---|
| `theme` | `registry:style` | Tokens, both themes, fonts, dither utilities |
| `pixel-glyphs` | `registry:lib` | Check, minus, close and error glyphs shared by the primitives |
| `dither-image` | `registry:ui` | Image dithering component plus `lib/dither` |
| `button`, `checkbox`, `slider`, `progress`, `dialog` | `registry:ui` | Layer 1 primitives |
| `window`, `error-dialog` | `registry:block` | Layer 2 compositions. `window` ships `hooks/use-window-drag.ts` |

Each item's `registryDependencies` pull in what it needs, so `shadcn add @dither/window` brings in everything below it.

## Showcase

`/components` is a bento catalogue of every `registry:ui` and `registry:block` item, generated from `registry.json`.

```ts
type ShowcaseSpan = "single" | "wide" | "tall" | "large"
type ShowcaseVariant = { label: string; render: () => React.ReactNode }
type ShowcaseDemo = { span: ShowcaseSpan; variants: readonly ShowcaseVariant[] }
```

- Adding a component means adding its registry item and `components/showcase/demos/<item-name>.tsx` exporting `demo: ShowcaseDemo`. Nothing else.
- `scripts/generate-showcase-index.mjs` writes `components/showcase/demos.generated.ts` in registry order. It fails, naming the file, when a showcased item has no demo or a demo has no showcased item. It runs in `predev`, `prebuild` and `registry:build`; run it by hand while `next dev` is already up. Commit the generated file.
- A demo shows every exported variant, size and state. Overlays open from a trigger. Floating compositions render as static instances inside their card.
- Spans: `single` 4 of 12 columns, `wide` 8, `tall` 4 by 2 rows, `large` 8 by 2 rows, packed with `grid-flow-row-dense`. One column under `md`.
- Helper items that are not user-facing components use `registry:lib` so they stay out of the catalogue.
