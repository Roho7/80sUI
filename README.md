# NOSTALGUI

Retro, 1-bit, Win95-flavoured components for shadcn. Square corners, four inks, stepped motion and ordered dither. Install them with the shadcn CLI and the code is yours to change.

![The NOSTALGUI desktop: draggable windows, a dithered eye in Paint and a Win95 taskbar](docs/images/desktop.png)

## Documentation

Visit [nostalgui.vercel.app/docs](https://nostalgui.vercel.app/docs) for the guides, and [nostalgui.vercel.app/components](https://nostalgui.vercel.app/components) for every component and variant.

## Install

NOSTALGUI is built on Radix. Base UI projects are not supported yet.

```bash
npx shadcn@latest init -b radix
```

```bash
npx shadcn@latest registry add "@nostalgui=https://nostalgui.vercel.app/r/{style}/{name}.json"
```

```bash
npx shadcn@latest add @nostalgui/theme @nostalgui/button
```

The CLI fills `{style}` from your `components.json`. No icon pack ships with the theme; [pixelarticons-react](https://github.com/gitntg/pixelarticons-react) sits on the same pixel grid and is what this site uses.

## Develop

```bash
npm run dev
```

```bash
npm run registry:build
```

```bash
node .claude/skills/verify-nostalgui/dither.mjs check
```

See [`docs/DESIGN.md`](docs/DESIGN.md) for the style rules and [`ROADMAP.md`](ROADMAP.md) for what ships.

## License

Licensed under the [MIT license](LICENSE).
