import { type ReactNode, useState } from "react"

import { ErrorDialog, ErrorDialogStack, type ErrorEntry } from "@/components/retro/error-dialog"

import type { ShowcaseDemo } from "../types"

const CASCADE: readonly ErrorEntry[] = [
  { id: "1", message: "Not found." },
  { id: "2", message: "Fail." },
  { id: "3", message: "Deadline moved. Again." },
]

type FrameProps = {
  className: string
  children: (container: HTMLElement) => ReactNode
}

function ContainedFrame({ className, children }: FrameProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  return (
    <div ref={setContainer} inert className={`relative w-full contain-layout ${className}`}>
      {container && children(container)}
    </div>
  )
}

function ignoreDismiss() {}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "single",
      render: () => (
        <ContainedFrame className="h-56">
          {(container) => <ErrorDialog message="Motivation.dll is missing." container={container} />}
        </ContainedFrame>
      ),
    },
    {
      label: "cascade",
      render: () => (
        <ContainedFrame className="right-6 h-72">
          {(container) => (
            <ErrorDialogStack errors={CASCADE} onDismiss={ignoreDismiss} container={container} />
          )}
        </ContainedFrame>
      ),
    },
  ],
}
