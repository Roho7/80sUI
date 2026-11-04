"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const COPIED_RESET_MS = 1500

type CopyButtonProps = {
  label: string
  className?: string
}

function CopyButton({ label, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) {
      return
    }
    const timeout = window.setTimeout(() => setIsCopied(false), COPIED_RESET_MS)
    return () => window.clearTimeout(timeout)
  }, [isCopied])

  function copyCode(event: React.MouseEvent<HTMLButtonElement>) {
    const text = event.currentTarget.closest("[data-code-block]")?.querySelector("pre")?.textContent ?? ""
    navigator.clipboard
      .writeText(text)
      .then(() => setIsCopied(true))
      .catch(() => setIsCopied(false))
  }

  return (
    <>
      <Button
        size="xs"
        variant="secondary"
        className={className}
        aria-label={`Copy ${label}`}
        onClick={copyCode}
      >
        {isCopied ? "Copied" : "Copy"}
      </Button>
      <span aria-live="polite" className="sr-only">
        {isCopied ? "Copied" : ""}
      </span>
    </>
  )
}

export { CopyButton }
