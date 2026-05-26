import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react'
import { performanceLogger } from '@/utils/performanceLogger'

interface Props {
  id: string
  children: ReactNode
}

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  performanceLogger.logProfiler({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    timestamp: Date.now(),
  })
}

export function ProfilerWrapper({ id, children }: Props) {
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )
}
