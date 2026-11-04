import type { Metadata } from "next"

import { SoundLab } from "./SoundLab"

export const metadata: Metadata = {
  title: "Sound lab / NOSTALGUI",
}

export default function SoundLabPage() {
  return <SoundLab />
}
