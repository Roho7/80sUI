"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { AlertGlyph, CheckGlyph, CloseGlyph, InfoGlyph } from "@/components/ui/pixel-glyphs"
import { Spinner } from "@/components/ui/spinner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckGlyph className="size-4" />
        ),
        info: (
          <InfoGlyph className="size-4" />
        ),
        warning: (
          <AlertGlyph className="size-4" />
        ),
        error: (
          <CloseGlyph className="size-4" />
        ),
        loading: (
          <Spinner className="size-4" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-(--width) items-start gap-3 pixel-border border-border bg-popover p-3 text-popover-foreground offset-shadow-2",
          icon: "relative mt-0.5 flex size-4 shrink-0 items-center justify-center",
          content: "flex min-w-0 flex-1 flex-col gap-1",
          title: "font-pixel text-[16px] leading-none uppercase",
          description: "text-lg leading-tight",
          actionButton:
            "h-8 shrink-0 pixel-border border-border bg-primary px-2.5 font-pixel text-[16px] leading-none text-primary-foreground uppercase bevel-raised",
          cancelButton:
            "h-8 shrink-0 pixel-border border-border bg-secondary px-2.5 font-pixel text-[16px] leading-none text-secondary-foreground uppercase bevel-raised",
          closeButton:
            "absolute top-1 right-1 flex size-6 items-center justify-center text-popover-foreground",
          error: "border-destructive",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
