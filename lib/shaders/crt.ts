import { BARREL_REACH } from "../crt/warp-filter"
import type { ShaderMotionParams, ShaderPreset } from "./types"

export const crtFragmentShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pxSize;
uniform float u_pixelRatio;
uniform float u_fps;
uniform float u_scanlines;
uniform float u_scanlineDensity;
uniform float u_noise;
uniform float u_vignette;
uniform float u_mask;
uniform float u_flicker;
uniform float u_curvature;
uniform float u_roll;

out vec4 fragColor;

const float TAU = 6.2831853;
const float BARREL_REACH = ${BARREL_REACH.toFixed(3)};

float readHash(vec3 point) {
  vec3 scaled = fract(point * vec3(0.1031, 0.103, 0.0973));
  scaled += dot(scaled, scaled.yxz + 33.33);
  return fract((scaled.x + scaled.y) * scaled.z);
}

vec2 readBarrelShift(vec2 unit) {
  float reach = u_curvature * BARREL_REACH;
  float radiusSquared = dot(unit, unit) * 0.5;
  return unit * reach * (radiusSquared - 1.0) / (1.0 + reach);
}

float readBoxDistance(vec2 point, vec2 halfSize, float radius) {
  vec2 inner = abs(point) - halfSize + radius;
  return length(max(inner, 0.0)) + min(max(inner.x, inner.y), 0.0) - radius;
}

vec4 readLayer(vec3 color, float alpha) {
  return vec4(color * alpha, alpha);
}

vec4 stack(vec4 top, vec4 bottom) {
  return top + bottom * (1.0 - top.a);
}

vec4 readMask(vec2 fragment) {
  float stripe = mod(floor(fragment.x / max(u_pixelRatio, 1.0)), 3.0);
  vec3 phosphor = stripe < 0.5 ? vec3(1.0, 0.0, 0.0) : stripe < 1.5 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0);
  return readLayer(phosphor, u_mask * 0.2);
}

vec4 readScanlines(vec2 sourcePx) {
  float period = max(u_scanlineDensity * u_pixelRatio, 2.0);
  float gap = 0.5 - 0.5 * cos(sourcePx.y / period * TAU);
  return readLayer(vec3(0.0), u_scanlines * gap * gap);
}

vec4 readNoise(vec2 fragment, float frame) {
  float grain = readHash(vec3(fragment, frame)) - 0.5;
  return readLayer(vec3(step(0.0, grain)), abs(grain) * 2.0 * u_noise * 0.4);
}

vec4 readRoll(float height) {
  float head = mod(u_time * 0.18, 1.35) - 0.2;
  float along = (height - head) / 0.16;
  float glow = exp(-along * along);
  float trail = exp(-(along + 1.8) * (along + 1.8) * 0.4);
  return stack(readLayer(vec3(1.0), glow * 0.08), readLayer(vec3(0.0), trail * 0.2));
}

vec4 readVignette(vec2 unit) {
  float reach = smoothstep(0.3, 1.45, length(unit));
  return readLayer(vec3(0.0), u_vignette * reach * reach);
}

vec4 readBezel(vec2 fragment) {
  vec2 center = u_resolution * 0.5;
  float shortSide = min(u_resolution.x, u_resolution.y);
  float lip = (1.0 + 6.0 * u_curvature) * u_pxSize;
  float bow = u_curvature * 0.05 * shortSide;
  float radius = max(min(u_curvature * 0.3 * shortSide, shortSide * 0.5 - lip - bow), 0.0);
  vec2 cell = (floor(fragment / u_pxSize) + 0.5) * u_pxSize;
  vec2 cellUnit = (cell - center) / center;
  vec2 pointUnit = (fragment - center) / center;
  vec2 cellBox = center - lip - bow * cellUnit.yx * cellUnit.yx;
  vec2 pointBox = center - lip - bow * pointUnit.yx * pointUnit.yx;
  float outside = step(0.0, readBoxDistance(cell - center, cellBox, radius));
  float depth = shortSide * (0.03 + 0.1 * u_curvature);
  float inside = clamp(-readBoxDistance(fragment - center, pointBox, radius) / depth, 0.0, 1.0);
  float shadow = (1.0 - inside) * (1.0 - inside) * 0.6;
  return readLayer(vec3(0.0), max(outside, shadow));
}

void main() {
  vec2 fragment = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  vec2 unit = fragment / u_resolution * 2.0 - 1.0;
  vec2 sourcePx = (unit + readBarrelShift(unit)) * 0.5 * u_resolution + u_resolution * 0.5;
  float frame = floor(u_time * u_fps + 0.001);
  vec4 color = vec4(0.0);

  if (u_mask > 0.0) {
    color = stack(readMask(fragment), color);
  }
  if (u_scanlines > 0.0) {
    color = stack(readScanlines(sourcePx), color);
  }
  if (u_noise > 0.0) {
    color = stack(readNoise(fragment, frame), color);
  }
  if (u_roll > 0.5) {
    color = stack(readRoll(fragment.y / u_resolution.y), color);
  }
  if (u_flicker > 0.0) {
    color = stack(readLayer(vec3(0.0), u_flicker * 0.14 * readHash(vec3(frame, 7.0, 3.0))), color);
  }
  if (u_vignette > 0.0) {
    color = stack(readVignette(unit), color);
  }
  if (u_curvature > 0.0) {
    color = stack(readBezel(fragment), color);
  }

  fragColor = color;
}
`

export type CrtUniforms = {
  u_fps: number
  u_scanlines: number
  u_scanlineDensity: number
  u_noise: number
  u_vignette: number
  u_mask: number
  u_flicker: number
  u_curvature: number
  u_roll: number
}

export type CrtParams = Required<ShaderMotionParams> & {
  scanlines: number
  scanlineDensity: number
  noise: number
  vignette: number
  mask: number
  flicker: number
  bloom: number
  curvature: number
  aberration: number
  roll: boolean
}

export type CrtPresetName = "subtle" | "arcade" | "broken"

export const crtPresets: Record<CrtPresetName, ShaderPreset<CrtParams>> = {
  subtle: {
    name: "Subtle",
    params: {
      speed: 1,
      frame: 0,
      fps: 30,
      scanlines: 0.18,
      scanlineDensity: 3,
      noise: 0.08,
      vignette: 0.25,
      mask: 0.1,
      flicker: 0,
      bloom: 0.15,
      curvature: 0.15,
      aberration: 0,
      roll: false,
    },
  },
  arcade: {
    name: "Arcade",
    params: {
      speed: 1,
      frame: 0,
      fps: 30,
      scanlines: 0.4,
      scanlineDensity: 3,
      noise: 0.12,
      vignette: 0.45,
      mask: 0.25,
      flicker: 0,
      bloom: 0.5,
      curvature: 0.22,
      aberration: 1.2,
      roll: false,
    },
  },
  broken: {
    name: "Broken",
    params: {
      speed: 1,
      frame: 0,
      fps: 30,
      scanlines: 0.35,
      scanlineDensity: 3,
      noise: 0.35,
      vignette: 0.6,
      mask: 0.15,
      flicker: 0.6,
      bloom: 0.4,
      curvature: 0.32,
      aberration: 3,
      roll: true,
    },
  },
}

export const defaultCrtPreset: CrtPresetName = "subtle"

export function resolveCrtParams(
  preset: CrtPresetName,
  overrides: Partial<CrtParams>,
  isReducedMotion: boolean
): CrtParams {
  const base = crtPresets[preset].params
  const defined = Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined))
  const resolved = { ...base, ...defined }
  return isReducedMotion ? { ...resolved, speed: 0, flicker: 0 } : resolved
}

export function toCrtUniforms(params: CrtParams): CrtUniforms {
  return {
    u_fps: params.fps,
    u_scanlines: params.scanlines,
    u_scanlineDensity: params.scanlineDensity,
    u_noise: params.noise,
    u_vignette: params.vignette,
    u_mask: params.mask,
    u_flicker: params.flicker,
    u_curvature: params.curvature,
    u_roll: params.roll ? 1 : 0,
  }
}
