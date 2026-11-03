import { readFileSync, writeFileSync } from "node:fs"

import postcss from "postcss"

const CSS_PATH = new URL("../app/globals.css", import.meta.url)
const REGISTRY_PATH = new URL("../registry.json", import.meta.url)
const SKIPPED_AT_RULES = new Set(["import", "custom-variant"])
const CSS_VAR_TARGETS = { ":root": "light", ".dark": "dark" }

function readDeclarations(container) {
  return Object.fromEntries(
    container.nodes
      .filter((node) => node.type === "decl")
      .map((node) => [node.prop.replace(/^--/, ""), node.value])
  )
}

function convertNodes(nodes) {
  const converted = {}
  for (const node of nodes) {
    if (node.type === "decl") {
      converted[node.prop] = node.value
    } else if (node.type === "rule") {
      converted[node.selector] = convertNodes(node.nodes)
    } else if (node.type === "atrule") {
      converted[`@${node.name} ${node.params}`.trim()] = node.nodes ? convertNodes(node.nodes) : {}
    }
  }
  return converted
}

function buildThemeFields(root) {
  const cssVars = { theme: {}, light: {}, dark: {} }
  const css = {}
  for (const node of root.nodes) {
    if (node.type === "atrule" && SKIPPED_AT_RULES.has(node.name)) {
      continue
    }
    if (node.type === "atrule" && node.name === "theme") {
      Object.assign(cssVars.theme, readDeclarations(node))
      continue
    }
    if (node.type === "rule" && node.selector in CSS_VAR_TARGETS) {
      Object.assign(cssVars[CSS_VAR_TARGETS[node.selector]], readDeclarations(node))
      continue
    }
    Object.assign(css, convertNodes([node]))
  }
  return { cssVars, css }
}

const root = postcss.parse(readFileSync(CSS_PATH, "utf8"))
const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"))
const themeItem = registry.items.find((item) => item.name === "theme")
if (!themeItem) {
  throw new Error("registry.json has no item named theme")
}
Object.assign(themeItem, buildThemeFields(root))
writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`)
