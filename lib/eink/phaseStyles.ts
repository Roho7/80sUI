import type { RefreshPhase } from "./types"

export const PHASE_SHADER_MODES: Record<RefreshPhase, number | null> = {
  flash: 0,
  invert: 1,
  noise: 2,
  clear: null,
}
