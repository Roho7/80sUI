import type { NextRequest } from "next/server"

const ITEM_FILE = /^[a-z0-9-]+\.json$/
const UNSUPPORTED_BASE_PREFIX = "base-"

export async function GET(request: NextRequest, context: RouteContext<"/r/[style]/[file]">) {
  const { style, file } = await context.params
  if (!ITEM_FILE.test(file)) {
    return Response.json({ error: "not-found", message: `No UI95 registry file named ${file}.` }, { status: 404 })
  }
  if (style.startsWith(UNSUPPORTED_BASE_PREFIX)) {
    return Response.json(
      {
        error: "unsupported-base",
        message: `UI95 is built on Radix and does not ship ${style} yet. Start the project with npx shadcn@latest init -b radix, or set "style" in components.json to a radix-* style.`,
      },
      { status: 404 }
    )
  }
  return Response.redirect(new URL(`/r/${file}`, request.url), 307)
}
