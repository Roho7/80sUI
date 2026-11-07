import { cn } from "cn"

import { CopyButton } from "./CopyButton"

type CodeBlockProps = {
  code: string
  title?: string
  className?: string
}

function CodeBlock({ code, title, className }: CodeBlockProps) {
  return (
    <div data-code-block className={cn("flex min-w-0 flex-col pixel-border border-border", className)}>
      <div className="flex h-8 items-center justify-between gap-2 border-b-(length:--pixel) border-border bg-titlebar py-1 pr-1 pl-3 font-pixel text-sm leading-none text-titlebar-foreground uppercase">
        <span className="min-w-0 truncate normal-case">{title ?? "Code"}</span>
        <CopyButton label={title ?? "code"} className="shrink-0" />
      </div>
      <pre className="max-h-[32rem] overflow-auto bg-foreground p-3 font-mono text-lg leading-tight text-background selection:bg-background selection:text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export { CodeBlock }
