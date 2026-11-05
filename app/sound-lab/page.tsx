import type { Metadata } from "next"

import { SoundLab } from "./SoundLab"

export const metadata: Metadata = {
  title: "Sound lab",
  robots: { index: false, follow: false },
}

export default function SoundLabPage() {
  return <SoundLab />
}
