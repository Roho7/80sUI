import Link from "next/link"

import { ThemeControls } from "@/app/_site/ThemeControls"
import { Button } from "@/components/ui/button"
import { DOC_GROUPS } from "@/lib/docs/pages"
import { SITE_LINKS } from "@/lib/docs/site-links"
import { SITE_NAME } from "@/lib/site"

import { DocsSearch } from "./DocsSearch"
import { MobileNav } from "./MobileNav"

function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b-(length:--pixel) border-border bg-card px-4 py-3 md:px-8">
      <Link href="/" className="font-pixel text-[16px] leading-none uppercase">
        {SITE_NAME}
      </Link>
      <nav aria-label="Site" className="flex items-center gap-1 max-md:hidden">
        {SITE_LINKS.map((link) => (
          <Button key={link.href} asChild variant="ghost" size="sm">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <DocsSearch groups={DOC_GROUPS} />
        <MobileNav groups={DOC_GROUPS} />
      </div>
      <ThemeControls className="w-full lg:w-auto" />
    </header>
  )
}

export { SiteHeader }
