import type { MetadataRoute } from "next"

import { DOC_PAGES } from "@/lib/docs/pages"
import { REGISTRY_DOCS } from "@/lib/docs/registry-docs"
import { docHref } from "@/lib/docs/routes"
import { absoluteUrl } from "@/lib/site"

const STATIC_ROUTES = ["/", "/components"]

const UPDATED_BY_HREF = new Map(
  REGISTRY_DOCS.flatMap((doc) => (doc.updatedAt ? [[docHref(doc.name), doc.updatedAt] as const] : []))
)

export default function sitemap(): MetadataRoute.Sitemap {
  return [...STATIC_ROUTES, ...DOC_PAGES.map((page) => page.href)].map((href) => ({
    url: absoluteUrl(href),
    lastModified: UPDATED_BY_HREF.get(href),
  }))
}
