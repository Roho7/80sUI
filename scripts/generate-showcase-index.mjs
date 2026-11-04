import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"

const REGISTRY_PATH = new URL("../registry.json", import.meta.url)
const DEMOS_DIRECTORY = new URL("../components/showcase/demos/", import.meta.url)
const OUTPUT_PATH = new URL("../components/showcase/demos.generated.ts", import.meta.url)
const DEMOS_PATH_LABEL = "components/showcase/demos"
const SHOWCASED_TYPES = new Set(["registry:ui", "registry:block"])

function toIdentifier(name) {
  return `${name.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase())}Demo`
}

function listDemoNames() {
  return readdirSync(DEMOS_DIRECTORY)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.slice(0, -".tsx".length))
}

function findProblems(items, showcased, demoNames) {
  const showcasedNames = new Set(showcased.map((item) => item.name))
  const demoNameSet = new Set(demoNames)
  const missingDemos = showcased
    .filter((item) => !demoNameSet.has(item.name))
    .map(
      (item) =>
        `registry item "${item.name}" (${item.type}) has no demo. Add ${DEMOS_PATH_LABEL}/${item.name}.tsx exporting \`demo: ShowcaseDemo\`.`
    )
  const orphanDemos = demoNames
    .filter((name) => !showcasedNames.has(name))
    .map((name) => {
      const item = items.find((candidate) => candidate.name === name)
      const reason = item
        ? `registry item "${name}" is ${item.type}, and only ${[...SHOWCASED_TYPES].join(" and ")} items are showcased`
        : `registry.json has no item named "${name}"`
      return `${DEMOS_PATH_LABEL}/${name}.tsx has no showcased registry item: ${reason}. Remove the demo or add the item.`
    })
  return [...missingDemos, ...orphanDemos]
}

function buildIndexSource(showcased) {
  const imports = showcased
    .map((item) => ({
      path: `./demos/${item.name}`,
      line: `import { demo as ${toIdentifier(item.name)} } from "./demos/${item.name}"`,
    }))
    .sort((first, second) => first.path.localeCompare(second.path))
    .map(({ line }) => line)
  const entries = showcased.map((item) =>
    [
      "  {",
      `    name: ${JSON.stringify(item.name)},`,
      `    title: ${JSON.stringify(item.title ?? item.name)},`,
      `    description: ${JSON.stringify(item.description ?? "")},`,
      `    demo: ${toIdentifier(item.name)},`,
      "  },",
    ].join("\n")
  )
  return [
    ...imports,
    'import type { ShowcaseEntry } from "./types"',
    "",
    "export const SHOWCASE_ENTRIES: readonly ShowcaseEntry[] = [",
    ...entries,
    "]",
    "",
  ].join("\n")
}

const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"))
const showcased = registry.items.filter((item) => SHOWCASED_TYPES.has(item.type))
const problems = findProblems(registry.items, showcased, listDemoNames())

if (problems.length > 0) {
  console.error(`generate-showcase-index: ${problems.length} problem(s)`)
  for (const problem of problems) {
    console.error(`  - ${problem}`)
  }
  process.exit(1)
}

const source = buildIndexSource(showcased)
const isUnchanged = existsSync(OUTPUT_PATH) && readFileSync(OUTPUT_PATH, "utf8") === source
if (!isUnchanged) {
  writeFileSync(OUTPUT_PATH, source)
}
console.log(
  `generate-showcase-index: ${showcased.length} showcased item(s)${isUnchanged ? ", index unchanged" : ", index written"}`
)
