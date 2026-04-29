import { useState, useRef } from 'react'
import Onboarding        from './Onboarding'
import MatchBrowser      from './MatchBrowser'
import MatchDetail       from './MatchDetail'
import MatchController   from './MatchController'
import CommunityBrowser  from './CommunityBrowser'
import CommunityDetail   from './CommunityDetail'
import SettingsModal     from './SettingsModal'
import './App.css'

// ─────────────────────────────────────────────────────────
// ALL STATE LIVES IN APP.JSX
//
//   isOnboardingComplete — gates the main app
//   user{}               — name, zip, level (from onboarding / settings)
//   settings{}           — notification, radius preferences
//   matches[]            — full match list (status + notes update it)
//   selectedMatchId      — which match Detail is showing
//   filterLevel / filterDistance / filterType / filterTime
//   searchQuery          — text search
//   activeView           — 'matches' | 'community'  — gates Browser + Detail
//   communityPosts[]     — full post list (replies update it)
//   selectedPostId       — which post CommunityDetail is showing
//   communityFilter      — which post category is active
//   isSettingsOpen       — controls SettingsModal visibility
//   syncStatus / toast   — transient feedback, auto-clear via refs
//
// Architecture:
//   • If isOnboardingComplete === false → show Onboarding
//   • If true → show the 3-panel CourtMatch app
//   • SettingsModal overlays the main app when isSettingsOpen === true
// ─────────────────────────────────────────────────────────

const INITIAL_MATCHES = [
  {
    id: 'match-1',
    title: 'Competitive Singles Hit',
    level: '4.0',
    distance: 1.2,
    distanceLabel: '1.2 mi',
    time: 'Today, 6:00 PM',
    location: 'Piedmont Park Tennis Center',
    type: 'Singles',
    playersNeeded: 1,
    host: 'Firas B.',
    description: 'Looking for a solid 4.0 hitting partner for a competitive 90-min session. Baseline rallying plus match play. Bring your A game.',
    playStyle: 'Aggressive baseliner, heavy topspin',
    whatToBring: 'Water, 2 cans of balls (shared)',
    courtSurface: 'Hard court',
    intensity: 'Competitive',
    matchNotes: '10-min warm-up then full match play. Tiebreaks to 7. Ad scoring.',
    status: 'Open',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-2',
    title: 'Evening Doubles – Chastain Park',
    level: '3.5',
    distance: 2.8,
    distanceLabel: '2.8 mi',
    time: 'Today, 7:30 PM',
    location: 'Chastain Park Tennis Center',
    type: 'Doubles',
    playersNeeded: 2,
    host: 'Sarah M.',
    description: 'Casual but competitive doubles session. Need 2 more players at 3.5 level. Courts are lit so we go rain or shine.',
    playStyle: 'All-court, net presence encouraged',
    whatToBring: 'Water, 1 can of balls per pair',
    courtSurface: 'Hard court (lit)',
    intensity: 'Competitive',
    matchNotes: 'Standard doubles scoring. Ad scoring preferred. Rotation if extra players show.',
    status: 'Open',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-3',
    title: 'Morning Rally – Freedom Park',
    level: '3.0',
    distance: 0.9,
    distanceLabel: '0.9 mi',
    time: 'Tomorrow, 9:00 AM',
    location: 'Freedom Park Tennis Courts',
    type: 'Practice',
    playersNeeded: 1,
    host: 'David K.',
    description: 'Relaxed morning practice focused on groundstrokes and consistency. Great for players building match experience.',
    playStyle: 'Baseline consistency, no big serving',
    whatToBring: 'Water — balls provided',
    courtSurface: 'Hard court',
    intensity: 'Casual',
    matchNotes: 'Crosscourt rallies, second-serve focus. 90 min total. No rush.',
    status: 'Open',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-4',
    title: 'Tournament Prep – High Intensity',
    level: '4.5',
    distance: 4.1,
    distanceLabel: '4.1 mi',
    time: 'Tonight, 7:00 PM',
    location: 'Blackburn Tennis Center',
    type: 'Singles',
    playersNeeded: 1,
    host: 'Marcus T.',
    description: 'Serious 4.5 player prepping for ALTA season. Match play only — must be competitive and willing to push the pace.',
    playStyle: 'Heavy topspin baseline, aggressive on short balls',
    whatToBring: 'Water, 3 cans of balls (I bring 2)',
    courtSurface: 'Hard court',
    intensity: 'High Intensity',
    matchNotes: 'Best of 3 sets, standard scoring. No coaching mid-match. Come ready.',
    status: 'Filling Fast',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-5',
    title: 'Mixed Doubles – Weekend Vibes',
    level: '3.5',
    distance: 3.3,
    distanceLabel: '3.3 mi',
    time: 'This Weekend, 10:00 AM',
    location: 'Bitsy Grant Tennis Center',
    type: 'Mixed',
    playersNeeded: 2,
    host: 'Priya N.',
    description: 'Fun mixed doubles with a competitive edge. Looking for 1M + 1F at 3.5. Courts booked, just need players.',
    playStyle: 'All-court, team-oriented',
    whatToBring: 'Water, good attitude — coffee run after',
    courtSurface: 'Clay',
    intensity: 'Casual',
    matchNotes: 'First to 8 games format, no-ad scoring. Rotation if extra people join.',
    status: 'Open',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-6',
    title: 'Advanced Singles – Lullwater',
    level: '4.5',
    distance: 5.2,
    distanceLabel: '5.2 mi',
    time: 'Tomorrow, 5:30 PM',
    location: 'Lullwater Park Courts',
    type: 'Singles',
    playersNeeded: 1,
    host: 'Jordan W.',
    description: "Looking for a 4.5 player for a full set match. I play serve-and-volley. Let's get some clean points in.",
    playStyle: 'Serve and volley, net-rushing',
    whatToBring: 'Water, we split balls 50/50',
    courtSurface: 'Hard court',
    intensity: 'Competitive',
    matchNotes: 'Warm-up included. 2–3 sets depending on time. Happy to split sets.',
    status: 'Open',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-7',
    title: 'Beginner-Friendly Doubles',
    level: '3.0',
    distance: 2.1,
    distanceLabel: '2.1 mi',
    time: 'This Weekend, 2:00 PM',
    location: 'Grant Park Tennis Courts',
    type: 'Doubles',
    playersNeeded: 2,
    host: 'Amara L.',
    description: 'Friendly doubles for 3.0 players. Great for newer players or those returning to tennis. No pressure.',
    playStyle: 'Friendly all-court, supportive rallies',
    whatToBring: 'Water, snacks if you want to stay after',
    courtSurface: 'Hard court',
    intensity: 'Casual',
    matchNotes: 'First to 6 games, no-ad scoring. Player rotation welcome.',
    status: 'Filling Fast',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
  {
    id: 'match-8',
    title: 'Elite Singles – 5.0 Only',
    level: '5.0',
    distance: 1.8,
    distanceLabel: '1.8 mi',
    time: 'Tonight, 8:00 PM',
    location: 'Bitsy Grant Tennis Center',
    type: 'Singles',
    playersNeeded: 1,
    host: 'Carlos R.',
    description: 'High-level singles for 5.0 players only. Score-keeping, full sets. Come ready to compete at full intensity.',
    playStyle: 'Power baseline, heavy serve',
    whatToBring: 'Water, 4 cans of balls minimum',
    courtSurface: 'Hard court',
    intensity: 'High Intensity',
    matchNotes: 'Standard ATP scoring. No unforced mercy games. Full intensity from ball one.',
    status: 'Full',
    hostNote: null,
    requestStatus: 'none',
    checklist: { water: false, balls: false, warmup: false, arrival: false, address: false },
    arrivalStatus: 'none',
    recap: null,
  },
]

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: 'Marcus T.',
    level: '4.5',
    location: 'Midtown',
    category: 'Hitting Requests',
    time: 'Today 2:30 PM',
    message: 'Looking for a hitting partner this week — afternoons work best. 4.5 level. I focus on baseline consistency and fitness rallies. DM if interested.',
    replies: [
      { author: 'Jordan W.', time: '3:10 PM', text: 'I\'m down — Tues or Thurs works for me. What court do you usually use?' },
    ],
  },
  {
    id: 'post-2',
    author: 'Priya N.',
    level: '3.5',
    location: 'Buckhead',
    category: 'Doubles',
    time: 'Today 11:00 AM',
    message: 'Forming a regular doubles group for Sunday mornings at Chastain. 3.5 level preferred. Looking for 2–3 committed players for the season.',
    replies: [],
  },
  {
    id: 'post-3',
    author: 'Tyler C.',
    level: '3.0',
    location: 'Grant Park',
    category: 'SCAD',
    time: 'Yesterday 6:00 PM',
    message: 'Any SCAD students want to hit this week? I\'m free most mornings. Beginner-intermediate level, just trying to get more court time before finals.',
    replies: [
      { author: 'Amara L.', time: 'Yesterday 7:00 PM', text: 'I\'m a SCAD student too! Wednesday morning works for me.' },
      { author: 'Tyler C.',  time: 'Yesterday 7:15 PM', text: 'Perfect — let\'s do 9 AM at Freedom Park, courts are usually open.' },
    ],
  },
  {
    id: 'post-4',
    author: 'Carlos R.',
    level: '5.0',
    location: 'Bitsy Grant',
    category: 'Tournament',
    time: 'Today 9:00 AM',
    message: 'Anyone else entering the Atlanta Open Club Championship next month? Looking to find practice partners who are serious about competing. 5.0+ level.',
    replies: [],
  },
  {
    id: 'post-5',
    author: 'Sarah M.',
    level: '3.5',
    location: 'Chastain',
    category: 'Hitting Requests',
    time: 'Yesterday 3:00 PM',
    message: 'Need a hitting partner for Saturday mornings — I\'m working on my serve and return game. 3.5 level, friendly and encouraging. Chastain area.',
    replies: [
      { author: 'David K.', time: 'Yesterday 4:30 PM', text: 'I\'m a 3.5 as well and work on returns a lot. Let\'s hit this weekend!' },
    ],
  },
  {
    id: 'post-6',
    author: 'Jordan W.',
    level: '4.5',
    location: 'Lullwater',
    category: 'Tournament',
    time: 'Today 7:00 AM',
    message: 'Recap from Lullwater club tournament — great competition, some really solid 4.5 players. Anyone who played there want to keep the rivalry going? DM me.',
    replies: [],
  },
]

// NTRP levels that map directly to filter values
const NTRP_FILTER_LEVELS = new Set(['3.0', '3.5', '4.0', '4.5', '5.0'])

export default function App() {
  // ── Onboarding state ───────────────────────────────────
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [user,                 setUser]                 = useState({ name: '', zip: '', level: '' })

  // ── User settings ──────────────────────────────────────
  const [settings, setSettings] = useState({ notification: 'app', radius: '5' })

  // ── Main app state ─────────────────────────────────────
  const [matches,         setMatches]         = useState(INITIAL_MATCHES)
  const [selectedMatchId, setSelectedMatchId] = useState('match-1')
  const [filterLevel,     setFilterLevel]     = useState('all')
  const [filterDistance,  setFilterDistance]  = useState('any')
  const [filterType,      setFilterType]      = useState('all')
  const [filterTime,      setFilterTime]      = useState('any')
  const [searchQuery,     setSearchQuery]     = useState('')
  const [syncStatus,      setSyncStatus]      = useState('')
  const [toast,           setToast]           = useState(null)

  // ── View + community state ─────────────────────────────
  const [activeView,      setActiveView]      = useState('matches')
  const [communityPosts,  setCommunityPosts]  = useState(INITIAL_POSTS)
  const [selectedPostId,  setSelectedPostId]  = useState(null)
  const [communityFilter, setCommunityFilter] = useState('all')

  // ── Modal state ────────────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const syncTimerRef  = useRef(null)
  const toastTimerRef = useRef(null)

  // ── Helpers ────────────────────────────────────────────
  const triggerSync = (msg) => {
    clearTimeout(syncTimerRef.current)
    setSyncStatus(msg)
    syncTimerRef.current = setTimeout(() => setSyncStatus(''), 2500)
  }

  const showToast = (msg) => {
    clearTimeout(toastTimerRef.current)
    setToast(msg)
    toastTimerRef.current = setTimeout(() => setToast(null), 3500)
  }

  // ── Onboarding complete ────────────────────────────────
  const handleOnboardingComplete = (userData) => {
    setUser(userData)
    setIsOnboardingComplete(true)
    showToast(`Welcome, ${userData.name}! 🎾`)

    if (NTRP_FILTER_LEVELS.has(userData.level)) {
      setFilterLevel(userData.level)
      triggerSync(`Showing ${userData.level} matches near you`)
    }
  }

  // ── Match callbacks ────────────────────────────────────
  const handleSelectMatch    = id  => { setSelectedMatchId(id);  triggerSync('Match details synced') }
  const handleFilterLevel    = val => { setFilterLevel(val);     triggerSync('Feed updated') }
  const handleFilterDistance = val => { setFilterDistance(val);  triggerSync('Feed updated') }
  const handleFilterType     = val => { setFilterType(val);      triggerSync('Feed updated') }
  const handleFilterTime     = val => { setFilterTime(val);      triggerSync('Feed updated') }
  const handleSearch         = val => { setSearchQuery(val); if (val) triggerSync('Feed updated') }
  const handleReset          = ()  => {
    setFilterLevel('all'); setFilterDistance('any')
    setFilterType('all');  setFilterTime('any'); setSearchQuery('')
    triggerSync('Filters cleared')
  }

  const handleJoin = (matchId) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, status: 'Request Sent' } : m
    ))
    triggerSync('Request status updated')
    showToast('Match request sent! 🎾')
  }

  const handleSaveNote = (matchId, note) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, hostNote: note } : m
    ))
    triggerSync('Note saved')
    showToast('Note saved to host!')
  }

  // ── Confirmed-experience callbacks ─────────────────────
  // Each fires UP here; App updates matches[] → Browser + Detail
  // re-render from the same data source. No confirmed state lives
  // in either child component.

  // Host accepts request → requestStatus flips to 'confirmed'.
  // In production this would arrive via push notification.
  // Here it's triggered by the "Simulate: Host Confirms" button.
  const handleConfirm = (matchId) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, requestStatus: 'confirmed', status: 'Confirmed' } : m
    ))
    triggerSync('Match confirmed!')
    showToast('Match confirmed! Check your Match Plan 🎾')
  }

  // Checklist item toggled in ConfirmedView.
  // App flips the boolean in place → Browser prep count + Detail list
  // both update from the same checklist object.
  const handleToggleChecklist = (matchId, itemKey) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, checklist: { ...m.checklist, [itemKey]: !m.checklist[itemKey] } }
        : m
    ))
    triggerSync('Prep checklist updated')
  }

  // Arrival status set in ConfirmedView → Browser arrival badge updates.
  const handleSetArrival = (matchId, status) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, arrivalStatus: status } : m
    ))
    const toastMsg = {
      'on-my-way': "You're on your way! 🚗",
      'arrived':   "You've arrived! 🎾",
      'cancelled': 'Participation cancelled.',
    }
    triggerSync('Arrival status updated')
    showToast(toastMsg[status] || 'Status updated')
  }

  // Match marked complete → requestStatus flips to 'completed'.
  // Detail switches to CompletedView automatically via requestStatus gate.
  const handleCompleteMatch = (matchId) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, requestStatus: 'completed', status: 'Completed' } : m
    ))
    triggerSync('Match completed')
    showToast('Match completed! How did it go? 🏆')
  }

  // Recap saved from CompletedView → stored in match.recap{}.
  // Browser shows 🏆 Recap badge; Detail shows saved recap.
  const handleSaveRecap = (matchId, recap) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, recap } : m
    ))
    triggerSync('Recap saved')
    showToast('Recap saved!')
  }

  // ── Community callbacks ────────────────────────────────
  const handleSetActiveView = (view) => {
    setActiveView(view)
    triggerSync(view === 'community' ? 'Community loaded' : 'Matches loaded')
  }

  const handleCommunityFilter = (val) => {
    setCommunityFilter(val)
    triggerSync('Posts filtered')
  }

  const handleSelectPost = (id) => {
    setSelectedPostId(id)
    triggerSync('Post loaded')
  }

  const handleAddReply = (postId, text) => {
    setCommunityPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, replies: [...p.replies, { author: user.name || 'You', time: 'Just now', text }] }
        : p
    ))
    triggerSync('Reply posted')
    showToast('Reply posted!')
  }

  // ── Settings callbacks ─────────────────────────────────
  const handleOpenSettings  = ()                         => setIsSettingsOpen(true)
  const handleCloseSettings = ()                         => setIsSettingsOpen(false)
  const handleSaveSettings  = (updatedUser, updatedSettings) => {
    setUser(updatedUser)
    setSettings(updatedSettings)
    setIsSettingsOpen(false)
    triggerSync('Profile updated')
    showToast('Settings saved!')
  }

  // ── Derived state ──────────────────────────────────────
  const filteredMatches = matches.filter(m => {
    if (filterLevel    !== 'all' && m.level !== filterLevel) return false
    if (filterDistance !== 'any' && m.distance > parseFloat(filterDistance)) return false
    if (filterType     !== 'all' && m.type  !== filterType)  return false
    if (filterTime     !== 'any' && !m.time.startsWith(filterTime)) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const hit = m.title.toLowerCase().includes(q)    ||
                  m.location.toLowerCase().includes(q) ||
                  m.host.toLowerCase().includes(q)      ||
                  m.description.toLowerCase().includes(q)
      if (!hit) return false
    }
    return true
  })

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || null

  const filteredPosts = communityPosts.filter(p =>
    communityFilter === 'all' || p.category === communityFilter
  )

  const selectedPost = communityPosts.find(p => p.id === selectedPostId) || null

  const isFiltered = filterLevel !== 'all' || filterDistance !== 'any' ||
                     filterType  !== 'all' || filterTime     !== 'any' ||
                     searchQuery.trim() !== ''

  // ── Gate: show onboarding OR main app ─────────────────
  if (!isOnboardingComplete) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        {toast && <div className="toast">{toast}</div>}
      </>
    )
  }

  // ── Main app ───────────────────────────────────────────
  return (
    <div className="app app--enter">

      <header className="site-header">
        <div className="site-header__brand">
          <span className="site-header__icon">🎾</span>
          <div className="site-header__text">
            <span className="site-header__title">CourtMatch</span>
            <span className="site-header__sub">Find local tennis matches near your level</span>
          </div>
        </div>
        <div className="site-header__right">
          {user.name && (
            <span className="site-header__user">Hi, {user.name}</span>
          )}
          <span className="site-header__count">
            {activeView === 'matches'
              ? `${filteredMatches.length} match${filteredMatches.length !== 1 ? 'es' : ''} near you`
              : `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`
            }
          </span>
        </div>
      </header>

      <div className={`sync-bar${syncStatus ? ' sync-bar--active' : ''}`}>
        {syncStatus && (
          <span className="sync-bar__msg">
            <span className="sync-bar__dot" />
            {syncStatus}
          </span>
        )}
      </div>

      <div className="panels">

        {/* LEFT — Controller (filters + view toggle + profile strip) */}
        <aside className="panel panel--controller">
          <MatchController
            filterLevel={filterLevel}
            filterDistance={filterDistance}
            filterType={filterType}
            filterTime={filterTime}
            searchQuery={searchQuery}
            isFiltered={isFiltered}
            onFilterLevel={handleFilterLevel}
            onFilterDistance={handleFilterDistance}
            onFilterType={handleFilterType}
            onFilterTime={handleFilterTime}
            onSearch={handleSearch}
            onReset={handleReset}
            activeView={activeView}
            onSetActiveView={handleSetActiveView}
            communityFilter={communityFilter}
            onCommunityFilter={handleCommunityFilter}
            user={user}
            onOpenSettings={handleOpenSettings}
          />
        </aside>

        {/* CENTER — Browser (switches content based on activeView) */}
        <main className="panel panel--browser">
          {activeView === 'matches' ? (
            <MatchBrowser
              matches={filteredMatches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={handleSelectMatch}
            />
          ) : (
            <CommunityBrowser
              posts={filteredPosts}
              selectedPostId={selectedPostId}
              onSelectPost={handleSelectPost}
            />
          )}
        </main>

        {/* RIGHT — Detail (switches content based on activeView) */}
        <aside className="panel panel--detail">
          {activeView === 'matches' ? (
            <MatchDetail
              selectedMatch={selectedMatch}
              onJoin={handleJoin}
              onSaveNote={handleSaveNote}
              onConfirm={handleConfirm}
              onToggleChecklist={handleToggleChecklist}
              onSetArrival={handleSetArrival}
              onCompleteMatch={handleCompleteMatch}
              onSaveRecap={handleSaveRecap}
            />
          ) : (
            <CommunityDetail
              selectedPost={selectedPost}
              onAddReply={handleAddReply}
            />
          )}
        </aside>

      </div>

      {/* Settings modal — overlays main app when isSettingsOpen === true */}
      {isSettingsOpen && (
        <SettingsModal
          user={user}
          settings={settings}
          onSave={handleSaveSettings}
          onClose={handleCloseSettings}
        />
      )}

      {toast && <div className="toast">{toast}</div>}

    </div>
  )
}
