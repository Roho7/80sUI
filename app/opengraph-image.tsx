import { OG_SIZE, renderOgImage } from "@/lib/og/render-og-image"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return renderOgImage({ eyebrow: "Component registry", title: SITE_NAME, description: SITE_TAGLINE })
}
