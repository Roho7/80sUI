import Link from "next/link"

import { DemoThumbnail, VariantCount } from "@/components/docs/DemoPreview"
import { SiteFooter } from "@/components/docs/SiteFooter"
import { SiteHeader } from "@/components/docs/SiteHeader"
import { InstallCommand } from "@/components/showcase/InstallCommand"
import { Button } from "@/components/ui/button"
import { listDocsInSection, REGISTRY_DOCS, SECTION_ORDER } from "@/lib/docs/registry-docs"
import { docHref } from "@/lib/docs/routes"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

import { PALETTES } from "./_site/palettes"

const SHOWCASED_DOCS = SECTION_ORDER.flatMap(listDocsInSection).filter((doc) => doc.hasDemo)

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-10 px-4 py-8 md:px-8 md:py-12">
        <section aria-labelledby="hero-title" className="flex max-w-3xl flex-col gap-4">
          <h1 id="hero-title" className="font-pixel text-[40px] leading-none uppercase md:text-[72px]">
            {SITE_NAME}
          </h1>
          <p className="text-2xl leading-tight">
            {SITE_TAGLINE} Square corners, four inks, no fades. Install a component and own the
            code.
          </p>
          <p className="font-pixel text-[16px] leading-none uppercase">
            {REGISTRY_DOCS.length} items / <VariantCount /> variants / {PALETTES.length} palettes
          </p>
          <InstallCommand name="theme" />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/desktop">Boot the desktop</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
        </section>
        <section aria-label="Components and blocks">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SHOWCASED_DOCS.map((doc) => (
              <li
                key={doc.name}
                className="relative flex min-w-0 flex-col pixel-border border-border bg-card text-card-foreground offset-shadow-3 hover:bg-muted focus-within:bg-muted"
              >
                <div
                  inert
                  className="flex h-44 items-start justify-start overflow-hidden border-b-(length:--pixel) border-border p-3 [justify-content:safe_center] [align-items:safe_center]"
                >
                  <DemoThumbnail name={doc.name} />
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <h2 className="font-pixel text-[16px] leading-none uppercase">
                    <Link href={docHref(doc.name)} className="after:absolute after:inset-0">
                      {doc.title}
                    </Link>
                  </h2>
                  <p className="line-clamp-3 text-lg leading-tight">{doc.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
