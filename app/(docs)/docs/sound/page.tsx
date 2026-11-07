import type { Metadata } from "next"

import { CodeBlock } from "@/components/docs/CodeBlock"
import { DocSection } from "@/components/docs/DocSection"
import { JsonLd } from "@/components/docs/JsonLd"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { InstallCommand } from "@/components/showcase/InstallCommand"
import { GUIDE_PAGES } from "@/lib/docs/pages"
import { articleJsonLd, pageMetadata } from "@/lib/seo"

const PAGE = GUIDE_PAGES[3]

export const metadata: Metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: PAGE.href })

const LAYOUT_SNIPPET = `import { Ui95Sounds } from "@/components/ui/ui95-sounds"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Ui95Sounds />
      </body>
    </html>
  )
}`

const RECIPE_SNIPPET = `{
  "button.press": {
    "note": "Tactile switch: bandpassed noise bump plus a square click",
    "layers": [
      {
        "wave": "noise",
        "attack": 0.0003,
        "decay": 0.006,
        "gain": 0.6,
        "filter": { "type": "bandpass", "frequency": 3500, "q": 2 }
      },
      {
        "wave": "square",
        "frequency": 74.4,
        "frequencyEnd": 375,
        "attack": 0,
        "decay": 0.00158,
        "gain": 0.07
      }
    ],
    "jitter": { "cents": 100, "gainDb": 6, "decay": 0.12 }
  }
}`

const SILENCE_SNIPPET = `{
  "enabled": true,
  "volume": 0.6,
  "sounds": {
    "tab.select": false
  }
}`

const OVERRIDE_SNIPPET = `<Button data-sound="none">Quiet</Button>
<Button data-sound="keycap">Clacky</Button>`

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-xl leading-tight">{children}</p>
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-well px-1 text-well-foreground">{children}</code>
}

function Subheading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-pixel text-[16px] leading-none uppercase">{children}</h3>
}

export default function SoundPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: PAGE.title,
          description: PAGE.description,
          path: PAGE.href,
          crumbs: [
            { name: "Docs", path: "/docs" },
            { name: PAGE.title, path: PAGE.href },
          ],
        })}
      />
      <PageHeader title={PAGE.title} description={PAGE.description} />
      <DocSection id="add-sound" title="Adding sound to your app">
        <Prose>
          Buttons, switches, menus and sliders can click like real hardware. Sound is optional and
          ships as its own registry item, so an app that installs only components stays silent.
        </Prose>
        <InstallCommand name="sound" />
        <Prose>
          The install puts three things in your project: the sound player, a{" "}
          <Code>sounds.json</Code> file next to your <Code>components.json</Code>, and a sync
          script at <Code>scripts/95-sound-lib.mjs</Code>.
        </Prose>
        <Prose>
          Render the player once, at the end of your root layout. Every UI95 component on
          every page uses that one player, so you never add sound code to a component.
        </Prose>
        <CodeBlock title="app/layout.tsx" code={LAYOUT_SNIPPET} />
        <Prose>
          Then run the sync script. It copies in the sounds for the components you have
          installed, and nothing else. Run it again whenever you add a component. It is better to add this step to your AGENTS.md file.
          It only adds what is missing, so your edits to <Code>sounds.json</Code> stay put.
        </Prose>
        <CodeBlock title="Terminal" code="node scripts/95-sound-lib.mjs sync" />
      </DocSection>
      <DocSection id="how-sound-works" title="How a click is made" >
        <Prose>
          There are no audio files to download. Each sound is a short recipe in{" "}
          <Code>sounds.json</Code>, and the browser builds it into sound the first time it plays.
          A recipe stacks a few layers, such as a burst of noise for the tap and a short tone for
          the click. Each layer fades in and out within a few thousandths of a second.
        </Prose>
        <CodeBlock title="sounds.json" code={RECIPE_SNIPPET} />
        <Prose>
          A real switch never sounds exactly the same twice, so neither does this one. The{" "}
          <Code>jitter</Code> setting nudges the pitch, volume and length a little on every press,
          which keeps a run of fast clicks from sounding like a machine gun.
        </Prose>
        <Prose>
          The player listens once for the whole page. When someone presses a control, it reads
          the control&apos;s <Code>data-slot</Code>, which every UI95 component already has,
          and plays the matching sound: a press and a release for a button, an on or an off for a
          switch, a tick for each step of a slider.
        </Prose>
        <Prose>
          Browsers block sound until a visitor interacts with the page. The page stays silent
          until the first click, and every click after that makes sound.
        </Prose>
      </DocSection>
      <DocSection id="tune" title="Tuning and silencing sounds">
        <Prose>
          To change how something sounds, edit its recipe in <Code>sounds.json</Code>. Raise a
          layer&apos;s <Code>gain</Code> to make it louder, or lengthen its <Code>decay</Code> to
          let it ring longer.
        </Prose>
        <Prose>
          Set a sound to <Code>false</Code> to switch it off, and use <Code>volume</Code> for the
          overall level. Set <Code>&quot;enabled&quot;: false</Code> to start your app with all
          sound off. Visitors who turn sound on or off keep their choice, even when it differs
          from your default.
        </Prose>
        <CodeBlock title="sounds.json" code={SILENCE_SNIPPET} />
        <Prose>
          To change a single element, give it a <Code>data-sound</Code> attribute. Use{" "}
          <Code>none</Code> to silence it, or the name of another sound to borrow that one.
        </Prose>
        <CodeBlock title="Overrides" code={OVERRIDE_SNIPPET} />
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
