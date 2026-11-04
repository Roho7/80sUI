import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"))
const config = JSON.parse(readFileSync(join(ROOT, "sounds.json"), "utf8"))
const missing = []
let written = 0

for (const item of registry.items) {
  const keys = item.meta?.sounds
  if (!Array.isArray(keys)) {
    continue
  }
  const outputPath = join(ROOT, "public/r", `${item.name}.json`)
  const output = JSON.parse(readFileSync(outputPath, "utf8"))
  const sounds = {}
  for (const key of keys) {
    const entry = config.sounds[key]
    if (entry === undefined || entry === false) {
      missing.push(`${item.name}: ${key}`)
      continue
    }
    sounds[key] = entry
  }
  output.meta = { ...output.meta, sounds }
  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`)
  written += 1
}

if (missing.length > 0) {
  console.error(`build-sound-meta: sounds.json is missing ${missing.join(", ")}`)
  process.exit(1)
}
console.log(`build-sound-meta: embedded sounds in ${written} registry items`)
