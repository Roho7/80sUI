import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { ShowcaseCatalogue } from "@/components/showcase/ShowcaseCatalogue"
import { Button } from "@/components/ui/button"

import { ThemeControls } from "../_site/ThemeControls"

export const metadata: Metadata = {
  title: "Components / NOSTALGUI",
  description: "Every NOSTALGUI registry component and variant, ready to install with shadcn.",
}

export default function ComponentsPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          <Button asChild variant="outline" size="icon" className="shrink-0">
            <Link href="/" aria-label="Back to desktop">
              <ChevronLeft />
            </Link>
          </Button>
          <div className="flex flex-col gap-3">
            <p className="font-pixel text-[16px] leading-none uppercase">NOSTALGUI</p>
            <h1 className="font-pixel text-[32px] leading-none uppercase md:text-[48px]">
              Components
            </h1>
            <p className="max-w-xl text-xl leading-tight">
              Every item in the @nostalgui registry with every variant it ships. Pick one, copy the
              command, own the code.
            </p>
          </div>
        </div>
        <ThemeControls />
      </header>
      <ShowcaseCatalogue />
    </main>
  )
}
