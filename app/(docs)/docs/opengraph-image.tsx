import { GUIDE_PAGES } from "@/lib/docs/pages"
import { OG_SIZE, renderOgImage } from "@/lib/og/render-og-image"

const PAGE = GUIDE_PAGES[0]

export const alt = `${PAGE.title}: ${PAGE.description}`
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return renderOgImage({ eyebrow: "Guide", title: PAGE.title, description: PAGE.description })
}
