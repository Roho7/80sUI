"use client"

import { cn } from "cn"
import * as React from "react"
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronGlyph } from "@/components/ui/pixel-glyphs"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar w-fit pixel-border border-border bg-card p-2 bevel-raised offset-shadow-none [--cell-size:--spacing(9)] in-data-[slot=card-content]:border-transparent in-data-[slot=card-content]:bg-transparent in-data-[slot=card-content]:shadow-none in-data-[slot=popover-content]:border-transparent in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:shadow-none",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code ?? "en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 min-[560px]:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-2", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:text-muted-foreground",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:text-muted-foreground",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-[select:disabled]:text-muted-foreground",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "h-8 w-full min-w-0 appearance-none pixel-border border-border bg-input py-0.5 pr-7 pl-2 text-lg leading-none text-card-foreground bevel-sunken offset-shadow-none outline-none select-none",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-pixel text-[16px] leading-none uppercase select-none",
          captionLayout === "label"
            ? ""
            : "pointer-events-none absolute inset-y-0 right-2 flex items-center text-[0px] [&>svg]:size-4 [&>svg]:text-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 font-pixel text-[16px] leading-none font-normal text-muted-foreground uppercase select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "font-pixel text-[16px] leading-none text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          defaultClassNames.day
        ),
        range_start: cn("relative isolate z-0", defaultClassNames.range_start),
        range_middle: cn(defaultClassNames.range_middle),
        range_end: cn("relative isolate z-0", defaultClassNames.range_end),
        today: cn(defaultClassNames.today),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation }) => {
          if (orientation === "left") {
            return (
              <ChevronGlyph
                direction="left"
                className={cn("size-4 rtl:rotate-180", className)}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronGlyph
                direction="right"
                className={cn("size-4 rtl:rotate-180", className)}
              />
            )
          }

          return <ChevronGlyph className={cn("size-4", className)} />
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code ?? "en-US")}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today}
      data-outside={modifiers.outside}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 font-pixel text-[16px] leading-none font-normal uppercase group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 data-[outside=true]:text-muted-foreground data-[range-end=true]:bg-foreground data-[range-end=true]:text-background data-[range-middle=true]:text-foreground data-[range-middle=true]:before:absolute data-[range-middle=true]:before:-inset-(--pixel) data-[range-middle=true]:before:-z-10 data-[range-middle=true]:before:bg-foreground data-[range-middle=true]:before:dither-50 data-[range-middle=true]:before:content-[''] data-[range-middle=true]:after:absolute data-[range-middle=true]:after:inset-[22%] data-[range-middle=true]:after:-z-5 data-[range-middle=true]:after:bg-card data-[range-middle=true]:after:content-[''] data-[range-start=true]:bg-foreground data-[range-start=true]:text-background data-[selected-single=true]:bg-foreground data-[selected-single=true]:text-background data-[selected-single=true]:data-[outside=true]:text-background data-[today=true]:border-dashed data-[today=true]:border-foreground [&>span]:text-xs",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
