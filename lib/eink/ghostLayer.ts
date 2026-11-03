import { doRectsOverlap, readElementRect } from "./rects"
import type { Rect } from "./types"

const MAX_GHOSTS = 48

type Ghost = {
  node: HTMLElement
  rect: Rect
}

export type GhostLayer = {
  capture: (element: Element, opacity: number) => void
  clearWithin: (rect: Rect) => void
  clearAll: () => void
  destroy: () => void
}

function copyCanvases(source: Element, clone: Element) {
  const sourceCanvases = source.querySelectorAll("canvas")
  const cloneCanvases = clone.querySelectorAll("canvas")
  sourceCanvases.forEach((canvas, index) => {
    const target = cloneCanvases[index]
    const context = target?.getContext("2d")
    if (context && canvas.width > 0 && canvas.height > 0) {
      context.drawImage(canvas, 0, 0)
    }
  })
}

function buildGhostNode(element: Element, rect: Rect, opacity: number): HTMLElement {
  const clone = element.cloneNode(true)
  const wrapper = document.createElement("div")
  wrapper.className = "eink-ghost"
  wrapper.setAttribute("aria-hidden", "true")
  wrapper.inert = true
  Object.assign(wrapper.style, {
    position: "fixed",
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    opacity: String(opacity),
    overflow: "hidden",
  })
  if (clone instanceof HTMLElement) {
    clone.removeAttribute("id")
    clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"))
    Object.assign(clone.style, {
      position: "absolute",
      left: "0px",
      top: "0px",
      right: "auto",
      bottom: "auto",
      margin: "0px",
      transform: "none",
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })
    copyCanvases(element, clone)
    wrapper.append(clone)
  }
  return wrapper
}

export function createGhostLayer(): GhostLayer {
  const layer = document.createElement("div")
  layer.setAttribute("aria-hidden", "true")
  layer.dataset.einkLayer = "ghosts"
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0px",
    pointerEvents: "none",
    zIndex: "40",
    overflow: "hidden",
  })
  document.body.append(layer)
  let ghosts: Ghost[] = []

  function capture(element: Element, opacity: number) {
    const rect = readElementRect(element)
    if (rect.width === 0 || rect.height === 0 || opacity <= 0) {
      return
    }
    const node = buildGhostNode(element, rect, opacity)
    layer.append(node)
    ghosts.push({ node, rect })
    while (ghosts.length > MAX_GHOSTS) {
      ghosts.shift()?.node.remove()
    }
  }

  function clearWithin(rect: Rect) {
    ghosts = ghosts.filter((ghost) => {
      const isCovered = doRectsOverlap(ghost.rect, rect)
      if (isCovered) {
        ghost.node.remove()
      }
      return !isCovered
    })
  }

  function clearAll() {
    ghosts.forEach((ghost) => ghost.node.remove())
    ghosts = []
  }

  function destroy() {
    clearAll()
    layer.remove()
  }

  return { capture, clearWithin, clearAll, destroy }
}
