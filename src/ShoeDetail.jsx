// ─────────────────────────────────────────────────────────
// ShoeDetail — editorial product information panel.
//
// READS:  selectedShoe (full object resolved in App.jsx)
// WRITES: nothing — read-only. No local state.
//
// This panel re-renders because App.jsx passes a new
// selectedShoe prop whenever selectedShoeId changes.
// It does not manage selection — it only displays.
// ─────────────────────────────────────────────────────────

const THEME = {
  Lifestyle:  { gradient: 'linear-gradient(160deg, #AF1E2D 0%, #2a0508 100%)', accent: '#AF1E2D' },
  Basketball: { gradient: 'linear-gradient(160deg, #0a1628 0%, #07101e 100%)', accent: '#97999B' },
  Running:    { gradient: 'linear-gradient(160deg, #1A5C2E 0%, #081508 100%)', accent: '#1A5C2E' },
}

export default function ShoeDetail({ selectedShoe }) {
  if (!selectedShoe) {
    return (
      <div className="detail detail--empty">
        <p>Select a shoe to view details.</p>
      </div>
    )
  }

  const theme = THEME[selectedShoe.category] || THEME.Lifestyle

  return (
    <div className="detail">

      {/* ── Hero ── */}
      <div className="detail__hero" style={{ background: theme.gradient }}>
        <div className="detail__hero-body">
          <span className="detail__hero-cat" style={{ color: theme.accent }}>
            {selectedShoe.category} · {selectedShoe.sport}
          </span>
          <h2 className="detail__hero-name">{selectedShoe.name}</h2>
          <span className="detail__hero-price">${selectedShoe.price}</span>
        </div>
        <div className="detail__hero-accent" style={{ background: theme.accent }} />
      </div>

      {/* ── Content ── */}
      <div className="detail__body">

        <p className="detail__mood">"{selectedShoe.mood}"</p>

        <hr className="detail__rule" />

        <div className="detail__row2">
          <div className="detail__field">
            <span className="detail__label">Colorway</span>
            <span className="detail__val">{selectedShoe.colorway}</span>
          </div>
          <div className="detail__field">
            <span className="detail__label">Sport</span>
            <span className="detail__val">{selectedShoe.sport}</span>
          </div>
        </div>

        <hr className="detail__rule" />

        <div className="detail__field">
          <span className="detail__label">Features</span>
          <ul className="detail__features">
            {selectedShoe.features.map((f, i) => (
              <li key={i} style={{ '--acc': theme.accent }}>{f}</li>
            ))}
          </ul>
        </div>

        <hr className="detail__rule" />

        <div className="detail__field">
          <span className="detail__label">Made for</span>
          <p className="detail__audience">{selectedShoe.audience}</p>
        </div>

      </div>
    </div>
  )
}
