"use client"

import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import * as React from "react"

import { ChevronGlyph } from "@/components/ui/pixel-glyphs"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("pixel-border border-border bg-card text-card-foreground bevel-raised offset-shadow-none", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between gap-3 px-3 py-3 text-left font-pixel text-[16px] leading-none uppercase hover:underline hover:decoration-(length:--pixel) hover:underline-offset-4 disabled:pointer-events-none disabled:text-muted-foreground **:data-[slot=accordion-trigger-icon]:ml-auto",
          className
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-trigger-icon"
          className="pointer-events-none grid size-5 shrink-0 place-items-center pixel-border border-border bg-secondary text-secondary-foreground bevel-raised offset-shadow-none group-aria-expanded/accordion-trigger:bevel-sunken"
        >
          <ChevronGlyph className="group-aria-expanded/accordion-trigger:hidden" />
          <ChevronGlyph direction="up" className="hidden group-aria-expanded/accordion-trigger:block" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-xl leading-tight"
      {...props}
    >
      <div
        className={cn(
          "px-3 pt-0 pb-3 [&_a]:underline [&_a]:decoration-(length:--pixel) [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
