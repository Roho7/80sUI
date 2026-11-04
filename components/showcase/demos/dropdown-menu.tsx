import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { ShowcaseDemo } from "../types"

function renderTrigger(label: string) {
  return (
    <DropdownMenuTrigger asChild>
      <Button size="sm" className="self-center">
        {label}
      </Button>
    </DropdownMenuTrigger>
  )
}

function renderItemsMenu() {
  return (
    <DropdownMenu>
      {renderTrigger("File")}
      <DropdownMenuContent>
        <DropdownMenuLabel>Document</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            New
            <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Open...
            <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            Save
            <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset>Print preview</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SelectionMenu() {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true)
  const [isGridVisible, setIsGridVisible] = useState(false)
  const [zoom, setZoom] = useState("100")

  return (
    <DropdownMenu>
      {renderTrigger("View")}
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={isStatusBarVisible} onCheckedChange={setIsStatusBarVisible}>
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={isGridVisible} onCheckedChange={setIsGridVisible}>
          Grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset>Zoom</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={zoom} onValueChange={setZoom}>
          <DropdownMenuRadioItem value="100">100%</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="200">200%</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="400">400%</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function renderSubmenu() {
  return (
    <DropdownMenu>
      {renderTrigger("Tools")}
      <DropdownMenuContent>
        <DropdownMenuItem>Defragment</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Accessories</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Calculator</DropdownMenuItem>
            <DropdownMenuItem>Notepad</DropdownMenuItem>
            <DropdownMenuItem>Paint</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Shut down...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "items, shortcuts, disabled, inset, destructive", render: renderItemsMenu },
    { label: "checkbox and radio", render: () => <SelectionMenu /> },
    { label: "submenu", render: renderSubmenu },
  ],
}
