// ─────────────────────────────────────────────────────────
// ShoeBrowser — the collection panel.
//
// READS:  shoes (filtered + sorted array from App)
//         selectedShoeId (to highlight the active card)
// WRITES: fires onSelectShoe(id) up to App on click
//
// IMPORTANT — state vs. visual interaction:
//   • HOVER is a pure CSS/visual enhancement only.
//     It does not read or write React state.
//     The transform and shadow effects are handled entirely
//     in CSS with :hover selectors.
//
//   • CLICK is the real state interaction. When a user
//     clicks a tile, onSelectShoe(id) fires upward to
//     App.jsx, which updates selectedShoeId in shared state.
//     That change flows back DOWN as a prop, causing the
//     selected tile to re-render with the --selected class,
//     AND causes ShoeDetail to re-render with the new shoe.
//
// This component never manages its own copy of the shoe
// list or the selected shoe — it only renders what it
// receives and reports clicks up to the parent.
// ─────────────────────────────────────────────────────────

// Each category gets a unique gradient palette
const CATEGORY_GRADIENTS = {
  Lifestyle: 'linear-gradient(135deg, #1a1a1a 0%, #3d2b1f 50%, #2a1a0e 100%)',
  Basketball: 'linear-gradient(135deg, #0a0a1a 0%, #1a2a4a 50%, #0d1a33 100%)',
  Running: 'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0a2a0a 100%)',
}

const CATEGORY_ACCENT = {
  Lifestyle: '#c8a882',
  Basketball: '#6ab0f5',
  Running: '#6fcf6f',
}

export default function ShoeBrowser({ shoes, selectedShoeId, onSelectShoe }) {
  if (shoes.length === 0) {
    return (
      <div className="browser-empty">
        <p>No shoes match this filter.</p>
      </div>
    )
  }

  return (
    <div className="browser">
      <div className="browser-header">
        <span className="browser-header__label">Collection</span>
        <span className="browser-header__count">{shoes.length} styles</span>
      </div>

      <div className="browser-grid">
        {shoes.map(shoe => {
          const isSelected = shoe.id === selectedShoeId
          const gradient = CATEGORY_GRADIENTS[shoe.category] || CATEGORY_GRADIENTS.Lifestyle
          const accent = CATEGORY_ACCENT[shoe.category] || '#ffffff'

          return (
            <button
              key={shoe.id}
              className={`shoe-tile ${isSelected ? 'shoe-tile--selected' : ''}`}
              onClick={() => onSelectShoe(shoe.id)}
              aria-pressed={isSelected}
            >
              {/* ── Visual hero area ──────────────────────
                  The scale transform on hover is purely CSS.
                  No state is read or written on hover.
              ─────────────────────────────────────────── */}
              <div className="shoe-tile__visual" style={{ background: gradient }}>
                {/* Large typographic placeholder acting as the shoe hero */}
                <div className="shoe-tile__wordmark" style={{ color: accent }}>
                  {shoe.name.split(' ').map((word, i) => (
                    <span key={i}>{word}</span>
                  ))}
                </div>
                <div className="shoe-tile__sport-tag">{shoe.sport}</div>

                {/* Overlay on selected state */}
                {isSelected && <div className="shoe-tile__selected-overlay" />}
              </div>

              {/* ── Info strip ── */}
              <div className="shoe-tile__info">
                <div className="shoe-tile__meta">
                  <span className="shoe-tile__category">{shoe.category}</span>
                  <span className="shoe-tile__colorway">{shoe.colorway}</span>
                </div>
                <span className="shoe-tile__price">${shoe.price}</span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="shoe-tile__selected-bar" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
