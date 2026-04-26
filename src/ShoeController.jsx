// ─────────────────────────────────────────────────────────
// ShoeController — the filter and sort panel.
//
// READS:  filterCategory, sortBy (current state from App)
// WRITES: fires onFilterChange, onSortChange, onReset up
//         to App when the user takes action
//
// This component does NOT update state itself. It reports
// what the user did and App decides what changes.
// ─────────────────────────────────────────────────────────

const CATEGORIES = ['all', 'Lifestyle', 'Basketball', 'Running']

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
      <h2 className="panel-label">Filter</h2>

      {/* ── Category filter ── */}
      <div className="controller__section">
        <span className="controller__section-label">Category</span>
        <div className="controller__filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => onFilterChange(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort ── */}
      <div className="controller__section">
        <span className="controller__section-label">Sort by</span>
        <div className="controller__filters">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`filter-btn ${sortBy === opt.value ? 'filter-btn--active' : ''}`}
              onClick={() => onSortChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reset ── */}
      <button className="reset-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
