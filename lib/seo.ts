import type { Metadata } from "next"

import { absoluteUrl, SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOURCE_URL } from "@/lib/site"

type PageSeo = {
  title: string
  description: string
  path: string
  type?: "website" | "article"
}

export function pageMetadata({ title, description, path, type = "article" }: PageSeo): Metadata {
  const url = absoluteUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  }
}

type JsonLdNode = Record<string, unknown>

export function websiteJsonLd(): JsonLdNode[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      codeRepository: SOURCE_URL,
      programmingLanguage: ["TypeScript", "React"],
      runtimePlatform: "Next.js",
      license: "https://opensource.org/licenses/MIT",
      author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
    },
  ]
}

type Crumb = { name: string; path: string }

export function articleJsonLd({
  title,
  description,
  path,
  crumbs,
  updatedAt,
}: PageSeo & { crumbs: readonly Crumb[]; updatedAt?: string }): JsonLdNode[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: title,
      description,
      url: absoluteUrl(path),
      ...(updatedAt ? { dateModified: updatedAt } : {}),
      author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    },
  ]
}
