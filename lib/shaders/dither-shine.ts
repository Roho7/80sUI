import type { ShaderColorParam, ShaderMotionParams, ShaderPreset } from "./types"

export const ditherShineFragmentShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pxSize;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_type;
uniform float u_bandWidth;
uniform float u_sweepDuration;
uniform float u_pauseDuration;
uniform float u_spotlightRadius;
uniform vec2 u_pointer;
uniform float u_hover;

out vec4 fragColor;

float readBayer2(vec2 cell) {
  vec2 corner = floor(cell);
  return fract(corner.x * 0.5 + corner.y * corner.y * 0.75);
}

float readBayer(vec2 cell, float size) {
  float fine = readBayer2(cell);
  if (size < 3.0) {
    return fine;
  }
  float medium = readBayer2(cell * 0.5) * 0.25 + fine;
  if (size < 6.0) {
    return medium;
  }
  return (readBayer2(cell * 0.25) * 0.25 + readBayer2(cell * 0.5)) * 0.25 + fine;
}

float readBandProfile(float offset) {
  float band = step(abs(offset), 0.5) * clamp(0.25 + (0.4375 - abs(offset)) * 2.0, 0.0, 1.0);
  float glintOffset = abs(offset + 0.9375);
  float glint = step(glintOffset, 0.1875) * (1.0 - glintOffset / 0.375);
  return max(band, glint);
}

void main() {
  vec2 fragment = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  vec2 cell = floor(fragment / u_pxSize);
  vec2 grid = max(ceil(u_resolution / u_pxSize) - 1.0, vec2(1.0));
  float diagonal = (cell.x + cell.y) / (grid.x + grid.y);

  float bandWidth = max(u_bandWidth, 0.001);
  float sweepDuration = max(u_sweepDuration, 0.001);
  float cycle = sweepDuration + max(u_pauseDuration, 0.0);
  float progress = clamp(mod(u_time, cycle) / sweepDuration, 0.0, 1.0);
  float center = mix(-0.5 * bandWidth, 1.0 + 1.125 * bandWidth, progress);
  float intensity = readBandProfile((diagonal - center) / bandWidth);

  vec2 cellCenter = (cell + 0.5) * u_pxSize;
  vec2 pointer = u_pointer * u_resolution;
  float radius = max(u_spotlightRadius * min(u_resolution.x, u_resolution.y), 1.0);
  float falloff = clamp(1.0 - length(cellCenter - pointer) / radius, 0.0, 1.0);
  float spotlight = u_hover * falloff * falloff;
  intensity = clamp(intensity + spotlight, 0.0, 1.0);

  vec4 color = intensity > readBayer(cell, u_type) ? u_colorFront : u_colorBack;
  fragColor = vec4(color.rgb * color.a, color.a);
}
`

export const DitherShineTypes = {
  "2x2": 2,
  "4x4": 4,
  "8x8": 8,
} as const

export type DitherShineType = keyof typeof DitherShineTypes

export type DitherShineUniforms = {
  u_type: number
  u_bandWidth: number
  u_sweepDuration: number
  u_pauseDuration: number
  u_spotlightRadius: number
  u_pointer: readonly [number, number]
  u_hover: number
}

export type DitherShineColors = {
  u_colorBack: ShaderColorParam
  u_colorFront: ShaderColorParam
}

export type DitherShineParams = Required<ShaderMotionParams> & {
  colorBack: ShaderColorParam
  colorFront: ShaderColorParam
  type: DitherShineType
  bandWidth: number
  sweepDuration: number
  pauseDuration: number
  spotlightRadius: number
  pointer: readonly [number, number]
  hover: number
}

export const defaultPreset: ShaderPreset<DitherShineParams> = {
  name: "Default",
  params: {
    speed: 1,
    frame: 0,
    fps: 10,
    colorBack: "--primary",
    colorFront: "--primary-foreground",
    type: "4x4",
    bandWidth: 0.35,
    sweepDuration: 1.2,
    pauseDuration: 1.2,
    spotlightRadius: 1,
    pointer: [0.5, 0.5],
    hover: 0,
  },
}

export const glintPreset: ShaderPreset<DitherShineParams> = {
  name: "Glint",
  params: {
    ...defaultPreset.params,
    type: "2x2",
    bandWidth: 0.14,
    sweepDuration: 0.6,
    pauseDuration: 1.8,
  },
}

export const slowPreset: ShaderPreset<DitherShineParams> = {
  name: "Slow",
  params: {
    ...defaultPreset.params,
    type: "8x8",
    bandWidth: 0.6,
    sweepDuration: 2.4,
    pauseDuration: 1.6,
  },
}

export const ditherShinePresets: readonly ShaderPreset<DitherShineParams>[] = [
  defaultPreset,
  glintPreset,
  slowPreset,
]
