// ─────────────────────────────────────────────────────────
// ShoeController — the filter and sort panel.
//
// READS:  filterCategory, sortBy (current values from App)
// WRITES: fires onFilterChange, onSortChange, onReset up
//         to App when the user interacts
//
// This component does NOT update state itself. It reports
// user actions upward. App decides what changes.
// ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Basketball', label: 'Basketball' },
  { value: 'Running', label: 'Running' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Low → High' },
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

      <div className="controller__brand">
        <span className="controller__brand-name">PUMA</span>
        <span className="controller__brand-sub">Explorer</span>
      </div>

      {/* ── Category ── */}
      <div className="controller__section">
        <span className="controller__section-label">Category</span>
        <div className="controller__filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${filterCategory === cat.value ? 'filter-btn--active' : ''}`}
              onClick={() => onFilterChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort ── */}
      <div className="controller__section">
        <span className="controller__section-label">Sort</span>
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
        Reset All
      </button>

      {/* ── Assignment architecture note ── */}
      <div className="controller__note">
        <p>State lives in App.jsx. Filters pass changes up via callbacks.</p>
      </div>

    </div>
  )
}
