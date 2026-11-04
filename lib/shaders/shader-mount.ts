import { observeInkChange, parseCssColor } from "@/lib/dither/inks"

import type {
  ShaderColorParam,
  ShaderMotionParams,
  ShaderMountColors,
  ShaderMountUniforms,
  ShaderUniformValue,
} from "./types"

const DEFAULT_FPS = 10

const PIXEL_TOKEN = "--pixel"

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
`

const CANVAS_STYLE: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  inset: "0",
  display: "block",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
}

type DeviceSize = { cssWidth: number; width: number; height: number }

export function isSameUniformValue(a: ShaderUniformValue, b: ShaderUniformValue): boolean {
  if (a === b) {
    return true
  }
  if (typeof a !== "object" || typeof b !== "object" || a.length !== b.length) {
    return false
  }
  return a.every((value, index) => value === b[index])
}

function resolveShaderColor(element: Element, color: ShaderColorParam): readonly number[] {
  const value = color.startsWith("--")
    ? getComputedStyle(element).getPropertyValue(color).trim()
    : color
  return parseCssColor(value).map((channel) => channel / 255)
}

function resolveFps(fps: number | undefined): number {
  return fps !== undefined && fps > 0 ? fps : DEFAULT_FPS
}

function writeUniformValue(
  gl: WebGL2RenderingContext,
  location: WebGLUniformLocation,
  value: ShaderUniformValue
) {
  if (typeof value === "number") {
    gl.uniform1f(location, value)
    return
  }
  if (typeof value === "boolean") {
    gl.uniform1i(location, value ? 1 : 0)
    return
  }
  switch (value.length) {
    case 1:
      gl.uniform1f(location, value[0])
      break
    case 2:
      gl.uniform2f(location, value[0], value[1])
      break
    case 3:
      gl.uniform3f(location, value[0], value[1], value[2])
      break
    case 4:
      gl.uniform4f(location, value[0], value[1], value[2], value[3])
      break
  }
}

function compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type)
  if (!shader) {
    return null
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`ShaderMount: ${gl.getShaderInfoLog(shader)}`)
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext, fragmentShader: string) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  const program = vertex && fragment ? gl.createProgram() : null
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
  }
  if (vertex) {
    gl.deleteShader(vertex)
  }
  if (fragment) {
    gl.deleteShader(fragment)
  }
  if (program && !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`ShaderMount: ${gl.getProgramInfoLog(program)}`)
    gl.deleteProgram(program)
    return null
  }
  return program
}

function readDeviceSize(entry: ResizeObserverEntry): DeviceSize {
  const cssBox = entry.contentBoxSize[0]
  const deviceBox = entry.devicePixelContentBoxSize?.[0]
  const cssWidth = cssBox?.inlineSize ?? entry.contentRect.width
  const cssHeight = cssBox?.blockSize ?? entry.contentRect.height
  const ratio = window.devicePixelRatio || 1
  return {
    cssWidth,
    width: deviceBox?.inlineSize ?? Math.round(cssWidth * ratio),
    height: deviceBox?.blockSize ?? Math.round(cssHeight * ratio),
  }
}

export class ShaderMount {
  static create(
    parentElement: HTMLElement,
    fragmentShader: string,
    uniforms: ShaderMountUniforms = {},
    colors: ShaderMountColors = {},
    motion: ShaderMotionParams = {}
  ): ShaderMount | null {
    const canvas = parentElement.ownerDocument.createElement("canvas")
    const gl = canvas.getContext("webgl2", { antialias: false, depth: false, stencil: false })
    if (!gl) {
      return null
    }
    const program = createProgram(gl, fragmentShader)
    if (!program) {
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      return null
    }
    return new ShaderMount(parentElement, canvas, gl, program, uniforms, colors, motion)
  }

  private readonly uniformLocations = new Map<string, WebGLUniformLocation | null>()
  private readonly uniformCache = new Map<string, ShaderUniformValue>()
  private readonly resizeObserver: ResizeObserver
  private readonly intersectionObserver: IntersectionObserver
  private readonly stopObservingInks: () => void
  private colors: ShaderMountColors = {}
  private speed: number
  private fps: number
  private currentFrame: number
  private pendingStepTime = 0
  private lastTickTime = 0
  private rafId: number | null = null
  private idleTimeoutId: number | null = null
  private size: DeviceSize = { cssWidth: 0, width: 0, height: 0 }
  private isInViewport = true
  private isDirty = false
  private isDisposed = false

  private constructor(
    private readonly parentElement: HTMLElement,
    private readonly canvas: HTMLCanvasElement,
    private readonly gl: WebGL2RenderingContext,
    private readonly program: WebGLProgram,
    uniforms: ShaderMountUniforms,
    colors: ShaderMountColors,
    motion: ShaderMotionParams
  ) {
    this.speed = motion.speed ?? 0
    this.fps = resolveFps(motion.fps)
    this.currentFrame = motion.frame ?? 0
    Object.assign(canvas.style, CANVAS_STYLE)
    canvas.setAttribute("aria-hidden", "true")
    if (getComputedStyle(parentElement).position === "static") {
      parentElement.style.position = "relative"
    }
    parentElement.prepend(canvas)
    gl.useProgram(program)
    this.writeUniforms(uniforms)
    this.writeColors(colors)
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        this.resize(readDeviceSize(entry))
      }
    })
    this.observeSize()
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.isInViewport = entry?.isIntersecting ?? true
      this.updateLoop()
    })
    this.intersectionObserver.observe(parentElement)
    this.stopObservingInks = observeInkChange(this.syncTheme)
    parentElement.ownerDocument.addEventListener("visibilitychange", this.updateLoop)
    this.updateLoop()
  }

  setUniforms(uniforms: ShaderMountUniforms) {
    if (this.writeUniforms(uniforms)) {
      this.requestDraw()
    }
  }

  setColors(colors: ShaderMountColors) {
    if (this.writeColors(colors)) {
      this.requestDraw()
    }
  }

  setSpeed(speed: number) {
    this.speed = speed
    this.updateLoop()
  }

  setFps(fps: number | undefined) {
    this.fps = resolveFps(fps)
  }

  setFrame(frame: number) {
    if (frame !== this.currentFrame) {
      this.currentFrame = frame
      this.requestDraw()
    }
  }

  getCurrentFrame(): number {
    return this.currentFrame
  }

  dispose() {
    this.isDisposed = true
    this.stopLoop()
    this.cancelIdleDraw()
    this.resizeObserver.disconnect()
    this.intersectionObserver.disconnect()
    this.stopObservingInks()
    this.parentElement.ownerDocument.removeEventListener("visibilitychange", this.updateLoop)
    this.gl.deleteProgram(this.program)
    this.gl.getExtension("WEBGL_lose_context")?.loseContext()
    this.canvas.remove()
  }

  private observeSize() {
    try {
      this.resizeObserver.observe(this.parentElement, { box: "device-pixel-content-box" })
    } catch {
      this.resizeObserver.observe(this.parentElement)
    }
  }

  private isPaused(): boolean {
    return this.parentElement.ownerDocument.hidden || !this.isInViewport
  }

  private readonly updateLoop = () => {
    if (this.isDisposed) {
      return
    }
    const isPaused = this.isPaused()
    if (this.speed !== 0 && !isPaused) {
      this.cancelIdleDraw()
      if (this.rafId === null) {
        this.lastTickTime = performance.now()
        this.rafId = requestAnimationFrame(this.tick)
      }
      return
    }
    this.stopLoop()
    if (isPaused) {
      this.cancelIdleDraw()
    } else if (this.isDirty) {
      this.scheduleIdleDraw()
    }
  }

  private stopLoop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private readonly tick = (now: number) => {
    const stepDuration = 1000 / this.fps
    this.pendingStepTime += now - this.lastTickTime
    this.lastTickTime = now
    const steps = Math.floor(this.pendingStepTime / stepDuration)
    if (steps > 0) {
      this.pendingStepTime -= steps * stepDuration
      this.currentFrame += steps * stepDuration * this.speed
      this.draw()
    } else if (this.isDirty) {
      this.draw()
    }
    this.rafId = requestAnimationFrame(this.tick)
  }

  private requestDraw() {
    if (this.rafId !== null) {
      return
    }
    this.isDirty = true
    if (!this.isPaused()) {
      this.scheduleIdleDraw()
    }
  }

  private scheduleIdleDraw() {
    if (this.idleTimeoutId !== null) {
      return
    }
    const stepDuration = 1000 / this.fps
    const delay = stepDuration - (performance.now() % stepDuration)
    this.idleTimeoutId = window.setTimeout(() => {
      this.idleTimeoutId = null
      this.draw()
    }, delay)
  }

  private cancelIdleDraw() {
    if (this.idleTimeoutId !== null) {
      window.clearTimeout(this.idleTimeoutId)
      this.idleTimeoutId = null
    }
  }

  private draw() {
    if (this.isDisposed || this.size.width === 0 || this.size.height === 0) {
      return
    }
    this.isDirty = false
    this.writeUniforms({ u_time: this.currentFrame / 1000 })
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
  }

  private resize(size: DeviceSize) {
    if (size.width === this.size.width && size.height === this.size.height) {
      return
    }
    this.size = size
    this.canvas.width = size.width
    this.canvas.height = size.height
    this.gl.viewport(0, 0, size.width, size.height)
    this.writeUniforms({
      u_resolution: [size.width, size.height],
      u_pixelRatio: this.readPixelRatio(),
    })
    this.writePixelSize()
    this.draw()
  }

  private readonly syncTheme = () => {
    const hasColorChanged = this.writeColors(this.colors)
    const hasPixelChanged = this.writePixelSize()
    if (hasColorChanged || hasPixelChanged) {
      this.requestDraw()
    }
  }

  private readPixelRatio(): number {
    return this.size.cssWidth > 0 ? this.size.width / this.size.cssWidth : 1
  }

  private writePixelSize(): boolean {
    const token = parseFloat(getComputedStyle(this.parentElement).getPropertyValue(PIXEL_TOKEN))
    const cssPixel = Number.isFinite(token) && token > 0 ? token : 1
    return this.writeUniforms({ u_pxSize: Math.max(1, Math.round(cssPixel * this.readPixelRatio())) })
  }

  private writeColors(colors: ShaderMountColors): boolean {
    this.colors = { ...this.colors, ...colors }
    const resolved = Object.fromEntries(
      Object.entries(colors).map(([name, color]) => [
        name,
        resolveShaderColor(this.parentElement, color),
      ])
    )
    return this.writeUniforms(resolved)
  }

  private readUniformLocation(name: string): WebGLUniformLocation | null {
    if (!this.uniformLocations.has(name)) {
      this.uniformLocations.set(name, this.gl.getUniformLocation(this.program, name))
    }
    return this.uniformLocations.get(name) ?? null
  }

  private writeUniforms(uniforms: ShaderMountUniforms): boolean {
    let hasChanged = false
    for (const [name, value] of Object.entries(uniforms)) {
      const cached = this.uniformCache.get(name)
      if (cached !== undefined && isSameUniformValue(cached, value)) {
        continue
      }
      this.uniformCache.set(name, value)
      hasChanged = true
      const location = this.readUniformLocation(name)
      if (location) {
        writeUniformValue(this.gl, location, value)
      }
    }
    return hasChanged
  }
}
