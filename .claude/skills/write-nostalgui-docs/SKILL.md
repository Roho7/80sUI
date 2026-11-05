---
name: write-nostalgui-docs
description: Write or rewrite a NOSTALGUI docs guide page under app/(docs)/docs in the house voice. Use when adding a guide (like Sound, Theming, Installation), when a docs page reads poorly, or when asked to "write the docs for X" on this site.
---

# Write a NOSTALGUI docs page

The reference page is `app/(docs)/docs/sound/page.tsx`. Read it first and match it.

## Before writing

- Name the reader. Default: an app developer who installed NOSTALGUI with the shadcn CLI. They know React and shadcn, not the internals (audio, shaders, dithering).
- List the topics, then merge. Two or three sections beat six. Small related topics become paragraphs inside one section.
- Order by what the reader does. Install or set up first, then explain how it works using the files they now have, then how to change it.

## Structure

- Section titles name the reader's action: "Adding sound to your app", "Tuning and silencing sounds". No bare nouns, no value words (easy, powerful, simple, seamless).
- Each section: one framing paragraph, then alternate short paragraphs and code. Code is the skeleton; prose leads into each block.
- Use the real API in every snippet: `InstallCommand name="<item>"` for installs, `CodeBlock` with a filename title for files, real keys from the repo (for example `sounds.json`).

## Prose

- Short sentences, one idea each. Plain words over jargon; if a term is needed (`data-slot`, `jitter`), say what it does in the same sentence.
- Give the why the reader cares about: "so you never add sound code to a component", "so your edits stay put".
- Use a real-world comparison when it helps: "A real switch never sounds exactly the same twice, so neither does this one."
- State limits plainly: "Browsers block sound until a visitor interacts with the page."
- No comparisons to other libraries. No exclamation marks.

## Wiring a new guide page

1. Add `{ href, title, description }` to `GUIDE_PAGES` in `lib/docs/pages.ts`. The sidebar, search, prev/next links, sitemap and `llms.txt` pick it up.
2. Create `app/(docs)/docs/<slug>/page.tsx` with `PageHeader`, `DocSection`s and `PageNeighbors`, reading its entry from `GUIDE_PAGES`.
3. Link to it from any older page that covered the topic briefly.
4. Do not link the Sound Lab.

## Check

- `npm run verify` passes.
- Open the page in the browser: headings in order, code blocks render, sidebar position right.
