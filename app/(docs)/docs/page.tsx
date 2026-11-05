import type { Metadata } from "next"

import { DocSection } from "@/components/docs/DocSection"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { GUIDE_PAGES } from "@/lib/docs/pages"

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
        description="Why? How? What?"
      />
      <DocSection id="what-happened-here" title="What's Happening Here?">
        <div className="flex max-w-3xl list-disc flex-col gap-1 pl-6 text-xl leading-tight">
          <p>
            Hi! I&apos;m Roho. And I am sick and tired of seeing gradients everywhere. If its not gradients it&apos;s <HighlightedText>clean-aesthetic-core</HighlightedText>, or whatever Vercel does.
            After a certain point, they just blend in.
          </p>
          <p>So I asked myself: why is everything minimal? why does everything need to be clean? is there a way to make things interesting without making them super complicated?</p>

          <p>But actually it&apos;s not that philosophical. I just wanted to make things look retro. Bring back the old software into the new web. Fashion repeats itself, so does UI.</p>
        </div>
      </DocSection>
      <DocSection id="who-is-it-for" title="Who is it for?">
        <p className="max-w-3xl text-xl leading-tight">
          I don&apos;t know. You know that. Does this speak to you? Then it is for you.
          You could make your entire CRM look like an 80s software or just build a cool game with it.
        </p>
      </DocSection>
      <DocSection id="principle" title="Design Principle">
        <p className="max-w-3xl text-xl leading-tight">
          Nostalgui is built on top of shadcn. Just plug it in and watch your UI transform into this. I&apos;ve built some special components that
          mimic the 80s vibe and plan to add a few more in the future.
        </p>
        <p className="max-w-3xl text-xl leading-tight">
          Some components use WEBGL shaders, especially the special ones. You&apos;ll only be downloading the shaders if you use these components.
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
            <ProseLink href="/">Boot the desktop</ProseLink>
          </li>
        </ul>
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
