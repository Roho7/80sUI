"use client"

import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import type { ShowcaseDemo } from "../types"

function Slots({ from, count }: { from: number; count: number }) {
  return (
    <InputOTPGroup>
      {Array.from({ length: count }, (_, i) => (
        <InputOTPSlot key={from + i} index={from + i} />
      ))}
    </InputOTPGroup>
  )
}

function useSeed(seed: string) {
  const [value, setValue] = React.useState(seed)
  return { value, onChange: setValue }
}

function SixDigits() {
  return (
    <InputOTP maxLength={6} {...useSeed("")}>
      <Slots from={0} count={6} />
    </InputOTP>
  )
}

function Split() {
  return (
    <InputOTP maxLength={6} {...useSeed("640")}>
      <Slots from={0} count={3} />
      <InputOTPSeparator />
      <Slots from={3} count={3} />
    </InputOTP>
  )
}

function Disabled() {
  return (
    <InputOTP maxLength={4} disabled {...useSeed("1981")}>
      <Slots from={0} count={4} />
    </InputOTP>
  )
}

function Invalid() {
  return (
    <InputOTP maxLength={4} aria-invalid {...useSeed("404")}>
      <Slots from={0} count={4} />
    </InputOTP>
  )
}

function Alphanumeric() {
  return (
    <InputOTP maxLength={4} pattern="^[a-zA-Z0-9]+$" {...useSeed("A1")}>
      <Slots from={0} count={4} />
    </InputOTP>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    { label: "6 digits", render: () => <SixDigits /> },
    { label: "3 + 3 separator", render: () => <Split /> },
    { label: "disabled", render: () => <Disabled /> },
    { label: "invalid", render: () => <Invalid /> },
    { label: "alphanumeric", render: () => <Alphanumeric /> },
  ],
}
