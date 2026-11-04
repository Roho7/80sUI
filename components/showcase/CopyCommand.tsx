"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const COPIED_RESET_MS = 1500

type CopyCommandProps = {
  command: string
  label: string
}

function CopyCommand({ command, label }: CopyCommandProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) {
      return
    }
    const timeout = window.setTimeout(() => setIsCopied(false), COPIED_RESET_MS)
    return () => window.clearTimeout(timeout)
  }, [isCopied])

  function copyCommand() {
    navigator.clipboard
      .writeText(command)
      .then(() => setIsCopied(true))
      .catch(() => setIsCopied(false))
  }

  return (
    <div className="flex items-center gap-2 bg-foreground py-1 pr-1 pl-2 text-background">
      <code className="min-w-0 flex-1 font-mono text-lg leading-tight break-all">
        <span aria-hidden="true">$ </span>
        {command}
      </code>
      <Button
        size="xs"
        variant="secondary"
        className="min-w-16"
        aria-label={`Copy ${label}`}
        onClick={copyCommand}
      >
        {isCopied ? "Copied" : "Copy"}
      </Button>
      <span aria-live="polite" className="sr-only">
        {isCopied ? "Copied" : ""}
      </span>
    </div>
  )
}

export { CopyCommand }
