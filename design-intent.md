# Design Intent — Project 2: The Reactive Sandbox
**Student:** Firas Benchouikha
**Course:** AI 201, Spring 2026 — Professor Tim Lindsey
**Project:** PUMA Shoe Explorer

---

## 1. Domain Choice

For this project I am building a PUMA Shoe Explorer — a reactive product discovery system that allows users to browse a curated collection of PUMA footwear, select a shoe, view its full product details, and filter or sort the collection in real time.

I chose this domain because I am currently working on a UX project centered around PUMA, and I want to use this assignment to explore a specific design problem: product discovery on most retail sites is passive. Users scroll a static grid, get overwhelmed, and leave. I want to build something more focused — a system where selecting a product feels intentional, where the detail view rewards curiosity, and where the controller puts the user in control without adding noise. This is not an e-commerce site. It is a discovery tool.

---

## 2. JSON State Shape

All shared state lives in one object, owned by the parent component (`App`). No panel manages its own copy of this data.

```json
{
  "selectedShoeId": "speedcat-og",
  "filterCategory": "all",
  "sortBy": "featured",
  "shoes": [
    {
      "id": "speedcat-og",
      "name": "Speedcat OG",
      "category": "Lifestyle",
      "sport": "Motorsport Heritage",
      "price": 100,
      "colorway": "PUMA Red / White",
      "mood": "Iconic, retro, clean",
      "features": ["Suede upper", "Low-profile silhouette", "Gum rubber sole"],
      "audience": "Heritage sneaker enthusiasts, fashion-forward"
    },
    {
      "id": "mb-04",
      "name": "MB.04",
      "category": "Basketball",
      "sport": "Basketball",
      "price": 130,
      "colorway": "White / Multi",
      "mood": "Bold, expressive, loud",
      "features": ["NITRO foam midsole", "Sculpted outsole", "Signature colorblocking"],
      "audience": "Basketball fans, LaMelo fans, statement dressers"
    },
    {
      "id": "deviate-nitro-3",
      "name": "Deviate NITRO 3",
      "category": "Running",
      "sport": "Road Running",
      "price": 160,
      "colorway": "Electric Lime / Black",
      "mood": "Fast, technical, performance-driven",
      "features": ["NITRO Elite foam", "Carbon fiber plate", "PWRTAPE upper"],
      "audience": "Competitive runners, marathon athletes"
    },
    {
      "id": "palermo",
      "name": "Palermo",
      "category": "Lifestyle",
      "sport": "Casual / Terrace",
      "price": 90,
      "colorway": "White / Green Fog",
      "mood": "Quiet, minimal, everyday",
      "features": ["Leather upper", "Terrace silhouette", "Contrast tongue branding"],
      "audience": "Minimalist dressers, vintage sneaker fans"
    }
  ]
}
```

This shape will be sketched and defined before any AI-generated code is written. When I prompt AI to build components, I will provide this model so its code reflects my architecture — not one it invents.

---

## 3. Three Panel Responsibilities

### Browser Panel
The Browser is the entry point. It displays the shoe collection as a grid of cards, one card per shoe. It receives the `shoes` array and `selectedShoeId` as props from App. When a user clicks a card, the Browser does not update state directly — it fires a callback event upward to App, which updates `selectedShoeId`. The selected card is visually highlighted to confirm the selection. Hover interactions (such as a subtle card scale) are purely visual and handled by CSS — they do not touch state.

**Reads:** `shoes`, `selectedShoeId`
**Writes:** fires `onSelectShoe(id)` up to App

### Detail View
The Detail View is a read-only panel. It receives the currently selected shoe object as a prop (looked up in App using `selectedShoeId`) and displays its full information: name, category, sport, price, colorway, mood, features, and audience. It does not manage any state. When `selectedShoeId` changes, this panel updates automatically because it receives new props. It is purely reactive.

**Reads:** `selectedShoe` (the full object, resolved in App)
**Writes:** nothing

### Controller Panel
The Controller gives users agency over the collection. It contains a category filter (All, Lifestyle, Running, Basketball), a sort control (Featured, Price: Low to High, Price: High to Low), and a Reset button that returns all controls to their defaults. When the user changes a filter or sort option, the Controller fires callback events up to App, which updates `filterCategory` and `sortBy` in shared state. The Browser then re-renders with the updated, filtered, and sorted shoe list.

**Reads:** `filterCategory`, `sortBy`
**Writes:** fires `onFilterChange(category)` and `onSortChange(sortBy)` up to App

---

## 4. Interaction Rules

- When a user clicks a shoe card in the Browser → `selectedShoeId` updates in App → Detail View re-renders with the new shoe's information
- When a user changes the category filter in the Controller → `filterCategory` updates in App → Browser re-renders showing only matching shoes
- When a user changes the sort order → `sortBy` updates in App → Browser re-renders with shoes reordered accordingly
- When the Reset button is clicked → `filterCategory` returns to `"all"` and `sortBy` returns to `"featured"` → Browser returns to the full default collection
- The selected shoe card remains visually highlighted at all times, even after filtering
- All changes originate from one shared state object in App — there are no local copies, no contradictions, no duplicate sources of truth

---

## 5. Visual Mood

The interface should feel **clean, sporty, and editorial** — closer to a high-end product lookbook than a traditional e-commerce grid. The layout is card-based with clear visual hierarchy: the shoe name and category read first, the price and colorway read second, the mood and features read third. Typography is strong and purposeful — not decorative. Spacing is generous. The selected state is clear without being heavy-handed.

Hover interactions are subtle — a slight card lift or scale to confirm interactivity — but they do not trigger state changes. The Controller sits as a quiet sidebar or top bar: useful, not dominant. The Detail View has room to breathe. The overall feeling is **focused and premium**, inspired by sports retail and product editorial design, not a cluttered storefront.

---

## 6. Experience Goal

This system should feel like a focused product discovery tool. The user's journey is: browse → select → understand. The Browser invites exploration. The Detail View rewards selection with complete, well-organized information. The Controller lets the user narrow the field without losing orientation. At no point should the user feel overwhelmed or unsure what they are looking at.

This is not a full e-commerce experience. There is no cart, no checkout, no account. The goal is to help a user go from knowing nothing about a shoe to understanding exactly what it is, who it is for, and whether it fits them — quickly and clearly.

---

## 7. Academic Integrity / AI Use Framing

This Design Intent was written before any AI-generated code was produced for this project. It defines my creative direction, data model, architectural decisions, interaction rules, and visual intent. Every line of AI-generated code I accept will be evaluated against this document. If the code does not follow this architecture — if it duplicates state, adds features I did not ask for, or makes visual decisions I did not approve — I will revise or reject it and document that moment as a Record of Resistance.

The Design Intent is mine. The code is a tool I am directing.

---

*AI 201 — Spring 2026 | Professor Tim Lindsey | SCAD*
