import type { AppState } from '../types'
import { rankedFeelings, rankedTriggers, riskiestBand, timeBandCounts } from '../insights'

const pct = (share: number) => `${Math.round(share * 100)}%`

export default function DangerMap({ state, onLog }: { state: AppState; onLog: () => void }) {
  const events = state.events
  const triggers = rankedTriggers(events).slice(0, 6)
  const feelings = rankedFeelings(events).slice(0, 3)
  const bands = timeBandCounts(events)
  const risky = riskiestBand(events)
  const maxTrigger = triggers[0]?.count ?? 0
  const maxBand = Math.max(...bands.map((b) => b.count), 0)

  if (events.length === 0) {
    return (
      <>
        <h1 className="screen-title">Danger map</h1>
        <p className="screen-sub">
          Your personal map of when and why the urge wins — built from your debriefs, not
          generic advice.
        </p>
        <div className="card">
          <p className="empty">
            No data yet. The map draws itself from your debriefs — after two or three, patterns
            start to show.
          </p>
          <button className="btn primary" onClick={onLog}>
            Log the first one
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="viz-root">
      <h1 className="screen-title">Danger map</h1>
      <p className="screen-sub">
        Built from your {events.length} debrief{events.length === 1 ? '' : 's'}. This is what
        actually sets you off — not what generic advice assumes.
      </p>

      <div className="card">
        <h2>Top triggers</h2>
        <p className="sub">Ranked by how often each one shows up in your debriefs.</p>
        {triggers.map((t) => (
          <div
            className="bar-row"
            key={t.label}
            title={`${t.label}: ${t.count} of ${events.length} debriefs (${pct(t.share)})`}
          >
            <span className="bar-label">{t.label}</span>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{ width: `${(t.count / maxTrigger) * 82}%` }}
                role="img"
                aria-label={`${t.label}: ${t.count} debriefs`}
              />
              <span className="bar-value">
                {t.count} · {pct(t.share)}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Risky hours</h2>
        <p className="sub">
          {risky
            ? `Your highest-risk window is ${risky.label} — ${risky.count} of ${events.length} logged moments landed there.`
            : 'When your logged moments happen across the day.'}
        </p>
        <div className="col-chart">
          {bands.map((b) => (
            <div
              className="col-slot"
              key={b.label}
              title={`${b.label}: ${b.count} debrief${b.count === 1 ? '' : 's'}`}
            >
              {b.count > 0 && b.count === maxBand && <span className="col-value">{b.count}</span>}
              <span
                className="col-fill"
                style={
                  b.count > 0
                    ? { height: `${(b.count / maxBand) * 100}%` }
                    : { height: 0, minHeight: 0 }
                }
                role="img"
                aria-label={`${b.label}: ${b.count} debriefs`}
              />
            </div>
          ))}
        </div>
        <div className="col-labels">
          {bands.map((b) => (
            <span key={b.label}>{b.label}</span>
          ))}
        </div>
      </div>

      {feelings.length > 0 && (
        <div className="card">
          <h2>What's underneath</h2>
          <p className="sub">The feelings that keep showing up right before the urge.</p>
          <div className="chips">
            {feelings.map((f) => (
              <span key={f.label} className="chip" style={{ cursor: 'default' }}>
                {f.label} · {f.count}×
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
