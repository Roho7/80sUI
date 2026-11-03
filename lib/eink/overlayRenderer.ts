import { compileProgram, createFullscreenQuad, flattenInks } from "./glProgram"
import { FULLSCREEN_VERTEX_SHADER, OVERLAY_FRAGMENT_SHADER } from "./shaders"
import type { InkPalette, Rect } from "./types"

export type OverlayDraw = {
  rect: Rect
  mode: number
  coverage: number
  seed: number
}

export type OverlayRenderer = {
  resize: (width: number, height: number) => void
  clear: () => void
  draw: (draws: readonly OverlayDraw[], inks: InkPalette, pixel: number) => void
}

export function createOverlayRenderer(
  gl: WebGL2RenderingContext
): OverlayRenderer | null {
  const program = compileProgram(gl, FULLSCREEN_VERTEX_SHADER, OVERLAY_FRAGMENT_SHADER)
  const quad = createFullscreenQuad(gl)
  if (!program || !quad) {
    return null
  }
  const inksLocation = gl.getUniformLocation(program, "uInks")
  const modeLocation = gl.getUniformLocation(program, "uMode")
  const coverageLocation = gl.getUniformLocation(program, "uCoverage")
  const seedLocation = gl.getUniformLocation(program, "uSeed")

  function clear() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.disable(gl.SCISSOR_TEST)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  function resize(width: number, height: number) {
    gl.canvas.width = width
    gl.canvas.height = height
    clear()
  }

  function draw(draws: readonly OverlayDraw[], inks: InkPalette, pixel: number) {
    clear()
    if (draws.length === 0) {
      return
    }
    gl.useProgram(program)
    gl.bindVertexArray(quad)
    gl.uniform3fv(inksLocation, flattenInks(inks))
    gl.enable(gl.SCISSOR_TEST)
    const bufferHeight = gl.drawingBufferHeight
    for (const { rect, mode, coverage, seed } of draws) {
      const left = Math.floor(rect.x / pixel)
      const top = Math.floor(rect.y / pixel)
      const right = Math.ceil((rect.x + rect.width) / pixel)
      const bottom = Math.ceil((rect.y + rect.height) / pixel)
      gl.scissor(left, bufferHeight - bottom, right - left, bottom - top)
      gl.uniform1i(modeLocation, mode)
      gl.uniform1f(coverageLocation, coverage)
      gl.uniform1f(seedLocation, seed)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    gl.disable(gl.SCISSOR_TEST)
    gl.bindVertexArray(null)
  }

  return { resize, clear, draw }
}
