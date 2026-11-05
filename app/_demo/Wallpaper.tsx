"use client"

import { DitherImage } from "@/components/ui/dither-image"

const WALLPAPER_SIZE = 620

function Wallpaper() {
  return (
    <DitherImage
      src="/1980.png"
      alt=""
      aria-hidden="true"
      width={WALLPAPER_SIZE}
      height={WALLPAPER_SIZE}
      pixelSize={1}
      contrast={1.1}
      className="pointer-events-none absolute inset-0 size-full object-cover select-none"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

export { Wallpaper }
