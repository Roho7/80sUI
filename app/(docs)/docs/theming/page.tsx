import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/docs/CodeBlock"
import { DocSection } from "@/components/docs/DocSection"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GUIDE_PAGES } from "@/lib/docs/pages"
import { docHref } from "@/lib/docs/routes"
import {
  PALETTE_INK_NAMES,
  readPaletteCss,
  readPalettes,
  readThemeCss,
  readThemeNotes,
  readThemeUtilities,
  readTokenGroups,
  type ThemeToken,
} from "@/lib/docs/theme"

const PAGE = GUIDE_PAGES[2]
const USED_BY_LIMIT = 5

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
}

const FONT_SETUP = `import { Silkscreen, VT323 } from "next/font/google"

const display = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-display" })
const body = VT323({ subsets: ["latin"], weight: "400", variable: "--font-body" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="phosphor" className={\`\${display.variable} \${body.variable}\`}>
      <body>{children}</body>
    </html>
  )
}`

const TOKEN_PAIR = `:root {
  --primary: var(--ink-0);
  --primary-foreground: var(--ink-3);
}`

const PIXEL_SCALE = `:root {
  --pixel: 2px;
}

<div className="pixel-border border-border offset-shadow-2" />
<div className="border-b-(length:--pixel) border-border" />`

const NEW_TOKEN = `:root {
  --warning: var(--ink-2);
  --warning-foreground: var(--ink-0);
}

.dark {
  --warning: var(--ink-1);
  --warning-foreground: var(--ink-3);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}`

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-xl leading-tight">{children}</p>
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-well px-1 text-well-foreground">{children}</code>
}

function UsedBy({ names }: { names: readonly string[] }) {
  if (names.length === 0) {
    return <span className="text-muted-foreground">Theme only</span>
  }
  const shown = names.slice(0, USED_BY_LIMIT)
  return (
    <span className="flex flex-wrap gap-x-2">
      {shown.map((name) => (
        <Link key={name} href={docHref(name)} className="underline decoration-(length:--pixel) underline-offset-4">
          {name}
        </Link>
      ))}
      {names.length > shown.length && <span>+{names.length - shown.length} more</span>}
    </span>
  )
}

function TokenSwatch({ token }: { token: ThemeToken }) {
  if (!token.isColor) {
    return <span aria-hidden="true" className="inline-block size-5" />
  }
  return (
    <span
      aria-hidden="true"
      className="inline-block size-5 shrink-0 pixel-border border-border"
      style={{ backgroundColor: `var(--${token.name})` }}
    />
  )
}

function TokenTable({ tokens }: { tokens: readonly ThemeToken[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Light</TableHead>
          <TableHead>Dark</TableHead>
          <TableHead>What it controls</TableHead>
          <TableHead>Used by</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.name}>
            <TableCell>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <TokenSwatch token={token} />
                --{token.name}
              </span>
            </TableCell>
            <TableCell className="whitespace-nowrap">{token.light}</TableCell>
            <TableCell className="whitespace-nowrap">{token.dark ?? "same"}</TableCell>
            <TableCell className="min-w-56 whitespace-normal">{token.note ?? "Not described yet."}</TableCell>
            <TableCell className="min-w-48 whitespace-normal">
              <UsedBy names={token.usedBy} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PaletteRow({ label, inks }: { label: string; inks: readonly string[] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 font-pixel text-sm leading-none uppercase">{label}</span>
      <span className="flex">
        {inks.map((ink, index) => (
          <span
            key={PALETTE_INK_NAMES[index]}
            title={`--${PALETTE_INK_NAMES[index]} ${ink}`}
            data-palette-swatch
            className="size-8 pixel-border border-border"
            style={{ backgroundColor: ink }}
          />
        ))}
      </span>
    </div>
  )
}

export default function ThemingPage() {
  const notes = readThemeNotes()
  const groups = readTokenGroups()
  const utilities = readThemeUtilities()
  const palettes = readPalettes()
  const examplePalette = palettes[palettes.length - 1]

  return (
    <>
      <PageHeader title={PAGE.title} description={PAGE.description} />
      <DocSection id="css-variables" title="CSS variables">
        <Prose>
          Every component reads semantic tokens such as <Code>card</Code>, <Code>foreground</Code>{" "}
          and <Code>border</Code>. Change the tokens in your CSS and every component follows, with no
          class edits. Tailwind turns each token into utilities like <Code>bg-card</Code>,{" "}
          <Code>text-foreground</Code> and <Code>border-border</Code>. Dark mode overrides the same
          tokens inside <Code>.dark</Code>.
        </Prose>
        <CodeBlock title="Usage" code={`<div className="bg-card text-card-foreground pixel-border border-border" />`} />
      </DocSection>
      {notes !== null && (
        <DocSection id="setup" title="Setup">
          <Prose>{notes}</Prose>
          <CodeBlock title="app/layout.tsx" code={FONT_SETUP} />
        </DocSection>
      )}
      <DocSection id="inks" title="Inks">
        <Prose>
          Each palette has four inks, <Code>--ink-0</Code> to <Code>--ink-3</Code>, plus{" "}
          <Code>--ink-4</Code> for glints and fills and <Code>--desktop</Code> for the ground. Every
          semantic token points at one of them, so a palette is six values. Shades between inks are
          dither, never a new color.
        </Prose>
      </DocSection>
      <DocSection id="convention" title="Token convention">
        <Prose>
          Tokens come in surface and foreground pairs. The base token colors the surface and the{" "}
          <Code>-foreground</Code> token colors the text and icons on it, so <Code>primary</Code>{" "}
          pairs with <Code>primary-foreground</Code>.
        </Prose>
        <CodeBlock title="app/globals.css" code={TOKEN_PAIR} />
        <CodeBlock title="Usage" code={`<div className="bg-primary text-primary-foreground">Hello</div>`} />
      </DocSection>
      <DocSection id="tokens" title="Theme tokens">
        <Prose>
          These live under <Code>:root</Code> and <Code>.dark</Code>. The swatches show the current
          palette, and the used-by column is read from the component sources.
        </Prose>
        <Accordion type="multiple">
          {groups.map((group) => (
            <AccordionItem key={group.id} value={group.id}>
              <AccordionTrigger>
                <span className="flex flex-1 items-baseline justify-between gap-3">
                  <span>{group.title}</span>
                  <span className="font-mono text-lg normal-case">{group.tokens.length} tokens</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3">
                  <Prose>{group.summary}</Prose>
                  <TokenTable tokens={group.tokens} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DocSection>
      <DocSection id="pixel" title="Pixel scale">
        <Prose>
          NOSTALGUI has no radius scale; <Code>--radius</Code> is 0. Its scale is{" "}
          <Code>--pixel</Code>, one pixel unit. Borders, offsets and dither cells are whole multiples
          of it, so <Code>offset-shadow-2</Code> drops a shadow two units. Change{" "}
          <Code>--pixel</Code> and the whole library grows or shrinks on the same grid.
        </Prose>
        <CodeBlock title="app/globals.css" code={PIXEL_SCALE} />
      </DocSection>
      <DocSection id="utilities" title="Utilities">
        <Prose>The theme ships these utilities alongside the tokens.</Prose>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utility</TableHead>
              <TableHead>What it does</TableHead>
              <TableHead>Used by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utilities.map((utility) => (
              <TableRow key={utility.name}>
                <TableCell className="whitespace-nowrap">{utility.name}</TableCell>
                <TableCell className="min-w-56 whitespace-normal">{utility.note ?? "Not described yet."}</TableCell>
                <TableCell className="min-w-48 whitespace-normal">
                  <UsedBy names={utility.usedBy} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DocSection>
      <DocSection id="new-tokens" title="Adding new tokens">
        <Prose>
          Define the token under <Code>:root</Code> and <Code>.dark</Code>, pointing at an ink, then
          expose it to Tailwind with <Code>@theme inline</Code>.
        </Prose>
        <CodeBlock title="app/globals.css" code={NEW_TOKEN} />
        <Prose>
          You can now use <Code>bg-warning</Code> and <Code>text-warning-foreground</Code>.
        </Prose>
      </DocSection>
      <DocSection id="palettes" title="Palettes">
        <Prose>
          <Code>data-theme</Code> on <Code>&lt;html&gt;</Code> picks the palette and the{" "}
          <Code>dark</Code> class picks its dark variant. Swatches run from <Code>--ink-0</Code> to{" "}
          <Code>--desktop</Code>.
        </Prose>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {palettes.map((palette) => (
            <Card key={palette.value}>
              <CardHeader>
                <CardTitle>{palette.label}</CardTitle>
                <CardDescription>data-theme=&quot;{palette.value}&quot;</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <PaletteRow label="Light" inks={palette.light} />
                <PaletteRow label="Dark" inks={palette.dark} />
              </CardContent>
            </Card>
          ))}
        </div>
        <Prose>
          To add a palette, set the six inks for light and dark under its own data-theme. This is how{" "}
          {examplePalette.label} is defined:
        </Prose>
        <CodeBlock title="app/globals.css" code={readPaletteCss(examplePalette.value)} />
      </DocSection>
      <DocSection id="theme-css" title="Theme CSS">
        <Prose>
          This is the full CSS the <ProseLink href="/docs/installation">theme item</ProseLink> writes
          into your project, generated from the registry.
        </Prose>
        <Collapsible className="flex flex-col gap-3">
          <CollapsibleTrigger asChild>
            <Button variant="secondary" className="self-start">
              Show theme CSS
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CodeBlock title="app/globals.css" code={readThemeCss()} />
          </CollapsibleContent>
        </Collapsible>
      </DocSection>
      <DocSection id="sound" title="Sound">
        <Prose>
          Sound is opt-in. The <ProseLink href="/docs/sound">sound guide</ProseLink> covers how it
          works and how to add it.
        </Prose>
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
