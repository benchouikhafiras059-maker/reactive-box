# Design Intent — Project 2: The Reactive Sandbox
**Student:** Firas Benchouikha
**Course:** AI 201, Spring 2026 — Professor Tim Lindsey
**Project:** Court Find — Local Tennis Match Discovery

---

## 1. Domain Choice

For this project I am designing **Court Find** — a tennis match discovery platform for players who want to find competitive local matches based on skill level, distance, match type, and time. It is inspired by the clarity and usability of PlayYourCourt, but focused entirely on competitive match opportunities between players — not coaching sessions or lessons.

I chose this domain because finding a quality hitting partner or competitive match at the right level is genuinely difficult. Most platforms are built around booking coaches, not connecting players. Court Find solves a real problem: open a feed, filter to your level and schedule, find a match, read the details, and decide to join. Clean, fast, local.

---

## 2. JSON State Shape

All shared state lives in one object, owned by the parent component (`App`). No panel manages its own copy of this data.

```json
{
  "selectedMatchId": "match-1",
  "filterLevel": "all",
  "filterDistance": "all",
  "filterType": "all",
  "filterTime": "all",
  "matches": [
    {
      "id": "match-1",
      "title": "Competitive Singles Hit",
      "level": "4.0",
      "distance": 1.2,
      "distanceLabel": "1.2 mi",
      "time": "Today, 6:00 PM",
      "location": "Piedmont Park Tennis Center",
      "type": "Singles",
      "playersNeeded": 1,
      "host": "Firas B.",
      "description": "Looking for a solid 4.0 hitting partner for a competitive 90-min session. Baseline rallying + match play.",
      "status": "Open"
    }
  ]
}
```

This shape was defined before any AI code was written. When I prompt AI to build components, I will provide this model so the code reflects my architecture — not one the AI invents.

---

## 3. Three Panel Responsibilities

### Browser Panel (Left)
The Browser is the match feed — a scrollable list of match cards, one per available match. It receives the `matches` array (already filtered by App) and `selectedMatchId` as props. When a user clicks a card, it fires `onSelectMatch(id)` up to App. It does not filter the list itself — it renders exactly what it receives. Hover is CSS-only, no state.

**Reads:** `matches` (pre-filtered list from App), `selectedMatchId`
**Writes:** fires `onSelectMatch(id)` up to App

### Detail View (Center)
The Detail View is read-only. It receives the fully resolved selected match object from App and displays all match information: title, level, type, time, location, distance, host, players needed, status, and description. It manages no state and fires no events. When `selectedMatchId` changes in App, this panel updates automatically through props.

**Reads:** `selectedMatch` (full object, resolved in App)
**Writes:** nothing

### Controller Panel (Right)
The Controller gives players control over what they see in the feed. It contains four filter groups:
- **Level:** All / 3.0 / 3.5 / 4.0 / 4.5 / 5.0
- **Distance:** Any / ≤1 mi / ≤3 mi / ≤5 mi / ≤10 mi
- **Type:** All / Singles / Doubles / Mixed / Practice
- **Time:** Any / Today / Tonight / Tomorrow / This Weekend

A Reset button returns all filters to their defaults. Every filter change fires a callback event up to App — the Controller stores no filter values itself.

**Reads:** `filterLevel`, `filterDistance`, `filterType`, `filterTime`
**Writes:** fires `onFilterLevel`, `onFilterDistance`, `onFilterType`, `onFilterTime`, `onReset` up to App

---

## 4. Interaction Rules

- Clicking a match card → `selectedMatchId` updates in App → Detail View re-renders with the new match
- Changing a filter → corresponding state updates in App → Browser re-renders with the filtered list
- Clicking Reset → all four filters return to `"all"` → Browser shows full unfiltered feed
- The selected card stays visually highlighted even after filtering (if it is filtered out of view, expected behavior)
- All changes originate from one shared state object in App — no local copies, no duplicate sources of truth

---

## 5. Visual Mood

The interface should feel **bright, clean, and friendly** — a local sports platform, not a startup dashboard or dark-mode app. The palette is warm white (`#FAFAF8`) with tennis green (`#4ADE80` / `#16A34A`) as the primary accent. Cards are soft and rounded. Buttons use generous border-radius. Typography is clear and readable — Inter, sized for scanning.

Status indicators use green (Open), amber (Filling Fast), and red (Full). Level badges are small, colored pills. Distance is shown in a subtle secondary style. The overall feeling is approachable and useful — like a well-designed local sports app you'd actually open on your phone before heading to the courts.

No dark mode. No gamer aesthetic. No dense data tables.

---

## 6. Experience Goal

Help players quickly find a match that fits their level, time, and location. The user's journey is: open the app → scan the match feed → filter to level and time that work → select a match → read the full details → decide to join. The Browser makes scanning fast. The Controller makes narrowing easy. The Detail View gives everything needed to make a decision in one view.

This is not a full sports platform. There is no account system, no payment, no live maps, no messaging, no booking flow. The goal is match discovery — from open feed to informed decision, fast.

---

## 7. Academic Integrity / AI Use Framing

This Design Intent was written before any AI-generated code was produced for this project. It defines my creative direction, data model, architectural decisions, interaction rules, and visual intent. Every line of AI-generated code I accept is evaluated against this document. If the code does not follow this architecture — if it duplicates state, adds features I did not ask for, or makes visual decisions I did not approve — I revise or reject it and document that moment as a Record of Resistance.

The Design Intent is mine. The code is a tool I am directing.

---

*AI 201 — Spring 2026 | Professor Tim Lindsey | SCAD*
