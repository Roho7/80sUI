# UI95 verification map

This directory is the maintained source for verifying the user-facing behavior of UI95. Read the index before driving the app, then use the matching feature file as the recipe. Journeys that need more than the audit live in `journeys/<name>.mjs` and run with `dither.mjs journey <name>`.

## Baseline preconditions

- `node .claude/skills/verify-ui95/dither.mjs doctor` reports `doctor: healthy` against the dev server on port 3000.
- The dev server runs from this repo. Reuse the user's `next dev` when it is there; never start a second one in the same checkout.
- There is no database, auth or seed data. State lives in the browser only (theme, palette).

## Driving conventions

- Drive through `dither.mjs` (`audit`, `shot`, `journey`). It launches headless Google Chrome through `playwright-core`.
- Prefer ARIA roles and accessible names (`button "Cyan pixel"`, `checkbox "Dark mode"`, `region "Terminal.exe"`, `menuitem "About UI95"`) and `data-slot` attributes over CSS classes or positions.
- Catalogue cards are `article#<registry-item-name>`; variant cells are `figure` elements inside them.
- Change themes through the controls (`applyTheme`), never by writing `data-theme` yourself.

## Proof and skip reporting

- Every run writes `.verify/evidence/<timestamp>-<label>/` with screenshots and a JSON record. Cite that path.
- Capture the action and the resulting state: a before and after screenshot or measurement for each interaction.
- Report a journey that cannot run with the failing step and its reason. Never weaken a journey to make it pass.
- Do not report a skipped entry point as verified through a different path.

## Features

| Feature | File | Proof command |
|---|---|---|
| Component catalogue (`/components`) | [showcase-catalogue.md](showcase-catalogue.md) | `audit` |
| Themes and palettes | [theme-switching.md](theme-switching.md) | `audit` |
| CTA keycap button | [cta-button.md](cta-button.md) | `journey cta-button` |
| Retro desktop landing (`/`) | [retro-desktop.md](retro-desktop.md) | `journey desktop` |
| Registry install | [registry-install.md](registry-install.md) | `shadcn view` / `add` in a scratch project |
