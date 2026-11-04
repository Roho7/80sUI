# Themes and palettes

Two palettes, `phosphor` (olive monochrome) and `cyan-pixel` (cream, black, cyan desktop), each with a light and dark mode. Every color on screen must resolve to that theme's `--ink-0..3` or `--desktop`. Shader canvases re-read their colors when the theme changes, without a reload.

## Sub-features

- `theme-palette` the `Phosphor` and `Cyan pixel` buttons set `<html data-theme>`.
- `theme-dark` the `Dark mode` checkbox toggles the `dark` class through next-themes.
- `theme-inks` every rendered color stays inside the active theme's inks.
- `theme-shaders` dither-image and dither-shine canvases repaint in the new inks.

## How to get to it (user POV)

- The header of `/components`: buttons `Phosphor`, `Cyan pixel` and checkbox `Dark mode`.
- The `Control Panel` window on the desktop landing at `/`.

## Driving it with dither.mjs

Preconditions:

- `doctor` is healthy.

- **All four themes.** Run `node .claude/skills/verify-nostalgui/dither.mjs audit 1440`. It clicks each control in turn and reports one line per theme. Each line reads `offPalette 0`; `audit.json` records the resolved `allowedColors` for each theme.
- **Shaders repaint.** Run `node .claude/skills/verify-nostalgui/dither.mjs shot dither-image phosphor-light` and `shot dither-image cyan-pixel-dark`. The eye is drawn in the olive inks in the first and the cyan-pixel dark inks in the second.
- **Desktop entry.** On `/`, the same controls live in the `Control Panel` window; `audit` covers `/` at 1280px and wider.

## Gotchas

- A new color token must alias an ink (`var(--ink-n)`), never a literal. The audit flags anything else as `offPalette`.
- The palette choice is not persisted. A full reload resets to `phosphor`; the audit sets it again on every page.
- `--desktop` is the only color allowed outside the inks, and only as a backdrop.
- Shader canvas pixels are not sampled by the audit. Judge them from `shot` screenshots.
