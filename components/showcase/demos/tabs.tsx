import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { ShowcaseDemo } from "../types"

type TabsSetting = {
  label: string
  variant: "default" | "line"
  orientation: "horizontal" | "vertical"
}

const SETTINGS: readonly TabsSetting[] = [
  { label: "default", variant: "default", orientation: "horizontal" },
  { label: "line", variant: "line", orientation: "horizontal" },
  { label: "default vertical", variant: "default", orientation: "vertical" },
  { label: "line vertical", variant: "line", orientation: "vertical" },
]

function renderTabs({ variant, orientation }: TabsSetting) {
  return (
    <Tabs defaultValue="general" orientation={orientation}>
      <TabsList variant={variant}>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="sound">Sound</TabsTrigger>
        <TabsTrigger value="modem" disabled>
          Modem
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general">System: UI95 0.0.1. Memory: 640K.</TabsContent>
      <TabsContent value="sound">Speaker: PC beeper. Volume: loud.</TabsContent>
    </Tabs>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: SETTINGS.map((setting) => ({ label: setting.label, render: () => renderTabs(setting) })),
}
