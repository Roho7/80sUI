"use client"

import { useEffect } from "react"

import { soundsConfig } from "@/lib/sound/config"
import { SoundEngine } from "@/lib/sound/sound-engine"
import { attachSoundSlots } from "@/lib/sound/sound-slots"
import type { SoundsConfig } from "@/lib/sound/types"

type Ui95SoundsProps = {
  config?: SoundsConfig
}

function Ui95Sounds({ config = soundsConfig }: Ui95SoundsProps) {
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

export { Ui95Sounds }
