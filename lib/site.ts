const PRODUCTION_HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (PRODUCTION_HOST ? `https://${PRODUCTION_HOST}` : "http://localhost:3000")

export const SITE_NAME = "NOSTALGUI"

export const SOURCE_URL = "https://github.com/Roho7/nostalgui"

export const SITE_TAGLINE = "Retro, 1-bit components for shadcn."

export function registryItemUrl(name: string): string {
  return `${SITE_URL}/r/${name}.json`
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}
