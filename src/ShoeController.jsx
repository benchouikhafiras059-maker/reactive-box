// ─────────────────────────────────────────────────────────
// ShoeController — filter and sort panel.
//
// READS:  filterCategory, sortBy from App (via props)
// WRITES: fires callbacks up to App on interaction
//
// This component never updates state itself. It reports
// user actions upward. App.jsx is the decision-maker.
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
  filterCategory, sortBy,
  onFilterChange, onSortChange, onReset,
}) {
  return (
    <div className="ctrl">

      <div className="ctrl__brand">
        <span className="ctrl__brand-name">PUMA</span>
        <span className="ctrl__brand-sub">Shoe Explorer</span>
      </div>

      <div className="ctrl__group">
        <span className="ctrl__group-label">Category</span>
        <div className="ctrl__options">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              className={`ctrl-btn ${filterCategory === c.value ? 'ctrl-btn--on' : ''}`}
              onClick={() => onFilterChange(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl__group">
        <span className="ctrl__group-label">Sort</span>
        <div className="ctrl__options">
          {SORT_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`ctrl-btn ${sortBy === o.value ? 'ctrl-btn--on' : ''}`}
              onClick={() => onSortChange(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <button className="ctrl-reset" onClick={onReset}>Reset</button>

      <div className="ctrl__note">
        <p>State lives in App.jsx<br />Props down · Events up</p>
      </div>

    </div>
  )
}
