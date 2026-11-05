# Registry install

Consumers install components with the shadcn CLI from the `@nostalgui` namespace. `npm run registry:build` regenerates the theme item from `app/globals.css` and writes `public/r/<name>.json`, which the Next app serves at `/r/<name>.json`. Consumers register `/r/{style}/{name}.json`: `app/r/[style]/[file]/route.ts` redirects Radix styles to `/r/<name>.json` and refuses `base-*` styles with a 404 JSON `message`. Each item pulls in its `@nostalgui/*` registry dependencies and npm dependencies.

## Sub-features

- `registry-build` `npm run registry:build` succeeds and `public/r/<name>.json` exists for every item.
- `registry-resolve` a consumer with the namespace configured can view any item and its dependency list.
- `registry-install` `shadcn add @nostalgui/<name>` writes the item and everything it depends on, and the consumer typechecks.
- `registry-base-refusal` a `base-*` style gets a 404 whose JSON `message` says to init with `-b radix`; a `radix-*` style redirects to the item.
- `registry-declared` every `@/` import an item's files make is declared as a `@nostalgui/*` dependency.

## How to get to it (user POV)

- The Setup strip at the top of `/components`: `npx shadcn@latest init -b radix`, then `npx shadcn registry add "@nostalgui=http://localhost:3000/r/{style}/{name}.json"`, then `npx shadcn add @nostalgui/<name>`.

## Driving it with dither.mjs

Preconditions:

- `doctor` is healthy (it checks `/r/button.json`).
- A scratch consumer directory outside the repo, for example under the session scratchpad.

- **Build.** Run `npm run registry:build` in the repo. It ends with `Building registry.` and `git status` shows `public/r/` changes only for items you touched.
- **Declared imports.** Run `npm run check:style`. No `registry-*` rule fires.
- **Resolve.** In a scratch directory with a `components.json` (style `radix-nova`), run `npx shadcn@latest registry add "@nostalgui=http://localhost:3000/r/{style}/{name}.json"`, then `npx shadcn@latest view @nostalgui/cta-button`. The output contains `"name": "cta-button"` and `registryDependencies` listing `@nostalgui/theme` and `@nostalgui/dither-shine`.
- **Base refusal.** `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:3000/r/radix-nova/button.json` prints `307 http://localhost:3000/r/button.json`. `curl -s http://localhost:3000/r/base-nova/button.json` answers 404 with `"error":"unsupported-base"`. In a scratch directory whose `components.json` has style `base-nova`, `npx shadcn@latest view @nostalgui/button` prints that message.
- **Install.** In a scratch project created with `npx shadcn@latest init -t next -b radix -p nova -n consumer --no-monorepo -y`, add the namespace, run `npx shadcn@latest add @nostalgui/<name>`, then `npx tsc --noEmit`. It exits 0 and the files of every dependency exist.

## Gotchas

- Consumers must init with Radix (`-b radix`). Base UI is refused at the registry URL. A consumer who registered the old `/r/{name}.json` URL bypasses the refusal; on shadcn's Base UI default the CLI then rewrites `asChild` to `render` and typecheck fails.
- Until the site is deployed the registry URL is `localhost:3000`; nothing outside this machine can install.
- The theme item asks consumers to load a pixel display font and a monospace body font (Silkscreen and VT323 by default) as `--font-display` and `--font-body`; a registry item cannot edit their layout.
- The full install takes minutes (it creates a Next app). Use the `view` check for routine verification and the full install before a release.
