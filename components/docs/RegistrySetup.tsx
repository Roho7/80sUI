import { CopyCommand } from "@/components/showcase/CopyCommand"
import { SITE_URL } from "@/lib/site"

const REGISTRY_URL = `${SITE_URL}/r/{style}/{name}.json`

function RegistrySetup() {
  return (
    <div className="flex flex-col gap-3">
      <CopyCommand command="npx shadcn@latest init -b radix" label="Radix init command" />
      <CopyCommand
        command={`npx shadcn@latest registry add "@ui95=${REGISTRY_URL}"`}
        label="registry add command"
      />
    </div>
  )
}

export { REGISTRY_URL, RegistrySetup }
