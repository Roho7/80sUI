"use client"

import { CrtScreen } from "@/components/retro/crt-screen"

import { useCrt } from "./useCrt"

function CrtSite() {
  const [isOn] = useCrt()
  return isOn ? <CrtScreen fullscreen preset="arcade" curvature={0.12} aberration={1.6} scanlines={0.2} noise={0.3} vignette={0.3} mask={0.3} bloom={0.5} /> : null
}

export { CrtSite }
