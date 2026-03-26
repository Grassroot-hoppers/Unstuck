# Architecture

> Read this first if you want to understand how Unstuck works, or where to make changes.

## Bird's Eye View

Unstuck is a **static website** that runs a validated personality assessment entirely in the browser. No backend is required for the core assessment flow. An optional Supabase backend enables persistent results storage.

```
User opens index.html
  → Clicks "Start Assessment"
  → assessment.html loads 120 IPIP-NEO items
  → User answers 10 questions per page (12 pages)
  → Answers stored in localStorage as they go
  → On completion: client-side JavaScript scores everything
  → Scores encoded as base64 JSON in URL hash
  → Redirect to results.html#<encoded-scores>
  → results.html decodes hash → renders radar chart + interpretation
  → (Optional) Scores saved to Supabase for permanent retrieval
```

**The entire scoring pipeline runs client-side.** No data leaves the browser unless the user opts into Supabase persistence.

## File Map

```
src/
├── index.html          ← Landing page. Marketing + CTA.
│                         Change: copy, design, trust badges
│
├── assessment.html     ← The 120-question assessment. THE core file.
│                         Contains: all 120 items (embedded JS array),
│                         scoring logic, reverse-scoring, localStorage,
│                         progress bar, page navigation.
│                         Change: question UI, progress UX, add Supabase save
│
├── results.html        ← Results page. Reads scores from URL hash.
│                         Contains: Chart.js radar chart, 15 interpretation
│                         texts (5 domains × 3 levels), 30 facet cards,
│                         share URL, PDF print stylesheet.
│                         Change: interpretation texts, chart style, add facet texts
│
└── styles.css          ← Shared design system. All visual styling.
                          Colors, typography, layout, responsive, print.
                          Change: any visual/design changes go here ONLY
```

## Data Flow

### 1. Items → Questions
The 120 IPIP-NEO items are embedded directly in `assessment.html` as a JavaScript array. Each item has:
```javascript
{ num: 1, text: "Worry about things", domain: "N", facet: 1, keyed: "plus" }
```
Items are shuffled on first load. The shuffle order is saved to localStorage so the user sees the same order if they resume.

### 2. Questions → Answers
User selects a response (1-5) for each item. Answers are stored in-memory and saved to localStorage after each page of 10 questions.

### 3. Answers → Scores
On completion, the scoring function:
1. Reverses minus-keyed items: `score = 6 - response`
2. Sums items per facet (4 items each → range 4-20)
3. Sums items per domain (24 items each → range 24-120)
4. Calculates averages (score / item count → range 1.0-5.0)
5. Assigns descriptors: avg > 3.5 = "High", 2.5-3.5 = "Average", < 2.5 = "Low"

### 4. Scores → URL
All scores (5 domains + 30 facets + age + gender) are packed into a JSON object, base64-encoded, and appended as the URL hash:
```
results.html#eyJkIjp7Ik4iOjYzLCJFIjo5MiwiTyI6MTAwLC...
```
This makes results shareable — anyone with the URL sees the same results.

### 5. URL → Results Page
`results.html` reads the hash, decodes the base64, and renders:
- Radar chart (Chart.js) from domain scores
- Domain blocks with interpretation text
- Facet cards with bar visualizations

### 6. (Future) Scores → Supabase
When Supabase is integrated, Step 4 adds: save scores to a `results` table with a short ID. The URL becomes `results.html?id=a7x9k2` and the page loads from Supabase instead of the hash.

## Key Design Decisions

### Why static HTML, not a framework?
- Zero build step. Open `index.html` and it works.
- Anyone can fork and deploy without learning React/Next.js/etc.
- AI can reason about the entire codebase (no framework abstraction layers).
- Stays below the [vibe coding ceiling](https://grassroothopper.com) — simple enough that a non-engineer can maintain it.

### Why items are embedded, not fetched?
- No network dependency. Works offline once loaded.
- No CORS issues. No API to maintain.
- The items are public domain — there's no reason to hide them behind an API.
- Trade-off: updating items requires editing `assessment.html`. Acceptable for 120 static items that never change.

### Why base64 URL hash for results?
- Zero server required for the core experience.
- Results are shareable via URL — paste it in a chat, it works.
- The user's data never leaves their browser unless they choose to save it.
- Trade-off: URLs are long and ugly. The Supabase short-ID solution fixes this in v1.

### Why localStorage for progress?
- Users can close the browser and resume where they left off.
- No account needed for the basic flow.
- Trade-off: clears if user wipes browser data. Supabase persistence is the v1 fix.

## The Assessment Items

120 items from the IPIP-NEO-120 (Johnson, 2014). Organized as:
- 5 domains: N (Neuroticism), E (Extraversion), O (Openness), A (Agreeableness), C (Conscientiousness)
- 6 facets per domain = 30 facets total
- 4 items per facet = 120 items total
- 71 plus-keyed + 49 minus-keyed = 120 items

**The items must not be modified.** Changing wording invalidates the psychometric properties. The interpretation texts (what we SAY about the scores) are fully customizable. The items (what we ASK) are not.

See [docs/scoring.md](docs/scoring.md) for full scoring methodology.

## Invariants (Things That Must Stay True)

1. **All 120 items are present and correctly keyed.** Any addition, removal, or rewording of items invalidates the assessment.
2. **Reverse scoring is correct.** Minus-keyed items: score = 6 - response. If this breaks, all results are wrong.
3. **The results URL is self-contained.** Given just the URL hash, the results page must render correctly with no other data source.
4. **No data is sent to any server without explicit user consent.** The default is fully client-side.
5. **The site works without JavaScript for the landing page.** The assessment and results require JS (Chart.js, scoring logic), but `index.html` should be readable without it.

## Where to Make Common Changes

| I want to... | Change this file | Specifically... |
|---|---|---|
| Update the landing page copy | `src/index.html` | The HTML content |
| Change colors/fonts/design | `src/styles.css` | CSS variables at the top |
| Edit interpretation texts | `src/results.html` | The `INTERPRETATIONS` object in the `<script>` block |
| Add a new language | `src/assessment.html` | The `ITEMS` array — duplicate and translate `text` fields |
| Add Supabase persistence | `src/assessment.html` + `src/results.html` | See [docs/supabase-setup.md](docs/supabase-setup.md) |
| Change scoring logic | `src/assessment.html` | The `calculateScores()` function |
| Modify the radar chart | `src/results.html` | The Chart.js configuration |
| Add a new page/module | Create new `.html` in `src/` | Link from `styles.css` shared nav |

## Future Architecture (v1 with Supabase)

```
Current (v0.1):
  Browser → localStorage → base64 URL → results page
  (fully static, no server)

Future (v1):
  Browser → Supabase (save scores) → short ID URL → results page
  Browser → Supabase (load scores) → render results
  (one database table, one API integration)
```

The Supabase integration adds exactly ONE table and TWO API calls (save + load). See [docs/supabase-setup.md](docs/supabase-setup.md) for the full plan.
