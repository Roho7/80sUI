import Link from "next/link"

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

function SiteFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t-(length:--pixel) border-border bg-card px-4 py-4 text-lg md:px-8">
      <p>
        <span className="font-pixel text-sm uppercase">{SITE_NAME}</span> {SITE_TAGLINE}
      </p>
      <ul className="flex items-center gap-4">
        <li>
          <Link href="/llms.txt" className="underline decoration-(length:--pixel) underline-offset-4">
            llms.txt
          </Link>
        </li>
        <li>
          <Link href="/r/registry.json" className="underline decoration-(length:--pixel) underline-offset-4">
            registry.json
          </Link>
        </li>
      </ul>
    </footer>
  )
}

export { SiteFooter }
