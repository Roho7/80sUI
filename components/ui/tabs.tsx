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
  "group/tabs-list inline-flex items-end text-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default:
          "group-data-horizontal/tabs:w-full",
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
        "relative inline-flex h-8 items-center justify-center gap-2 px-3 font-pixel text-[16px] leading-none whitespace-nowrap uppercase group-data-vertical/tabs:justify-start disabled:pointer-events-none disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "group-data-[variant=default]/tabs-list:pixel-border group-data-[variant=default]/tabs-list:border-border group-data-[variant=default]/tabs-list:bg-secondary group-data-[variant=default]/tabs-list:text-secondary-foreground group-data-[variant=default]/tabs-list:bevel-raised group-data-[variant=default]/tabs-list:offset-shadow-none group-data-[variant=default]/tabs-list:data-active:z-10 group-data-[variant=default]/tabs-list:data-active:bg-card group-data-[variant=default]/tabs-list:data-active:text-card-foreground",
        "group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:not-first:-ml-(--pixel) group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:data-active:-mb-[calc(var(--pixel)*2)] group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:data-active:[box-shadow:inset_calc(var(--pixel)*-1)_0_0_0_var(--bevel-lo),inset_var(--pixel)_var(--pixel)_0_0_var(--bevel-hi)] group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:data-active:h-9 group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:data-active:border-b-0",
        "group-data-vertical/tabs:group-data-[variant=default]/tabs-list:not-first:-mt-(--pixel) group-data-vertical/tabs:group-data-[variant=default]/tabs-list:data-active:-mr-[calc(var(--pixel)*2)] group-data-vertical/tabs:group-data-[variant=default]/tabs-list:data-active:[box-shadow:inset_0_calc(var(--pixel)*-1)_0_0_var(--bevel-lo),inset_var(--pixel)_var(--pixel)_0_0_var(--bevel-hi)] group-data-vertical/tabs:group-data-[variant=default]/tabs-list:data-active:border-r-0",
        "group-data-[variant=line]/tabs-list:px-1 group-data-[variant=line]/tabs-list:text-muted-foreground group-data-[variant=line]/tabs-list:hover:text-foreground group-data-[variant=line]/tabs-list:data-active:text-foreground",
        "after:absolute after:hidden after:bg-foreground group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-[calc(var(--pixel)*2)] group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:right-0 group-data-vertical/tabs:after:w-[calc(var(--pixel)*2)] group-data-[variant=line]/tabs-list:data-active:after:block",
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
        "flex-1 text-xl leading-tight group-data-horizontal/tabs:pt-3 group-data-vertical/tabs:pl-3",
        "group-has-data-[variant=default]/tabs:pixel-border group-has-data-[variant=default]/tabs:border-border group-has-data-[variant=default]/tabs:bg-card group-has-data-[variant=default]/tabs:p-3 group-has-data-[variant=default]/tabs:text-card-foreground group-has-data-[variant=default]/tabs:bevel-raised group-has-data-[variant=default]/tabs:offset-shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger }
