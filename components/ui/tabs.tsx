"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"
import * as React from "react"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex data-horizontal:flex-col", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-end text-foreground data-[orientation=vertical]:h-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  {
    variants: {
      variant: {
        default:
          "data-[orientation=horizontal]:w-full",
        line: "w-fit gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-8 items-center justify-center gap-2 px-3 font-pixel text-[16px] leading-none whitespace-nowrap uppercase data-[orientation=vertical]:justify-start disabled:pointer-events-none disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "group-data-[variant=default]/tabs-list:pixel-border group-data-[variant=default]/tabs-list:border-border group-data-[variant=default]/tabs-list:bg-secondary group-data-[variant=default]/tabs-list:text-secondary-foreground group-data-[variant=default]/tabs-list:bevel-raised group-data-[variant=default]/tabs-list:offset-shadow-none group-data-[variant=default]/tabs-list:data-active:z-10 group-data-[variant=default]/tabs-list:data-active:bg-card group-data-[variant=default]/tabs-list:data-active:text-card-foreground",
        "data-[orientation=horizontal]:group-data-[variant=default]/tabs-list:not-first:-ml-(--pixel) data-[orientation=horizontal]:group-data-[variant=default]/tabs-list:data-active:-mb-[calc(var(--pixel)*2)] data-[orientation=horizontal]:group-data-[variant=default]/tabs-list:data-active:[box-shadow:inset_calc(var(--pixel)*-1)_0_0_0_var(--bevel-lo),inset_var(--pixel)_var(--pixel)_0_0_var(--bevel-hi)] data-[orientation=horizontal]:group-data-[variant=default]/tabs-list:data-active:h-9 data-[orientation=horizontal]:group-data-[variant=default]/tabs-list:data-active:border-b-0",
        "data-[orientation=vertical]:group-data-[variant=default]/tabs-list:not-first:-mt-(--pixel) data-[orientation=vertical]:group-data-[variant=default]/tabs-list:data-active:-mr-[calc(var(--pixel)*2)] data-[orientation=vertical]:group-data-[variant=default]/tabs-list:data-active:[box-shadow:inset_0_calc(var(--pixel)*-1)_0_0_var(--bevel-lo),inset_var(--pixel)_var(--pixel)_0_0_var(--bevel-hi)] data-[orientation=vertical]:group-data-[variant=default]/tabs-list:data-active:border-r-0",
        "group-data-[variant=line]/tabs-list:px-1 group-data-[variant=line]/tabs-list:text-muted-foreground group-data-[variant=line]/tabs-list:hover:text-foreground group-data-[variant=line]/tabs-list:data-active:text-foreground",
        "after:absolute after:hidden after:bg-foreground data-[orientation=horizontal]:after:inset-x-0 data-[orientation=horizontal]:after:bottom-0 data-[orientation=horizontal]:after:h-[calc(var(--pixel)*2)] data-[orientation=vertical]:after:inset-y-0 data-[orientation=vertical]:after:right-0 data-[orientation=vertical]:after:w-[calc(var(--pixel)*2)] group-data-[variant=line]/tabs-list:data-active:after:block",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-xl leading-tight data-[orientation=horizontal]:pt-3 data-[orientation=vertical]:pl-3",
        "[[data-slot=tabs-list][data-variant=default]~&]:pixel-border [[data-slot=tabs-list][data-variant=default]~&]:border-border [[data-slot=tabs-list][data-variant=default]~&]:bg-card [[data-slot=tabs-list][data-variant=default]~&]:p-3 [[data-slot=tabs-list][data-variant=default]~&]:text-card-foreground [[data-slot=tabs-list][data-variant=default]~&]:bevel-raised [[data-slot=tabs-list][data-variant=default]~&]:offset-shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger }
