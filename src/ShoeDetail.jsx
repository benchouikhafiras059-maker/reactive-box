// ─────────────────────────────────────────────────────────
// ShoeDetail — editorial product information panel.
//
// READS:  selectedShoe (full shoe object, resolved in App)
// WRITES: nothing — purely read-only.
//
// When a shoe is clicked in ShoeBrowser, the event goes
// UP to App.jsx, which updates selectedShoeId in state.
// App resolves the full shoe object and passes it DOWN
// here as selectedShoe. This component re-renders because
// its props changed — it never manages selection itself.
// ─────────────────────────────────────────────────────────

const DETAIL_THEME = {
  Lifestyle:   { gradient: 'linear-gradient(160deg, #200508 0%, #0a0202 100%)', accent: '#AF1E2D' },  // PUMA Red
  Basketball:  { gradient: 'linear-gradient(160deg, #040c1e 0%, #020408 100%)', accent: '#97999B' },  // Cool Gray 7C
  Running:     { gradient: 'linear-gradient(160deg, #061206 0%, #020402 100%)', accent: '#1A5C2E' },  // PUMA Green
}

export default function ShoeDetail({ selectedShoe }) {
  if (!selectedShoe) {
    return (
      <div className="detail detail--empty">
        <p>Select a shoe to view details.</p>
      </div>
    )
  }

  const theme = DETAIL_THEME[selectedShoe.category] || DETAIL_THEME.Lifestyle

  return (
    <div className="detail">

      {/* ── Hero ── */}
      <div className="detail__hero" style={{ background: theme.gradient }}>
        <div className="detail__hero-inner">
          <span
            className="detail__hero-category"
            style={{ color: theme.accent }}
          >
            {selectedShoe.category} · {selectedShoe.sport}
          </span>
          <h2 className="detail__hero-name">{selectedShoe.name}</h2>
          <span className="detail__hero-price">${selectedShoe.price}</span>
        </div>
        {/* Diagonal accent line */}
        <div className="detail__hero-line" style={{ background: theme.accent }} />
      </div>

      {/* ── Editorial content ── */}
      <div className="detail__content">

        <p className="detail__mood">"{selectedShoe.mood}"</p>

        <div className="detail__rule" />

        <div className="detail__row-pair">
          <div className="detail__field">
            <span className="detail__label">Colorway</span>
            <span className="detail__value">{selectedShoe.colorway}</span>
          </div>
          <div className="detail__field">
            <span className="detail__label">Sport</span>
            <span className="detail__value">{selectedShoe.sport}</span>
          </div>
        </div>

        <div className="detail__rule" />

        <div className="detail__field">
          <span className="detail__label">Features</span>
          <ul className="detail__features">
            {selectedShoe.features.map((f, i) => (
              <li key={i} style={{ '--accent': theme.accent }}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="detail__rule" />

        <div className="detail__field">
          <span className="detail__label">Made for</span>
          <p className="detail__audience">{selectedShoe.audience}</p>
        </div>

      </div>
    </div>
  )
}
