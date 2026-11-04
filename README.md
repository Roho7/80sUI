# NOSTALGUI

Retro, 1-bit, Win95-flavoured components distributed as a shadcn registry. Browse every component and variant at `/components`.

## Install

NOSTALGUI is built on Radix. Base UI projects are not supported yet.

```bash
npx shadcn@latest init -b radix
```

```bash
npx shadcn@latest registry add "@nostalgui=http://localhost:3000/r/{style}/{name}.json"
```

```bash
npx shadcn@latest add @nostalgui/button
```

The CLI fills `{style}` from your `components.json`. A Base UI style is refused with a message instead of installing files that fail typecheck.

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

See `docs/DESIGN.md` for the style rules and `ROADMAP.md` for what ships.
