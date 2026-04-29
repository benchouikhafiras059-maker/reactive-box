// ─────────────────────────────────────────────────────────
// MatchBrowser — CENTER PANEL
//
// READ:  matches (pre-filtered by App), selectedMatchId
// WRITE: fires onSelectMatch(id) up to App on click
//
// No internal state. All badges derive from App state:
//   match.status        → status badge color
//   match.hostNote      → ✉ Note badge
//   match.requestStatus → confirmed / completed UI
//   match.checklist     → "3/5 prep complete" badge
//   match.arrivalStatus → arrival badge (On my way / Arrived / Cancelled)
//   match.recap         → Recap saved badge
//
// When App updates any of these fields, MatchBrowser re-renders
// automatically via new props — no local state involved.
//
// Architecture: fires onSelectMatch UP → App sets selectedMatchId
// → Detail re-renders via new selectedMatch prop.
// ─────────────────────────────────────────────────────────

const LEVEL_STYLE = {
  '3.0': { bg: '#EFF6FF', color: '#2563EB' },
  '3.5': { bg: '#F0FDF4', color: '#16A34A' },
  '4.0': { bg: '#FFF7ED', color: '#C2410C' },
  '4.5': { bg: '#FDF4FF', color: '#7C3AED' },
  '5.0': { bg: '#FFF1F2', color: '#BE123C' },
}

const STATUS_STYLE = {
  'Open':         { bg: '#F0FDF4', color: '#15803D', dot: '#16A34A' },
  'Filling Fast': { bg: '#FFF7ED', color: '#C2410C', dot: '#EA7C3F' },
  'Full':         { bg: '#FFF1F2', color: '#BE123C', dot: '#E11D48' },
  'Request Sent': { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  'Confirmed':    { bg: '#ECFDF5', color: '#065F46', dot: '#10B981' },
  'Completed':    { bg: '#F5F3FF', color: '#5B21B6', dot: '#8B5CF6' },
}

// Arrival badge styles — mirrors arrivalStatus values from App.jsx
const ARRIVAL_BADGE = {
  'on-my-way': { label: '🚗 On my way', bg: '#FEF3C7', color: '#92400E' },
  'arrived':   { label: '✅ Arrived',    bg: '#ECFDF5', color: '#065F46' },
  'cancelled': { label: '✕ Cancelled',  bg: '#FFF1F2', color: '#BE123C' },
}

const TYPE_ICON = {
  Singles:  '◦',
  Doubles:  '◦◦',
  Mixed:    '⊕',
  Practice: '◎',
}

export default function MatchBrowser({ matches, selectedMatchId, onSelectMatch }) {
  return (
    <div className="browser">

      <div className="browser__header">
        <h2 className="browser__title">Open Matches</h2>
        <span className="browser__count">{matches.length} found</span>
      </div>

      {matches.length === 0 && (
        <div className="browser__empty">
          <span className="browser__empty-icon">🔍</span>
          <p className="browser__empty-title">No matches found</p>
          <p className="browser__empty-sub">Try adjusting your filters or search.</p>
        </div>
      )}

      <div className="browser__list">
        {matches.map(match => {
          const levelSt    = LEVEL_STYLE[match.status === 'Confirmed' || match.status === 'Completed'
            ? match.level : match.level] || {}
          const statusSt   = STATUS_STYLE[match.status] || {}
          const selected   = match.id === selectedMatchId
          const isConfirmed  = match.requestStatus === 'confirmed'
          const isCompleted  = match.requestStatus === 'completed'
          const arrivalBadge = ARRIVAL_BADGE[match.arrivalStatus]

          // Prep checklist progress — shown on confirmed cards
          const checkedCount = match.checklist
            ? Object.values(match.checklist).filter(Boolean).length
            : 0
          const totalCount = match.checklist ? Object.keys(match.checklist).length : 0

          return (
            // Click fires onSelectMatch(id) UP to App.
            // App sets selectedMatchId → Detail re-renders from the same match object.
            <button
              key={match.id}
              className={`match-card${selected ? ' match-card--selected' : ''}${isConfirmed ? ' match-card--confirmed' : ''}${isCompleted ? ' match-card--completed' : ''}`}
              onClick={() => onSelectMatch(match.id)}
              aria-pressed={selected}
            >
              {/* Top row — level + type + status */}
              <div className="match-card__top-row">
                <div className="match-card__badges">
                  <span
                    className="match-card__level"
                    style={{ background: LEVEL_STYLE[match.level]?.bg, color: LEVEL_STYLE[match.level]?.color }}
                  >
                    {match.level} NTRP
                  </span>
                  <span className="match-card__type">
                    {TYPE_ICON[match.type] || '◦'} {match.type}
                  </span>
                </div>
                <span
                  className="match-card__status"
                  style={{ background: statusSt.bg, color: statusSt.color }}
                >
                  <span className="match-card__status-dot" style={{ background: statusSt.dot }} />
                  {match.status}
                </span>
              </div>

              <h3 className="match-card__title">{match.title}</h3>
              <p className="match-card__host">by {match.host}</p>

              <div className="match-card__meta">
                <span className="match-card__meta-item">📍 {match.location}</span>
                <span className="match-card__meta-item">🕐 {match.time}</span>
              </div>

              {/* Arrival status badge — sourced from App state (match.arrivalStatus).
                  Appears automatically when user updates arrival in Detail. */}
              {arrivalBadge && (
                <div
                  className="match-card__arrival-badge"
                  style={{ background: arrivalBadge.bg, color: arrivalBadge.color }}
                >
                  {arrivalBadge.label}
                </div>
              )}

              {/* Footer row */}
              <div className="match-card__footer">
                <span className="match-card__distance">{match.distanceLabel} away</span>
                <div className="match-card__footer-right">

                  {/* ✉ Note badge — sourced from App state (match.hostNote) */}
                  {match.hostNote && (
                    <span className="match-card__note-badge">✉ Note</span>
                  )}

                  {/* Prep progress — sourced from App state (match.checklist).
                      Updates when user checks items in Detail. */}
                  {isConfirmed && (
                    <span className={`match-card__prep-badge${checkedCount === totalCount ? ' match-card__prep-badge--done' : ''}`}>
                      {checkedCount}/{totalCount} prep
                    </span>
                  )}

                  {/* Recap badge — sourced from App state (match.recap) */}
                  {isCompleted && match.recap && (
                    <span className="match-card__recap-badge">🏆 Recap</span>
                  )}

                  {/* Spots open — only shown when not confirmed/completed */}
                  {!isConfirmed && !isCompleted && (
                    <span className="match-card__spots">
                      {match.playersNeeded} spot{match.playersNeeded !== 1 ? 's' : ''} open
                    </span>
                  )}

                </div>
              </div>

            </button>
          )
        })}
      </div>
    </div>
  )
}
