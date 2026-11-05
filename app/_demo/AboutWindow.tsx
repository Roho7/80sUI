"use client"

import Link from "next/link"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { CtaButton } from "@/components/ui/cta-button"

import type { DesktopWindowProps } from "./types"

type AboutWindowProps = DesktopWindowProps & {
  itemCount: number
}

function AboutWindow({ itemCount, ...windowProps }: AboutWindowProps) {
  return (
    <Window statusBar={<span>{itemCount} items in the registry</span>} {...windowProps}>
      <div className="flex flex-col gap-4 p-5">
        <h1 className="font-pixel text-[44px] leading-none uppercase md:text-[56px]">NOSTALGUI</h1>
        <p className="text-2xl leading-tight mb-6">
          Retro components for shadcn.
        </p>
        <div className="flex  gap-3">
          <CtaButton asChild shine={{ pauseDuration: 4, sweepDuration: 0.9 }}>
            <Link href="/components">Browse components</Link>
          </CtaButton>
          <Button asChild variant="outline">
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>
      </div>
    </Window>
  )
}

export { AboutWindow }
