"use client"

import { useEffect, useState } from "react"

import { domToMarkdown } from "@/components/docs/dom-markdown"
import { Button } from "@/components/ui/button"

const COPIED_RESET_MS = 1500

type CopyPageButtonProps = {
  markdown?: string
}

function CopyPageButton({ markdown }: CopyPageButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) {
      return
    }
    const timeout = window.setTimeout(() => setIsCopied(false), COPIED_RESET_MS)
    return () => window.clearTimeout(timeout)
  }, [isCopied])

  function copyPage() {
    const main = document.querySelector("main")
    const text = markdown ?? (main ? domToMarkdown(main) : "")
    navigator.clipboard
      .writeText(text)
      .then(() => setIsCopied(true))
      .catch(() => setIsCopied(false))
  }

  return (
    <>
      <Button size="sm" variant="secondary" className="shrink-0" aria-label="Copy page as markdown" onClick={copyPage}>
        {isCopied ? "Copied" : "Copy page"}
      </Button>
      <span aria-live="polite" className="sr-only">
        {isCopied ? "Page copied as markdown" : ""}
      </span>
    </>
  )
}

export { CopyPageButton }
