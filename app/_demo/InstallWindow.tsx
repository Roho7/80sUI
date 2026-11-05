"use client"

import Link from "next/link"

import { Window } from "@/components/retro/window"
import { CopyCommand } from "@/components/showcase/CopyCommand"
import { InstallCommand } from "@/components/showcase/InstallCommand"

import type { DesktopWindowProps } from "./types"

function InstallWindow(windowProps: DesktopWindowProps) {
  return (
    <Window title="Setup.exe" {...windowProps}>
      <div className="flex flex-col gap-3 p-4">
        <p className="text-xl leading-tight">
          NOSTALGUI is built on Radix. Start a Radix project; Base UI is not supported yet.
        </p>
        <CopyCommand command="npx shadcn@latest init -b radix" label="Radix init command" />
        <p className="font-pixel text-[20px] leading-none uppercase">Install the theme</p>
        <InstallCommand name="theme" />
        <Link href="/docs/installation" className="self-start text-xl underline decoration-[length:var(--pixel)]">
          Full installation guide
        </Link>
      </div>
    </Window>
  )
}

export { InstallWindow }
