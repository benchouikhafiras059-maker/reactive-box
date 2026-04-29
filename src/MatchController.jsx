// ─────────────────────────────────────────────────────────
// MatchController — LEFT PANEL
//
// READ:  all filter values, activeView, communityFilter, user — from App
// WRITE: fires filter callbacks, view switch, settings open — up to App
//
// No internal state. All values owned by App.jsx.
//
// Structure:
//   [View toggle — Matches / Community]
//   [Filter section — changes based on activeView]
//   [Profile strip — sticky at bottom]
// ─────────────────────────────────────────────────────────

const MATCH_LEVELS    = ['all', '3.0', '3.5', '4.0', '4.5', '5.0']
const DISTANCES       = [
  { value: 'any', label: 'Any' },
  { value: '1',   label: '≤ 1 mi' },
  { value: '3',   label: '≤ 3 mi' },
  { value: '5',   label: '≤ 5 mi' },
  { value: '10',  label: '≤ 10 mi' },
]
const MATCH_TYPES     = ['all', 'Singles', 'Doubles', 'Mixed', 'Practice']
const TIMES           = [
  { value: 'any',          label: 'Any time' },
  { value: 'Today',        label: 'Today' },
  { value: 'Tonight',      label: 'Tonight' },
  { value: 'Tomorrow',     label: 'Tomorrow' },
  { value: 'This Weekend', label: 'This Weekend' },
]
const COMMUNITY_CATS  = [
  { value: 'all',              label: 'All Posts' },
  { value: 'Hitting Requests', label: 'Hitting Requests' },
  { value: 'Doubles',          label: 'Doubles' },
  { value: 'Tournament',       label: 'Tournament' },
  { value: 'SCAD',             label: 'SCAD' },
]

export default function MatchController({
  // Match filters
  filterLevel, filterDistance, filterType, filterTime, searchQuery, isFiltered,
  onFilterLevel, onFilterDistance, onFilterType, onFilterTime, onSearch, onReset,
  // View / community
  activeView, onSetActiveView, communityFilter, onCommunityFilter,
  // Profile / settings
  user, onOpenSettings,
}) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    // ctrl-wrap makes the profile strip sticky at the bottom
    <div className="ctrl-wrap">

      {/* ── Scrollable filter area ── */}
      <div className="controller">

        {/* View toggle — fires onSetActiveView up to App.
            App updates activeView → Browser + Detail swap content via props. */}
        <div className="view-toggle">
          <button
            className={`view-toggle__btn${activeView === 'matches' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => onSetActiveView('matches')}
          >
            🎾 Matches
          </button>
          <button
            className={`view-toggle__btn${activeView === 'community' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => onSetActiveView('community')}
          >
            👥 Community
          </button>
        </div>

        <div className="controller__divider" />

        {/* ── Match filters (shown when activeView = 'matches') ── */}
        {activeView === 'matches' && (
          <>
            {/* Search */}
            <div className="controller__section">
              <label className="controller__label" htmlFor="search">Search</label>
              <div className="search-wrap">
                <span className="search-wrap__icon">🔍</span>
                <input
                  id="search"
                  className="search-input"
                  type="text"
                  placeholder="Title, location, host..."
                  value={searchQuery}
                  onChange={e => onSearch(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear">✕</button>
                )}
              </div>
            </div>

            <div className="controller__divider" />

            <div className="controller__section">
              <div className="controller__label">NTRP Level</div>
              <div className="controller__pills">
                {MATCH_LEVELS.map(l => (
                  <button
                    key={l}
                    className={`pill${filterLevel === l ? ' pill--active' : ''}`}
                    onClick={() => onFilterLevel(l)}
                  >
                    {l === 'all' ? 'All levels' : l}
                  </button>
                ))}
              </div>
            </div>

            <div className="controller__divider" />

            <div className="controller__section">
              <div className="controller__label">Distance</div>
              <div className="controller__pills">
                {DISTANCES.map(d => (
                  <button
                    key={d.value}
                    className={`pill${filterDistance === d.value ? ' pill--active' : ''}`}
                    onClick={() => onFilterDistance(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="controller__divider" />

            <div className="controller__section">
              <div className="controller__label">Match Type</div>
              <div className="controller__pills">
                {MATCH_TYPES.map(t => (
                  <button
                    key={t}
                    className={`pill${filterType === t ? ' pill--active' : ''}`}
                    onClick={() => onFilterType(t)}
                  >
                    {t === 'all' ? 'All types' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="controller__divider" />

            <div className="controller__section">
              <div className="controller__label">When</div>
              <div className="controller__pills">
                {TIMES.map(t => (
                  <button
                    key={t.value}
                    className={`pill${filterTime === t.value ? ' pill--active' : ''}`}
                    onClick={() => onFilterTime(t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {isFiltered && (
              <>
                <div className="controller__divider" />
                <button className="reset-btn" onClick={onReset}>✕ Clear filters</button>
              </>
            )}
          </>
        )}

        {/* ── Community filters (shown when activeView = 'community') ── */}
        {activeView === 'community' && (
          <>
            <div className="controller__section">
              <div className="controller__label">Filter Posts</div>
              <div className="controller__pills">
                {COMMUNITY_CATS.map(c => (
                  <button
                    key={c.value}
                    className={`pill${communityFilter === c.value ? ' pill--active' : ''}`}
                    onClick={() => onCommunityFilter(c.value)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ── Profile strip — sticky at bottom, outside scroll area ──
          Profile data comes from App.jsx user{} state via props.
          onOpenSettings fires up to App → App sets isSettingsOpen = true. */}
      {user?.name && (
        <div className="profile-strip">
          <div className="profile-card">
            <div className="profile-card__avatar">{initials}</div>
            <div className="profile-card__info">
              <span className="profile-card__name">{user.name}</span>
              <span className="profile-card__meta">
                {user.level} · {user.zip}
              </span>
            </div>
            <button
              className="profile-card__settings"
              onClick={onOpenSettings}
              title="Open settings"
              aria-label="Settings"
            >
              ⚙
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
