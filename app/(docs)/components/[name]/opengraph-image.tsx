import { findDoc, REGISTRY_DOCS, SECTION_LABELS } from "@/lib/docs/registry-docs"
import { OG_SIZE, renderOgImage } from "@/lib/og/render-og-image"

export const alt = "NOSTALGUI component"
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return REGISTRY_DOCS.map((doc) => ({ name: doc.name }))
}

export default async function OpengraphImage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const doc = findDoc(name)
  return renderOgImage({
    eyebrow: doc ? SECTION_LABELS[doc.section] : "Component",
    title: doc?.title ?? name,
    description: doc?.description ?? "",
  })
}
