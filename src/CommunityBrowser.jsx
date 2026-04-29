// ─────────────────────────────────────────────────────────
// CommunityBrowser — CENTER PANEL (community mode)
//
// READ:  posts (pre-filtered by App), selectedPostId
// WRITE: fires onSelectPost(id) up to App on click
//
// No internal state. Same pattern as MatchBrowser:
// renders exactly what it receives, fires events up.
// ─────────────────────────────────────────────────────────

const CATEGORY_STYLE = {
  'Hitting Requests': { bg: '#F0FDF4', color: '#16A34A' },
  'Doubles':          { bg: '#EFF6FF', color: '#2563EB' },
  'Tournament':       { bg: '#FDF4FF', color: '#7C3AED' },
  'SCAD':             { bg: '#FFF7ED', color: '#C2410C' },
}

export default function CommunityBrowser({ posts, selectedPostId, onSelectPost }) {
  return (
    <div className="browser">

      <div className="browser__header">
        <h2 className="browser__title">Community</h2>
        <span className="browser__count">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
      </div>

      {posts.length === 0 && (
        <div className="browser__empty">
          <span className="browser__empty-icon">💬</span>
          <p className="browser__empty-title">No posts yet</p>
          <p className="browser__empty-sub">Try a different filter.</p>
        </div>
      )}

      <div className="browser__list">
        {posts.map(post => {
          const catSt    = CATEGORY_STYLE[post.category] || {}
          const selected = post.id === selectedPostId

          return (
            // Click fires onSelectPost(id) UP to App.
            // App updates selectedPostId → CommunityDetail re-renders via props.
            <button
              key={post.id}
              className={`match-card comm-card${selected ? ' match-card--selected' : ''}`}
              onClick={() => onSelectPost(post.id)}
              aria-pressed={selected}
            >
              <div className="match-card__top-row">
                <span
                  className="match-card__level"
                  style={{ background: catSt.bg, color: catSt.color }}
                >
                  {post.category}
                </span>
                <span className="comm-card__level-badge">{post.level} NTRP</span>
              </div>

              <p className="comm-card__message">{post.message}</p>

              <div className="match-card__meta">
                <span className="match-card__meta-item">👤 {post.author}</span>
                <span className="match-card__meta-item">📍 {post.location}</span>
                <span className="match-card__meta-item">🕐 {post.time}</span>
              </div>

              <div className="match-card__footer">
                <span className="match-card__distance" />
                <span className="comm-card__replies">
                  💬 {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
