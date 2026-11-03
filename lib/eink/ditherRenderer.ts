import { compileProgram, createFullscreenQuad, flattenInks } from "./glProgram"
import { DITHER_FRAGMENT_SHADER, FULLSCREEN_VERTEX_SHADER } from "./shaders"
import type { BayerMatrixSize, InkPalette } from "./types"

export type DitherSource = HTMLImageElement | HTMLCanvasElement | ImageBitmap

export type DitherRequest = {
  source: DitherSource
  width: number
  height: number
  matrixSize: BayerMatrixSize
  contrast: number
  seed: number
}

export type DitherRenderer = {
  render: (request: DitherRequest, inks: InkPalette) => ImageData | null
}

const SEED_OFFSETS = [
  [0, 0],
  [1, 2],
  [3, 1],
  [2, 3],
  [5, 6],
  [7, 4],
] as const

export function readSeedOffset(seed: number): readonly [number, number] {
  return SEED_OFFSETS[Math.abs(Math.floor(seed)) % SEED_OFFSETS.length]
}

export function createDitherRenderer(
  gl: WebGL2RenderingContext
): DitherRenderer | null {
  const program = compileProgram(gl, FULLSCREEN_VERTEX_SHADER, DITHER_FRAGMENT_SHADER)
  const quad = createFullscreenQuad(gl)
  const framebuffer = gl.createFramebuffer()
  const target = gl.createTexture()
  if (!program || !quad || !framebuffer || !target) {
    return null
  }
  const imageLocation = gl.getUniformLocation(program, "uImage")
  const inksLocation = gl.getUniformLocation(program, "uInks")
  const matrixLocation = gl.getUniformLocation(program, "uMatrixSize")
  const seedLocation = gl.getUniformLocation(program, "uSeedOffset")
  const contrastLocation = gl.getUniformLocation(program, "uContrast")
  const sourceTextures = new WeakMap<DitherSource, WebGLTexture>()

  function readSourceTexture(source: DitherSource): WebGLTexture | null {
    const cached = sourceTextures.get(source)
    if (cached) {
      return cached
    }
    const texture = gl.createTexture()
    if (!texture) {
      return null
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    sourceTextures.set(source, texture)
    return texture
  }

  function render(request: DitherRequest, inks: InkPalette): ImageData | null {
    const sourceTexture = readSourceTexture(request.source)
    if (!sourceTexture) {
      return null
    }
    const { width, height } = request
    gl.bindTexture(gl.TEXTURE_2D, target)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target, 0)
    gl.viewport(0, 0, width, height)
    gl.disable(gl.SCISSOR_TEST)
    gl.useProgram(program)
    gl.bindVertexArray(quad)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, sourceTexture)
    gl.uniform1i(imageLocation, 0)
    gl.uniform3fv(inksLocation, flattenInks(inks))
    gl.uniform1i(matrixLocation, request.matrixSize)
    gl.uniform2fv(seedLocation, readSeedOffset(request.seed))
    gl.uniform1f(contrastLocation, request.contrast)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    const pixels = new Uint8ClampedArray(width * height * 4)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    gl.bindVertexArray(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    return new ImageData(pixels, width, height)
  }

  return { render }
}
