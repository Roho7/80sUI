import type * as React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import type { ShowcaseDemo } from "../types"

function Label({ children }: { children: string }) {
  return (
    <div className="flex h-full items-center justify-center p-2 font-pixel text-[16px] leading-none uppercase">
      {children}
    </div>
  )
}

function Frame({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return <div className={`w-full max-w-full ${className}`}>{children}</div>
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "horizontal",
      render: () => (
        <Frame className="h-24">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={35} minSize={15}>
              <Label>C:\</Label>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={65} minSize={15}>
              <Label>README.TXT</Label>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Frame>
      ),
    },
    {
      label: "with handle",
      render: () => (
        <Frame className="h-24">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50} minSize={15}>
              <Label>A:\</Label>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={15}>
              <Label>640K FREE</Label>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Frame>
      ),
    },
    {
      label: "vertical",
      render: () => (
        <Frame className="h-40">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={40} minSize={20}>
              <Label>AUTOEXEC.BAT</Label>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={20}>
              <Label>CONFIG.SYS</Label>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Frame>
      ),
    },
    {
      label: "nested",
      render: () => (
        <Frame className="h-48">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={30} minSize={15}>
              <Label>C:\</Label>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={30}>
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={50} minSize={20}>
                  <Label>MODEM.INI</Label>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <Label>DISK 1 OF 3</Label>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Frame>
      ),
    },
  ],
}
