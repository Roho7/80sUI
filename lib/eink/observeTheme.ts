const THEME_ATTRIBUTES = ["class", "data-theme", "style"]

export function observeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: THEME_ATTRIBUTES,
  })
  return () => observer.disconnect()
}
