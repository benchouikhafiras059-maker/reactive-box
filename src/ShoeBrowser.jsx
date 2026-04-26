// ─────────────────────────────────────────────────────────
// ShoeBrowser — the collection panel.
//
// READS:  shoes (filtered + sorted array from App)
//         selectedShoeId (to highlight the active card)
// WRITES: fires onSelectShoe(id) up to App on click
//
// This component does NOT manage its own list or selection.
// It only renders what it receives and reports clicks up.
// ─────────────────────────────────────────────────────────

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
      <h2 className="panel-label">Collection</h2>
      <div className="browser-grid">
        {shoes.map(shoe => {
          const isSelected = shoe.id === selectedShoeId

          return (
            <button
              key={shoe.id}
              className={`shoe-card ${isSelected ? 'shoe-card--selected' : ''}`}
              onClick={() => onSelectShoe(shoe.id)}
              aria-pressed={isSelected}
            >
              {/* Color swatch — visual stand-in for shoe image */}
              <div className="shoe-card__swatch" data-category={shoe.category} />

              <div className="shoe-card__body">
                <span className="shoe-card__category">{shoe.category}</span>
                <h3 className="shoe-card__name">{shoe.name}</h3>
                <div className="shoe-card__footer">
                  <span className="shoe-card__colorway">{shoe.colorway}</span>
                  <span className="shoe-card__price">${shoe.price}</span>
                </div>
              </div>

              {isSelected && <span className="shoe-card__selected-badge">Selected</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
