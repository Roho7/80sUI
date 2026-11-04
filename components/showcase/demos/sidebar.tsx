import type { CSSProperties } from "react"

import {
  DocumentGlyph,
  FolderGlyph,
  SearchGlyph,
  TerminalGlyph,
} from "@/components/ui/pixel-glyphs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import type { ShowcaseDemo } from "../types"

type SidebarSetting = {
  label: string
  variant: "sidebar" | "floating" | "inset"
  collapsible: "offcanvas" | "icon"
  defaultOpen: boolean
}

const SETTINGS: readonly SidebarSetting[] = [
  {
    label: "default",
    variant: "sidebar",
    collapsible: "offcanvas",
    defaultOpen: true,
  },
  {
    label: "icon collapsed",
    variant: "sidebar",
    collapsible: "icon",
    defaultOpen: false,
  },
  {
    label: "floating",
    variant: "floating",
    collapsible: "icon",
    defaultOpen: true,
  },
]

const PROVIDER_STYLE = { "--sidebar-width": "11rem" } as CSSProperties

function renderSidebar({ variant, collapsible, defaultOpen }: SidebarSetting) {
  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={PROVIDER_STYLE}
        className="relative h-96 min-h-0 overflow-hidden pixel-border border-border"
      >
        <Sidebar
          variant={variant}
          collapsible={collapsible}
          className="absolute h-full"
        >
          <SidebarHeader>
            <SidebarInput placeholder="Find file..." aria-label="Find file" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Disks</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="C:\">
                      <FolderGlyph />
                      <span>C:\</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#" isActive>
                          <span>GAMES</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>DOS</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="A:\">
                      <FolderGlyph />
                      <span>A:\</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Search">
                      <SearchGlyph />
                      <span>Search</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Terminal">
                      <TerminalGlyph />
                      <span>Terminal</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled tooltip="Modem">
                      <DocumentGlyph />
                      <span>Modem</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="640K free">
                  <DocumentGlyph />
                  <span>640K free</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-w-0">
          <header className="flex h-10 items-center gap-2 px-2">
            <SidebarTrigger />
            <span className="font-pixel text-[16px] leading-none uppercase">
              README.TXT
            </span>
          </header>
          <p className="px-3 text-xl leading-tight">
            Please insert disk 2 to continue.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export const demo: ShowcaseDemo = {
  span: "large",
  variants: SETTINGS.map((setting) => ({
    label: setting.label,
    render: () => renderSidebar(setting),
  })),
}
