import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

import { readSoundsConfig } from "@/lib/sound/types"

const SOUNDS_PATH = join(process.cwd(), "sounds.json")

function roundNumbers(value: unknown): unknown {
  if (typeof value === "number") {
    return Number(value.toPrecision(6))
  }
  if (Array.isArray(value)) {
    return value.map(roundNumbers)
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, roundNumbers(item)]))
  }
  return value
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  return origin !== null && host !== null && new URL(origin).host === host
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Saving sounds only works under next dev" }, { status: 403 })
  }
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Cross-origin save refused" }, { status: 403 })
  }
  let incoming
  try {
    incoming = readSoundsConfig(await request.json())
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid sounds" }, { status: 400 })
  }
  const current = readSoundsConfig(JSON.parse(await readFile(SOUNDS_PATH, "utf8")))
  const sounds = { ...current.sounds }
  for (const [key, entry] of Object.entries(incoming.sounds)) {
    sounds[key] = entry
  }
  const next = roundNumbers({ ...current, sounds })
  await writeFile(SOUNDS_PATH, `${JSON.stringify(next, null, 2)}\n`)
  return Response.json({ saved: Object.keys(incoming.sounds) })
}
