import { OG_SIZE, renderOgImage } from "@/lib/og/render-og-image"

export const alt = "UI95 components: every registry component and variant"
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Catalogue",
    title: "Components",
    description: "Every UI95 registry component and variant, ready to install with shadcn.",
  })
}
