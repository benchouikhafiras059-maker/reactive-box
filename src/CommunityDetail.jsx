// ─────────────────────────────────────────────────────────
// CommunityDetail — RIGHT PANEL (community mode)
//
// READ:  selectedPost (full object resolved in App)
// WRITE: fires onAddReply(postId, replyText) up to App
//
// replyInput is local form state — the saved replies live
// in App.jsx state (post.replies[]). Same pattern as
// MatchDetail's note input: local while typing, fires up on save.
// ─────────────────────────────────────────────────────────

import { useState } from 'react'

const CATEGORY_STYLE = {
  'Hitting Requests': { bg: '#F0FDF4', color: '#16A34A' },
  'Doubles':          { bg: '#EFF6FF', color: '#2563EB' },
  'Tournament':       { bg: '#FDF4FF', color: '#7C3AED' },
  'SCAD':             { bg: '#FFF7ED', color: '#C2410C' },
}

// ── Inner content — key trick resets state + fades on post change ──
function PostContent({ post, onAddReply }) {
  // Local form state only — replies live in App.jsx (post.replies)
  const [replyInput, setReplyInput] = useState('')

  const catSt = CATEGORY_STYLE[post.category] || {}

  const handleReply = () => {
    if (!replyInput.trim()) return
    // Fires UP to App — App appends to post.replies[] → all panels re-render via props
    onAddReply(post.id, replyInput.trim())
    setReplyInput('')
  }

  return (
    <div className="detail__content detail-fade">

      {/* Synced micro-label */}
      <div className="detail__synced">
        <span className="detail__synced-dot" />
        Post loaded
      </div>

      {/* Category + level badges */}
      <div className="detail__head">
        <div className="detail__head-badges">
          <span
            className="detail__level"
            style={{ background: catSt.bg, color: catSt.color }}
          >
            {post.category}
          </span>
          <span className="detail__type">{post.level} NTRP</span>
        </div>
      </div>

      {/* Author info */}
      <div className="comm-detail__author">
        <div className="comm-detail__avatar">
          {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div className="comm-detail__name">{post.author}</div>
          <div className="comm-detail__meta">📍 {post.location} · {post.time}</div>
        </div>
      </div>

      {/* Post message */}
      <div className="detail__desc">
        <span className="detail__desc-label">Post</span>
        <p className="detail__desc-text">{post.message}</p>
      </div>

      {/* Replies thread — sourced from App state via props.
          When App updates post.replies[], this section re-renders automatically. */}
      <div className="comm-detail__replies">
        <div className="detail__desc-label">
          Replies ({post.replies.length})
        </div>

        {post.replies.length === 0 && (
          <p className="comm-detail__no-replies">No replies yet — be the first.</p>
        )}

        {post.replies.map((r, i) => (
          <div key={i} className="comm-reply">
            <div className="comm-reply__header">
              <span className="comm-reply__author">{r.author}</span>
              <span className="comm-reply__time">{r.time}</span>
            </div>
            <p className="comm-reply__text">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Reply input — local state, fires onAddReply up to App on submit */}
      <div className="detail__note-section">
        <span className="detail__note-label">Add a reply</span>
        <textarea
          className="detail__note-input"
          placeholder="Write your reply..."
          value={replyInput}
          onChange={e => setReplyInput(e.target.value)}
          rows={3}
        />
        <button
          className="detail__note-save"
          onClick={handleReply}
          disabled={!replyInput.trim()}
        >
          Post Reply
        </button>
      </div>

    </div>
  )
}

export default function CommunityDetail({ selectedPost, onAddReply }) {
  if (!selectedPost) {
    return (
      <div className="detail detail--empty">
        <span className="detail__empty-icon">💬</span>
        <p className="detail__empty-title">Select a post</p>
        <p className="detail__empty-sub">Choose a post to read and reply.</p>
      </div>
    )
  }

  return (
    <div className="detail">
      {/* key causes PostContent to remount on post change → fades in + resets replyInput */}
      <PostContent
        key={selectedPost.id}
        post={selectedPost}
        onAddReply={onAddReply}
      />
    </div>
  )
}
