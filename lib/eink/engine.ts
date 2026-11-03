import {
  createDitherRenderer,
  type DitherRenderer,
  type DitherRequest,
} from "./ditherRenderer"
import { createGhostLayer, type GhostLayer } from "./ghostLayer"
import { INTENSITY_SETTINGS, type IntensitySetting } from "./intensitySettings"
import { observeTheme } from "./observeTheme"
import { createOverlayCanvas } from "./overlayCanvas"
import {
  createOverlayRenderer,
  type OverlayDraw,
  type OverlayRenderer,
} from "./overlayRenderer"
import { PHASE_SHADER_MODES } from "./phaseStyles"
import { areInksEqual, readFps, readInks, readPixel } from "./readTokens"
import { readElementRect, readViewportRect } from "./rects"
import { startRefreshJobs, stepRefreshJobs } from "./refreshScheduler"
import {
  FULL_REFRESH_INTERVAL,
  REFRESH_EFFECTS,
  type RefreshScope,
} from "./refreshSequences"
import type {
  EinkIntensity,
  InkPalette,
  Rect,
  RefreshJob,
  RefreshKind,
  RefreshRequest,
} from "./types"

export type EinkEngine = {
  mount: (root: Element) => void
  unmount: () => void
  requestRefresh: (element: Element, kind: RefreshKind) => void
  requestRefreshRect: (rect: Rect, kind: RefreshKind) => void
  captureGhost: (element: Element) => void
  setIntensity: (intensity: EinkIntensity) => void
  readFps: () => number
  readInks: () => InkPalette | null
  subscribeInks: (listener: () => void) => () => void
  renderDither: (request: DitherRequest) => ImageData | null
}

type EngineSurface = {
  root: Element
  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext | null
  overlay: OverlayRenderer | null
  dither: DitherRenderer | null
  ghostLayer: GhostLayer
  stopObservingTheme: () => void
}

const SCOPE_RECTS: Record<RefreshScope, (rect: Rect) => Rect> = {
  rect: (rect) => rect,
  viewport: () => readViewportRect(),
}

function toOverlayDraws(
  draws: ReturnType<typeof stepRefreshJobs>["draws"],
  setting: IntensitySetting,
  seed: number
): OverlayDraw[] {
  return draws.flatMap(({ job, phase }) => {
    const mode = PHASE_SHADER_MODES[phase]
    return mode === null
      ? []
      : [
          {
            rect: job.rect,
            mode,
            coverage: setting.coverage * REFRESH_EFFECTS[job.kind].coverage,
            seed,
          },
        ]
  })
}

function createSurface(root: Element, onThemeChange: () => void): EngineSurface {
  const canvas = createOverlayCanvas()
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  })
  return {
    root,
    canvas,
    gl,
    overlay: gl ? createOverlayRenderer(gl) : null,
    dither: gl ? createDitherRenderer(gl) : null,
    ghostLayer: createGhostLayer(),
    stopObservingTheme: observeTheme(onThemeChange),
  }
}

function destroySurface(surface: EngineSurface) {
  surface.stopObservingTheme()
  surface.ghostLayer.destroy()
  surface.gl?.getExtension("WEBGL_lose_context")?.loseContext()
  surface.canvas.remove()
}

export function createEinkEngine(): EinkEngine {
  const inkListeners = new Set<() => void>()
  let surface: EngineSurface | null = null
  let inks: InkPalette | null = null
  let fps = 12
  let pixel = 2
  let setting = INTENSITY_SETTINGS.full
  let pending: RefreshRequest[] = []
  let jobs: RefreshJob[] = []
  let ghostedThisFrame = new Set<Element>()
  let countedRefreshes = 0
  let frameHandle = 0
  let lastFrameAt = 0

  function resizeOverlay() {
    surface?.overlay?.resize(
      Math.ceil(window.innerWidth / pixel),
      Math.ceil(window.innerHeight / pixel)
    )
  }

  function runFrame() {
    jobs = [...jobs, ...startRefreshJobs(pending)]
    pending = []
    ghostedThisFrame = new Set()
    const frame = stepRefreshJobs(jobs)
    jobs = frame.remaining
    if (!surface || !inks) {
      return
    }
    surface.overlay?.draw(
      toOverlayDraws(frame.draws, setting, Math.random()),
      inks,
      pixel
    )
    for (const job of frame.finished) {
      if (REFRESH_EFFECTS[job.kind].clearsGhosts) {
        surface.ghostLayer.clearWithin(job.rect)
      }
    }
  }

  function loop(now: number) {
    frameHandle = 0
    if (now - lastFrameAt >= 1000 / fps - 1) {
      lastFrameAt = now
      runFrame()
    }
    if (jobs.length > 0 || pending.length > 0) {
      frameHandle = requestAnimationFrame(loop)
    }
  }

  function ensureLoop() {
    if (frameHandle === 0) {
      frameHandle = requestAnimationFrame(loop)
    }
  }

  function requestRefreshRect(rect: Rect, kind: RefreshKind) {
    if (!surface || !setting.isActive) {
      return
    }
    const effect = REFRESH_EFFECTS[kind]
    pending.push({ rect: SCOPE_RECTS[effect.scope](rect), kind })
    if (effect.countsTowardFull) {
      countedRefreshes += 1
    }
    if (countedRefreshes >= FULL_REFRESH_INTERVAL) {
      countedRefreshes = 0
      pending.push({ rect: readViewportRect(), kind: "full" })
    }
    ensureLoop()
  }

  function captureGhost(element: Element) {
    if (!surface || !setting.isActive || ghostedThisFrame.has(element)) {
      return
    }
    ghostedThisFrame.add(element)
    surface.ghostLayer.capture(element, setting.ghostOpacity)
  }

  function requestRefresh(element: Element, kind: RefreshKind) {
    if (REFRESH_EFFECTS[kind].leavesGhost) {
      captureGhost(element)
    }
    requestRefreshRect(readElementRect(element), kind)
  }

  function cancelRefreshes() {
    pending = []
    jobs = []
    surface?.overlay?.clear()
    surface?.ghostLayer.clearAll()
  }

  function setIntensity(intensity: EinkIntensity) {
    setting = INTENSITY_SETTINGS[intensity]
    if (!setting.isActive) {
      cancelRefreshes()
    }
  }

  function syncTheme() {
    if (!surface) {
      return
    }
    const nextInks = readInks(surface.root)
    fps = readFps(surface.root)
    const nextPixel = readPixel(surface.root)
    if (nextPixel !== pixel) {
      pixel = nextPixel
      resizeOverlay()
    }
    if (inks && areInksEqual(nextInks, inks)) {
      return
    }
    inks = nextInks
    inkListeners.forEach((listener) => listener())
    requestRefreshRect(readViewportRect(), "full")
  }

  function mount(root: Element) {
    if (surface) {
      return
    }
    surface = createSurface(root, syncTheme)
    inks = readInks(root)
    fps = readFps(root)
    pixel = readPixel(root)
    resizeOverlay()
    window.addEventListener("resize", resizeOverlay)
    inkListeners.forEach((listener) => listener())
  }

  function unmount() {
    if (!surface) {
      return
    }
    cancelAnimationFrame(frameHandle)
    frameHandle = 0
    cancelRefreshes()
    window.removeEventListener("resize", resizeOverlay)
    destroySurface(surface)
    surface = null
    inks = null
    inkListeners.forEach((listener) => listener())
  }

  function subscribeInks(listener: () => void) {
    inkListeners.add(listener)
    return () => {
      inkListeners.delete(listener)
    }
  }

  function renderDither(request: DitherRequest) {
    if (!surface?.dither || !inks) {
      return null
    }
    return surface.dither.render(request, inks)
  }

  return {
    mount,
    unmount,
    requestRefresh,
    requestRefreshRect,
    captureGhost,
    setIntensity,
    readFps: () => fps,
    readInks: () => inks,
    subscribeInks,
    renderDither,
  }
}
