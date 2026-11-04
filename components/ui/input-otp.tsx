"use client"

import { cn } from "cn"
import { OTPInput, OTPInputContext } from "input-otp"
import * as React from "react"

import { MinusGlyph } from "@/components/ui/pixel-glyphs"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "group/otp flex items-center has-disabled:text-muted-foreground",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-10 items-center justify-center border-(length:--pixel) border-border well font-pixel text-[16px] leading-none uppercase not-first:border-l-0 group-has-disabled/otp:bg-muted group-has-aria-invalid/otp:border-dashed group-has-aria-invalid/otp:border-destructive data-[active=true]:z-10 data-[active=true]:outline-(length:--pixel) data-[active=true]:outline-foreground data-[active=true]:outline-dashed",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-(--pixel) animate-blink bg-foreground motion-reduce:animate-none" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center px-1"
      role="separator"
      {...props}
    >
      <MinusGlyph />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
