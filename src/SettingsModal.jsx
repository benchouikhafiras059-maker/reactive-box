// ─────────────────────────────────────────────────────────
// SettingsModal — overlaid on the main app
//
// READ:  user, settings (from App.jsx state)
// WRITE: fires onSave(updatedUser, updatedSettings) up to App
//        fires onClose up to App
//
// All form values are local state — initialized from props.
// On save, fires the updated values up; App stores them.
// ─────────────────────────────────────────────────────────

import { useState } from 'react'

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const NTRP_LEVELS  = ['3.0', '3.5', '4.0', '4.5', '5.0']
const RADII        = [{ v: '1', label: '1 mi' }, { v: '3', label: '3 mi' },
                      { v: '5', label: '5 mi' }, { v: '10', label: '10 mi' }]
const NOTIFS       = [{ v: 'app', label: '🔔 App' }, { v: 'email', label: '📧 Email' },
                      { v: 'text', label: '📱 Text' }]

export default function SettingsModal({ user, settings, onSave, onClose }) {
  // Local form state — initialized from App.jsx props
  const [name,         setName]         = useState(user.name)
  const [zip,          setZip]          = useState(user.zip)
  const [level,        setLevel]        = useState(user.level)
  const [notification, setNotification] = useState(settings.notification)
  const [radius,       setRadius]       = useState(settings.radius)

  const canSave = name.trim() && zip.trim() && level

  // Fires updated values UP to App — App updates user{} + settings{} state
  const handleSave = () => {
    if (!canSave) return
    onSave(
      { name: name.trim(), zip: zip.trim(), level },
      { notification, radius }
    )
  }

  return (
    // Clicking the backdrop closes the modal
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card settings-fade" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Profile & Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Profile ── */}
        <div className="modal-section">
          <div className="modal-section-label">Your profile</div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label" htmlFor="s-name">Name</label>
              <input
                id="s-name"
                className="modal-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="modal-field">
              <label className="modal-label" htmlFor="s-zip">ZIP Code</label>
              <input
                id="s-zip"
                className="modal-input"
                type="text"
                value={zip}
                onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="e.g. 30308"
                inputMode="numeric"
                maxLength={5}
              />
            </div>
          </div>

          <div className="modal-field">
            <div className="modal-label">Skill level</div>
            <div className="modal-pills">
              {[...SKILL_LEVELS, ...NTRP_LEVELS].map(l => (
                <button
                  key={l}
                  className={`modal-pill${level === l ? ' modal-pill--active' : ''}`}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Match radius ── */}
        <div className="modal-section">
          <div className="modal-section-label">Match radius</div>
          <div className="modal-pills">
            {RADII.map(r => (
              <button
                key={r.v}
                className={`modal-pill${radius === r.v ? ' modal-pill--active' : ''}`}
                onClick={() => setRadius(r.v)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="modal-section">
          <div className="modal-section-label">Notifications</div>
          <div className="modal-pills">
            {NOTIFS.map(n => (
              <button
                key={n.v}
                className={`modal-pill${notification === n.v ? ' modal-pill--active' : ''}`}
                onClick={() => setNotification(n.v)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button
            className={`modal-btn modal-btn--save${!canSave ? ' modal-btn--disabled' : ''}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}
