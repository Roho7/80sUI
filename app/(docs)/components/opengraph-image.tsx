import { OG_SIZE, renderOgImage } from "@/lib/og/render-og-image"

export const alt = "NOSTALGUI components: every registry component and variant"
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Catalogue",
    title: "Components",
    description: "Every NOSTALGUI registry component and variant, ready to install with shadcn.",
  })
}
