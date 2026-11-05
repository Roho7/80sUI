import { Taskbar, TaskbarClock, TaskbarTask } from "@/components/retro/taskbar"
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

const PROGRAMS = ["Paint", "Terminal", "Notepad", "Minesweeper", "Calculator", "Solitaire"] as const

function renderTasks(count: number) {
  return PROGRAMS.slice(0, count).map((program, index) => (
    <TaskbarTask key={program} isActive={index === 0}>
      {program}
    </TaskbarTask>
  ))
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "start menu, tasks, clock",
      render: () => <Taskbar startMenu={renderStartMenu()}>{renderTasks(2)}</Taskbar>,
    },
    {
      label: "3 visible tasks, rest scroll under the clock",
      render: () => (
        <Taskbar startMenu={renderStartMenu()} maxVisibleTasks={3}>
          {renderTasks(6)}
        </Taskbar>
      ),
    },
    {
      label: "custom start, no clock",
      render: () => (
        <Taskbar startMenu={renderStartMenu()} startLabel="Menu" startMenuTitle="guest" clock={null}>
          {renderTasks(2)}
        </Taskbar>
      ),
    },
    {
      label: "clock only",
      render: () => <Taskbar clock={<TaskbarClock />} />,
    },
  ],
}
