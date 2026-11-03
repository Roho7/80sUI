import type { RefreshKind, RefreshPhase } from "./types"

export const REFRESH_SEQUENCES: Record<RefreshKind, readonly RefreshPhase[]> = {
  partial: ["noise", "clear"],
  region: ["flash", "invert", "noise", "clear"],
  full: ["flash", "invert", "flash", "invert", "noise", "clear"],
}

export type RefreshScope = "rect" | "viewport"

export type RefreshEffect = {
  scope: RefreshScope
  rank: number
  coverage: number
  leavesGhost: boolean
  clearsGhosts: boolean
  countsTowardFull: boolean
}

export const REFRESH_EFFECTS: Record<RefreshKind, RefreshEffect> = {
  partial: {
    scope: "rect",
    rank: 0,
    coverage: 0.5,
    leavesGhost: true,
    clearsGhosts: false,
    countsTowardFull: false,
  },
  region: {
    scope: "rect",
    rank: 1,
    coverage: 1,
    leavesGhost: false,
    clearsGhosts: true,
    countsTowardFull: true,
  },
  full: {
    scope: "viewport",
    rank: 2,
    coverage: 1,
    leavesGhost: false,
    clearsGhosts: true,
    countsTowardFull: false,
  },
}

export const FULL_REFRESH_INTERVAL = 8
