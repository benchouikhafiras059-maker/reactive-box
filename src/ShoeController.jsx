// ─────────────────────────────────────────────────────────
// ShoeController — filter and sort panel.
//
// READS:  filterCategory, sortBy from App (via props)
// WRITES: fires callbacks up to App on every interaction
//
// App is the decision-maker. This component only reports
// what the user did. It never updates state directly.
// ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'all',        label: 'All' },
  { value: 'Lifestyle',  label: 'Lifestyle' },
  { value: 'Basketball', label: 'Basketball' },
  { value: 'Running',    label: 'Running' },
]

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Low → High' },
  { value: 'price-desc', label: 'High → Low' },
]

export default function ShoeController({
  filterCategory,
  sortBy,
  onFilterChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="controller">

      {/* Brand lockup */}
      <div className="controller__brand">
        <span className="controller__brand-name">PUMA</span>
        <span className="controller__brand-sub">Shoe Explorer</span>
      </div>

      {/* Category */}
      <div className="controller__group">
        <span className="controller__group-label">Category</span>
        <div className="controller__options">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`ctrl-btn ${filterCategory === cat.value ? 'ctrl-btn--active' : ''}`}
              onClick={() => onFilterChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="controller__group">
        <span className="controller__group-label">Sort by</span>
        <div className="controller__options">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`ctrl-btn ${sortBy === opt.value ? 'ctrl-btn--active' : ''}`}
              onClick={() => onSortChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button className="ctrl-reset" onClick={onReset}>
        Reset
      </button>

      {/* State architecture note */}
      <div className="controller__note">
        <p>State lives in App.jsx.<br />Props down · Events up.</p>
      </div>

    </div>
  )
}
