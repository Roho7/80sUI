export function createOverlayCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  canvas.dataset.einkLayer = "overlay"
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0px",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "2147483000",
    imageRendering: "pixelated",
  })
  document.body.append(canvas)
  return canvas
}
