"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

import type { ShowcaseDemo } from "../types"

const DEFAULT_MONTH = new Date(2026, 10, 4)

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

function SingleCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 10, 12)
  )
  return (
    <Calendar
      mode="single"
      defaultMonth={DEFAULT_MONTH}
      selected={date}
      onSelect={setDate}
    />
  )
}

function RangeCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 10, 9),
    to: new Date(2026, 10, 19),
  })
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      defaultMonth={DEFAULT_MONTH}
      selected={range}
      onSelect={setRange}
    />
  )
}

function DropdownCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 10, 4)
  )
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      startMonth={new Date(1990, 0)}
      endMonth={new Date(2030, 11)}
      defaultMonth={DEFAULT_MONTH}
      selected={date}
      onSelect={setDate}
    />
  )
}

function WeekdaysCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 10, 10)
  )
  return (
    <Calendar
      mode="single"
      defaultMonth={DEFAULT_MONTH}
      disabled={isWeekend}
      selected={date}
      onSelect={setDate}
    />
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    { label: "single", render: () => <SingleCalendar /> },
    { label: "range, two months", render: () => <RangeCalendar /> },
    { label: "dropdown caption", render: () => <DropdownCalendar /> },
    { label: "weekends disabled", render: () => <WeekdaysCalendar /> },
  ],
}
