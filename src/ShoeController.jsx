// ─────────────────────────────────────────────────────────
// ShoeController — filter and sort panel.
//
// Assignment state machine role:
//   READS:  filterCategory, sortBy (from App via props)
//   WRITES: fires callbacks UP to App on every interaction
//
// This component never calls setState. It reports user
// actions upward. App.jsx decides what changes.
// ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'all',        label: 'All Models' },
  { value: 'Motorsport', label: 'Motorsport'  },
  { value: 'Lifestyle',  label: 'Lifestyle'   },
  { value: 'Basketball', label: 'Basketball'  },
  { value: 'Running',    label: 'Running'     },
]

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'       },
  { value: 'price-asc',  label: 'Price ↑ Low'    },
  { value: 'price-desc', label: 'Price ↓ High'   },
]

export default function ShoeController({
  filterCategory, sortBy,
  onFilterChange, onSortChange, onReset,
}) {
  return (
    <div className="ctrl">

      {/* Brand mark */}
      <div className="ctrl__brand">
        <span className="ctrl__brand-name">PUMA</span>
        <span className="ctrl__brand-sub">Select</span>
      </div>

      {/* Category */}
      <div className="ctrl__section">
        <span className="ctrl__section-label">Category</span>
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

      {/* Sort */}
      <div className="ctrl__section">
        <span className="ctrl__section-label">Sort</span>
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

      <button className="ctrl-reset" onClick={onReset}>
        ↺ Reset
      </button>

      <div className="ctrl__note">
        <p>State → App.jsx<br />Props ↓ · Events ↑</p>
      </div>

    </div>
  )
}
