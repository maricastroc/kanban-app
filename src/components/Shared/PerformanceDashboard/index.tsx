import { useState, useEffect, CSSProperties } from 'react'
import { performanceLogger, ComponentStat } from '@/utils/performanceLogger'
import { generateMockBoard } from '@/utils/mockDataGenerator'
import { BoardProps } from '@/@types/board'

interface Props {
  onLoadScaleTest: (board: BoardProps) => void
  version?: 'context' | 'redux'
}

type Tab = 'renders' | 'dnd' | 'scale' | 'meta'

interface TestMeta {
  version: string
  scenario: string
  boards: string
  tasks: string
  interaction: string
}

export function PerformanceDashboard({ onLoadScaleTest, version = 'context' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('renders')
  const [stats, setStats] = useState<ComponentStat[]>([])
  const [dragStats, setDragStats] = useState<ReturnType<
    typeof performanceLogger.getDragStats
  >>(null)
  const [meta, setMeta] = useState<TestMeta>({
    version,
    scenario: '',
    boards: '1',
    tasks: '15',
    interaction: '',
  })

  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setStats(performanceLogger.getComponentStats())
      setDragStats(performanceLogger.getDragStats())
    }, 800)
    return () => clearInterval(interval)
  }, [isOpen])

  // works in both dev and production builds
  if (typeof window === 'undefined') return null

  function buildExportPayload() {
    return {
      meta: {
        version: meta.version,
        scenario: meta.scenario || 'unnamed',
        boards: Number(meta.boards),
        tasks: Number(meta.tasks),
        interaction: meta.interaction,
        environment: process.env.NODE_ENV,
        browser: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      componentStats: performanceLogger.getComponentStats(),
      dragStats: performanceLogger.getDragStats(),
      totalProfilerEvents: (performanceLogger as any)['records']?.length ?? 0,
      rawDragRecords: performanceLogger.getDragStats()?.records ?? [],
    }
  }

  function handleExport() {
    const payload = buildExportPayload()
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const versionSlug = meta.version.replace(/\s+/g, '-').toLowerCase()
    const scenarioSlug = (meta.scenario || 'test').replace(/\s+/g, '-').toLowerCase()
    a.download = `profiler-${versionSlug}-${scenarioSlug}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    performanceLogger.clear()
    setStats([])
    setDragStats(null)
  }

  function handleScaleTest(count: number) {
    performanceLogger.clear()
    setMeta((m) => ({ ...m, tasks: String(count), interaction: `scale-${count}-tasks` }))
    onLoadScaleTest(generateMockBoard(count))
  }

  function updateMeta(key: keyof TestMeta, value: string) {
    setMeta((m) => ({ ...m, [key]: value }))
  }

  const tabs: Tab[] = ['renders', 'dnd', 'scale', 'meta']

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: 'monospace' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Performance Dashboard"
        style={{
          display: 'block',
          marginLeft: 'auto',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 44,
          height: 44,
          cursor: 'pointer',
          fontSize: 18,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        ⚡
      </button>

      {isOpen && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <span style={{ fontWeight: 700, color: '#cba6f7' }}>
              ⚡ React Profiler
            </span>
            <span style={{ color: '#6c7086', fontSize: 10, marginLeft: 4 }}>
              {process.env.NODE_ENV}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={handleExport} style={btn('#a6e3a1')}>
                Export JSON
              </button>
              <button onClick={handleClear} style={btn('#f38ba8')}>
                Clear
              </button>
            </div>
          </div>

          {/* meta summary bar */}
          <div style={{ padding: '4px 14px', background: '#11111b', fontSize: 10, color: '#6c7086', display: 'flex', gap: 12 }}>
            <span>version: <b style={{ color: '#cba6f7' }}>{meta.version || '—'}</b></span>
            <span>scenario: <b style={{ color: '#cdd6f4' }}>{meta.scenario || '—'}</b></span>
            <span>tasks: <b style={{ color: '#cdd6f4' }}>{meta.tasks}</b></span>
          </div>

          <div style={tabBarStyle}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={tabStyle(activeTab === tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ overflow: 'auto', flex: 1, padding: 10 }}>
            {activeTab === 'renders' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ color: '#89b4fa' }}>
                    <th style={th}>Component</th>
                    <th style={th}>Renders</th>
                    <th style={th}>Unnecessary</th>
                    <th style={th}>Avg ms</th>
                    <th style={th}>Max ms</th>
                    <th style={th}>Base ms</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: '#6c7086' }}>
                        Interact with the app to collect data
                      </td>
                    </tr>
                  )}
                  {stats.map((s) => (
                    <tr key={s.component} style={{ borderBottom: '1px solid #313244' }}>
                      <td style={td}>{s.component}</td>
                      <td style={{ ...td, textAlign: 'center' }}>{s.totalRenders}</td>
                      <td
                        style={{
                          ...td,
                          textAlign: 'center',
                          color: s.unnecessaryRenders > 0 ? '#f38ba8' : '#a6e3a1',
                          fontWeight: s.unnecessaryRenders > 0 ? 700 : 400,
                        }}
                      >
                        {s.unnecessaryRenders}
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>{s.avgActualDuration.toFixed(2)}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{s.maxActualDuration.toFixed(2)}</td>
                      <td style={{ ...td, textAlign: 'right', color: '#6c7086' }}>{s.avgBaseDuration.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'dnd' && (
              dragStats ? (
                <div>
                  <div style={{ marginBottom: 10, color: '#89b4fa', fontWeight: 700 }}>
                    Drag operations: {dragStats.count}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ color: '#89b4fa' }}>
                        <th style={th}>#</th>
                        <th style={th}>Interaction (ms)</th>
                        <th style={th}>API (ms)</th>
                        <th style={th}>Re-render (ms)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dragStats.records.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #313244' }}>
                          <td style={td}>{i + 1}</td>
                          <td style={{ ...td, textAlign: 'right' }}>{r.dragDuration.toFixed(1)}</td>
                          <td style={{ ...td, textAlign: 'right' }}>{r.apiDuration > 0 ? r.apiDuration.toFixed(1) : '—'}</td>
                          <td style={{ ...td, textAlign: 'right', color: '#cba6f7' }}>{r.postRenderDuration.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: 10, color: '#6c7086', borderTop: '1px solid #313244', paddingTop: 8, fontSize: 11 }}>
                    Avg interaction: <span style={{ color: '#cdd6f4' }}>{dragStats.avgDragDuration.toFixed(1)}ms</span>
                    {' | '}Avg API: <span style={{ color: '#cdd6f4' }}>{dragStats.avgApiDuration.toFixed(1)}ms</span>
                    {' | '}Avg re-render: <span style={{ color: '#cba6f7' }}>{dragStats.avgPostRenderDuration.toFixed(2)}ms</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#6c7086', textAlign: 'center', padding: 20 }}>
                  Drag and drop a task to collect data
                </p>
              )
            )}

            {activeTab === 'scale' && (
              <div>
                <p style={{ color: '#89b4fa', marginBottom: 12 }}>
                  Inject mock tasks to test rendering at scale.
                  Profiler data is cleared before each test.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {[30, 60, 100, 200].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleScaleTest(count)}
                      style={btn('#89b4fa')}
                    >
                      {count} tasks
                    </button>
                  ))}
                </div>
                <p style={{ color: '#6c7086', fontSize: 11 }}>
                  ⚠ Uses mock data (bypasses API). After loading, check the Renders tab.
                </p>
              </div>
            )}

            {activeTab === 'meta' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ color: '#89b4fa', margin: 0, fontSize: 11 }}>
                  Fill in before exporting — this metadata is included in the JSON.
                </p>

                {([
                  { key: 'version', label: 'Version', placeholder: 'Context API / Redux Toolkit' },
                  { key: 'scenario', label: 'Scenario', placeholder: 'e.g. initial-mount, board-switch' },
                  { key: 'interaction', label: 'Interaction', placeholder: 'e.g. clicked board switch' },
                  { key: 'boards', label: 'Boards (#)', placeholder: '1' },
                  { key: 'tasks', label: 'Tasks (#)', placeholder: '15' },
                ] as { key: keyof TestMeta; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <label style={{ color: '#6c7086', fontSize: 10 }}>{label}</label>
                    <input
                      value={meta[key]}
                      onChange={(e) => updateMeta(key, e.target.value)}
                      placeholder={placeholder}
                      style={inputStyle}
                    />
                  </div>
                ))}

                <div style={{ marginTop: 4, padding: 8, background: '#11111b', borderRadius: 6, fontSize: 10, color: '#6c7086' }}>
                  <div>env: <span style={{ color: '#cdd6f4' }}>{process.env.NODE_ENV}</span></div>
                  <div>browser: <span style={{ color: '#cdd6f4' }}>{typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-1)[0] : '—'}</span></div>
                </div>

                <button onClick={handleExport} style={{ ...btn('#a6e3a1'), padding: '6px 14px', marginTop: 4 }}>
                  Export JSON with metadata
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const panelStyle: CSSProperties = {
  position: 'absolute',
  bottom: 52,
  right: 0,
  width: 540,
  maxHeight: 500,
  background: '#1e1e2e',
  color: '#cdd6f4',
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const headerStyle: CSSProperties = {
  padding: '10px 14px',
  background: '#313244',
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  fontSize: 12,
}

const tabBarStyle: CSSProperties = {
  display: 'flex',
  background: '#181825',
  borderBottom: '1px solid #45475a',
}

const th: CSSProperties = {
  textAlign: 'left',
  padding: '4px 8px',
  borderBottom: '1px solid #45475a',
  fontWeight: 600,
}

const td: CSSProperties = {
  padding: '3px 8px',
}

const inputStyle: CSSProperties = {
  background: '#313244',
  border: '1px solid #45475a',
  borderRadius: 4,
  color: '#cdd6f4',
  padding: '4px 8px',
  fontFamily: 'monospace',
  fontSize: 11,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

function tabStyle(active: boolean): CSSProperties {
  return {
    padding: '7px 12px',
    background: active ? '#313244' : 'transparent',
    color: active ? '#cba6f7' : '#6c7086',
    border: 'none',
    borderBottom: active ? '2px solid #cba6f7' : '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 11,
  }
}

function btn(color: string): CSSProperties {
  return {
    background: 'transparent',
    color,
    border: `1px solid ${color}`,
    borderRadius: 4,
    padding: '3px 10px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 11,
  }
}
