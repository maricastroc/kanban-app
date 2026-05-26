export interface ProfilerRecord {
  id: string
  phase: 'mount' | 'update' | 'nested-update'
  actualDuration: number
  baseDuration: number
  startTime: number
  commitTime: number
  timestamp: number
}

export interface DragRecord {
  dragDuration: number
  apiDuration: number
  postRenderDuration: number
  timestamp: number
}

export interface ComponentStat {
  component: string
  totalRenders: number
  unnecessaryRenders: number
  avgActualDuration: number
  totalActualDuration: number
  maxActualDuration: number
  avgBaseDuration: number
  mountCount: number
  updateCount: number
}

class PerformanceLogger {
  private records: ProfilerRecord[] = []
  private dragRecords: DragRecord[] = []
  private unnecessaryRenders: Map<string, number> = new Map()
  private pendingDragIndex: number | null = null

  logProfiler(record: ProfilerRecord) {
    this.records.push(record)
    // correlate post-drag render with pending drag event
    if (
      this.pendingDragIndex !== null &&
      record.id === 'ColumnsContainer' &&
      record.phase === 'update'
    ) {
      const drag = this.dragRecords[this.pendingDragIndex]
      if (drag) drag.postRenderDuration = record.actualDuration
      this.pendingDragIndex = null
    }
  }

  logDrag(record: Omit<DragRecord, 'postRenderDuration'>) {
    const index = this.dragRecords.length
    this.dragRecords.push({ ...record, postRenderDuration: 0 })
    this.pendingDragIndex = index
  }

  logUnnecessaryRender(componentName: string) {
    const count = this.unnecessaryRenders.get(componentName) || 0
    this.unnecessaryRenders.set(componentName, count + 1)
  }

  getComponentStats(): ComponentStat[] {
    const statsMap = new Map<string, ComponentStat>()

    for (const record of this.records) {
      const existing = statsMap.get(record.id) ?? {
        component: record.id,
        totalRenders: 0,
        unnecessaryRenders: 0,
        avgActualDuration: 0,
        totalActualDuration: 0,
        maxActualDuration: 0,
        avgBaseDuration: 0,
        mountCount: 0,
        updateCount: 0,
      }
      existing.totalRenders++
      existing.totalActualDuration += record.actualDuration
      existing.avgActualDuration =
        existing.totalActualDuration / existing.totalRenders
      existing.avgBaseDuration =
        (existing.avgBaseDuration * (existing.totalRenders - 1) +
          record.baseDuration) /
        existing.totalRenders
      existing.maxActualDuration = Math.max(
        existing.maxActualDuration,
        record.actualDuration,
      )
      if (record.phase === 'mount') existing.mountCount++
      else existing.updateCount++
      statsMap.set(record.id, existing)
    }

    for (const [name, count] of this.unnecessaryRenders) {
      const existing = statsMap.get(name)
      if (existing) {
        existing.unnecessaryRenders = count
      } else {
        statsMap.set(name, {
          component: name,
          totalRenders: 0,
          unnecessaryRenders: count,
          avgActualDuration: 0,
          totalActualDuration: 0,
          maxActualDuration: 0,
          avgBaseDuration: 0,
          mountCount: 0,
          updateCount: 0,
        })
      }
    }

    return Array.from(statsMap.values()).sort(
      (a, b) => b.totalRenders - a.totalRenders,
    )
  }

  getDragStats() {
    if (this.dragRecords.length === 0) return null
    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length
    return {
      count: this.dragRecords.length,
      avgDragDuration: avg(this.dragRecords.map((r) => r.dragDuration)),
      avgApiDuration: avg(this.dragRecords.map((r) => r.apiDuration)),
      avgPostRenderDuration: avg(
        this.dragRecords.map((r) => r.postRenderDuration),
      ),
      records: this.dragRecords,
    }
  }

  exportJSON(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        componentStats: this.getComponentStats(),
        dragStats: this.getDragStats(),
        totalProfilerEvents: this.records.length,
        rawDragRecords: this.dragRecords,
      },
      null,
      2,
    )
  }

  clear() {
    this.records = []
    this.dragRecords = []
    this.unnecessaryRenders.clear()
    this.pendingDragIndex = null
  }
}

export const performanceLogger = new PerformanceLogger()
