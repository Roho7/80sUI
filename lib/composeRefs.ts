import { type Ref, type RefCallback, useMemo } from "react"

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node)
  } else if (ref) {
    ref.current = node
  }
}

export function useComposedRef<T>(
  first: Ref<T> | undefined,
  second: Ref<T> | undefined
): RefCallback<T> {
  return useMemo(
    () => (node: T | null) => {
      assignRef(first, node)
      assignRef(second, node)
    },
    [first, second]
  )
}
