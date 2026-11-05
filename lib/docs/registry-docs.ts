import generated from "./registry-docs.generated.json"
import type { DocSection, RegistryDoc } from "./types"

export const REGISTRY_DOCS = generated as RegistryDoc[]

export const SECTION_LABELS: Record<DocSection, string> = {
  components: "Components",
  blocks: "Blocks",
  utilities: "Utilities",
}

export const SECTION_ORDER: readonly DocSection[] = ["components", "blocks", "utilities"]

const DOCS_BY_NAME = new Map(REGISTRY_DOCS.map((doc) => [doc.name, doc]))

export function findDoc(name: string): RegistryDoc | undefined {
  return DOCS_BY_NAME.get(name)
}

export function listDocsInSection(section: DocSection): RegistryDoc[] {
  return REGISTRY_DOCS.filter((doc) => doc.section === section).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}
