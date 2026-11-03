import { useSyncExternalStore } from "react"

function subscribeNever() {
  return () => {}
}

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}
