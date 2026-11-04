# Registry install

Consumers install components with the shadcn CLI from the `@nostalgui` namespace. `npm run registry:build` regenerates the theme item from `app/globals.css` and writes `public/r/<name>.json`, which the Next app serves at `/r/<name>.json`. Each item pulls in its `@nostalgui/*` registry dependencies and npm dependencies.

## Sub-features

- `registry-build` `npm run registry:build` succeeds and `public/r/<name>.json` exists for every item.
- `registry-resolve` a consumer with the namespace configured can view any item and its dependency list.
- `registry-install` `shadcn add @nostalgui/<name>` writes the item and everything it depends on, and the consumer typechecks.
- `registry-declared` every `@/` import an item's files make is declared as a `@nostalgui/*` dependency.

## How to get to it (user POV)

- `npx shadcn registry add "@nostalgui=http://localhost:3000/r/{name}.json"` once in a Radix-based shadcn project, then `npx shadcn add @nostalgui/<name>`.

## Driving it with dither.mjs

Preconditions:

- `doctor` is healthy (it checks `/r/button.json`).
- A scratch consumer directory outside the repo, for example under the session scratchpad.

- **Build.** Run `npm run registry:build` in the repo. It ends with `Building registry.` and `git status` shows `public/r/` changes only for items you touched.
- **Declared imports.** Run `npm run check:style`. No `registry-*` rule fires.
- **Resolve.** In a scratch directory with a `components.json` (style `radix-nova`), run `npx shadcn@latest registry add "@nostalgui=http://localhost:3000/r/{name}.json"`, then `npx shadcn@latest view @nostalgui/cta-button`. The output contains `"name": "cta-button"` and `registryDependencies` listing `@nostalgui/theme` and `@nostalgui/dither-shine`.
- **Install.** In a scratch project created with `npx shadcn@latest init -t next -b radix -p nova -n consumer --no-monorepo -y`, add the namespace, run `npx shadcn@latest add @nostalgui/<name>`, then `npx tsc --noEmit`. It exits 0 and the files of every dependency exist.

## Gotchas

- Consumers must init with Radix (`-b radix`). On shadcn's Base UI default the CLI rewrites `asChild` to `render` and typecheck fails.
- Until the site is deployed the registry URL is `localhost:3000`; nothing outside this machine can install.
- The theme item asks consumers to load Silkscreen and VT323 themselves; a registry item cannot edit their layout.
- The full install takes minutes (it creates a Next app). Use the `view` check for routine verification and the full install before a release.
