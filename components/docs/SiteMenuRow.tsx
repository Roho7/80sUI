import { Github } from "@nsmr/pixelart-react"

import { ThemeControls } from "@/app/_site/ThemeControls"
import { Button } from "@/components/ui/button"
import { DOC_GROUPS } from "@/lib/docs/pages"
import { SOURCE_URL } from "@/lib/site"

import { DocsSearch } from "./DocsSearch"
import { MobileNav } from "./MobileNav"
import { SiteMenubar } from "./SiteMenubar"

const [GUIDE_GROUP, ...SECTION_GROUPS] = DOC_GROUPS

function SiteMenuRow() {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b-(length:--pixel) border-border bg-card px-2 py-1">
      <SiteMenubar
        guides={GUIDE_GROUP}
        sections={SECTION_GROUPS}
        className="h-8 border-b-0 bg-transparent p-0 max-md:hidden"
      />
      <div className="ml-auto flex items-center gap-2">
        <DocsSearch groups={DOC_GROUPS} />
        <MobileNav groups={DOC_GROUPS} />
      </div>
      <div className="flex w-full items-center gap-4 lg:w-auto">
        <ThemeControls />
        <Button asChild variant="link" size="icon-sm">
          <a href={SOURCE_URL} target="_blank" rel="noreferrer" aria-label="UI95 on GitHub">
            <Github className="size-5 fill-current" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  )
}

export { SiteMenuRow }
