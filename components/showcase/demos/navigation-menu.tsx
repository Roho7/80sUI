"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import type { ShowcaseDemo } from "../types"

type Entry = { title: string; description: string }

const DRIVERS: readonly Entry[] = [
  { title: "Disk", description: "Mount a 3.5 inch floppy at A:." },
  { title: "Modem", description: "Dial up at 2400 baud." },
  { title: "Memory", description: "Check the 640K conventional pool." },
  { title: "Sound", description: "Tune the PC speaker beeps." },
]

const FILES: readonly string[] = ["AUTOEXEC.BAT", "CONFIG.SYS", "README.TXT"]

function MenuBar({ viewport }: { viewport: boolean }) {
  return (
    <NavigationMenu viewport={viewport} className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Drivers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-64 grid-cols-1 gap-0">
              {DRIVERS.map((driver) => (
                <li key={driver.title}>
                  <NavigationMenuLink
                    href="#"
                    className="flex-col items-start gap-1"
                  >
                    <span className="font-pixel text-[16px] leading-none uppercase">
                      {driver.title}
                    </span>
                    <span className="text-xl leading-tight">
                      {driver.description}
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Files</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-40">
              {FILES.map((file) => (
                <li key={file}>
                  <NavigationMenuLink href="#">{file}</NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Help
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "with viewport",
      render: () => (
        <div className="h-72">
          <MenuBar viewport />
        </div>
      ),
    },
    {
      label: "without viewport",
      render: () => (
        <div className="h-72">
          <MenuBar viewport={false} />
        </div>
      ),
    },
  ],
}
