// ─────────────────────────────────────────────────────────
// ShoeDetail — the editorial information panel.
//
// READS:  selectedShoe (full shoe object, resolved in App)
// WRITES: nothing — this component is purely read-only.
//
// IMPORTANT — how this panel updates:
//   When a user clicks a shoe in ShoeBrowser, the click
//   event fires upward to App.jsx, which updates
//   selectedShoeId in shared state. App then looks up the
//   full shoe object and passes it DOWN here as the
//   selectedShoe prop. This panel re-renders automatically
//   because React re-runs it when its props change.
//
//   There is NO local state for the selected shoe here.
//   This is the "single source of truth" pattern — the
//   data lives in App, and this panel just displays it.
// ─────────────────────────────────────────────────────────

const CATEGORY_BG = {
  Lifestyle: 'linear-gradient(160deg, #1a1a1a 0%, #2e1e10 100%)',
  Basketball: 'linear-gradient(160deg, #080818 0%, #0d1a33 100%)',
  Running: 'linear-gradient(160deg, #081008 0%, #0a2a0a 100%)',
}

const CATEGORY_ACCENT = {
  Lifestyle: '#c8a882',
  Basketball: '#6ab0f5',
  Running: '#6fcf6f',
}

export default function ShoeDetail({ selectedShoe }) {
  if (!selectedShoe) {
    return (
      <div className="detail detail--empty">
        <p>Select a shoe to see details.</p>
      </div>
    )
  }

  const heroBg = CATEGORY_BG[selectedShoe.category] || CATEGORY_BG.Lifestyle
  const accentColor = CATEGORY_ACCENT[selectedShoe.category] || '#ffffff'

  return (
    <div className="detail">

      {/* ── Hero area ── */}
      <div className="detail__hero" style={{ background: heroBg }}>
        <span className="detail__hero-category" style={{ color: accentColor }}>
          {selectedShoe.category}
        </span>
        <h2 className="detail__hero-name">{selectedShoe.name}</h2>
        <span className="detail__hero-price">${selectedShoe.price}</span>
      </div>

      {/* ── Content ── */}
      <div className="detail__content">

        <p className="detail__mood">{selectedShoe.mood}</p>

        <div className="detail__divider" />

        <div className="detail__meta-grid">
          <div className="detail__meta-item">
            <span className="detail__label">Sport</span>
            <span className="detail__value">{selectedShoe.sport}</span>
          </div>
          <div className="detail__meta-item">
            <span className="detail__label">Colorway</span>
            <span className="detail__value">{selectedShoe.colorway}</span>
          </div>
        </div>

        <div className="detail__divider" />

        <div className="detail__section">
          <span className="detail__label">Features</span>
          <ul className="detail__features">
            {selectedShoe.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="detail__divider" />

        <div className="detail__section">
          <span className="detail__label">Made for</span>
          <p className="detail__audience">{selectedShoe.audience}</p>
        </div>

      </div>
    </div>
  )
}
