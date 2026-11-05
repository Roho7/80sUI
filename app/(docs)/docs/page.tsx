import type { Metadata } from "next"

import { DocSection } from "@/components/docs/DocSection"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { Plate } from "@/components/ui/plate"
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
          I don&apos;t know. Does this speak to you? Then it is for you.
          You could make your entire CRM look like an 80s software or just build a cool mystery game with it.
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

        <Plate variant="raised">
          <h3 className="font-bold">NOTICE!</h3>
          The whole project is still a WIP but the dark mode is especially so. I do not like the high contrast look, I might change it.
          I suggest using the themes only in light mode as they look far better, imo.
        </Plate>
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
      <DocSection id="roadmap" title="Roadmap">
        <p className="max-w-3xl text-xl leading-tight">A lot more fun components planned ahead:</p>
        <ul className="gap-x-4 gap-y-1 text-xl leading-tight">
          <li>
            CRT Screen
          </li>
          <li>
            Notepad
          </li>
          <li>
            Hold To speak Microphone
          </li>
          <li>
            Rotating Dial
          </li>
          <li>
            Radial Meter
          </li>
          <li>
            Graphs and Charts
          </li>
          <li>
            A Red Button
          </li>
          <li>
            Tape recorder buttons
          </li>
          <li>
            Lever Switches
          </li>
          <li>
            A functional Paint
          </li>
          <li>
            A Virtual Mechanical Keyboard
          </li>
        </ul>
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
