import { mergeOverlappingRequests } from "./rects"
import { REFRESH_SEQUENCES } from "./refreshSequences"
import type { RefreshJob, RefreshPhase, RefreshRequest } from "./types"

export type PhaseDraw = {
  job: RefreshJob
  phase: RefreshPhase
}

export type RefreshFrame = {
  draws: PhaseDraw[]
  finished: RefreshJob[]
  remaining: RefreshJob[]
}

export function startRefreshJobs(
  pending: readonly RefreshRequest[]
): RefreshJob[] {
  return mergeOverlappingRequests(pending).map((request) => ({
    ...request,
    phaseIndex: 0,
  }))
}

export function stepRefreshJobs(jobs: readonly RefreshJob[]): RefreshFrame {
  const frame: RefreshFrame = { draws: [], finished: [], remaining: [] }
  for (const job of jobs) {
    const sequence = REFRESH_SEQUENCES[job.kind]
    frame.draws.push({ job, phase: sequence[job.phaseIndex] })
    const next = { ...job, phaseIndex: job.phaseIndex + 1 }
    const bucket = next.phaseIndex >= sequence.length ? frame.finished : frame.remaining
    bucket.push(next)
  }
  return frame
}
