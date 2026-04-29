# AI 201 P2 — Session Log
**Project:** The Reactive Sandbox  
**Student:** Firas Benchouikha  
**Course:** AI 201, Spring 2026, Professor Tim Lindsey  
**Repo:** /Users/firasbenchouikha/Documents/GitHub/reactive-box

---

## Session 1 — 2026-04-26

### What we did
- Located the project folder at `Documents/GitHub/reactive-box`
- Read both PDFs:
  - `reactive box companion.pdf` — architecture, domain guidance, ESF practices
  - `reactive-sandbox-lecture.pdf` — Session 7 lecture slides (Monday, April 13, 2026)
- Reviewed the full project brief and requirements

### Key decisions / context established
- Project is a React three-panel state machine: Browser → Detail View → Controller
- One shared state object in App, passed as props — no useContext, no Redux
- Domain not yet chosen (pending student's Design Intent)
- Design Intent must be written by student BEFORE any code is written (academic integrity)

### Next steps
- Student to pick domain
- Student to write Design Intent (due before Session 8)
- Design Intent must answer: domain, JSON shape, three panels, interaction rules, visual mood

---

## Session 2 — 2026-04-26

### What we did
- Student defined project concept: PUMA Shoe Explorer
- Wrote full Design Intent document → saved as `design-intent.md`

### Key decisions made
- **Domain:** PUMA product discovery system — chosen because student is working on a PUMA UX project and wants to explore interactive product discovery vs. static grids
- **4 shoes in data model:** Speedcat OG (Lifestyle, $100), MB.04 (Basketball, $130), Deviate NITRO 3 (Running, $160), Palermo (Lifestyle, $90)
- **State shape:** `{ selectedShoeId, filterCategory, sortBy, shoes[] }`
- **Browser:** card grid, click fires `onSelectShoe(id)` up to App, hover is CSS only
- **Detail View:** read-only, receives resolved shoe object as prop
- **Controller:** category filter + sort control + reset button, fires callbacks up to App
- **Visual mood:** clean, sporty, editorial, card-based, strong typography, premium feel
- **Experience goal:** browse → select → understand. Not an e-commerce site.

### Next steps
- Set up React/Vite project scaffold
- Build state model in App
- Build Browser component first (render from mock data)

---

## Session 3 — 2026-04-26

### What we did
- Built full React app (App.jsx, ShoeBrowser.jsx, ShoeDetail.jsx, ShoeController.jsx, App.css)
- Redesigned UI from flat card layout to premium dark product showcase

### Key decisions
- Dark background (--grey-900 / black) throughout — feels premium, not generic
- Typographic wordmarks as shoe hero visuals (no images needed)
- Each category has its own gradient palette (Lifestyle: warm brown, Basketball: dark blue, Running: dark green)
- Hover is CSS-only (transform + shadow) — clearly documented in code comments
- Click-to-select is the real state interaction — fires up to App, flows back down as props
- ShoeDetail has a tall hero section with category gradient + large name overlay
- Red accent (#ff3a00) used for selected states, features list, and brand identity
- Controller has dark sidebar with brand lockup at top

### Records of Resistance (for assignment documentation)
- Kept hover as pure CSS — resisted adding useState for hover effect
- No useContext or Redux — useState + props is sufficient for this component tree
- No routing added — single page only as per Design Intent

### Next steps
- Test all interactions in browser
- Consider adding real shoe images if available
- Deploy to GitHub Pages

---

## Session 4 — 2026-04-26

### What we did
- Rejected PUMA Shoe Explorer entirely — deleted ShoeBrowser, ShoeDetail, ShoeController
- Pivoted to new concept: **Match Feed** — competitive tennis match discovery for Atlanta college players
- Wrote Match Feed Design Intent → saved as `design-intent.md` (replaced PUMA version)
- Built full React app from scratch:
  - `src/App.jsx` — 6 match objects, 4 filter states, all handlers, derived `visibleMatches` computed here
  - `src/MatchBrowser.jsx` — card feed, click fires `onSelectMatch(id)` up to App, hover CSS-only
  - `src/MatchDetail.jsx` — read-only, receives full resolved match object, renders facts + notes + CTA
  - `src/MatchController.jsx` — 4 filter pill groups (level, type, distance, time) + reset button
  - `src/App.css` — dark navy (#0D1117) three-panel layout, green (#2ECC71) accents, badge system
  - `src/index.css` — updated design tokens for Match Feed palette (navy, green, amber, red)

### Key decisions
- Dark navy (#0D1117) throughout — matches sports/dev dashboard aesthetic the user wanted
- Tennis green (#2ECC71) as the single primary accent — selected states, level tags, spot indicators
- Status badges in three colors: green (Open), amber (Filling Fast), red (Full)
- Type badges color-coded: blue (Singles), purple (Doubles), amber (Tournament), green (Practice)
- FF DIN Condensed Bold for all card titles and display headings
- Join Match button in Detail is display-only (disabled when Full) — no routing or booking flow
- Filtering is computed in App.jsx — children receive final filtered list, never filter themselves
- Hover is CSS-only — confirmed no useState for hover in any component

### Post-build audit results (8/8 pass)
1. ✅ App.jsx owns all shared state
2. ✅ Browser reads + writes only through props/callbacks
3. ✅ Detail is read-only, no state, no callbacks
4. ✅ Controller fires callbacks up, no local state copies
5. ✅ Hover is CSS-only
6. ✅ Filtering computed in App, not in children
7. ✅ selectedMatch resolved in App, Detail receives full object
8. ✅ Strict props-down / events-up — no cross-component communication

### Records of Resistance
- Kept hover as pure CSS — no useState for hover on any card
- No useContext, no Redux, no custom hooks — useState + props only
- Join button is visual only — resisted adding routing or booking state

### Next steps
- Test all interactions in browser
- Consider deploying to GitHub Pages

---

## Session 5 — 2026-04-27

### What we did
- Rejected Match Feed, UX Intelligence Dashboard, and SCAD Student Hub in sequence (multiple concept pivots)
- Final pivot to: **MedDash — Healthcare Operations Dashboard**
- Wrote full Healthcare Design Intent → saved as `design-intent.md` (replaced Match Feed version)
- Built full React app from scratch:
  - `src/index.css` — clinical design tokens (--bg: #F4F7FB, --blue: #2563EB, status colors)
  - `src/App.jsx` — 4 patients with full nested data, 4 state vars, derived visiblePatients + selectedPatient, 5 callbacks
  - `src/PatientBrowser.jsx` — patient list, status ring avatars, selected state, hover CSS-only
  - `src/PatientDetail.jsx` — 5 data layer views, inline Sparkline SVG, BarChart, ScanThumbnail, StatusBadge
  - `src/PatientController.jsx` — data layer nav buttons + department/status filter pills + reset
  - `src/App.css` — 260px | 1fr | 220px grid, clinical color system, all component styles
- Deleted old component files before building: ItemController, ItemBrowser, ItemDetail, AIDrawer, ReplyModal, EditModal
- Vite build confirmed clean: ✓ 23 modules, built in 91ms
- Dev server running on http://localhost:5173

### Key decisions
- **Domain:** Healthcare patient monitoring — chosen for high-stakes information design challenge
- **4 patients:** Curtis Valk (Pulmonology/monitoring), Maria Santos (Cardiology/critical), James Okafor (Emergency/stable), Amara Diallo (Endocrinology/stable)
- **5 data layers:** Overview, Diagnostics, Imaging, Records, Monitoring — selected via `selectedDataType` state
- **Inline SVG sparklines** instead of chart libraries — lightweight, dependency-free
- **Inline bar charts** via CSS height percentages for monitoring view
- **Status color system:** green (stable), amber (monitoring), red (critical) — applied to badges, avatar rings, sparklines
- **Layout:** 260px browser | 1fr detail | 220px controller — fixed panels, independent scroll
- **Cool off-white background** (#F4F7FB) — clinical, calm, not sterile white

### Records of Resistance
- Kept all hover as pure CSS — no useState for hover
- No useContext, no Redux — useState + props only
- No chart library — inline SVG polylines only
- Detail panel is fully read-only — fires no events up

### Post-build audit (8/8 pass)
1. ✅ App.jsx owns all shared state
2. ✅ Browser (PatientBrowser) reads + writes only through props/callbacks
3. ✅ Detail (PatientDetail) is read-only, no state, no callbacks
4. ✅ Controller (PatientController) fires callbacks up, stores no local state copies
5. ✅ Hover is CSS-only
6. ✅ Filtering computed in App, not in children
7. ✅ selectedPatient resolved in App, Detail receives full object
8. ✅ Strict props-down / events-up — no cross-component communication

### Next steps
- Test all interactions in browser at http://localhost:5173
- Deploy to GitHub Pages (pending)

<!-- New sessions will be appended below -->
