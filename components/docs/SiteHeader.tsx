import Link from "next/link"

import { ThemeControls } from "@/app/_site/ThemeControls"
import { DOC_GROUPS } from "@/lib/docs/pages"
import { SITE_NAME } from "@/lib/site"

import { DocsSearch } from "./DocsSearch"
import { MobileNav } from "./MobileNav"
import { SiteMenubar } from "./SiteMenubar"

const [GUIDE_GROUP, ...SECTION_GROUPS] = DOC_GROUPS

function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b-(length:--pixel) border-border bg-card px-4 py-3 md:px-8">
      <Link href="/" className="font-pixel text-[16px] leading-none uppercase">
        {SITE_NAME}
      </Link>
      <SiteMenubar
        guides={GUIDE_GROUP}
        sections={SECTION_GROUPS}
        className="h-8 border-b-0 bg-transparent p-0 max-md:hidden"
      />
      <div className="ml-auto flex items-center gap-2">
        <DocsSearch groups={DOC_GROUPS} />
        <MobileNav groups={DOC_GROUPS} />
      </div>
      <ThemeControls className="w-full lg:w-auto" />
    </header>
  )
}

export { SiteHeader }
