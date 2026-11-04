import { DOC_GROUPS } from "@/lib/docs/pages"
import { REGISTRY_DOCS } from "@/lib/docs/registry-docs"
import { absoluteUrl, registryItemUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export const dynamic = "force-static"

const REGISTRY_BY_HREF = new Map(
  REGISTRY_DOCS.map((doc) => [`/components/${doc.name}`, registryItemUrl(doc.name)])
)

function buildSection(group: (typeof DOC_GROUPS)[number]): string {
  const lines = group.pages.map((page) => {
    const registryUrl = REGISTRY_BY_HREF.get(page.href)
    const suffix = registryUrl ? ` Registry: ${registryUrl}` : ""
    return `- [${page.title}](${absoluteUrl(page.href)}): ${page.description}${suffix}`
  })
  return [`## ${group.label}`, "", ...lines].join("\n")
}

export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE} A shadcn registry for Radix projects. Install any item with: npx shadcn@latest add ${absoluteUrl("/r/<name>.json")}`,
    "",
    ...DOC_GROUPS.map(buildSection).flatMap((section) => [section, ""]),
  ].join("\n")
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
