import type { Metadata } from "next"

import { Desktop } from "../_demo/Desktop"

export const metadata: Metadata = {
  title: "Desktop",
  description: "A retro desktop built from NOSTALGUI windows, a taskbar and a terminal.",
}

export default function DesktopPage() {
  return <Desktop />
}
