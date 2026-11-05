import type { WindowProps } from "@/components/retro/window"

export type DesktopWindowProps = Pick<
  WindowProps,
  "title" | "isActive" | "onActivate" | "onMinimize" | "onClose" | "style" | "defaultPosition" | "className"
>
