// ─────────────────────────────────────────────────────────
// ShoeDetail — the information panel.
//
// READS:  selectedShoe (full shoe object, resolved in App)
// WRITES: nothing — this component is purely read-only.
//
// It updates automatically when selectedShoe changes
// because App passes a new object as a prop. No local
// state needed or used here.
// ─────────────────────────────────────────────────────────

export default function ShoeDetail({ selectedShoe }) {
  if (!selectedShoe) {
    return (
      <div className="detail detail--empty">
        <p>Select a shoe to see details.</p>
      </div>
    )
  }

  return (
    <div className="detail">
      <h2 className="panel-label">Details</h2>

      {/* Color swatch — visual stand-in for product hero image */}
      <div className="detail__hero" data-category={selectedShoe.category} />

      <div className="detail__content">
        <div className="detail__header">
          <span className="detail__category">{selectedShoe.category}</span>
          <h3 className="detail__name">{selectedShoe.name}</h3>
          <span className="detail__price">${selectedShoe.price}</span>
        </div>

        <div className="detail__row">
          <span className="detail__label">Sport</span>
          <span className="detail__value">{selectedShoe.sport}</span>
        </div>

        <div className="detail__row">
          <span className="detail__label">Colorway</span>
          <span className="detail__value">{selectedShoe.colorway}</span>
        </div>

        <div className="detail__row">
          <span className="detail__label">Positioning</span>
          <span className="detail__value detail__value--mood">{selectedShoe.mood}</span>
        </div>

        <div className="detail__section">
          <span className="detail__label">Features</span>
          <ul className="detail__features">
            {selectedShoe.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="detail__section">
          <span className="detail__label">Audience</span>
          <p className="detail__value">{selectedShoe.audience}</p>
        </div>
      </div>
    </div>
  )
}
