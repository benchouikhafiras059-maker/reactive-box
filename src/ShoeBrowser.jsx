// ─────────────────────────────────────────────────────────
// ShoeBrowser — the PUMA Shoe Select Screen.
//
// Assignment state machine role:
//   READS:  shoes (filtered + sorted, from App)
//           selectedShoeId (which tile to highlight)
//   WRITES: fires onSelectShoe(id) UP to App on click
//
// ── HOVER vs. SELECTION ───────────────────────────────────
// HOVER  → pure CSS only. Scale + brightness + shadow.
//          Zero React state is touched. The browser engine
//          handles this entirely via :hover selectors.
//
// CLICK  → fires onSelectShoe(id) up to App.jsx.
//          App updates selectedShoeId in shared state.
//          The new id flows back DOWN as a prop.
//          This component re-renders → --selected applied.
//          ShoeDetail also re-renders via its own props.
//
// No child component stores selection. App is the owner.
// ─────────────────────────────────────────────────────────

// Visual identity per category
const CAT_STYLE = {
  Motorsport: { color: '#AF1E2D', bg: 'linear-gradient(145deg,#2a0508 0%,#1a0305 100%)', label: 'MOTO' },
  Lifestyle:  { color: '#C8C9C7', bg: 'linear-gradient(145deg,#1c1c1c 0%,#111 100%)',    label: 'LIFE' },
  Basketball: { color: '#97999B', bg: 'linear-gradient(145deg,#081428 0%,#040a18 100%)', label: 'BBALL' },
  Running:    { color: '#1A5C2E', bg: 'linear-gradient(145deg,#0e3319 0%,#061008 100%)', label: 'RUN' },
}

// Group an array of shoes by their category, preserving order
function groupByCategory(shoes) {
  const order = ['Motorsport', 'Lifestyle', 'Basketball', 'Running']
  const map = {}
  shoes.forEach(s => {
    if (!map[s.category]) map[s.category] = []
    map[s.category].push(s)
  })
  return order.filter(cat => map[cat]).map(cat => ({ category: cat, shoes: map[cat] }))
}

export default function ShoeBrowser({ shoes, selectedShoeId, onSelectShoe }) {
  const groups = groupByCategory(shoes)

  return (
    <div className="select-screen">

      {/* ── Screen title ── */}
      <div className="select-title">
        <span className="select-title__brand">PUMA</span>
        <h1 className="select-title__heading">SHOE SELECT</h1>
        <span className="select-title__count">{shoes.length} models available</span>
      </div>

      {/* ── No results ── */}
      {shoes.length === 0 && (
        <p className="select-empty">No shoes match this filter.</p>
      )}

      {/* ── Category groups ───────────────────────────────
          Shoes are grouped by category and rendered as
          separate rows — like a character roster grouped
          by class or faction. The grouping is derived from
          the props passed down from App, not stored here.
      ─────────────────────────────────────────────────── */}
      <div className="select-groups">
        {groups.map(({ category, shoes: catShoes }) => {
          const style = CAT_STYLE[category] || CAT_STYLE.Lifestyle

          return (
            <div key={category} className="shoe-group">

              {/* Group header */}
              <div className="shoe-group__header">
                <span className="shoe-group__tag" style={{ color: style.color }}>
                  {style.label}
                </span>
                <span className="shoe-group__name">{category}</span>
                <span className="shoe-group__divider" />
                <span className="shoe-group__count">{catShoes.length}</span>
              </div>

              {/* Tile row */}
              <div className="shoe-group__row">
                {catShoes.map(shoe => {
                  const isSelected = shoe.id === selectedShoeId
                  return (
                    <button
                      key={shoe.id}
                      className={`shoe-chip ${isSelected ? 'shoe-chip--selected' : ''}`}
                      style={{ '--cat-color': style.color, '--cat-bg': style.bg }}
                      onClick={() => onSelectShoe(shoe.id)}
                      aria-pressed={isSelected}
                    >
                      {/* ── Visual area ─────────────────────────────
                          HOVER: scale + brightness via CSS only.
                          No state. The :hover selector handles this.
                          CLICK: calls onSelectShoe(id) → goes to App.
                      ─────────────────────────────────────────────── */}
                      <div className="shoe-chip__visual">
                        {/* Shoe name as large display type — the portrait */}
                        <div className="shoe-chip__portrait">
                          {shoe.name.split(' ').slice(0, 1).join(' ')}
                        </div>
                        <div className="shoe-chip__portrait-sub">
                          {shoe.name.split(' ').slice(1).join(' ')}
                        </div>
                        {/* Selected glow overlay */}
                        {isSelected && <div className="shoe-chip__glow" />}
                      </div>

                      {/* Chip footer */}
                      <div className="shoe-chip__footer">
                        <span className="shoe-chip__name">{shoe.name}</span>
                        <span className="shoe-chip__price">${shoe.price}</span>
                      </div>

                      {/* Selected indicator dot */}
                      {isSelected && <span className="shoe-chip__dot" />}
                    </button>
                  )
                })}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
