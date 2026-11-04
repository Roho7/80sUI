"use client"

import * as React from "react"

import { isSameUniformValue, ShaderMount as ShaderMountVanilla } from "@/lib/shaders/shader-mount"
import type {
  ShaderMotionParams,
  ShaderMountColors,
  ShaderMountUniforms,
} from "@/lib/shaders/types"

type ShaderMountProps = React.ComponentProps<"div"> &
  ShaderMotionParams & {
    fragmentShader: string
    uniforms: ShaderMountUniforms
    colors: ShaderMountColors
    onMountChange?: (mount: ShaderMountVanilla | null) => void
  }

function selectChangedUniforms(
  next: ShaderMountUniforms,
  previous: ShaderMountUniforms
): ShaderMountUniforms {
  return Object.fromEntries(
    Object.entries(next).filter(([name, value]) => {
      const previousValue = previous[name]
      return previousValue === undefined || !isSameUniformValue(previousValue, value)
    })
  )
}

function selectChangedColors(
  next: ShaderMountColors,
  previous: ShaderMountColors
): ShaderMountColors {
  return Object.fromEntries(Object.entries(next).filter(([name, color]) => previous[name] !== color))
}

function ShaderMount({
  fragmentShader,
  uniforms,
  colors,
  speed = 0,
  frame = 0,
  fps,
  onMountChange,
  ...props
}: ShaderMountProps) {
  const elementRef = React.useRef<HTMLDivElement>(null)
  const mountRef = React.useRef<ShaderMountVanilla | null>(null)
  const notifyMountChange = React.useEffectEvent((mount: ShaderMountVanilla | null) => {
    onMountChange?.(mount)
  })
  const pushedUniformsRef = React.useRef<ShaderMountUniforms>({})
  const pushedColorsRef = React.useRef<ShaderMountColors>({})

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }
    const mount = ShaderMountVanilla.create(element, fragmentShader)
    mountRef.current = mount
    pushedUniformsRef.current = {}
    pushedColorsRef.current = {}
    notifyMountChange(mount)
    return () => {
      mount?.dispose()
      mountRef.current = null
      notifyMountChange(null)
    }
  }, [fragmentShader])

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) {
      return
    }
    mount.setColors(selectChangedColors(colors, pushedColorsRef.current))
    pushedColorsRef.current = colors
    mount.setUniforms(selectChangedUniforms(uniforms, pushedUniformsRef.current))
    pushedUniformsRef.current = uniforms
  }, [fragmentShader, colors, uniforms])

  React.useEffect(() => {
    mountRef.current?.setFps(fps)
    mountRef.current?.setSpeed(speed)
  }, [fragmentShader, speed, fps])

  React.useEffect(() => {
    mountRef.current?.setFrame(frame)
  }, [fragmentShader, frame])

  return <div ref={elementRef} {...props} />
}

export { ShaderMount }
export type { ShaderMountProps }
