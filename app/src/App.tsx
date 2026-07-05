import { useEffect, useState } from 'react'
import type { AppState, DebriefEvent, EventKind, Screen } from './types'
import { eraseState, loadState, saveState } from './storage'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Autopsy from './screens/Autopsy'
import DangerMap from './screens/DangerMap'
import Prevent from './screens/Prevent'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [screen, setScreen] = useState<Screen>('home')
  const [autopsyKind, setAutopsyKind] = useState<EventKind>('slip')

  const startAutopsy = (kind: EventKind) => {
    setAutopsyKind(kind)
    setScreen('autopsy')
  }

  useEffect(() => {
    saveState(state)
  }, [state])

  if (!state.habit) {
    return <Onboarding onDone={(habit) => setState((s) => ({ ...s, habit }))} />
  }

  const addEvent = (event: DebriefEvent) =>
    setState((s) => ({ ...s, events: [...s.events, event] }))

  const erase = () => {
    if (window.confirm('Erase everything? This deletes all your data from this device.')) {
      eraseState()
      setState({ habit: null, events: [] })
      setScreen('home')
    }
  }

  const nav: Array<{ id: Screen; label: string }> = [
    { id: 'home', label: 'Today' },
    { id: 'map', label: 'Danger map' },
    { id: 'prevent', label: 'Prevention' },
  ]

  return (
    <>
      <header className="top-bar">
        <div className="brand">
          Relapse Autopsy
          <small>slips are intel, not failure</small>
        </div>
        {screen !== 'autopsy' && (
          <nav className="nav">
            {nav.map((n) => (
              <button key={n.id} aria-current={screen === n.id} onClick={() => setScreen(n.id)}>
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {screen === 'home' && (
        <Home state={state} onLog={startAutopsy} onMap={() => setScreen('map')} onErase={erase} />
      )}
      {screen === 'autopsy' && (
        <Autopsy
          initialKind={autopsyKind}
          onCancel={() => setScreen('home')}
          onComplete={(event) => {
            addEvent(event)
            setScreen('map')
          }}
        />
      )}
      {screen === 'map' && <DangerMap state={state} onLog={() => startAutopsy('slip')} />}
      {screen === 'prevent' && <Prevent state={state} />}
    </>
  )
}
