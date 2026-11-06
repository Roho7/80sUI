import type { Metadata } from "next"

import { DocSection } from "@/components/docs/DocSection"
import { RegistrySetup } from "@/components/docs/RegistrySetup"
import { ShowcaseCatalogue } from "@/components/showcase/ShowcaseCatalogue"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Components",
  description: "Every UI95 registry component and variant, ready to install with shadcn.",
  path: "/components",
  type: "website",
})

export default function ComponentsPage() {
  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="font-pixel text-[32px] leading-none uppercase md:text-[48px]">Components</h1>
        <p className="max-w-xl text-xl leading-tight">
          Every item in the @ui95 registry with every variant it ships. Pick one, copy the
          command, own the code.
        </p>
      </header>
      <DocSection id="setup" title="Setup" className="p-3">
        <p className="text-xl leading-tight">
          UI95 is built on Shadcn and Radix. Base UI is not supported yet.
        </p>
        <RegistrySetup />
      </DocSection>
      <ShowcaseCatalogue />
    </>
  )
}
