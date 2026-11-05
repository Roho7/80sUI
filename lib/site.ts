const PRODUCTION_HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "nostalgui.vercel.app"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${PRODUCTION_HOST}`

export const SITE_NAME = "NOSTALGUI"

export const SOURCE_URL = "https://github.com/Roho7/nostalgui"

export const SITE_TAGLINE = "Retro components for shadcn."

export const SITE_DESCRIPTION =
  "NOSTALGUI is a shadcn registry of retro, Windows 95 style React components: square corners, four inks, stepped motion, ordered dither and synthesized click sounds. Install them with the shadcn CLI and own the code."

export const SITE_KEYWORDS = [
  "shadcn",
  "shadcn registry",
  "retro UI",
  "Windows 95 UI",
  "pixel art components",
  "1-bit design",
  "dither",
  "React components",
  "Tailwind CSS",
  "Radix UI",
  "Next.js",
]

export const SITE_AUTHOR = { name: "Roho7", url: "https://roho.live" }

export const SITE_TWITTER = "@Rohosen_"

export function registryItemUrl(name: string): string {
  return `${SITE_URL}/r/${name}.json`
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}
