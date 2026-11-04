#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { basename, dirname, join, relative, resolve } from "node:path"
import { parseArgs } from "node:util"

const USAGE = `Usage: node scripts/dither-sounds.mjs sync [items...] [options]

Adds the sounds of every installed NOSTALGUI component to sounds.json.
Entries already in sounds.json are kept as they are.

Options:
  --overwrite         replace existing entries with the registry defaults
  --registry <url>    item URL template, default: components.json registries["@nostalgui"]
  --file <path>       sounds.json location, default: where "@/sounds.json" resolves
  --dry-run           print the changes without writing
  -h, --help          show this help`

const CWD = process.cwd()

function fail(message) {
  console.error(`dither-sounds: ${message}`)
  process.exit(1)
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch (error) {
    fail(`could not read ${label} at ${relative(CWD, path) || path}: ${error.message}`)
  }
}

function stripJsonComments(text) {
  return text.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, comment) => (comment ? "" : match)).replace(/,(\s*[}\]])/g, "$1")
}

function readAliasRoot() {
  for (const name of ["tsconfig.json", "jsconfig.json"]) {
    const path = join(CWD, name)
    if (!existsSync(path)) {
      continue
    }
    try {
      const config = JSON.parse(stripJsonComments(readFileSync(path, "utf8")))
      const options = config.compilerOptions ?? {}
      const target = options.paths?.["@/*"]?.[0]
      if (target) {
        return resolve(CWD, options.baseUrl ?? ".", target.replace(/\*$/, ""))
      }
    } catch {
      return CWD
    }
  }
  return CWD
}

function resolveAlias(alias, aliasRoot) {
  if (alias.startsWith("@/")) {
    return join(aliasRoot, alias.slice(2))
  }
  return resolve(CWD, alias)
}

function readRegistryTemplate(componentsJson, override) {
  const style = componentsJson.style ?? "radix-nova"
  if (override) {
    return { url: override, headers: {}, style }
  }
  const entry = componentsJson.registries?.["@nostalgui"]
  if (typeof entry === "string") {
    return { url: entry, headers: {}, style }
  }
  if (entry && typeof entry.url === "string") {
    const headers = Object.fromEntries(Object.entries(entry.headers ?? {}).map(([key, value]) => [key, String(value).replace(/\$\{(\w+)\}/g, (_, name) => process.env[name] ?? "")]))
    return { url: entry.url, headers, style }
  }
  fail('components.json has no registries["@nostalgui"]; pass --registry "https://host/r/{style}/{name}.json"')
}

async function fetchItem(registry, name) {
  const url = registry.url.replace("{name}", name).replace("{style}", registry.style)
  const response = await fetch(url, { headers: registry.headers })
  if (!response.ok) {
    fail(`GET ${url} answered ${response.status}`)
  }
  return response.json()
}

function localPathFor(file, aliases, aliasRoot) {
  const target = file.target
  if (target?.startsWith("~/")) {
    return join(CWD, target.slice(2))
  }
  const prefixes = { "@components/": aliases.components, "@ui/": aliases.ui, "@lib/": aliases.lib, "@hooks/": aliases.hooks }
  for (const [prefix, alias] of Object.entries(prefixes)) {
    if (target?.startsWith(prefix) && alias) {
      return join(resolveAlias(alias, aliasRoot), target.slice(prefix.length))
    }
  }
  const byType = {
    "registry:ui": aliases.ui,
    "registry:component": aliases.components,
    "registry:hook": aliases.hooks,
    "registry:lib": aliases.lib,
  }
  const alias = byType[file.type]
  return alias ? join(resolveAlias(alias, aliasRoot), basename(file.path)) : null
}

function isInstalled(item, aliases, aliasRoot) {
  const files = item.files ?? []
  const primary = files.find((file) => file.type === "registry:ui" || file.type === "registry:component") ?? files[0]
  const path = primary ? localPathFor(primary, aliases, aliasRoot) : null
  return path !== null && existsSync(path)
}

function schemaUrlFor(registryUrl) {
  try {
    return new URL("/schema/sounds.json", registryUrl.replace("{name}", "x")).toString()
  } catch {
    return undefined
  }
}

async function sync(names, options) {
  const componentsPath = join(CWD, "components.json")
  if (!existsSync(componentsPath)) {
    fail("run this from the project root, next to components.json")
  }
  const componentsJson = readJson(componentsPath, "components.json")
  const aliases = componentsJson.aliases ?? {}
  const aliasRoot = readAliasRoot()
  const registry = readRegistryTemplate(componentsJson, options.registry)
  const soundsPath = options.file ? resolve(CWD, options.file) : join(aliasRoot, "sounds.json")

  const index = await fetchItem(registry, "registry")
  const items = (index.items ?? []).filter((item) => Array.isArray(item.meta?.sounds) && item.meta.sounds.length > 0)
  const known = new Set(items.map((item) => item.name))
  for (const name of names) {
    if (!known.has(name)) {
      fail(`"${name}" is not a NOSTALGUI item with sounds. Items with sounds: ${[...known].join(", ")}`)
    }
  }
  const chosen = names.length > 0 ? items.filter((item) => names.includes(item.name)) : items.filter((item) => isInstalled(item, aliases, aliasRoot))

  const sounds = existsSync(soundsPath)
    ? readJson(soundsPath, "sounds.json")
    : { $schema: schemaUrlFor(registry.url), enabled: true, volume: 0.6, reducedMotion: "thin", sounds: {} }
  sounds.sounds ??= {}
  sounds.$schema ??= schemaUrlFor(registry.url)

  const added = []
  const replaced = []
  const kept = []
  for (const item of chosen) {
    const detail = await fetchItem(registry, item.name)
    const entries = detail.meta?.sounds
    if (!entries || Array.isArray(entries)) {
      fail(`${item.name} has no sound data in the registry; rebuild it with npm run registry:build`)
    }
    for (const [key, entry] of Object.entries(entries)) {
      if (!(key in sounds.sounds)) {
        sounds.sounds[key] = entry
        added.push(key)
      } else if (options.overwrite) {
        sounds.sounds[key] = entry
        replaced.push(key)
      } else {
        kept.push(key)
      }
    }
  }

  const where = relative(CWD, soundsPath) || soundsPath
  console.log(`dither-sounds: ${chosen.length === 0 ? "no installed NOSTALGUI components have sounds" : `checked ${chosen.map((item) => item.name).join(", ")}`}`)
  if (added.length) console.log(`  added ${added.length}: ${added.join(", ")}`)
  if (replaced.length) console.log(`  replaced ${replaced.length}: ${replaced.join(", ")}`)
  if (kept.length) console.log(`  kept ${kept.length} you already have: ${kept.join(", ")}`)
  if (options["dry-run"]) {
    console.log(`  dry run: ${where} not written`)
    return
  }
  if (added.length || replaced.length || !existsSync(soundsPath)) {
    if (!existsSync(dirname(soundsPath))) {
      fail(`folder ${dirname(soundsPath)} does not exist`)
    }
    writeFileSync(soundsPath, `${JSON.stringify(sounds, null, 2)}\n`)
    console.log(`  wrote ${where}`)
  } else {
    console.log(`  ${where} is up to date`)
  }
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    overwrite: { type: "boolean" },
    registry: { type: "string" },
    file: { type: "string" },
    "dry-run": { type: "boolean" },
    help: { type: "boolean", short: "h" },
  },
})

const [command, ...names] = positionals
if (values.help || command !== "sync") {
  console.log(USAGE)
  process.exit(values.help ? 0 : 1)
}
await sync(names, values)
