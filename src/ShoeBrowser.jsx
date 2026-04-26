// ─────────────────────────────────────────────────────────
// ShoeBrowser — the floating product constellation.
//
// READS:  shoes (filtered + sorted list from App)
//         selectedShoeId (which tile is selected)
// WRITES: fires onSelectShoe(id) up to App on click
//
// ── HOVER vs. SELECTION ───────────────────────────────────
// HOVER  → pure CSS only. transform scale + shadow.
//          Zero React state is read or written.
//          The browser paints this with :hover selectors.
//
// CLICK  → fires onSelectShoe(id) up to App.jsx.
//          App updates selectedShoeId in shared state.
//          The new id flows back DOWN as a prop.
//          This component re-renders, applying --selected
//          to the right tile. ShoeDetail also re-renders
//          because App passes it the resolved shoe object.
//
// No child manages its own copy of the selection.
// ─────────────────────────────────────────────────────────

// Per-shoe visual identity — each tile has its own gradient + accent
const SHOE_STYLE = {
  'shoe-1': {
    gradient: 'linear-gradient(145deg, #AF1E2D 0%, #6b0d15 60%, #1a0305 100%)',
    accent: '#AF1E2D',
    label: 'Motorsport',
    tag: 'Heritage',
  },
  'shoe-2': {
    gradient: 'linear-gradient(145deg, #0a1628 0%, #1a2840 60%, #070e1c 100%)',
    accent: '#97999B',
    label: 'Basketball',
    tag: 'Performance',
  },
  'shoe-3': {
    gradient: 'linear-gradient(145deg, #1A5C2E 0%, #0e3319 60%, #050f08 100%)',
    accent: '#1A5C2E',
    label: 'Running',
    tag: 'NITRO',
  },
  'shoe-4': {
    gradient: 'linear-gradient(145deg, #1c1c1c 0%, #2a2010 60%, #0f0f0f 100%)',
    accent: '#C8C9C7',
    label: 'Streetwear',
    tag: 'Terrace',
  },
}

export default function ShoeBrowser({ shoes, selectedShoeId, onSelectShoe }) {
  // Find selected shoe name for the headline (computed from props — not stored as state)
  const activeName = shoes.find(s => s.id === selectedShoeId)?.name || 'Footwear'

  if (shoes.length === 0) {
    return (
      <div className="browser-empty">
        <p>No shoes match this filter.</p>
      </div>
    )
  }

  return (
    <div className="browser">

      {/* ── Stage headline ── */}
      <div className="browser-headline">
        <span className="browser-headline__eyebrow">Explore PUMA</span>
        <h1 className="browser-headline__name">{activeName}</h1>
        <span className="browser-headline__count">{shoes.length} styles</span>
      </div>

      {/* ── Constellation grid ────────────────────────────
          Tiles stagger vertically on even positions to
          create an organic, non-grid-like layout.
          Hover zoom is CSS-only. Click drives state.
      ─────────────────────────────────────────────────── */}
      <div className="browser-constellation">
        {shoes.map((shoe, index) => {
          const isSelected = shoe.id === selectedShoeId
          const style = SHOE_STYLE[shoe.id] || SHOE_STYLE['shoe-1']

          return (
            <button
              key={shoe.id}
              className={`shoe-tile ${isSelected ? 'shoe-tile--selected' : ''}`}
              style={{ '--tile-accent': style.accent }}
              onClick={() => onSelectShoe(shoe.id)}
              aria-pressed={isSelected}
              data-index={index}
            >
              {/* ── Visual hero ───────────────────────────
                  The zoom on hover is CSS transform only.
                  No React state is involved in hover.
              ─────────────────────────────────────────── */}
              <div
                className="shoe-tile__visual"
                style={{ background: style.gradient }}
              >
                {/* Category tag */}
                <span className="shoe-tile__tag">{style.tag}</span>

                {/* Hero shoe name — huge condensed display type */}
                <div className="shoe-tile__name-block">
                  {shoe.name.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className={i === 0 ? 'shoe-tile__name-large' : 'shoe-tile__name-small'}
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {/* Price — top right */}
                <span className="shoe-tile__price-badge">${shoe.price}</span>

                {/* Selected shimmer overlay */}
                {isSelected && <div className="shoe-tile__selected-overlay" />}
              </div>

              {/* ── Info strip ── */}
              <div className="shoe-tile__info">
                <div>
                  <p className="shoe-tile__info-category">{shoe.category} · {style.label}</p>
                  <p className="shoe-tile__info-name">{shoe.name}</p>
                  <p className="shoe-tile__info-colorway">{shoe.colorway}</p>
                </div>
                <span className="shoe-tile__info-arrow">
                  {isSelected ? '●' : '→'}
                </span>
              </div>

              {/* Selected bottom bar */}
              {isSelected && <div className="shoe-tile__bar" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
