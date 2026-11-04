import type { WindowProps } from "@/components/retro/window"

export type DesktopWindowProps = Pick<
  WindowProps,
  "isActive" | "onActivate" | "style" | "defaultPosition" | "className"
>
