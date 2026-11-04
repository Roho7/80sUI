import { SidebarNav } from "@/components/docs/SidebarNav"
import { SiteFooter } from "@/components/docs/SiteFooter"
import { SiteHeader } from "@/components/docs/SiteHeader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DOC_GROUPS } from "@/lib/docs/pages"

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-start">
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r-(length:--pixel) border-border lg:block">
          <ScrollArea className="h-full">
            <SidebarNav groups={DOC_GROUPS} className="p-3" />
          </ScrollArea>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
      <SiteFooter />
    </div>
  )
}
