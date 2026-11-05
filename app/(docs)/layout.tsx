import { DocsTaskbar } from "@/app/_site/DocsTaskbar"
import { ProgramMain, ProgramWindow } from "@/app/_site/ProgramWindow"
import { SidebarNav } from "@/components/docs/SidebarNav"
import { SiteMenuRow } from "@/components/docs/SiteMenuRow"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DOC_GROUPS } from "@/lib/docs/pages"

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ProgramWindow>
        <SiteMenuRow />
        <div className="flex min-h-0 flex-1">
          <aside className="hidden h-full w-64 shrink-0 border-r-(length:--pixel) border-border lg:block">
            <ScrollArea className="h-full">
              <SidebarNav groups={DOC_GROUPS} />
            </ScrollArea>
          </aside>
          <ProgramMain>{children}</ProgramMain>
        </div>
      </ProgramWindow>
      <DocsTaskbar />
    </>
  )
}
