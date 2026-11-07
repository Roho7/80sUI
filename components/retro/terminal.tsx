"use client"

import { cn } from "cn"
import * as React from "react"

type TerminalLine = {
  kind: "command" | "output"
  text: string
}

type TerminalProps = Omit<React.ComponentProps<"pre">, "children"> & {
  lines: readonly TerminalLine[]
  prompt?: string
  typingFps?: number
  isAnimated?: boolean
  isLooping?: boolean
}

type VisibleLine = TerminalLine & {
  isTyping: boolean
}

type TerminalPlayback = {
  visibleLines: readonly VisibleLine[]
  isFinished: boolean
}

const LOOP_PAUSE_MS = 5000

function countLineTicks(line: TerminalLine): number {
  return line.kind === "command" ? line.text.length + 1 : 1
}

function countScriptTicks(lines: readonly TerminalLine[]): number {
  return lines.reduce((total, line) => total + countLineTicks(line), 0)
}

function calculateTerminalPlayback(lines: readonly TerminalLine[], tick: number): TerminalPlayback {
  const visibleLines: VisibleLine[] = []
  let remainingTicks = tick
  for (const line of lines) {
    const lineTicks = countLineTicks(line)
    if (remainingTicks >= lineTicks) {
      visibleLines.push({ ...line, isTyping: false })
      remainingTicks -= lineTicks
      continue
    }
    visibleLines.push({
      ...line,
      text: line.kind === "command" ? line.text.slice(0, remainingTicks) : "",
      isTyping: true,
    })
    return { visibleLines, isFinished: false }
  }
  return { visibleLines, isFinished: true }
}

function useTerminalTick(totalTicks: number, typingFps: number, isAnimated: boolean, isLooping: boolean): number {
  const [tick, setTick] = React.useState(0)
  const pauseTicks = Math.ceil((LOOP_PAUSE_MS / 1000) * typingFps)
  const cycleTicks = totalTicks + pauseTicks

  React.useEffect(() => {
    if (!isAnimated) {
      return
    }
    const interval = window.setInterval(() => {
      setTick((current) => {
        if (isLooping) {
          return (current + 1) % cycleTicks
        }
        return Math.min(current + 1, totalTicks)
      })
    }, 1000 / typingFps)
    return () => window.clearInterval(interval)
  }, [isAnimated, isLooping, cycleTicks, totalTicks, typingFps])

  return isAnimated ? tick : totalTicks
}

function renderPrompt(prompt: string) {
  return <span data-slot="terminal-prompt">{prompt} </span>
}

function renderCursor() {
  return (
    <span data-slot="terminal-cursor" aria-hidden="true" className="animate-blink">
      █
    </span>
  )
}

function Terminal({
  lines,
  prompt = "C:\\>",
  typingFps = 12,
  isAnimated = true,
  isLooping = false,
  className,
  ...props
}: TerminalProps) {
  const tick = useTerminalTick(countScriptTicks(lines), typingFps, isAnimated, isLooping)
  const { visibleLines, isFinished } = calculateTerminalPlayback(lines, tick)

  return (
    <pre
      data-slot="terminal"
      data-finished={isFinished}
      className={cn(
        "w-full overflow-hidden bg-foreground [contain:inline-size] p-3 font-mono text-xl leading-tight whitespace-pre-wrap text-background selection:bg-background selection:text-foreground",
        className
      )}
      {...props}
    >
      {visibleLines.map((line, index) => (
        <span key={index} data-slot="terminal-line" data-kind={line.kind} className="block min-h-[1lh]">
          {line.kind === "command" && renderPrompt(prompt)}
          {line.text}
          {line.isTyping && renderCursor()}
        </span>
      ))}
      {isFinished && (
        <span data-slot="terminal-line" data-kind="idle" className="block min-h-[1lh]">
          {renderPrompt(prompt)}
          {renderCursor()}
        </span>
      )}
    </pre>
  )
}

export { Terminal, type TerminalLine, type TerminalProps }
