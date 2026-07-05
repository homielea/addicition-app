import type { AppState, EventKind } from '../types'
import { rankedTriggers } from '../insights'

function formatWhen(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Home({
  state,
  onLog,
  onMap,
  onErase,
}: {
  state: AppState
  onLog: (kind: EventKind) => void
  onMap: () => void
  onErase: () => void
}) {
  const reps = state.events.length
  const slips = state.events.filter((e) => e.kind === 'slip').length
  const closeCalls = reps - slips
  const topTrigger = rankedTriggers(state.events)[0]
  const recent = [...state.events].reverse().slice(0, 5)

  return (
    <>
      <div className="card hero">
        <div className="label">Insight reps — quitting {state.habit?.toLowerCase()}</div>
        <div className="value">{reps}</div>
        <div className="delta">only goes up</div>
        <div className="note">
          Every debrief is a rep. Slips count — a slip you understand is data, not damage.
        </div>
      </div>

      <div className="actions">
        <button className="action-btn primary" onClick={() => onLog('slip')}>
          <strong>I slipped — log it</strong>
          <span>60 seconds, no judgment. This is the useful part.</span>
        </button>
        <button className="action-btn" onClick={() => onLog('close-call')}>
          <strong>Close call</strong>
          <span>Had the urge, didn't act. That's intel too.</span>
        </button>
      </div>

      <div className="tiles">
        <div className="tile">
          <div className="label">Slips debriefed</div>
          <div className="value">{slips}</div>
        </div>
        <div className="tile">
          <div className="label">Close calls</div>
          <div className="value">{closeCalls}</div>
        </div>
        <div className="tile">
          <div className="label">Top trigger</div>
          <div className="value">
            {topTrigger ? <small>{topTrigger.label}</small> : <small>—</small>}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent debriefs</h2>
        <p className="sub">The raw material of your danger map.</p>
        {recent.length === 0 ? (
          <p className="empty">
            Nothing logged yet. When a slip or a close call happens, log it here — the first
            debrief starts your map.
          </p>
        ) : (
          <>
            {recent.map((e) => (
              <div className="event-row" key={e.id}>
                <span>
                  <span className={`kind-dot${e.kind === 'close-call' ? ' close-call' : ''}`} />
                  {e.trigger} <span style={{ color: 'var(--text-muted)' }}>·</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>felt {e.feeling.toLowerCase()}</span>
                </span>
                <span className="when">{formatWhen(e.at)}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={onMap} style={{ paddingLeft: 0 }}>
                See your danger map →
              </button>
            </div>
          </>
        )}
      </div>

      <div className="footer-links">
        <button onClick={onErase}>Erase all my data</button>
      </div>
    </>
  )
}
