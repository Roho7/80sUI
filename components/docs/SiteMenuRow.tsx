import { Github } from "@nsmr/pixelart-react"

import { SiteEditMenubarMenu, ThemeControls } from "@/app/_site/ThemeControls"
import { Button } from "@/components/ui/button"
import { Menubar } from "@/components/ui/menubar"
import { DOC_GROUPS } from "@/lib/docs/pages"
import { SOURCE_URL } from "@/lib/site"

import { DocsSearch } from "./DocsSearch"
import { MobileNav } from "./MobileNav"
import { SiteMenubar } from "./SiteMenubar"

const [GUIDE_GROUP, ...SECTION_GROUPS] = DOC_GROUPS

function SiteMenuRow() {
  return (
    <Menubar
      aria-label="Site"
      className="h-auto min-h-9 shrink-0 flex-nowrap items-center gap-x-2 gap-y-2 overflow-x-auto py-1 max-md:gap-x-1 md:flex-wrap md:overflow-visible md:gap-x-4"
    >
      <div className="contents max-md:hidden">
        <SiteMenubar guides={GUIDE_GROUP} sections={SECTION_GROUPS} />
      </div>
      <div className="shrink-0 md:hidden">
        <SiteEditMenubarMenu />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:ml-auto md:flex-initial md:justify-start md:gap-4">
        <DocsSearch groups={DOC_GROUPS} />
        <ThemeControls className="hidden md:flex" />
        <Button asChild variant="link" size="icon-sm" className="hidden shrink-0 md:block">
          <a href={SOURCE_URL} target="_blank" rel="noreferrer" aria-label="UI95 on GitHub">
            <Github className="size-5 fill-current" aria-hidden="true" />
          </a>
        </Button>
        <MobileNav groups={DOC_GROUPS} />
      </div>
    </Menubar>
  )
}

export { SiteMenuRow }
