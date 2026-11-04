import { useState } from "react"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

import type { ShowcaseDemo } from "../types"

function PaintMenubar() {
  const [isToolboxVisible, setIsToolboxVisible] = useState(true)
  const [isColorBoxVisible, setIsColorBoxVisible] = useState(false)
  const [brush, setBrush] = useState("round")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              New
              <MenubarShortcut>Ctrl+N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Open...
              <MenubarShortcut>Ctrl+O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>Save</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>eye1.png</MenubarItem>
              <MenubarItem>untitled.bmp</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={isToolboxVisible} onCheckedChange={setIsToolboxVisible}>
            Tool box
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={isColorBoxVisible} onCheckedChange={setIsColorBoxVisible}>
            Color box
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel inset>Brush</MenubarLabel>
          <MenubarRadioGroup value={brush} onValueChange={setBrush}>
            <MenubarRadioItem value="round">Round</MenubarRadioItem>
            <MenubarRadioItem value="square">Square</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem inset>Help topics</MenubarItem>
          <MenubarItem inset>About Paint</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [{ label: "items, checkbox, radio, submenu, destructive", render: () => <PaintMenubar /> }],
}
