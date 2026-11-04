import type { Metadata } from "next"

import { SoundLab } from "./SoundLab"

export const metadata: Metadata = {
  title: "Sound lab",
}

export default function SoundLabPage() {
  return <SoundLab />
}
