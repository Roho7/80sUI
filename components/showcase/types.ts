import type * as React from "react"

export type ShowcaseSpan = "single" | "wide" | "tall" | "large"

export type ShowcaseVariant = {
  label: string
  render: () => React.ReactNode
}

export type ShowcaseDemo = {
  span: ShowcaseSpan
  variants: readonly ShowcaseVariant[]
}

export type ShowcaseEntry = {
  name: string
  title: string
  description: string
  demo: ShowcaseDemo
}
