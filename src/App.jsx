import { useState } from 'react'
import ShoeBrowser from './ShoeBrowser'
import ShoeDetail from './ShoeDetail'
import ShoeController from './ShoeController'
import './App.css'

// ─────────────────────────────────────────────────────────
// ALL STATE LIVES HERE — App.jsx is the single source of
// truth for this three-panel state machine.
//
// Architecture (assignment requirement):
//   App owns state → passes data DOWN as props
//   Children fire events UP through callbacks
//   No child stores its own copy of selectedShoeId or shoes
//
// Panels:
//   ShoeController → updates filterCategory + sortBy
//   ShoeBrowser    → reads filtered/sorted shoes + selection
//   ShoeDetail     → reads resolved selectedShoe object
// ─────────────────────────────────────────────────────────

const ALL_SHOES = [
  // ── Motorsport ────────────────────────────────────────
  {
    id: 'shoe-1',
    name: 'Speedcat OG',
    category: 'Motorsport',
    sport: 'Motorsport',
    price: 100,
    colorway: 'PUMA Red / White',
    mood: 'Heritage racing sneaker with low-profile attitude',
    features: ['Low-profile silhouette', 'Suede upper', 'Gum rubber outsole'],
    audience: 'Style-conscious consumers who want a retro sneaker with cultural relevance',
  },
  {
    id: 'shoe-9',
    name: 'Speedtrap',
    category: 'Motorsport',
    sport: 'Motorsport',
    price: 95,
    colorway: 'Black / White',
    mood: 'Streamlined motorsport silhouette built for speed and minimal drag',
    features: ['Lightweight mesh upper', 'Motorsport heritage', 'Speed-inspired profile'],
    audience: 'Motorsport fans who want a driver-inspired everyday sneaker',
  },

  // ── Lifestyle ─────────────────────────────────────────
  {
    id: 'shoe-4',
    name: 'Palermo',
    category: 'Lifestyle',
    sport: 'Streetwear',
    price: 90,
    colorway: 'Green / Gum',
    mood: 'Classic terrace-inspired sneaker with everyday wearability',
    features: ['Leather upper', 'Gum rubber outsole', 'Retro terrace profile'],
    audience: 'Consumers seeking a casual sneaker with vintage sports culture',
  },
  {
    id: 'shoe-5',
    name: 'Suede Classic',
    category: 'Lifestyle',
    sport: 'Streetwear',
    price: 80,
    colorway: 'Royal Blue / White',
    mood: 'The original street sneaker — worn by icons for five decades',
    features: ['Suede upper', 'Formstrip branding', 'Rubber cupsole'],
    audience: 'Sneaker culture enthusiasts and everyday style seekers',
  },
  {
    id: 'shoe-6',
    name: 'Mostro',
    category: 'Lifestyle',
    sport: 'Streetwear',
    price: 110,
    colorway: 'Black / Silver',
    mood: 'Bold hybrid silhouette bridging athletic function and street edge',
    features: ['Chunky sole unit', 'Layered upper construction', 'Statement profile'],
    audience: 'Bold dressers who want a high-impact casual sneaker',
  },
  {
    id: 'shoe-10',
    name: 'RS-X',
    category: 'Lifestyle',
    sport: 'Streetwear',
    price: 105,
    colorway: 'White / Multi',
    mood: 'Retro running DNA rebuilt as a bold lifestyle statement',
    features: ['Mesh and synthetic upper', 'Chunky RS sole unit', 'Retro running heritage'],
    audience: 'Trend-forward consumers who want chunky retro energy',
  },

  // ── Basketball ────────────────────────────────────────
  {
    id: 'shoe-2',
    name: 'MB.04',
    category: 'Basketball',
    sport: 'Basketball',
    price: 125,
    colorway: 'Electric Blue',
    mood: "Expressive performance shoe built around LaMelo Ball's identity",
    features: ['NITRO foam cushioning', 'Court grip outsole', 'Bold visual identity'],
    audience: 'Basketball players and young consumers who value performance and personality',
  },
  {
    id: 'shoe-7',
    name: 'Clyde All-Pro',
    category: 'Basketball',
    sport: 'Basketball',
    price: 110,
    colorway: 'Black / Gold',
    mood: 'Pro-level performance with the legendary Clyde lineage',
    features: ['NITRO foam midsole', 'Quick-cut outsole', 'Leather-inspired upper'],
    audience: 'Serious hoopers who want performance with heritage credibility',
  },

  // ── Running ───────────────────────────────────────────
  {
    id: 'shoe-3',
    name: 'Deviate NITRO 3',
    category: 'Running',
    sport: 'Road Running',
    price: 160,
    colorway: 'Black / Lime',
    mood: 'High-performance running shoe focused on speed and energy return',
    features: ['NITRO Elite foam', 'Carbon fiber plate', 'PWRTAPE upper'],
    audience: 'Competitive runners who want speed, energy return, and technical performance',
  },
  {
    id: 'shoe-8',
    name: 'Velocity NITRO 3',
    category: 'Running',
    sport: 'Road Running',
    price: 120,
    colorway: 'White / Silver',
    mood: 'Everyday trainer built for speed-focused comfort on any run',
    features: ['NITRO foam midsole', 'PUMAGRIP outsole', 'Engineered mesh upper'],
    audience: 'Daily runners who want responsive cushioning without premium price',
  },
  {
    id: 'shoe-11',
    name: 'Electrify NITRO 3',
    category: 'Running',
    sport: 'Road Running',
    price: 130,
    colorway: 'Electric Red / Black',
    mood: 'Electrifying speed shoe engineered for fast training sessions',
    features: ['NITRO foam', 'Propulsion plate', 'Breathable mesh upper'],
    audience: 'Runners who train hard and want a performance shoe that looks as fast as it runs',
  },
]

export default function App() {
  // ── Shared state — lives ONLY here ───────────────────
  const [selectedShoeId, setSelectedShoeId] = useState('shoe-1')
  const [filterCategory, setFilterCategory]  = useState('all')
  const [sortBy, setSortBy]                  = useState('featured')

  // ── Derived data — computed here, not stored ─────────
  // Browser receives the final filtered+sorted list.
  // It never filters or sorts itself.
  const visibleShoes = ALL_SHOES
    .filter(s => filterCategory === 'all' || s.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  // Full shoe object — resolved here so Detail never has
  // to look it up itself. Only one copy exists: this one.
  const selectedShoe = ALL_SHOES.find(s => s.id === selectedShoeId) || null

  // ── Callbacks — passed DOWN as props ─────────────────
  const handleSelectShoe   = id  => setSelectedShoeId(id)
  const handleFilterChange = cat => setFilterCategory(cat)
  const handleSortChange   = val => setSortBy(val)
  const handleReset        = ()  => { setFilterCategory('all'); setSortBy('featured') }

  return (
    <div className="app">
      <main className="app-layout">

        {/* LEFT — Controller */}
        <aside className="panel panel--controller">
          <ShoeController
            filterCategory={filterCategory}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
        </aside>

        {/* CENTER — Browser (the select screen) */}
        <section className="panel panel--browser">
          <ShoeBrowser
            shoes={visibleShoes}
            selectedShoeId={selectedShoeId}
            onSelectShoe={handleSelectShoe}
          />
        </section>

        {/* RIGHT — Detail */}
        <aside className="panel panel--detail">
          <ShoeDetail selectedShoe={selectedShoe} />
        </aside>

      </main>
    </div>
  )
}
