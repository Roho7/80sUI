import { ImageResponse } from "next/og"

import { BRAND_INKS, buildKeycapDataUri } from "@/lib/brand/keycap"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: BRAND_INKS.desktop }}>
        <img src={buildKeycapDataUri(160)} width={160} height={160} alt="" />
      </div>
    ),
    size
  )
}
