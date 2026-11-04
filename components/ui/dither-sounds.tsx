"use client"

import { useEffect } from "react"

import { soundsConfig } from "@/lib/sound/config"
import { SoundEngine } from "@/lib/sound/sound-engine"
import { attachSoundSlots } from "@/lib/sound/sound-slots"
import type { SoundsConfig } from "@/lib/sound/types"

type DitherSoundsProps = {
  config?: SoundsConfig
}

function DitherSounds({ config = soundsConfig }: DitherSoundsProps) {
  useEffect(() => {
    const engine = SoundEngine.get()
    if (!engine) {
      return
    }
    engine.configure(config)
    return attachSoundSlots(engine, document)
  }, [config])
  return null
}

export { DitherSounds }
