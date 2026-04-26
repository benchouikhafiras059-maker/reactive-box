import { useState } from 'react'
import ShoeBrowser from './ShoeBrowser'
import ShoeDetail from './ShoeDetail'
import ShoeController from './ShoeController'
import './App.css'

// ─────────────────────────────────────────────────────────
// ALL STATE LIVES HERE — App.jsx is the single source of
// truth. No child stores its own copy of the shoe data or
// the selected shoe. Data flows DOWN as props. Events flow
// UP through callback functions.
// ─────────────────────────────────────────────────────────

const ALL_SHOES = [
  {
    id: 'shoe-1',
    name: 'Speedcat OG',
    category: 'Lifestyle',
    sport: 'Motorsport',
    price: 100,
    colorway: 'Red / White',
    mood: 'Heritage racing sneaker with low-profile attitude',
    features: ['Low-profile silhouette', 'Suede upper', 'Motorsport heritage'],
    audience: 'Style-conscious users who want a retro sneaker with cultural relevance',
  },
  {
    id: 'shoe-2',
    name: 'MB.04',
    category: 'Basketball',
    sport: 'Basketball',
    price: 125,
    colorway: 'Electric Blue',
    mood: "Expressive performance shoe built around LaMelo Ball's identity",
    features: ['Cushioning', 'Court grip', 'Bold visual identity'],
    audience: 'Basketball players and young consumers who value performance and personality',
  },
  {
    id: 'shoe-3',
    name: 'Deviate NITRO 3',
    category: 'Running',
    sport: 'Running',
    price: 160,
    colorway: 'Black / Lime',
    mood: 'High-performance running shoe focused on speed and energy return',
    features: ['NITRO foam', 'Carbon plate', 'Lightweight upper'],
    audience: 'Runners who want speed, comfort, and technical performance',
  },
  {
    id: 'shoe-4',
    name: 'Palermo',
    category: 'Lifestyle',
    sport: 'Streetwear',
    price: 90,
    colorway: 'Green / Gum',
    mood: 'Classic terrace-inspired sneaker with everyday wearability',
    features: ['Gum sole', 'Retro profile', 'Soft suede finish'],
    audience: 'Users looking for a casual sneaker with vintage sports culture',
  },
]

export default function App() {
  // ── Shared state ──────────────────────────────────────
  const [selectedShoeId, setSelectedShoeId] = useState('shoe-1')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // ── Derived data ──────────────────────────────────────
  // Filtering and sorting happen HERE in App, not in the
  // Browser. The Browser just renders what it receives.
  const visibleShoes = ALL_SHOES
    .filter(shoe =>
      filterCategory === 'all' ? true : shoe.category === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0 // 'featured' keeps original array order
    })

  // Resolve the full shoe object so ShoeDetail gets rich
  // data — not just an ID it would have to look up itself.
  const selectedShoe = ALL_SHOES.find(shoe => shoe.id === selectedShoeId) || null

  // ── Event handlers ────────────────────────────────────
  // These live in App because only App can update state.
  // They are passed DOWN to children as props.
  function handleSelectShoe(id) {
    setSelectedShoeId(id)
  }

  function handleFilterChange(category) {
    setFilterCategory(category)
  }

  function handleSortChange(sort) {
    setSortBy(sort)
  }

  function handleReset() {
    setFilterCategory('all')
    setSortBy('featured')
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header__title">Shoe Explorer</span>
      </header>

      <main className="app-layout">
        {/* LEFT — Controller: user controls filters and sort */}
        <aside className="panel panel--controller">
          <ShoeController
            filterCategory={filterCategory}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
        </aside>

        {/* CENTER — Browser: displays the shoe collection */}
        <section className="panel panel--browser">
          <ShoeBrowser
            shoes={visibleShoes}
            selectedShoeId={selectedShoeId}
            onSelectShoe={handleSelectShoe}
          />
        </section>

        {/* RIGHT — Detail: shows information about the selected shoe */}
        <aside className="panel panel--detail">
          <ShoeDetail selectedShoe={selectedShoe} />
        </aside>
      </main>
    </div>
  )
}
