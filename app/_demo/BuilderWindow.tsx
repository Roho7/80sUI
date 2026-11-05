"use client"

import { Window } from "@/components/retro/window"
import { DitherImage } from "@/components/ui/dither-image"

import type { DesktopWindowProps } from "./types"

const LINKS = [
  { href: "https://github.com/Roho7", label: "github" },
  { href: "https://roho.live", label: "portfolio" },
  { href: "https://x.com/Rohosen_", label: "twitter" },
] as const

function BuilderWindow(windowProps: DesktopWindowProps) {
  return (
    <Window {...windowProps}>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <DitherImage src="/eye1.png" alt="Dithered eye" width={64} height={63} pixelSize={2} />
          <p className="font-pixel text-[24px] leading-none uppercase">Roho7</p>
        </div>
        <p className="text-xl leading-tight">
          Designer & Developer. Misses the simple times.
        </p>
        <ul className="flex flex-col gap-1 text-xl leading-tight">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer" className="underline decoration-[length:var(--pixel)]">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  )
}

export { BuilderWindow }
