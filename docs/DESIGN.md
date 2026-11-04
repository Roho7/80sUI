# dither-ui design

A shadcn registry of retro, 1-bit, Win95-flavoured components. Web only. Installed like beui: `npx shadcn add @dither/window`.

## Decisions

1. **Fixed structure, swappable palettes.** Every theme shares the same window chrome, 1-bit borders, pixel + mono fonts and dithered fills. Themes change colors only.
2. **DOM only, except opt-in WebGL shader components.** Components are real shadcn + Radix + Tailwind with no provider, overlay canvas or refresh animation. Dithering is CPU ordered Bayer: `DitherImage` quantizes to the inks in `lib/dither` and re-renders when the theme's inks change. The exception is opt-in shader components such as `dither-shine`: each owns its own WebGL2 canvas. `cta-button` uses one over a solid CSS fill, which is all that shows under SSR, without WebGL, when disabled or with reduced motion.
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
| `--keycap`, `--keycap-foreground` | Keycap face and label for `CtaButton`. |
| `--keycap-wall-hi`, `--keycap-wall-lo`, `--keycap-outline` | Keycap top and left walls, right and bottom walls, and the outline. |
| `--pixel` | Base pixel unit. Every border and offset shadow is a multiple of it, and window drags snap to it. |
| `--font-pixel`, `--font-mono` | Display and body fonts. |

Themes are selected with `data-theme` on `<html>`: `phosphor` (olive monochrome) and `cyan-pixel` (cream, black, cyan desktop).

Shades between inks are dither, never a fifth color: `dither-25`, `dither-50`, `dither-75` utilities mask a Bayer tile over `background-color`.

## Primitive conventions

- No opacity, radius, fade, zoom or slide. Disabled is `muted-foreground` text or a dithered overlay, and overlays open in one frame.
- Menus (`select`, `dropdown-menu`, `menubar`, the taskbar start menu) share one look: `popover` box with `offset-shadow-2`, items highlighted by a `foreground` bar with `popover` text, etched separators from `bevel-lo` over `bevel-hi`, indicators on the left from `pixel-glyphs`.
- Fields are sunken (`bevel-sunken`), thumbs and toggles raised (`bevel-raised`). `--offset-shadow` inherits, so a beveled element inside a shadowed one adds `offset-shadow-none`.
- Invalid fields and the destructive badge use a dashed border; destructive alerts and buttons invert. In both shipped palettes `destructive` equals `foreground`, so the border style carries the meaning.
- Focus uses the global dashed `:focus-visible` outline in `--pixel`.

## Rendering

- **`DitherImage`.** Draws the source into a small canvas, applies ordered Bayer (4x4 or 8x8) thresholds on the CPU, quantizes to the four inks and puts the result on its own canvas. A `MutationObserver` on `<html>` `class`, `data-theme` and `style` re-renders it when the inks change. `isAnimated` reseeds the matrix offset at 12 fps.
- **`Window`.** With `defaultPosition` it is absolutely positioned and its title bar drags it with `useWindowDrag`, snapped to `--pixel`. Without one it renders in flow and does not drag.

## Shaders

Shader components follow the structure of [Paper Shaders](https://github.com/paper-design/shaders) (Apache-2.0, credited in `NOTICE`). We copy the pattern, not the code or the package.

```ts
type ShaderMotionParams = { speed?: number; frame?: number; fps?: number }
type ShaderColorParam = string
type ShaderUniformValue = number | boolean | readonly number[]
type ShaderMountUniforms = Record<string, ShaderUniformValue>
type ShaderMountColors = Record<string, ShaderColorParam>
type ShaderPreset<Params> = { name: string; params: Params }
```

- **`ShaderMount`** (`lib/shaders/shader-mount.ts`) is framework-agnostic. `ShaderMount.create(parent, fragmentShader, uniforms, colors, motion)` returns `null` instead of throwing when WebGL2 or the program is unavailable. Each mount owns one canvas and one WebGL2 context, draws a fullscreen triangle from `gl_VertexID`, sizes the canvas to the parent in device pixels with a `ResizeObserver`, and pauses on an `IntersectionObserver` and `document.hidden`. `setUniforms`, `setColors`, `setSpeed`, `setFps`, `setFrame` and `dispose`. Uniform writes are diffed. Built-in uniforms are `u_time` (seconds), `u_resolution`, `u_pixelRatio` and `u_pxSize`.
- **One module per shader** in `lib/shaders/<name>.ts` exports `<name>FragmentShader`, `<Name>Uniforms` (GPU side), `<Name>Colors`, `<Name>Params` (user side), enum maps such as `DitherShineTypes`, `defaultPreset` and `<name>Presets`.
- **React** has a thin `components/ui/shader-mount.tsx` that creates the mount in an effect and pushes only the uniforms and colors whose props changed, and one `memo` component per shader that maps params to uniforms with defaults from `defaultPreset`. `onMountChange` hands the vanilla mount to a parent that drives uniforms imperatively.

Where we differ from Paper:

1. **Stepped time.** The mount draws only when a 1/`fps` step elapses (default 10 fps), advancing shader time by `speed / fps` per step. With `speed` 0 there is no `requestAnimationFrame`; a uniform, color or frame change schedules one draw on the next wall-clock step boundary. A resize draws immediately because it clears the canvas.
2. **Theme colors.** Color params take a custom property name such as `"--primary"` or a literal color. The mount resolves them from the parent's computed style through the `lib/dither/inks.ts` probe into `vec4`s and re-resolves when `<html>` changes `class`, `data-theme` or `style`.
3. **Pixel grid.** `u_pxSize` is the `--pixel` token in device pixels. Shaders compute their grid from `gl_FragCoord` measured from the top-left, so dither cells line up with every border.
4. **Hover is DOM, not shader.** `CtaButton` is a keycap: its face is the padding box (where the shine canvas sits) and its four walls are CSS borders in `--keycap-wall-hi` (top, left) and `--keycap-wall-lo` (right, bottom), which meet in mitred corners. The pointer is quantized to 5 levels per axis and written as `--tilt-x`, `--tilt-y` and `--tilt-lift` once per 1/`fps` step; wall widths move from one side to the opposite side, so the face slides toward the pointer while the outer size stays fixed.

## Sound

Sound is opt-in: components never import it. Installing `@dither/sound` and rendering `<DitherSounds />` once turns it on.

- **`sounds.json`** in the project root (where `@/sounds.json` resolves) is the single place every sound is configured: `enabled`, `volume`, `reducedMotion` and a flat `sounds` map keyed like `button.press`. An entry is a patch (`layers` of sine, square, blend or noise with an envelope, pitch drop, optional filter, plus `jitter`, `crush` and, for `.tick` sounds, a `detent`), a `loop` for continuous drags, or `false` to silence it. `/schema/sounds.json` is its JSON Schema.
- **Growing it.** `shadcn add` cannot merge JSON, so each component's registry item lists its sound keys in `meta.sounds`, and `npm run registry:build` embeds their data from the repo's `sounds.json` (`scripts/build-sound-meta.mjs`). In a user's project, `node scripts/dither-sounds.mjs sync` adds the entries of installed components only and never overwrites existing keys (`--overwrite` restores defaults).
- **`SoundEngine`** (`lib/sound/sound-engine.ts`) is framework-agnostic: one shared AudioContext created on the first gesture, every patch rendered on the CPU (`lib/sound/render.ts`) into six jittered buffers played round-robin, envelopes that end at exactly zero, `step()` for detents (spread, collapse or per-event, with a minimum gap and a look-ahead cap), `startLoop()` for drags, and a runtime `setEnabled` stored in localStorage that wins over `enabled`.
- **Event delegation, not props.** `attachSoundSlots` (`lib/sound/sound-slots.ts`) maps `data-slot` to a sound and a gesture: press and release for buttons and `*-trigger`s, on and off for checkbox and switch, select for radio items, tabs and menu items, ticks from `aria-valuenow` for sliders, pick-up, friction and drop from `data-dragging` for windows. Pointer gestures play on pointer down; keyboard changes play from the attribute mutation. `data-sound="key"` renames an element's sound and `data-sound="none"` silences it.
- **React** has `<DitherSounds />`, `useSoundEnabled()` and `useSound(key)`. Under `prefers-reduced-motion`, `"thin"` collapses drag ticks and skips loops; `"mute"` silences everything.
- `/sound-lab` is the sound designer: every component with its real sounds and knob editors. Under `next dev`, "save to sounds.json" (per sound or for every edit) posts to `app/sound-lab/save/route.ts`, which validates the entries and merges them into the repo's `sounds.json`; it refuses outside development and from other origins.

## Registry

| Item | Type | Contents |
|---|---|---|
| `theme` | `registry:style` | Tokens, both themes, fonts, dither utilities |
| `pixel-glyphs` | `registry:lib` | Check, minus, close, chevron, arrow, dot, radio and error glyphs plus 16x16 folder, document and terminal icons |
| `dither-inks` | `registry:lib` | `lib/dither/inks.ts`: the color probe and the theme observer |
| `dither-image` | `registry:ui` | Image dithering component plus the rest of `lib/dither` |
| `shader-mount` | `registry:lib` | `lib/shaders/types.ts`, `lib/shaders/shader-mount.ts` and `components/ui/shader-mount.tsx` |
| `dither-shine` | `registry:ui` | `lib/shaders/dither-shine.ts` and its `DitherShine` component |
| `cta-button` | `registry:ui` | Call-to-action button over `dither-shine` |
| `sound` | `registry:lib` | `lib/sound/*`, `hooks/use-sound.ts`, `<DitherSounds />`, a starter `sounds.json` and `scripts/dither-sounds.mjs` |
| `button`, `checkbox`, `slider`, `progress`, `dialog`, `input`, `textarea`, `label`, `radio-group`, `switch`, `select`, `tabs`, `tooltip`, `dropdown-menu`, `menubar`, `scroll-area`, `separator`, `badge`, `alert`, `card`, `accordion` | `registry:ui` | Layer 1 primitives |
| `window`, `error-dialog`, `terminal`, `taskbar`, `desktop-icon` | `registry:block` | Layer 2 compositions. `window` ships `hooks/use-window-drag.ts` |

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
- Variant cells are sized by their content, never by a guessed column width: a wrapping flex row where each cell has `flex-basis: content`, grows to fill its line, and never shrinks below `min(100%, --cell-min)`. Only a component wider than the whole card scrolls, inside its own cell. Demos never need width hacks.
- Helper items that are not user-facing components use `registry:lib` so they stay out of the catalogue.
