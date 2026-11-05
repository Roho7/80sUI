# Retro desktop

`/` is a Win95-style desktop built from registry components plus site-only desktop icons: draggable `Window`s (README.TXT with the page's h1, Setup.exe with the install command, Roho7.vcf, install.bat, untitled - Paint, Downloading, Error, Control Panel), a hex backdrop, cascading `ErrorDialog`s, and a `Taskbar` whose Start menu opens About, Components, Docs and Shut Down.

## Sub-features

- `desktop-drag` a window's title bar drags it, and the drop snaps to the 2px `--pixel` grid.
- `desktop-start` Start opens a dropdown with `About NOSTALGUI`, `Components` and `Shut Down...`.
- `desktop-about` `About NOSTALGUI` opens a modal dialog that Escape closes.
- `desktop-navigate` Start > `Components` routes to `/components`.
- `desktop-errors` `Shut Down...` and the Error window spawn cascading error dialogs.
- `desktop-terminal` the terminal types commands at a stepped rate with a blinking block cursor.

## How to get to it (user POV)

- Open `http://localhost:3000/` on a screen 1280px wide or wider (below that the windows stack).

## Driving it with dither.mjs

Preconditions:

- `doctor` is healthy.
- Viewport at least 1280px wide (journeys use 1440).

- **Drag, Start, About, navigate.** Run `node .claude/skills/verify-nostalgui/dither.mjs journey desktop`. It drags `region "install.bat"` by its `[data-slot=window-titlebar]` 141px right and 93px down and expects a move of more than 100 by 60 to an even position, opens Start from the keyboard, opens `dialog "About NOSTALGUI"`, closes it with Escape, then follows `menuitem "Components"` to `/components`. Screenshots `desktop.png`, `after-drag.png`, `start-menu.png` and `about-dialog.png` land in the evidence directory.
- **Style.** `audit 1440` covers `/` in all four themes.
- **Error cascade.** Not in a journey yet. Open Start > `Shut Down...` and expect a new `ErrorDialog` offset diagonally from the last one.

## Gotchas

- Below 1280px the windows drop their positions and stack in reading order, so `/` is audited at every width.
- In `next dev` the Next.js dev badge sits on top of the Start button and intercepts clicks. Focus `button "Start"` and press Enter instead; production builds have no badge.
- Window positions start fixed, so a drag that ends on another window's title bar is still valid; assert the moved window's box, not a screenshot diff.
