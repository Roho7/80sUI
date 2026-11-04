"use client"

import * as React from "react"

import { ShaderMount, type ShaderMountProps } from "@/components/ui/shader-mount"
import {
  defaultPreset,
  type DitherShineColors,
  ditherShineFragmentShader,
  type DitherShineParams,
  DitherShineTypes,
  type DitherShineUniforms,
} from "@/lib/shaders/dither-shine"

type DitherShineProps = Omit<ShaderMountProps, "fragmentShader" | "uniforms" | "colors"> &
  Partial<DitherShineParams>

const DitherShine = React.memo(function DitherShine({
  speed = defaultPreset.params.speed,
  frame = defaultPreset.params.frame,
  fps = defaultPreset.params.fps,
  colorBack = defaultPreset.params.colorBack,
  colorFront = defaultPreset.params.colorFront,
  type = defaultPreset.params.type,
  bandWidth = defaultPreset.params.bandWidth,
  sweepDuration = defaultPreset.params.sweepDuration,
  pauseDuration = defaultPreset.params.pauseDuration,
  spotlightRadius = defaultPreset.params.spotlightRadius,
  pointer = defaultPreset.params.pointer,
  hover = defaultPreset.params.hover,
  ...props
}: DitherShineProps) {
  const [pointerX, pointerY] = pointer
  const uniforms = React.useMemo<DitherShineUniforms>(
    () => ({
      u_type: DitherShineTypes[type],
      u_bandWidth: bandWidth,
      u_sweepDuration: sweepDuration,
      u_pauseDuration: pauseDuration,
      u_spotlightRadius: spotlightRadius,
      u_pointer: [pointerX, pointerY],
      u_hover: hover,
    }),
    [type, bandWidth, sweepDuration, pauseDuration, spotlightRadius, pointerX, pointerY, hover]
  )
  const colors = React.useMemo<DitherShineColors>(
    () => ({ u_colorBack: colorBack, u_colorFront: colorFront }),
    [colorBack, colorFront]
  )

  return (
    <ShaderMount
      data-slot="dither-shine"
      {...props}
      speed={speed}
      frame={frame}
      fps={fps}
      fragmentShader={ditherShineFragmentShader}
      uniforms={uniforms}
      colors={colors}
    />
  )
})

export { DitherShine }
export type { DitherShineProps }
