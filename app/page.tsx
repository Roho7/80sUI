import { REGISTRY_DOCS } from "@/lib/docs/registry-docs"

import { Desktop } from "./_demo/Desktop"

export default function HomePage() {
  return <Desktop itemCount={REGISTRY_DOCS.length} />
}
