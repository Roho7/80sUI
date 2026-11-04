import soundsJson from "@/sounds.json"

import { readSoundsConfig, type SoundsConfig } from "./types"

export const soundsConfig: SoundsConfig = readSoundsConfig(soundsJson)
