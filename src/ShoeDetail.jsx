// ─────────────────────────────────────────────────────────
// ShoeDetail — the selected shoe's stat card.
//
// Assignment state machine role:
//   READS:  selectedShoe (full object, resolved in App)
//   WRITES: nothing — purely read-only display.
//
// This panel re-renders automatically when selectedShoe
// changes because App passes a new object as a prop.
// It does not manage selection — App does.
// ─────────────────────────────────────────────────────────

const CAT_THEME = {
  Motorsport: { accent: '#AF1E2D', bg: 'linear-gradient(160deg,#2a0508 0%,#0a0202 100%)' },
  Lifestyle:  { accent: '#C8C9C7', bg: 'linear-gradient(160deg,#1c1c1c 0%,#0a0a0a 100%)' },
  Basketball: { accent: '#97999B', bg: 'linear-gradient(160deg,#081428 0%,#030810 100%)' },
  Running:    { accent: '#1A5C2E', bg: 'linear-gradient(160deg,#0e3319 0%,#040c06 100%)' },
}

export default function ShoeDetail({ selectedShoe }) {
  if (!selectedShoe) {
    return (
      <div className="detail detail--empty">
        <div className="detail__empty-icon">▶</div>
        <p>Select a shoe to load stats</p>
      </div>
    )
  }

  const theme = CAT_THEME[selectedShoe.category] || CAT_THEME.Lifestyle

  return (
    <div className="detail">

      {/* ── Hero portrait ── */}
      <div className="detail__hero" style={{ background: theme.bg }}>
        <div className="detail__hero-portrait">
          {selectedShoe.name.split(' ').slice(0, 1)}
        </div>
        <div className="detail__hero-overlay">
          <span className="detail__hero-cat" style={{ color: theme.accent }}>
            {selectedShoe.category}
          </span>
          <h2 className="detail__hero-name">{selectedShoe.name}</h2>
          <span className="detail__hero-price">${selectedShoe.price}</span>
        </div>
        {/* Category accent edge */}
        <div className="detail__hero-edge" style={{ background: theme.accent }} />
      </div>

      {/* ── Stat block ── */}
      <div className="detail__stats">

        <div className="detail__stat-row">
          <span className="detail__stat-label">Sport</span>
          <span className="detail__stat-val">{selectedShoe.sport}</span>
        </div>
        <div className="detail__stat-row">
          <span className="detail__stat-label">Colorway</span>
          <span className="detail__stat-val">{selectedShoe.colorway}</span>
        </div>

        <div className="detail__divider" />

        <p className="detail__positioning">"{selectedShoe.mood}"</p>

        <div className="detail__divider" />

        <div className="detail__section">
          <span className="detail__section-label">Key Tech</span>
          <ul className="detail__features">
            {selectedShoe.features.map((f, i) => (
              <li key={i} style={{ '--ac': theme.accent }}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="detail__divider" />

        <div className="detail__section">
          <span className="detail__section-label">Made For</span>
          <p className="detail__audience">{selectedShoe.audience}</p>
        </div>

      </div>
    </div>
  )
}
