// ─────────────────────────────────────────────────────────
// MatchDetail — RIGHT PANEL
//
// READ:  selectedMatch (full object owned by App.jsx)
// WRITE: fires callbacks up to App — never stores confirmed
//        state locally. All persistent state lives in matches[].
//
// requestStatus (owned by App) gates which view renders:
//   'none'      → RequestView  (join / pending stepper)
//   'confirmed' → ConfirmedView (Match Plan + checklist + arrival)
//   'completed' → CompletedView (post-match recap form)
//
// The key={selectedMatch.id} trick on MatchContent causes React
// to unmount + remount the inner tree on match change, which:
//   1. Replays CSS fade-in animation
//   2. Resets all local form state (noteInput, recapInputs)
//   3. Shows the "synced" micro-label again
//
// Architecture reminder:
//   Browser → (onSelectMatch) → App → (selectedMatch prop) → Detail
//   Detail fires callbacks UP — App updates matches[] → Browser re-renders
//   Checklist / arrivalStatus changes sync Browser + Detail simultaneously
// ─────────────────────────────────────────────────────────

import { useState } from 'react'

// ── Style maps ─────────────────────────────────────────────
const LEVEL_STYLE = {
  '3.0': { bg: '#EFF6FF', color: '#2563EB' },
  '3.5': { bg: '#F0FDF4', color: '#16A34A' },
  '4.0': { bg: '#FFF7ED', color: '#C2410C' },
  '4.5': { bg: '#FDF4FF', color: '#7C3AED' },
  '5.0': { bg: '#FFF1F2', color: '#BE123C' },
}

const INTENSITY_STYLE = {
  'Casual':         { bg: '#F0FDF4', color: '#16A34A' },
  'Competitive':    { bg: '#FFF7ED', color: '#C2410C' },
  'High Intensity': { bg: '#FFF1F2', color: '#BE123C' },
}

// Checklist item definitions — same order as match.checklist keys in App.jsx
const CHECKLIST_ITEMS = [
  { key: 'water',   label: 'Bring water' },
  { key: 'balls',   label: 'Bring extra balls' },
  { key: 'warmup',  label: 'Warm up 10 minutes before' },
  { key: 'arrival', label: 'Confirm arrival time with host' },
  { key: 'address', label: 'Save court address' },
]

const ARRIVAL_LABEL = {
  'none':      null,
  'on-my-way': "🚗 You're on your way",
  'arrived':   '✅ You\'ve arrived',
  'cancelled': '✕ Participation cancelled',
}


// ═══════════════════════════════════════════════════════════
// RequestView — shown when requestStatus === 'none'
// This is the original join / pending experience.
// ═══════════════════════════════════════════════════════════
function RequestView({ match, onJoin, onSaveNote, onConfirm }) {
  // noteInput is local form state only.
  // The saved note lives in App.jsx (match.hostNote).
  const [noteInput, setNoteInput] = useState('')

  const levelSt     = LEVEL_STYLE[match.level]       || {}
  const intensitySt = INTENSITY_STYLE[match.intensity] || {}
  const canJoin     = match.status === 'Open' || match.status === 'Filling Fast'
  const isSent      = match.status === 'Request Sent'
  const isFull      = match.status === 'Full'

  const handleNoteSave = () => {
    if (!noteInput.trim()) return
    // Fires UP to App — App updates matches[id].hostNote → Browser badge appears
    onSaveNote(match.id, noteInput.trim())
    setNoteInput('')
  }

  return (
    <div className="detail__content detail-fade">

      <div className="detail__synced">
        <span className="detail__synced-dot" />
        Match details synced
      </div>

      {/* Header badges + status */}
      <div className="detail__head">
        <div className="detail__head-badges">
          <span className="detail__level" style={{ background: levelSt.bg, color: levelSt.color }}>
            {match.level} NTRP
          </span>
          <span className="detail__type">{match.type}</span>
        </div>
        <span className={`detail__status detail__status--${match.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {match.status}
        </span>
      </div>

      <h2 className="detail__title">{match.title}</h2>
      <p className="detail__host">Hosted by <strong>{match.host}</strong></p>

      {/* Core info grid */}
      <div className="detail__info-grid">
        <div className="detail__info-item">
          <span className="detail__info-label">Location</span>
          <span className="detail__info-value">📍 {match.location}</span>
        </div>
        <div className="detail__info-item">
          <span className="detail__info-label">Time</span>
          <span className="detail__info-value">🕐 {match.time}</span>
        </div>
        <div className="detail__info-item">
          <span className="detail__info-label">Distance</span>
          <span className="detail__info-value">📏 {match.distanceLabel} away</span>
        </div>
        <div className="detail__info-item">
          <span className="detail__info-label">Spots Open</span>
          <span className="detail__info-value">
            👥 {match.playersNeeded} player{match.playersNeeded !== 1 ? 's' : ''} needed
          </span>
        </div>
      </div>

      {/* Extended info */}
      <div className="detail__info-grid">
        <div className="detail__info-item">
          <span className="detail__info-label">Court Surface</span>
          <span className="detail__info-value">🎾 {match.courtSurface}</span>
        </div>
        <div className="detail__info-item">
          <span className="detail__info-label">Intensity</span>
          <span
            className="detail__info-value detail__intensity"
            style={{ background: intensitySt.bg, color: intensitySt.color }}
          >
            {match.intensity}
          </span>
        </div>
        <div className="detail__info-item detail__info-item--wide">
          <span className="detail__info-label">Play Style</span>
          <span className="detail__info-value">⚡ {match.playStyle}</span>
        </div>
        <div className="detail__info-item detail__info-item--wide">
          <span className="detail__info-label">What to Bring</span>
          <span className="detail__info-value">🎒 {match.whatToBring}</span>
        </div>
      </div>

      {/* Description + notes */}
      <div className="detail__desc">
        <span className="detail__desc-label">About this match</span>
        <p className="detail__desc-text">{match.description}</p>
      </div>
      <div className="detail__desc">
        <span className="detail__desc-label">Match notes</span>
        <p className="detail__desc-text">{match.matchNotes}</p>
      </div>

      {/* Progress stepper — visible after joining.
          When status === 'Request Sent', the user is pending host review.
          The "Simulate" button lets a demo reviewer advance to confirmed state. */}
      {isSent && (
        <>
          <div className="stepper">
            <div className="stepper__label">Request Progress</div>
            <div className="stepper__track">
              <div className="stepper__step stepper__step--done">
                <div className="stepper__circle stepper__circle--done">✓</div>
                <span className="stepper__text">Request Sent</span>
              </div>
              <div className="stepper__line stepper__line--done" />
              <div className="stepper__step stepper__step--active">
                <div className="stepper__circle stepper__circle--active" />
                <span className="stepper__text">Host Review</span>
              </div>
              <div className="stepper__line" />
              <div className="stepper__step stepper__step--pending">
                <div className="stepper__circle stepper__circle--pending" />
                <span className="stepper__text">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Simulates the host accepting the request.
              In a real app this would arrive via push notification / webhook.
              Fires onConfirm(id) UP → App sets requestStatus='confirmed'. */}
          <button className="simulate-btn" onClick={() => onConfirm(match.id)}>
            Simulate: Host Confirms →
          </button>
        </>
      )}

      {/* Join button — fires onJoin(id) UP to App.
          App sets status='Request Sent' → stepper appears, button disables. */}
      <button
        className={`join-btn${isSent ? ' join-btn--sent' : ''}${isFull ? ' join-btn--full' : ''}`}
        onClick={() => canJoin && onJoin(match.id)}
        disabled={!canJoin}
      >
        {isSent ? '✓ Request Sent — Awaiting Host' : isFull ? 'Match Full' : 'Request to Join →'}
      </button>

      {/* Saved note — sourced from App state. Appears when match.hostNote is set. */}
      {match.hostNote && (
        <div className="detail__saved-note">
          <div className="detail__saved-note-header">
            <span className="detail__saved-note-icon">✉</span>
            <span className="detail__saved-note-label">Your note to host</span>
          </div>
          <p className="detail__saved-note-text">{match.hostNote}</p>
        </div>
      )}

      {/* Note input — local state, fires onSaveNote up on save. */}
      <div className="detail__note-section">
        <span className="detail__note-label">
          {match.hostNote ? 'Update your note' : 'Add a note to the host'}
        </span>
        <textarea
          className="detail__note-input"
          placeholder="e.g. I'll be wearing a white hat, I'm a strong 4.0..."
          value={noteInput}
          onChange={e => setNoteInput(e.target.value)}
          rows={3}
        />
        <button
          className="detail__note-save"
          onClick={handleNoteSave}
          disabled={!noteInput.trim()}
        >
          {match.hostNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>

    </div>
  )
}


// ═══════════════════════════════════════════════════════════
// ConfirmedView — shown when requestStatus === 'confirmed'
//
// The Detail panel transforms into a Match Plan experience.
// All data is sourced from App.jsx state via the match prop —
// nothing is duplicated here. Checklist + arrival callbacks
// fire UP to App, which updates matches[] → both Browser and
// Detail re-render from the same shared data.
// ═══════════════════════════════════════════════════════════
function ConfirmedView({ match, onToggleChecklist, onSetArrival, onCompleteMatch }) {
  const checkedCount = Object.values(match.checklist).filter(Boolean).length
  const totalCount   = CHECKLIST_ITEMS.length
  const intensitySt  = INTENSITY_STYLE[match.intensity] || {}
  const currentArrival = match.arrivalStatus

  return (
    <div className="detail__content detail-fade">

      <div className="detail__synced">
        <span className="detail__synced-dot" />
        You're confirmed
      </div>

      {/* ── Confirmation Header ──────────────────────────── */}
      <div className="confirmed-header">
        <div className="confirmed-header__badge">
          <span className="confirmed-header__check">✓</span>
          You're confirmed
        </div>
        <h2 className="detail__title">{match.title}</h2>
        <p className="detail__host">Hosted by <strong>{match.host}</strong></p>
        <div className="confirmed-header__meta">
          <span className="confirmed-header__meta-item">📍 {match.location}</span>
          <span className="confirmed-header__meta-item">🕐 {match.time}</span>
        </div>
      </div>

      {/* ── Match Plan Card ──────────────────────────────────
          Data sourced from App state (match prop) — same object
          Browser is reading. Any field update flows to both panels. */}
      <div className="match-plan">
        <div className="match-plan__label">Match Plan</div>

        <div className="detail__info-grid">
          <div className="detail__info-item detail__info-item--wide">
            <span className="detail__info-label">Court Location</span>
            <span className="detail__info-value">📍 {match.location}</span>
          </div>
          <div className="detail__info-item">
            <span className="detail__info-label">Arrive By</span>
            <span className="detail__info-value">⏰ 15 min early</span>
          </div>
          <div className="detail__info-item">
            <span className="detail__info-label">Court Surface</span>
            <span className="detail__info-value">🎾 {match.courtSurface}</span>
          </div>
          <div className="detail__info-item">
            <span className="detail__info-label">Match Format</span>
            <span className="detail__info-value">◦ {match.type}</span>
          </div>
          <div className="detail__info-item">
            <span className="detail__info-label">Intensity</span>
            <span
              className="detail__info-value detail__intensity"
              style={{ background: intensitySt.bg, color: intensitySt.color }}
            >
              {match.intensity}
            </span>
          </div>
          <div className="detail__info-item detail__info-item--wide">
            <span className="detail__info-label">What to Bring</span>
            <span className="detail__info-value">🎒 {match.whatToBring}</span>
          </div>
        </div>

        {/* Match notes inside plan */}
        <div className="match-plan__notes">
          <span className="detail__info-label">Scoring / Notes</span>
          <p className="match-plan__notes-text">{match.matchNotes}</p>
        </div>

        {/* Host note surfaces here when confirmed, sourced from App state */}
        {match.hostNote && (
          <div className="match-plan__host-note">
            <span className="match-plan__host-note-icon">✉</span>
            <div>
              <span className="detail__info-label">Host Note</span>
              <p className="match-plan__host-note-text">{match.hostNote}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Prep Checklist ───────────────────────────────────
          Checklist state lives in App.jsx (match.checklist{}).
          Toggling fires onToggleChecklist(id, key) UP to App.
          App flips the boolean → Browser "3/5 prep" count + this
          list both update from the same data source. */}
      <div className="prep-checklist">
        <div className="prep-checklist__header">
          <span className="prep-checklist__label">Prep Checklist</span>
          <span className={`prep-checklist__progress${checkedCount === totalCount ? ' prep-checklist__progress--done' : ''}`}>
            {checkedCount}/{totalCount} complete
          </span>
        </div>
        {CHECKLIST_ITEMS.map(item => (
          <button
            key={item.key}
            className={`checklist-item${match.checklist[item.key] ? ' checklist-item--checked' : ''}`}
            onClick={() => onToggleChecklist(match.id, item.key)}
          >
            <span className="checklist-item__box">
              {match.checklist[item.key] && <span className="checklist-item__check">✓</span>}
            </span>
            <span className="checklist-item__label">{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── Arrival Status ───────────────────────────────────
          arrivalStatus lives in App.jsx (match.arrivalStatus).
          Button click fires onSetArrival(id, status) UP to App.
          App updates matches[id].arrivalStatus → Browser badge
          and this section both reflect the new state instantly. */}
      <div className="arrival-section">
        <div className="arrival-section__label">Arrival Status</div>

        {/* Current status label — visible when not 'none' */}
        {currentArrival !== 'none' && (
          <div className="arrival-section__current">
            {ARRIVAL_LABEL[currentArrival]}
          </div>
        )}

        <div className="arrival-section__btns">
          <button
            className={`arrival-btn${currentArrival === 'on-my-way' ? ' arrival-btn--active' : ''}`}
            onClick={() => onSetArrival(match.id, 'on-my-way')}
          >
            🚗 I'm on my way
          </button>
          <button
            className={`arrival-btn arrival-btn--arrived${currentArrival === 'arrived' ? ' arrival-btn--active' : ''}`}
            onClick={() => onSetArrival(match.id, 'arrived')}
          >
            ✅ I've arrived
          </button>
        </div>

        <button
          className={`arrival-btn arrival-btn--cancel${currentArrival === 'cancelled' ? ' arrival-btn--cancelled-active' : ''}`}
          onClick={() => onSetArrival(match.id, 'cancelled')}
        >
          ✕ Cancel participation
        </button>
      </div>

      {/* Complete Match — fires onCompleteMatch(id) UP to App.
          App sets requestStatus='completed', status='Completed'.
          This view unmounts; CompletedView takes over. */}
      <button className="complete-btn" onClick={() => onCompleteMatch(match.id)}>
        Complete Match →
      </button>

    </div>
  )
}


// ═══════════════════════════════════════════════════════════
// CompletedView — shown when requestStatus === 'completed'
//
// Post-match reflection form. Local state for inputs only —
// the saved recap lives in App.jsx (match.recap{}).
// Fires onSaveRecap(id, recap) UP to App on save.
// ═══════════════════════════════════════════════════════════
function CompletedView({ match, onSaveRecap }) {
  // Local form state — initialized from saved recap if it exists.
  // key trick remounts this on match change, re-reading from props.
  const [result, setResult] = useState(match.recap?.result || '')
  const [notes,  setNotes]  = useState(match.recap?.notes  || '')

  const handleSave = () => {
    if (!result.trim()) return
    // Fires UP to App — App sets matches[id].recap → this section re-renders from props
    onSaveRecap(match.id, { result: result.trim(), notes: notes.trim() })
  }

  return (
    <div className="detail__content detail-fade">

      <div className="detail__synced">
        <span className="detail__synced-dot" />
        Match completed
      </div>

      {/* Completed header */}
      <div className="completed-header">
        <div className="completed-header__badge">🏆 Match Complete</div>
        <h2 className="detail__title">{match.title}</h2>
        <p className="detail__host">with <strong>{match.host}</strong> · {match.time}</p>
      </div>

      {/* Saved recap display — sourced from App state (match.recap) */}
      {match.recap && (
        <div className="recap-saved">
          <div className="recap-saved__label">Your Recap</div>
          <div className="recap-saved__result">{match.recap.result}</div>
          {match.recap.notes && (
            <p className="recap-saved__notes">{match.recap.notes}</p>
          )}
          <p className="recap-saved__hint">Update below to edit</p>
        </div>
      )}

      {/* Post-match recap form.
          Result + notes are local state while typing.
          onSaveRecap fires UP to App on save — App stores in match.recap. */}
      <div className={`recap-form${match.recap ? ' recap-form--update' : ''}`}>
        <div className="recap-form__label">
          {match.recap ? 'Update Recap' : 'How did it go?'}
        </div>

        <div className="detail__note-section">
          <span className="detail__note-label">Result</span>
          <input
            className="detail__note-input recap-form__result-input"
            type="text"
            placeholder="e.g. Won 6–4, 7–5 · Lost first set, rallied back"
            value={result}
            onChange={e => setResult(e.target.value)}
          />
        </div>

        <div className="detail__note-section">
          <span className="detail__note-label">Reflections</span>
          <textarea
            className="detail__note-input"
            placeholder="What went well? What to work on next time?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <button
          className="detail__note-save recap-form__save"
          onClick={handleSave}
          disabled={!result.trim()}
        >
          {match.recap ? 'Update Recap' : 'Save Recap →'}
        </button>
      </div>

    </div>
  )
}


// ═══════════════════════════════════════════════════════════
// MatchContent — routes to the correct view based on
// requestStatus from App.jsx. Never stores confirmed state.
//
// key={selectedMatch.id} on this component causes full
// unmount + remount on match change (see MatchDetail below).
// ═══════════════════════════════════════════════════════════
function MatchContent({ match, onJoin, onSaveNote, onConfirm, onToggleChecklist, onSetArrival, onCompleteMatch, onSaveRecap }) {
  // Gate: requestStatus is owned by App.jsx and passed via props.
  // Changing it here requires a callback up — nothing is mirrored locally.
  if (match.requestStatus === 'completed') {
    return <CompletedView match={match} onSaveRecap={onSaveRecap} />
  }
  if (match.requestStatus === 'confirmed') {
    return (
      <ConfirmedView
        match={match}
        onToggleChecklist={onToggleChecklist}
        onSetArrival={onSetArrival}
        onCompleteMatch={onCompleteMatch}
      />
    )
  }
  return (
    <RequestView
      match={match}
      onJoin={onJoin}
      onSaveNote={onSaveNote}
      onConfirm={onConfirm}
    />
  )
}


// ── Main export ───────────────────────────────────────────
export default function MatchDetail({
  selectedMatch,
  onJoin, onSaveNote, onConfirm,
  onToggleChecklist, onSetArrival, onCompleteMatch, onSaveRecap,
}) {

  if (!selectedMatch) {
    return (
      <div className="detail detail--empty">
        <span className="detail__empty-icon">🎾</span>
        <p className="detail__empty-title">Select a match</p>
        <p className="detail__empty-sub">Tap any match card to see the full details.</p>
      </div>
    )
  }

  return (
    <div className="detail">
      {/* key={selectedMatch.id} — changing match causes full remount:
          (1) CSS fade-in replays  (2) local form state resets
          (3) synced label re-appears  (4) view re-gates on requestStatus */}
      <MatchContent
        key={selectedMatch.id}
        match={selectedMatch}
        onJoin={onJoin}
        onSaveNote={onSaveNote}
        onConfirm={onConfirm}
        onToggleChecklist={onToggleChecklist}
        onSetArrival={onSetArrival}
        onCompleteMatch={onCompleteMatch}
        onSaveRecap={onSaveRecap}
      />
    </div>
  )
}
