"use client"

import { usePathname, useRouter } from "next/navigation"

import { Window } from "@/components/retro/window"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SITE_NAME } from "@/lib/site"

import { StartLogoGlyph } from "./LogoGlyph"

function ProgramWindow({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const goToDesktop = () => router.push("/")

  return (
    <Window
      title={SITE_NAME}
      variant="page"
      titleIcon={<StartLogoGlyph />}
      className="fixed inset-x-0 top-0 bottom-11 z-10"
      onMinimize={goToDesktop}
      onClose={goToDesktop}
    >
      <div className="absolute inset-0 flex flex-col overflow-hidden">{children}</div>
    </Window>
  )
}

function ProgramMain({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()

  return (
    <ScrollArea key={pathname} className="min-w-0 flex-1">
      <main className="flex flex-col gap-8 px-4 py-6 md:px-8 md:py-10">{children}</main>
    </ScrollArea>
  )
}

export { ProgramMain, ProgramWindow }
