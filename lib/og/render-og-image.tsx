import { ImageResponse } from "next/og"

import { BRAND_INKS, START_LOGO_PATH } from "@/lib/brand/keycap"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const OG_SIZE = { width: 1200, height: 630 }

type OgImageContent = {
  eyebrow: string
  title: string
  description: string
  windowTitle?: string
}

type OgFont = { name: string; data: ArrayBuffer; weight: 400; style: "normal" }

const SCALE = 2
const PIXEL = 2 * SCALE
const SHADOW = PIXEL * 3
const MARGIN = 56
const WINDOW_WIDTH = OG_SIZE.width - MARGIN * 2 - SHADOW
const WINDOW_HEIGHT = OG_SIZE.height - MARGIN * 2 - SHADOW
const TITLEBAR_HEIGHT = 32 * SCALE
const STATUSBAR_HEIGHT = 28 * SCALE
const HOST = SITE_URL.replace(/^https?:\/\//, "")
const DESCRIPTION_LIMIT = 130
const LONG_DESCRIPTION = 70

const CONTROL_GLYPHS = {
  minimize: "M1 5h5v2H1z",
  maximize: "M0 0h7v2H0zM0 2h1v5H0zM6 2h1v5H6zM1 6h5v1H1z",
  close:
    "M0 0h2v1H0zM5 0h2v1H5zM1 1h2v1H1zM4 1h2v1H4zM2 2h3v1H2zM3 3h1v1H3zM2 4h3v1H2zM1 5h2v1H1zM4 5h2v1H4zM0 6h2v1H0zM5 6h2v1H5z",
} as const

async function loadGoogleFont(family: string, text: string): Promise<OgFont | null> {
  try {
    const query = `family=${encodeURIComponent(family)}&text=${encodeURIComponent(text)}`
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text()
    const source = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!source) {
      return null
    }
    return { name: family, data: await (await fetch(source)).arrayBuffer(), weight: 400, style: "normal" }
  } catch {
    return null
  }
}

function clampDescription(description: string): string {
  return description.length > DESCRIPTION_LIMIT ? `${description.slice(0, DESCRIPTION_LIMIT - 3).trimEnd()}...` : description
}

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function buildDitherShadowUri(): string {
  const width = WINDOW_WIDTH + SHADOW
  const height = WINDOW_HEIGHT + SHADOW
  const strip = `M${WINDOW_WIDTH} ${SHADOW}h${SHADOW}v${height - SHADOW}H${SHADOW}v-${SHADOW}h${WINDOW_WIDTH - SHADOW}z`
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges"><defs><pattern id="d" x="${SHADOW}" y="${SHADOW}" width="${PIXEL * 2}" height="${PIXEL * 2}" patternUnits="userSpaceOnUse"><rect width="${PIXEL}" height="${PIXEL}" fill="${BRAND_INKS.ink0}"/><rect x="${PIXEL}" y="${PIXEL}" width="${PIXEL}" height="${PIXEL}" fill="${BRAND_INKS.ink0}"/></pattern></defs><path d="${strip}" fill="url(#d)"/></svg>`
  )
}

function buildGlyphUri(path: string, fill: string, isDithered = false): string {
  const dither = isDithered
    ? `<defs><pattern id="m" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#fff"/><rect x="1" y="1" width="1" height="1" fill="#fff"/></pattern><mask id="k"><rect width="7" height="7" fill="url(#m)"/></mask></defs>`
    : ""
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" shape-rendering="crispEdges">${dither}<path d="${path}" fill="${fill}"${isDithered ? ' mask="url(#k)"' : ""}/></svg>`
  )
}

function buildLogoUri(fill: string): string {
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 5" shape-rendering="crispEdges"><path d="${START_LOGO_PATH}" fill="${fill}"/></svg>`
  )
}

export async function renderOgImage({ eyebrow, title, description: fullDescription, windowTitle: customWindowTitle }: OgImageContent) {
  const description = clampDescription(fullDescription)
  const isHome = title === SITE_NAME
  const headline = (isHome ? title.slice(1) : title).toUpperCase()
  const windowTitle = customWindowTitle ?? (isHome ? "README.TXT" : `${title.replace(/\s+/g, "_")}.TXT`.toUpperCase())
  const statusText = HOST
  const fonts = (
    await Promise.all([
      loadGoogleFont("Silkscreen", `${windowTitle}${eyebrow}${headline}`.toUpperCase()),
      loadGoogleFont("VT323", `${description}${statusText}`),
    ])
  ).filter((font): font is OgFont => font !== null)
  const headlineSize = headline.length > 14 ? 64 : 88
  const controlSize = 12 * SCALE

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: BRAND_INKS.desktop }}>
        <img
          src={buildDitherShadowUri()}
          width={WINDOW_WIDTH + SHADOW}
          height={WINDOW_HEIGHT + SHADOW}
          alt=""
          style={{ position: "absolute", left: MARGIN, top: MARGIN }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: MARGIN,
            top: MARGIN,
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            border: `${PIXEL}px solid ${BRAND_INKS.ink0}`,
            background: BRAND_INKS.ink3,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12 * SCALE,
              height: TITLEBAR_HEIGHT,
              paddingLeft: 12 * SCALE,
              paddingRight: 4 * SCALE,
              borderBottom: `${PIXEL}px solid ${BRAND_INKS.ink0}`,
              background: BRAND_INKS.ink0,
            }}
          >
            <div style={{ display: "flex", fontFamily: "Silkscreen", fontSize: 16 * SCALE, lineHeight: 1, color: BRAND_INKS.ink3 }}>
              {windowTitle}
            </div>
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: 16 * SCALE }}>
              {[0, 1, 2, 3].map((line) => (
                <div key={line} style={{ height: PIXEL, marginBottom: PIXEL, background: BRAND_INKS.ink3 }} />
              ))}
            </div>
            {[
              { path: CONTROL_GLYPHS.minimize, isDisabled: false },
              { path: CONTROL_GLYPHS.maximize, isDisabled: true },
              { path: CONTROL_GLYPHS.close, isDisabled: false },
            ].map(({ path, isDisabled }) => (
              <div key={path} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24 * SCALE, height: 24 * SCALE }}>
                <img src={buildGlyphUri(path, BRAND_INKS.ink3, isDisabled)} width={controlSize} height={controlSize} alt="" />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 8 * SCALE, padding: 20 * SCALE }}>
            <div style={{ display: "flex", fontFamily: "Silkscreen", fontSize: 12 * SCALE, color: BRAND_INKS.ink1, letterSpacing: 2 }}>
              {eyebrow.toUpperCase()}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Silkscreen", fontSize: headlineSize, lineHeight: 1, color: BRAND_INKS.ink0 }}>
              {isHome && (
                <img
                  src={buildLogoUri(BRAND_INKS.ink0)}
                  width={Math.round(headlineSize * 0.62 * 2.2)}
                  height={Math.round(headlineSize * 0.62)}
                  alt=""
                  style={{ marginRight: 4 * SCALE, marginBottom: Math.round(headlineSize * 0.12) }}
                />
              )}
              {headline}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "VT323",
                fontSize: description.length > LONG_DESCRIPTION ? 18 * SCALE : 22 * SCALE,
                lineHeight: 1.1,
                color: BRAND_INKS.ink0,
                maxWidth: WINDOW_WIDTH - 40 * SCALE,
              }}
            >
              {description}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: STATUSBAR_HEIGHT,
              paddingLeft: 8 * SCALE,
              borderTop: `${PIXEL}px solid ${BRAND_INKS.ink0}`,
              fontFamily: "VT323",
              fontSize: 18 * SCALE,
              color: BRAND_INKS.ink0,
            }}
          >
            {statusText}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: PIXEL, background: BRAND_INKS.ink4 }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: PIXEL, background: BRAND_INKS.ink4 }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, right: 0, height: PIXEL, background: BRAND_INKS.ink1 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: PIXEL, background: BRAND_INKS.ink1 }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
