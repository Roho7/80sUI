import { Terminal, type TerminalLine } from "@/components/retro/terminal"

import type { ShowcaseDemo } from "../types"

const BOOT: readonly TerminalLine[] = [
  { kind: "command", text: "mem /c" },
  { kind: "output", text: "640K conventional, 384K upper" },
  { kind: "command", text: "dir a:" },
  { kind: "output", text: "General failure reading drive A" },
]

const SHELL: readonly TerminalLine[] = [
  { kind: "command", text: "whoami" },
  { kind: "output", text: "guest" },
]

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    { label: "typing", render: () => <Terminal lines={BOOT} className="h-40" /> },
    { label: "looping", render: () => <Terminal lines={BOOT} isLooping typingFps={20} className="h-40" /> },
    { label: "static", render: () => <Terminal lines={BOOT} isAnimated={false} className="h-40" /> },
    {
      label: "custom prompt",
      render: () => <Terminal lines={SHELL} prompt="guest@nostalgui:~$" isAnimated={false} className="h-40" />,
    },
  ],
}
