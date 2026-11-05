"use client"

import { usePathname, useRouter } from "next/navigation"

import { Window } from "@/components/retro/window"
import { SITE_NAME } from "@/lib/site"

import { LogoGlyph } from "./LogoGlyph"

function ProgramWindow({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const goToDesktop = () => router.push("/")

  return (
    <Window
      title={SITE_NAME}
      titleIcon={<LogoGlyph />}
      className="fixed inset-x-0 top-0 bottom-11 z-10"
      onMinimize={goToDesktop}
      onClose={goToDesktop}
    >
      <div className="flex h-full flex-col">{children}</div>
    </Window>
  )
}

function ProgramMain({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()

  return (
    <main
      key={pathname}
      className="flex min-w-0 flex-1 flex-col gap-8 overflow-y-auto px-4 py-6 md:px-8 md:py-10"
    >
      {children}
    </main>
  )
}

export { ProgramMain, ProgramWindow }
