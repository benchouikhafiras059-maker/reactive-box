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

<!-- New sessions will be appended below -->
