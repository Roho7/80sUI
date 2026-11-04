import { Taskbar, TaskbarClock } from "@/components/retro/taskbar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

import type { ShowcaseDemo } from "../types"

function renderStartMenu() {
  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Programs</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Paint</DropdownMenuItem>
          <DropdownMenuItem>Terminal</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem>Documents</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Shut Down...</DropdownMenuItem>
    </>
  )
}

function renderTasks() {
  return (
    <>
      <Button variant="secondary" size="sm" aria-pressed className="min-w-0 bevel-sunken">
        <span className="truncate">Paint</span>
      </Button>
      <Button variant="secondary" size="sm" className="min-w-0">
        <span className="truncate">Terminal</span>
      </Button>
    </>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "start menu, tasks, clock",
      render: () => <Taskbar startMenu={renderStartMenu()}>{renderTasks()}</Taskbar>,
    },
    {
      label: "custom start, no clock",
      render: () => (
        <Taskbar startMenu={renderStartMenu()} startLabel="Menu" startMenuTitle="guest" clock={null}>
          {renderTasks()}
        </Taskbar>
      ),
    },
    {
      label: "clock only",
      render: () => <Taskbar clock={<TaskbarClock />} />,
    },
  ],
}
