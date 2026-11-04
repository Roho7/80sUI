#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { basename, join } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const UPSTREAM = "https://ui.shadcn.com/r/styles/radix-nova/{name}.json"
const REGISTRY_PATH = join(ROOT, "registry.json")
const ROADMAP_PATH = join(ROOT, "ROADMAP.md")
const PLATFORM_PACKAGES = new Set(["react", "react-dom", "next"])
const USAGE = `Usage: node scripts/add-shadcn.mjs <add|deps> <names...>

add   fetch shadcn radix-nova sources for components not yet in the repo, write them to
      components/ui as the starting point for a restyle, add a registry item, a stub demo
      and the ROADMAP tick. Existing files and items are left alone, so it is safe to rerun.
deps  recompute each item's dependencies and registryDependencies from its files' imports.`

const UPSTREAM_ALIASES = [
  ["@/registry/radix-nova/ui/", "@/components/ui/"],
  ["@/registry/radix-nova/lib/", "@/lib/"],
  ["@/registry/radix-nova/hooks/", "@/hooks/"],
]

function rewriteImports(source) {
  return UPSTREAM_ALIASES.reduce((text, [from, to]) => text.replaceAll(from, to), source)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function titleOf(name) {
  return name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")
}

function listImports(source) {
  return [...source.matchAll(/^\s*import\s[^"']*["']([^"']+)["']/gm), ...source.matchAll(/^\s*export\s[^"']*\sfrom\s["']([^"']+)["']/gm)].map((match) => match[1])
}

function packageOf(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function deriveDependencies(item, itemByFile) {
  const registryDependencies = new Set(["@dither/theme"])
  const dependencies = new Set()
  for (const file of item.files) {
    const path = join(ROOT, file.path)
    if (!existsSync(path)) {
      continue
    }
    for (const specifier of listImports(readFileSync(path, "utf8"))) {
      if (specifier.startsWith(".") || specifier.startsWith("node:")) {
        continue
      }
      if (specifier.startsWith("@/")) {
        const local = specifier.slice(2)
        const owner = ["", ".tsx", ".ts", "/index.ts"].map((extension) => itemByFile.get(`${local}${extension}`)).find(Boolean)
        if (owner && owner !== item.name) {
          registryDependencies.add(`@dither/${owner}`)
        }
        continue
      }
      const name = packageOf(specifier)
      if (!PLATFORM_PACKAGES.has(name)) {
        dependencies.add(name)
      }
    }
  }
  return { dependencies: [...dependencies].sort(), registryDependencies: [...registryDependencies].sort((a, b) => (a === "@dither/theme" ? -1 : b === "@dither/theme" ? 1 : a.localeCompare(b))) }
}

function indexFiles(registry) {
  const itemByFile = new Map()
  for (const item of registry.items) {
    for (const file of item.files ?? []) {
      itemByFile.set(file.path, item.name)
    }
  }
  return itemByFile
}

function syncDependencies(registry, names) {
  const itemByFile = indexFiles(registry)
  const changed = []
  for (const item of registry.items) {
    if (!names.includes(item.name)) {
      continue
    }
    const derived = deriveDependencies(item, itemByFile)
    const before = JSON.stringify([item.dependencies ?? [], item.registryDependencies ?? []])
    if (derived.dependencies.length > 0) {
      item.dependencies = derived.dependencies
    } else {
      delete item.dependencies
    }
    item.registryDependencies = derived.registryDependencies
    if (JSON.stringify([item.dependencies ?? [], item.registryDependencies]) !== before) {
      changed.push(item.name)
    }
  }
  return changed
}

function tickRoadmap(names) {
  let roadmap = readFileSync(ROADMAP_PATH, "utf8")
  for (const name of names) {
    roadmap = roadmap.replace(new RegExp(`^- \\[ \\] ${name}$`, "m"), `- [x] ${name}`)
  }
  const section = roadmap.slice(roadmap.indexOf("## shadcn components"), roadmap.indexOf("## dither-ui originals"))
  const done = (section.match(/^- \[x\] /gm) ?? []).length
  const total = (section.match(/^- \[[ x]\] /gm) ?? []).length
  roadmap = roadmap.replace(/^\d+ of \d+ done\.$/m, `${done} of ${total} done.`)
  writeFileSync(ROADMAP_PATH, roadmap)
}

const DEMO_STUB = (name, exportName) => `import { ${exportName} } from "@/components/ui/${name}"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [{ label: "default", render: () => <${exportName} /> }],
}
`

async function add(names) {
  const registry = readJson(REGISTRY_PATH)
  const known = new Set(registry.items.map((item) => item.name))
  const added = []
  for (const name of names) {
    const response = await fetch(UPSTREAM.replace("{name}", name))
    if (!response.ok) {
      throw new Error(`${name}: upstream answered ${response.status}`)
    }
    const upstream = await response.json()
    const files = upstream.files.filter((file) => file.type === "registry:ui")
    for (const file of files) {
      const target = join(ROOT, "components/ui", basename(file.path))
      if (!existsSync(target)) {
        writeFileSync(target, rewriteImports(file.content))
      }
    }
    const demoPath = join(ROOT, "components/showcase/demos", `${name}.tsx`)
    if (!existsSync(demoPath)) {
      const exportName = files[0].content.match(/export\s*\{\s*(\w+)/)?.[1] ?? titleOf(name).replace(/ /g, "")
      writeFileSync(demoPath, DEMO_STUB(name, exportName))
    }
    if (!known.has(name)) {
      registry.items.splice(registry.items.findIndex((item) => item.type === "registry:block"), 0, {
        name,
        type: "registry:ui",
        title: upstream.title ?? titleOf(name),
        description: upstream.description ?? `shadcn ${name} reskinned for dither-ui.`,
        files: files.map((file) => ({ path: `components/ui/${basename(file.path)}`, type: "registry:ui" })),
        registryDependencies: ["@dither/theme"],
      })
      known.add(name)
      added.push(name)
    }
  }
  syncDependencies(registry, names)
  writeJson(REGISTRY_PATH, registry)
  tickRoadmap(names)
  console.log(`add-shadcn: ${added.length ? `added ${added.join(", ")}` : "nothing new"}; registry deps synced for ${names.length}`)
}

const [command, ...names] = process.argv.slice(2)
if (names.length === 0 || (command !== "add" && command !== "deps")) {
  console.log(USAGE)
  process.exit(1)
}
if (command === "add") {
  await add(names)
} else {
  const registry = readJson(REGISTRY_PATH)
  const changed = syncDependencies(registry, names)
  writeJson(REGISTRY_PATH, registry)
  console.log(`add-shadcn: registry deps ${changed.length ? `updated for ${changed.join(", ")}` : "already match the imports"}`)
}
