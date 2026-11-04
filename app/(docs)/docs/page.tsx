import type { Metadata } from "next"

import { DocSection } from "@/components/docs/DocSection"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { GUIDE_PAGES } from "@/lib/docs/pages"
import { REGISTRY_DOCS } from "@/lib/docs/registry-docs"

const PAGE = GUIDE_PAGES[0]

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
}

export default function IntroductionPage() {
  return (
    <>
      <PageHeader
        title={PAGE.title}
        description="NOSTALGUI is a shadcn registry of retro, 1-bit components. You install a component with the CLI and own the source."
      />
      <DocSection id="principles" title="Principles">
        <ul className="flex max-w-3xl list-disc flex-col gap-1 pl-6 text-xl leading-tight">
          <li>Four inks per theme. Shades between them are dither, never a fifth color.</li>
          <li>Square corners and borders in multiples of one pixel unit.</li>
          <li>Motion is stepped. Overlays open in one frame.</li>
          <li>Components are Radix primitives with Tailwind. There is no provider to mount.</li>
        </ul>
      </DocSection>
      <DocSection id="reading" title="Reading a component page">
        <p className="max-w-3xl text-xl leading-tight">
          There are {REGISTRY_DOCS.length} items. Each page is generated from the registry and the
          source files, so it never drifts: live examples with their code, install steps for the
          CLI or by hand, the props read from the types, and which items it uses or is used by.
        </p>
      </DocSection>
      <DocSection id="start" title="Start here">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xl leading-tight">
          <li>
            <ProseLink href="/docs/installation">Installation</ProseLink>
          </li>
          <li>
            <ProseLink href="/docs/theming">Theming</ProseLink>
          </li>
          <li>
            <ProseLink href="/components">Browse components</ProseLink>
          </li>
          <li>
            <ProseLink href="/desktop">Boot the desktop</ProseLink>
          </li>
        </ul>
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
