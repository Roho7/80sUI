"use client"

import Link from "next/link"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"

import type { DesktopWindowProps } from "./types"

type AboutWindowProps = DesktopWindowProps & {
  itemCount: number
}

function AboutWindow({ itemCount, ...windowProps }: AboutWindowProps) {
  return (
    <Window title="README.TXT" statusBar={<span>{itemCount} items in the registry</span>} {...windowProps}>
      <div className="flex flex-col gap-4 p-5">
        <h1 className="font-pixel text-[44px] leading-none uppercase md:text-[56px]">NOSTALGUI</h1>
        <p className="text-2xl leading-tight">
          Retro, 1-bit components for shadcn. Square corners, four inks, stepped motion and
          ordered dither instead of fades.
        </p>
        <p className="text-xl leading-tight">
          Every window on this desktop is built from the registry. Install a component with the
          shadcn CLI and the code is yours to change.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/components">Browse components</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>
      </div>
    </Window>
  )
}

export { AboutWindow }
