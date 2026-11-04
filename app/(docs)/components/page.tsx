import type { Metadata } from "next"

import { DocSection } from "@/components/docs/DocSection"
import { RegistrySetup } from "@/components/docs/RegistrySetup"
import { ShowcaseCatalogue } from "@/components/showcase/ShowcaseCatalogue"

export const metadata: Metadata = {
  title: "Components",
  description: "Every NOSTALGUI registry component and variant, ready to install with shadcn.",
}

export default function ComponentsPage() {
  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="font-pixel text-[32px] leading-none uppercase md:text-[48px]">Components</h1>
        <p className="max-w-xl text-xl leading-tight">
          Every item in the @nostalgui registry with every variant it ships. Pick one, copy the
          command, own the code.
        </p>
      </header>
      <DocSection id="setup" title="Setup" className="bg-muted p-3">
        <p className="text-xl leading-tight">
          NOSTALGUI is built on Radix. Start a Radix project, add the registry once, then add any
          component below. Base UI projects are not supported yet.
        </p>
        <RegistrySetup />
      </DocSection>
      <ShowcaseCatalogue />
    </>
  )
}
