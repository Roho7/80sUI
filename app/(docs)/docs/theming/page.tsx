import type { Metadata } from "next"

import { PALETTES } from "@/app/_site/palettes"
import { DocSection } from "@/components/docs/DocSection"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { GUIDE_PAGES } from "@/lib/docs/pages"
import registry from "@/registry.json"

const PAGE = GUIDE_PAGES[2]

const THEME_NOTES = registry.items.find((item) => item.name === "theme")?.docs ?? null

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
}

export default function ThemingPage() {
  return (
    <>
      <PageHeader title={PAGE.title} description={PAGE.description} />
      {THEME_NOTES !== null && (
        <DocSection id="setup" title="Setup">
          <p className="max-w-3xl text-xl leading-tight">{THEME_NOTES}</p>
        </DocSection>
      )}
      <DocSection id="palettes" title="Palettes">
        <p className="max-w-3xl text-xl leading-tight">
          Select one with data-theme on the html element. Each has a light and a dark variant,
          switched with the dark class. Try them with the controls in the header.
        </p>
        <ul className="flex flex-col gap-1 text-xl leading-tight">
          {PALETTES.map((palette) => (
            <li key={palette.value}>
              <span className="font-mono">{palette.value}</span> {palette.label}
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection id="tokens" title="Tokens">
        <p className="max-w-3xl text-xl leading-tight">
          Four inks, --ink-0 to --ink-3, drive every color. Dithered images quantize to them, and the
          dither-25, dither-50 and dither-75 utilities fake the shades between. The pixel unit
          --pixel sizes every border and offset shadow.
        </p>
      </DocSection>
      <DocSection id="sound" title="Sound">
        <p className="max-w-3xl text-xl leading-tight">
          Sound is opt-in. Add the <ProseLink href="/components/sound">sound item</ProseLink> and
          render NostalguiSounds once.
        </p>
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
