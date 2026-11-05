import { docHref } from "@/lib/docs/routes"
import type { RegistryDoc } from "@/lib/docs/types"
import { absoluteUrl, registryItemUrl } from "@/lib/site"

const FENCE = "```"

function fenced(language: string, code: string): string {
  return `${FENCE}${language}\n${code.replace(/\n$/, "")}\n${FENCE}`
}

function apiSection(doc: RegistryDoc): string[] {
  return doc.api.flatMap((component) => {
    const heading = `### ${component.name}`
    if (component.props.length === 0) {
      return [heading, "No props of its own. It forwards the props of the element or primitive it wraps."]
    }
    const rows = component.props.map(
      (prop) =>
        `| \`${prop.name}\`${prop.required ? " *" : ""} | \`${prop.type.replace(/\|/g, "\\|")}\` | ${prop.defaultValue === null ? "-" : `\`${prop.defaultValue}\``} |`
    )
    return [heading, ["| Prop | Type | Default |", "| --- | --- | --- |", ...rows].join("\n")]
  })
}

export function registryDocToMarkdown(doc: RegistryDoc): string {
  const blocks: string[] = [`# ${doc.title}`, doc.description, `Source: ${absoluteUrl(docHref(doc.name))}`]

  if (doc.hasDemo && doc.demoSource !== null) {
    blocks.push("## Examples", fenced("tsx", doc.demoSource))
  }

  blocks.push(
    "## Installation",
    fenced("bash", `npx shadcn@latest add ${registryItemUrl(doc.name)}`),
    "Run it in a Radix shadcn project that already has the NOSTALGUI theme."
  )
  if (doc.dependencies.length > 0) {
    blocks.push("Dependencies:", fenced("bash", `npm install ${doc.dependencies.join(" ")}`))
  }
  if (doc.registryDependencies.length > 0) {
    blocks.push(
      "Add these items first:",
      doc.registryDependencies.map((name) => `- [${name}](${absoluteUrl(docHref(name))})`).join("\n")
    )
  }
  blocks.push(...doc.files.flatMap((file) => [`\`${file.path}\``, fenced("tsx", file.source)]))

  if (doc.notes !== null) {
    blocks.push("## Notes", doc.notes)
  }
  if (doc.api.length > 0) {
    blocks.push("## API reference", ...apiSection(doc))
  }
  if (doc.usedBy.length > 0) {
    blocks.push("## Used by", doc.usedBy.map((name) => `- [${name}](${absoluteUrl(docHref(name))})`).join("\n"))
  }
  if (doc.sounds.length > 0) {
    blocks.push("## Sounds", doc.sounds.map((sound) => `- \`${sound}\``).join("\n"))
  }

  return `${blocks.join("\n\n")}\n`
}
