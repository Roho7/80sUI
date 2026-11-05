import { ImageResponse } from "next/og"

import { buildKeycapDataUri } from "@/lib/brand/keycap"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<img src={buildKeycapDataUri(32)} width={32} height={32} alt="" />, size)
}
