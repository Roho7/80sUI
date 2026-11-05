"use client"

import { DitherImage } from "@/components/ui/dither-image"

const WALLPAPER_SIZE = 720

function Wallpaper() {
  return (
    <DitherImage
      src="/eye1.png"
      alt=""
      aria-hidden="true"
      width={WALLPAPER_SIZE}
      height={WALLPAPER_SIZE}
      pixelSize={3}
      contrast={1.1}
      className="pointer-events-none absolute inset-0 size-full object-cover select-none"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

export { Wallpaper }
