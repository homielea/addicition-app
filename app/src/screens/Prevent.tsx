import type { AppState } from '../types'
import { buildNudges, closeCallRate } from '../insights'

export default function Prevent({ state }: { state: AppState }) {
  const nudges = buildNudges(state.events)
  const rate = closeCallRate(state.events)

  return (
    <>
      <h1 className="screen-title">Prevention</h1>
      <p className="screen-sub">
        Your map, turned into moves. These come from your own debriefs — decided now, so you
        don't have to decide in the moment.
      </p>

      {nudges.length === 0 ? (
        <div className="card">
          <p className="empty">
            Nothing to work with yet. Prevention plays are generated from your danger map — log
            a debrief or two and this page fills in.
          </p>
        </div>
      ) : (
        <div className="card">
          <h2>Your plays</h2>
          <p className="sub">Small, specific, and aimed at your actual patterns.</p>
          {nudges.map((n) => (
            <div className="nudge" key={n.title}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      )}

      {rate !== null && (
        <div className="card">
          <h2>The urge is survivable</h2>
          <p className="sub" style={{ marginBottom: 0 }}>
            {Math.round(rate * 100)}% of the moments you've logged were close calls — the urge
            came and you didn't act. {rate > 0 ? 'You already know how to ride one out. ' : ''}
            Every close call you log teaches the map what works.
          </p>
        </div>
      )}

      <div className="card">
        <h2>If tonight is hard</h2>
        <p className="sub" style={{ marginBottom: 0 }}>
          You don't have to win the whole night — just the next 10 minutes. Change rooms, put
          the phone somewhere inconvenient, and if a slip happens anyway: log it. The debrief is
          the one move that always counts.
        </p>
      </div>
    </>
  )
}
