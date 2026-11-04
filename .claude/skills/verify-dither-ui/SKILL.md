---
name: verify-dither-ui
description: Verify the dither-ui component registry (Next.js showcase at /components, retro desktop at /, shadcn registry at /r/*.json) against its locked 1-bit retro style. Use after adding or changing any component, demo, token or shader, before committing, when asked to "verify", "check the style", "prove it works", or when something looks off-palette, rounded, smooth-animated or overflowing.
---

# Verify dither-ui

dither-ui is a shadcn registry with a locked style: four inks per theme, square corners, `--pixel`-multiple borders, stepped (never tweened) motion, dither instead of alpha, no comments anywhere. This skill proves a change keeps that style and that new components are built like the existing ones. Read `docs/DESIGN.md` for the rules themselves; this file is how to check them.

Everything runs through one helper from the repo root:

```bash
node .claude/skills/verify-dither-ui/dither.mjs <command>
```

## Launch

```bash
node .claude/skills/verify-dither-ui/dither.mjs up
```

- If a `next dev` from this repo already owns port 3000 (the user usually runs one), `up` reuses it and `down` will never stop it.
- Otherwise it starts `npm run dev -- --port 3000` detached, writes `.verify/dev.pid` and `.verify/dev.log`, and waits until `/components` serves the catalogue (the `id="button"` card), not merely until the port answers.
- `predev` regenerates the showcase index, so a fresh start always reflects `registry.json`.
- Next 16 refuses a second `next dev` in the same checkout, so two instances cannot run side by side. Do not try; reuse the running one. If port 3000 belongs to another project, `up` refuses; set `DITHER_PORT=3100` and rerun.
- The database, auth and seed data concepts do not apply: the app is static and has no backend.

## Doctor

```bash
node .claude/skills/verify-dither-ui/dither.mjs doctor
```

Read-only. Checks port 3000 is listening, its process runs from this repo, `/components` renders the catalogue, the registry serves `/r/button.json`, and Google Chrome is installed. Run it first whenever anything looks off; drive only a `doctor: healthy` instance.

## Static checks

```bash
node .claude/skills/verify-dither-ui/dither.mjs check
```

Runs `npm run lint`, `npm run typecheck`, `npm run check:style` and the showcase index generator. `check:style` (`scripts/check-style.mjs`) is the style contract in code. Its rules are a table you extend when a new convention is agreed:

| Rule | Catches |
|---|---|
| `no-rounded-corners` | any `rounded-*` except `rounded-none` |
| `no-smooth-motion` | `transition*`, `duration-*`, `ease-*`, tw-animate `fade/zoom/slide-in/out`, `animate-spin/pulse/bounce/ping` |
| `no-alpha-colors` | `bg-x/50`-style alpha and `opacity-*` |
| `no-soft-effects` | `shadow-sm..2xl`, `blur`, gradients, `drop-shadow` |
| `no-off-system-fonts` | `font-sans`, `font-serif` |
| `no-raw-border-widths` | `border-2/4/8` (use `pixel-border` or `border-(length:--pixel)`) |
| `no-literal-colors` | hex, `rgb()`, `hsl()`, `oklch()` in components and app |
| `no-framer-or-gsap` | `framer-motion`, `motion/react`, `gsap`, `react-spring` imports |
| `no-comments` | `//`, `/* */`, `{/* */}` in any source file, GLSL strings included |
| `roadmap-matches-registry` | a ticked `ROADMAP.md` entry that is not a shipped ui/block item, or a shipped item left unticked |
| `registry-*` | every component file ships in an item, every item file exists, every `@/` import is declared as a `@dither/*` registry dependency, every npm import is in the item's `dependencies`, every ui/block item depends on `@dither/theme` |

The generator fails if a `registry:ui` or `registry:block` item has no demo, or a demo has no item.

## Drive: the drift audit

```bash
node .claude/skills/verify-dither-ui/dither.mjs audit            # 1440 and 375
node .claude/skills/verify-dither-ui/dither.mjs audit 1440 900 375
```

Headless Chrome via `playwright-core` (channel `chrome`, no browser download). For each width and route it loads the page, then switches theme the way a user does: clicks the `Phosphor` / `Cyan pixel` buttons and the `Dark mode` checkbox (ARIA names from `app/_site/ThemeControls.tsx`), waits for `<html data-theme>` and the `dark` class to match, and inspects every rendered element:

- **offPalette:** text, background, border, outline, box-shadow and SVG shape fill colors must resolve to `--ink-0..3`, `--desktop` or transparent in that theme.
- **rounded:** any non-zero computed corner radius.
- **tweened:** any transition with a duration, or an animation whose timing is not `steps()` (the terminal cursor's `blink` is allowed).
- **translucent:** any painted element with `opacity < 1` (blink excepted).
- **overflow:** any variant cell whose content paints outside the cell or scrolls inside it, and any sideways page scroll.
- **console errors** per route.

Routes: `/components` at every width, `/` only at 1280px and wider (the desktop demo is desktop-only by design).

```bash
node .claude/skills/verify-dither-ui/dither.mjs shot cta-button cyan-pixel-dark
```

Screenshots one catalogue card at 2x. Card ids are registry item names (`article#<name>`).

```bash
node .claude/skills/verify-dither-ui/dither.mjs journey cta-button
node .claude/skills/verify-dither-ui/dither.mjs journey desktop
```

Runs `features/journeys/<name>.mjs` against a 1440px page: real pointer and keyboard input, measured state before and after, screenshots at each step, a `journey.json` of every expectation, and a final `no console errors` check. A journey is a default-exported `async ({ page, baseUrl, evidenceDir, expect, applyTheme })`. Add one per interactive feature; the feature files say which exist.

## Evidence

Every `audit` and `shot` writes to `.verify/evidence/<timestamp>-<label>/` (git-ignored): `audit.json` with every finding and the resolved palette per theme, plus one PNG per route, width and theme. Cite that directory in your report.

Proof standards:
- Drive the real path. Change themes by clicking the controls, not by setting attributes. Open overlays from their triggers.
- Capture the action and the resulting state: a theme switch is proven by the audit of the new theme, not by the click succeeding.
- The static check proves the source; the audit proves what renders. They disagree on purpose: a `rounded-md` merged away by `cn`, or zeroed by `--radius: 0`, passes the audit and fails the static check. Fix the source either way.
- A clean audit with zero cells means the page did not render; check `cells` in `audit.json`.

## The new component contract

When a component is added, all of these must hold before it is done. The tools enforce most of them; the rest are judgment calls to check by eye in the `shot` output.

1. **Registry item** in `registry.json` with the right `type`, `dependencies` and `registryDependencies` (always `@dither/theme`, plus every `@dither/*` it imports). `check:style` enforces this.
2. **Demo** at `components/showcase/demos/<item-name>.tsx` exporting `demo: ShowcaseDemo` that shows every variant, size and state. Pick the `span` that keeps the bento grid without holes. The generator enforces existence; completeness is yours to check.
3. **Style:** square, `--pixel` borders, ink tokens only, dither for shades, `font-pixel` for labels and `font-mono` for body, offset shadows only on primary buttons and outer containers, bevels from `bevel-raised` / `bevel-sunken`, glyphs from `pixel-glyphs`. Drop-in shadcn reskins keep shadcn's file name, exports and variant names.
4. **Motion:** stepped. CSS `steps()`, a `1000 / fps` timer, or the shader mount's clock. Respect `prefers-reduced-motion`.
5. **Shaders** follow the Paper pattern in `docs/DESIGN.md` (one module in `lib/shaders/`, one thin React component, presets).
6. **Tick it** in `ROADMAP.md`; `check:style` fails until you do.
7. **Run** `check`, then `audit`, then `shot <name>` in at least one light and one dark theme, and look at the screenshots.

## Cleanup

```bash
node .claude/skills/verify-dither-ui/dither.mjs down
```

Stops only the process group whose pid `up` recorded in `.verify/dev.pid`, then removes the pid file and log. It never touches a dev server it did not start and never deletes `.verify/evidence/`. Browsers launched by `audit` and `shot` close themselves.

## Feature map

`features/README.md` indexes the user-facing features and how to prove each. A proof that drives one convenient entry point is incomplete when the map lists others. When the app changes, update the map in the same change.
