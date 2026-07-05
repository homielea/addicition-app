import { useState } from 'react'
import type { DebriefEvent, EventKind } from '../types'
import { FEELINGS, TRIGGERS } from '../types'

type WhenChoice = 'now' | 'hour' | 'lastnight' | 'custom'

function resolveWhen(choice: WhenChoice, custom: string): string {
  const now = new Date()
  if (choice === 'hour') return new Date(now.getTime() - 60 * 60 * 1000).toISOString()
  if (choice === 'lastnight') {
    const d = new Date(now)
    if (now.getHours() >= 5) d.setDate(d.getDate() - 1)
    d.setHours(23, 0, 0, 0)
    return d.toISOString()
  }
  if (choice === 'custom' && custom) return new Date(custom).toISOString()
  return now.toISOString()
}

export default function Autopsy({
  initialKind = 'slip',
  onCancel,
  onComplete,
}: {
  initialKind?: EventKind
  onCancel: () => void
  onComplete: (event: DebriefEvent) => void
}) {
  const [step, setStep] = useState(0)
  const [kind, setKind] = useState<EventKind>(initialKind)
  const [trigger, setTrigger] = useState('')
  const [customTrigger, setCustomTrigger] = useState('')
  const [feeling, setFeeling] = useState('')
  const [note, setNote] = useState('')
  const [when, setWhen] = useState<WhenChoice>('now')
  const [customWhen, setCustomWhen] = useState('')
  const [done, setDone] = useState(false)

  const resolvedTrigger = trigger === 'custom' ? customTrigger.trim() : trigger

  const finish = () => {
    const event: DebriefEvent = {
      id: crypto.randomUUID(),
      kind,
      at: resolveWhen(when, customWhen),
      trigger: resolvedTrigger,
      feeling,
      note: note.trim() || undefined,
    }
    setDone(true)
    // Brief beat so the "+1 rep" lands before the map appears.
    setTimeout(() => onComplete(event), 1400)
  }

  if (done) {
    return (
      <div className="card hero">
        <div className="done-check">✓</div>
        <div className="label">Debrief banked</div>
        <div className="value" style={{ fontSize: 40 }}>
          +1 rep
        </div>
        <div className="note">
          That's intel, not failure. Your danger map just got sharper.
        </div>
      </div>
    )
  }

  const steps = ['What set it off?', 'What was underneath it?', 'Anything else?']

  return (
    <>
      <div className="step-dots" aria-hidden>
        {steps.map((_, i) => (
          <span key={i} className={i <= step ? 'done' : ''} />
        ))}
      </div>

      <h1 className="screen-title">{steps[step]}</h1>

      {step === 0 && (
        <>
          <p className="screen-sub">
            No judgment — this took 60 seconds of honesty most people never do.
          </p>
          <div className="card">
            <div className="chips" style={{ marginBottom: 16 }}>
              <button className="chip" aria-pressed={kind === 'slip'} onClick={() => setKind('slip')}>
                It was a slip
              </button>
              <button
                className="chip"
                aria-pressed={kind === 'close-call'}
                onClick={() => setKind('close-call')}
              >
                Close call — I didn't act
              </button>
            </div>

            <label className="field-label">
              What set it off? Pick the closest one.
            </label>
            <div className="chips">
              {TRIGGERS.map((t) => (
                <button key={t} className="chip" aria-pressed={trigger === t} onClick={() => setTrigger(t)}>
                  {t}
                </button>
              ))}
              <button
                className="chip"
                aria-pressed={trigger === 'custom'}
                onClick={() => setTrigger('custom')}
              >
                Something else
              </button>
            </div>
            {trigger === 'custom' && (
              <input
                className="text-input"
                style={{ marginTop: 10 }}
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                placeholder="Name the trigger in your own words"
              />
            )}

            <label className="field-label">When was it?</label>
            <div className="chips">
              {(
                [
                  ['now', 'Just now'],
                  ['hour', '~1 hour ago'],
                  ['lastnight', 'Last night'],
                  ['custom', 'Pick a time'],
                ] as Array<[WhenChoice, string]>
              ).map(([id, label]) => (
                <button key={id} className="chip" aria-pressed={when === id} onClick={() => setWhen(id)}>
                  {label}
                </button>
              ))}
            </div>
            {when === 'custom' && (
              <input
                type="datetime-local"
                className="text-input"
                style={{ marginTop: 10 }}
                value={customWhen}
                onChange={(e) => setCustomWhen(e.target.value)}
              />
            )}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <p className="screen-sub">
            The trigger is the spark; the feeling is the fuel. What were you actually feeling
            right before?
          </p>
          <div className="card">
            <div className="chips">
              {FEELINGS.map((f) => (
                <button key={f} className="chip" aria-pressed={feeling === f} onClick={() => setFeeling(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="screen-sub">
            Optional. One sentence for your future self — where were you, what would have helped?
          </p>
          <div className="card">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Alone in my room after the call with Dad. Going for a walk earlier would have helped."
            />
          </div>
        </>
      )}

      <div className="wizard-footer">
        <button className="btn ghost" onClick={step === 0 ? onCancel : () => setStep(step - 1)}>
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 2 ? (
          <button
            className="btn primary"
            disabled={step === 0 ? !resolvedTrigger : !feeling}
            onClick={() => setStep(step + 1)}
          >
            Next
          </button>
        ) : (
          <button className="btn primary" onClick={finish}>
            Bank it
          </button>
        )}
      </div>
    </>
  )
}
