import { useState } from 'react'
import { HABITS } from '../types'

export default function Onboarding({ onDone }: { onDone: (habit: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const [custom, setCustom] = useState('')

  const habit = picked === 'custom' ? custom.trim() : picked

  return (
    <>
      <header className="top-bar">
        <div className="brand">
          Relapse Autopsy
          <small>slips are intel, not failure</small>
        </div>
      </header>

      <h1 className="screen-title">What are you quitting?</h1>
      <p className="screen-sub">
        No account, no real name. Everything stays on this device.
      </p>

      <div className="card">
        <div className="chips">
          {HABITS.map((h) => (
            <button
              key={h}
              className="chip"
              aria-pressed={picked === h}
              onClick={() => setPicked(h)}
            >
              {h}
            </button>
          ))}
          <button
            className="chip"
            aria-pressed={picked === 'custom'}
            onClick={() => setPicked('custom')}
          >
            Something else
          </button>
        </div>
        {picked === 'custom' && (
          <>
            <label className="field-label" htmlFor="custom-habit">
              Name it whatever you want — only you will see it
            </label>
            <input
              id="custom-habit"
              className="text-input"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. online shopping"
            />
          </>
        )}
      </div>

      <div className="card">
        <h2>How this works</h2>
        <p className="sub" style={{ marginBottom: 0 }}>
          Most apps lose you the night you slip. This one is built for that night. When a slip
          happens, you run a 60-second debrief — what set it off, what you were feeling
          underneath. Each debrief adds a point to your danger map and a rep to your count.
          <strong> The number only goes up.</strong> There is no streak to break, because a slip
          you understand is progress.
        </p>
      </div>

      <div className="wizard-footer" style={{ justifyContent: 'flex-end' }}>
        <button className="btn primary" disabled={!habit} onClick={() => habit && onDone(habit)}>
          Start
        </button>
      </div>
    </>
  )
}
