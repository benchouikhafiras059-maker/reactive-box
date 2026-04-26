// ─────────────────────────────────────────────────────────
// ShoeBrowser — the sneaker wall / collection panel.
//
// READS:  shoes (filtered + sorted list, passed from App)
//         selectedShoeId (which tile to highlight)
// WRITES: fires onSelectShoe(id) to App on click
//
// ── HOVER vs. SELECTION ───────────────────────────────────
// HOVER  → purely CSS: transform, scale, shadow, brightness.
//          Zero React state involved. This is a visual-only
//          enhancement so the user feels the interface is
//          physical and responsive.
//
// CLICK  → fires onSelectShoe(id) up to App.jsx.
//          App updates selectedShoeId in shared state.
//          The new selectedShoeId flows back DOWN as a prop,
//          causing this component to re-render and apply
//          the --selected class to the correct tile.
//          ShoeDetail also re-renders because App resolves
//          the full shoe object and passes it down.
//
// No child component stores its own copy of the selection.
// ─────────────────────────────────────────────────────────

// Per-shoe visual identity — gradient, accent, pattern
const SHOE_THEME = {
  'shoe-1': {
    // Speedcat OG — Motorsport heritage. PUMA Red as the hero accent.
    gradient: 'linear-gradient(150deg, #0e0e0e 0%, #200508 55%, #0a0a0a 100%)',
    accent: '#AF1E2D',   // official PUMA Red
    label: 'Motorsport',
    pattern: 'motorsport',
  },
  'shoe-2': {
    // MB.04 — Basketball. Cool Gray 7C as base, deep blue hero.
    gradient: 'linear-gradient(150deg, #04040f 0%, #081428 55%, #050510 100%)',
    accent: '#97999B',   // Cool Gray 7C — neutral contrast on dark
    label: 'Basketball',
    pattern: 'court',
  },
  'shoe-3': {
    // Deviate NITRO 3 — Running. PUMA Green (Sportstyle) as accent.
    gradient: 'linear-gradient(150deg, #040f04 0%, #091a09 55%, #050d05 100%)',
    accent: '#1A5C2E',   // official PUMA Green (Sportstyle)
    label: 'Running',
    pattern: 'speed',
  },
  'shoe-4': {
    // Palermo — Streetwear. Cool Gray 3C — warm and understated.
    gradient: 'linear-gradient(150deg, #0f0d09 0%, #1c170d 55%, #0c0a07 100%)',
    accent: '#C8C9C7',   // Cool Gray 3C
    label: 'Streetwear',
    pattern: 'terrace',
  },
}

// Split shoe name into display lines for large typography
function splitName(name) {
  const parts = name.split(' ')
  if (parts.length === 1) return [name]
  if (parts.length === 2) return parts
  // For 3+ word names keep first word alone
  return [parts[0], parts.slice(1).join(' ')]
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
          const theme = SHOE_THEME[shoe.id] || SHOE_THEME['shoe-1']
          const nameParts = splitName(shoe.name)

          return (
            <button
              key={shoe.id}
              className={`shoe-tile ${isSelected ? 'shoe-tile--selected' : ''}`}
              onClick={() => onSelectShoe(shoe.id)}
              aria-pressed={isSelected}
            >
              {/* ──────────────────────────────────────────
                  VISUAL HERO AREA
                  Hover scale is CSS-only (see App.css).
                  The gradient and accent are unique per shoe.
              ────────────────────────────────────────── */}
              <div
                className="shoe-tile__visual"
                style={{ background: theme.gradient }}
                data-pattern={theme.pattern}
              >
                {/* Subtle texture overlay — CSS handled */}
                <div className="shoe-tile__texture" data-pattern={theme.pattern} />

                {/* Category pill */}
                <span
                  className="shoe-tile__badge"
                  style={{ color: theme.accent, borderColor: theme.accent + '40' }}
                >
                  {shoe.category}
                </span>

                {/* Large display name — the shoe IS the visual */}
                <div className="shoe-tile__name-display">
                  {nameParts.map((part, i) => (
                    <span
                      key={i}
                      className={i === 0 ? 'shoe-tile__name-main' : 'shoe-tile__name-sub'}
                      style={i === 0 ? { color: theme.accent } : {}}
                    >
                      {part}
                    </span>
                  ))}
                </div>

                {/* Sport tag — bottom left */}
                <span className="shoe-tile__sport">{theme.label}</span>

                {/* Price — bottom right */}
                <span className="shoe-tile__price-overlay">${shoe.price}</span>

                {/* Selected tint overlay */}
                {isSelected && <div className="shoe-tile__selected-tint" />}
              </div>

              {/* ── Bottom info strip ── */}
              <div className="shoe-tile__strip">
                <div className="shoe-tile__strip-info">
                  <span className="shoe-tile__strip-name">{shoe.name}</span>
                  <span className="shoe-tile__strip-colorway">{shoe.colorway}</span>
                </div>
                <span
                  className="shoe-tile__strip-arrow"
                  style={isSelected ? { color: 'var(--red)' } : {}}
                >
                  {isSelected ? '●' : '→'}
                </span>
              </div>

              {/* Red bottom bar — only on selected */}
              {isSelected && <div className="shoe-tile__selected-bar" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
