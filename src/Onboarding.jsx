// ─────────────────────────────────────────────────────────
// Onboarding — shown BEFORE the main 3-panel app
//
// READ:  nothing from App (no props needed)
// WRITE: fires onComplete({ name, zip, level }) up to App
//
// All form state here is local UI state — it lives only
// long enough to collect the user's info, then fires up.
// App.jsx stores the result in user{} state.
// ─────────────────────────────────────────────────────────

import { useState } from 'react'

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const NTRP_LEVELS  = ['3.0', '3.5', '4.0', '4.5', '5.0']

export default function Onboarding({ onComplete }) {
  // Local UI state — which screen + form values
  const [screen, setScreen] = useState(1)
  const [name,   setName]   = useState('')
  const [zip,    setZip]    = useState('')
  const [level,  setLevel]  = useState('')

  const canSubmit = name.trim() && zip.trim() && level

  // Fires up to App.jsx — App stores user, sets isOnboardingComplete = true
  const handleSubmit = () => {
    if (!canSubmit) return
    onComplete({ name: name.trim(), zip: zip.trim(), level })
  }

  return (
    <div className="ob">

      {/* ── Screen 1 — Welcome ── */}
      {screen === 1 && (
        <div key="s1" className="ob__card ob-fade">
          <div className="ob__icon">🎾</div>
          <h1 className="ob__title">Welcome to CourtMatch</h1>
          <p className="ob__sub">Find local tennis matches near your level</p>

          <div className="ob__features">
            <div className="ob__feature">
              <span className="ob__feature-icon">📍</span>
              <span>Matches within miles of you</span>
            </div>
            <div className="ob__feature">
              <span className="ob__feature-icon">🏆</span>
              <span>Filtered to your NTRP level</span>
            </div>
            <div className="ob__feature">
              <span className="ob__feature-icon">⚡</span>
              <span>Request to join in one tap</span>
            </div>
          </div>

          <button className="ob__btn ob__btn--primary" onClick={() => setScreen(2)}>
            Get Started →
          </button>
        </div>
      )}

      {/* ── Screen 2 — Profile form ── */}
      {screen === 2 && (
        <div key="s2" className="ob__card ob-fade">
          <button className="ob__back" onClick={() => setScreen(1)}>← Back</button>

          <div className="ob__icon ob__icon--sm">🎾</div>
          <h2 className="ob__title ob__title--sm">Tell us about yourself</h2>
          <p className="ob__sub">We'll find the right matches for your level</p>

          {/* Name input */}
          <div className="ob__field">
            <label className="ob__label" htmlFor="ob-name">Your name</label>
            <input
              id="ob-name"
              className="ob__input"
              type="text"
              placeholder="First name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* ZIP input */}
          <div className="ob__field">
            <label className="ob__label" htmlFor="ob-zip">ZIP code</label>
            <input
              id="ob-zip"
              className="ob__input"
              type="text"
              placeholder="e.g. 30308"
              value={zip}
              onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              inputMode="numeric"
              maxLength={5}
            />
          </div>

          {/* Level selection */}
          <div className="ob__field">
            <div className="ob__label">Skill level</div>

            <div className="ob__level-group">
              <div className="ob__level-group-label">General</div>
              <div className="ob__pills">
                {SKILL_LEVELS.map(l => (
                  <button
                    key={l}
                    className={`ob__pill${level === l ? ' ob__pill--active' : ''}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="ob__level-group">
              <div className="ob__level-group-label">NTRP rating</div>
              <div className="ob__pills">
                {NTRP_LEVELS.map(l => (
                  <button
                    key={l}
                    className={`ob__pill${level === l ? ' ob__pill--active' : ''}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`ob__btn ob__btn--primary${!canSubmit ? ' ob__btn--disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Start Finding Matches →
          </button>

          <p className="ob__legal">No account needed. No payment. Just tennis.</p>
        </div>
      )}

    </div>
  )
}
