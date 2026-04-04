# Design: Browser fixture testing (personas + short manual path)

**Status:** Approved for implementation planning  
**Date:** 2026-04-04  
**Replaces:** Cursor plan `debug_testing_pipeline_ae1c3666.plan.md` emphasis on hidden debug pages, duplicate scoring paths, and Playwright-first scope. This design keeps **one hub page**, extends **`assessment.html`**, adds **fixture data**, and uses **real DOM actions** only.

## Goals

1. **Persona replay** — From a small hub, one primary action runs the **real** assessment UI through all **120** items using **pre-authored answers** (1–5 per `item.num`). The user **watches** the flow advance (~**1 second dwell per page** after answers on that page are applied). Navigation and completion use the **same controls** as a human (`option-btn` clicks, then `Next →` / `Finish →`).
2. **Short manual path** — `assessment.html?debug=1` lets a human answer **five** items on the real assessment UI, then the app **auto-fills** the remaining **115** items via the same click mechanism, continues through pages, and completes like a normal run (results + optional Supabase save).
3. **Manual coherence check** — Five named fixtures (public figures) with **documented expected directions** on the Big Five so obvious mismatches between known reputation and rendered results flag scoring, keying, or interpretation bugs.
4. **No extra automation in v1** — No `package.json`, Playwright, or CI test gate unless added later as an optional layer on top of this contract.

**Non-goals:** Clinical claims about real individuals; automated assertions in CI; shortcut URLs that skip the assessment entirely (persona path must exercise the assessment shell).

## Ethics and copy

- Fixtures are **illustrative QA personas**, not psychological diagnoses of living or deceased people.
- Hub page must include a clear line: *Illustrative fixtures for testing only — not claims about any real person.*
- Display names may be the public figure labels you chose for communication (`Trump`, `Steve Jobs`, …).

## Fixture set (directional expectations)

Use these as **manual** eyeball checks on domain/facet **direction**, not exact percentile targets:

| Fixture id | Label        | Rough expected signal (if answers are consistent) |
|------------|--------------|-----------------------------------------------------|
| `trump`    | Trump        | Very high Extraversion / assertiveness; very low Agreeableness; lower Openness; elevated Neuroticism (reactive) patterns possible |
| `jobs`     | Steve Jobs   | Very high Openness + Conscientiousness; very low Agreeableness |
| `tyson`    | Mike Tyson   | High Neuroticism + Extraversion; lower Agreeableness + Conscientiousness |
| `ross`     | Bob Ross     | Very high Agreeableness + Openness; very low Neuroticism |
| `cobain`   | Kurt Cobain  | Very high Neuroticism + Openness; lower Extraversion + Conscientiousness |

**Implementation note:** During implementation, each fixture is a map `{ [itemNum: number]: 1 | 2 | 3 | 4 | 5 }` with **all 120 keys** present. Authoring order can follow `ITEMS` order in `assessment.html` for maintainability.

## Architecture

### 1. `src/test-personas.js`

- **Exports** (global or IIFE assignment — match how other shared scripts load): fixture metadata (`id`, `displayName`, `expectedBlurb`, `defaultAge`, `defaultGender`) plus `answers` keyed by `item.num`.
- **No scoring or hash encoding in this file** for the persona path: the assessment completion path must call existing `computeScores()` / `encodeResults()` after state is filled entirely via the UI.

### 2. `src/debug.html` (hub)

- Uses existing `styles.css` for a **clear, calm** layout: title, disclaimer, fixture cards or list.
- **Primary control per fixture:** one button or link → navigates to `assessment.html?fixture=<id>` (exact query name to implement; **`fixture`** is recommended).
- **Secondary:** link to `assessment.html?debug=1` with short explanation (“Answer 5 items, rest auto-filled; real UI”).
- **Optional:** link back to `index.html`. No requirement to hide this page on production (per product choice).

### 3. `assessment.html` extensions

**Shared rules:**

- **Mechanism:** Only **`HTMLElement.prototype.click()`** (or equivalent user-visible activation) on real `.option-btn` elements with matching `data-item` / `data-value`, and on `#next-btn` / `Finish` when enabled. Do **not** set `state.answers` and call `renderAssessment()` internally for fixture replay except where the **only** way to stay in sync is a minimal hook — preference is always **DOM-first** so production listeners and `checkPageComplete()` behave exactly as for users.
- **Timing:** After all ten answers on a page are clicked, enforce **≥ 1 s** dwell on that page before clicking **Next** (or **Finish** on page 12). Micro-delays between successive option clicks on the same page are allowed (e.g. tens of ms) so motion is visible within the 1 s budget.
- **Shuffle:** Use the normal `shuffleOrder` created at session start. Answers are keyed by **`item.num`**, so order of items on screen does not require a separate per-fixture shuffle.
- **localStorage:** Fixture and short-manual modes must **not** fight the resume modal: on entry, clear or bypass persisted assess state per a single documented strategy (e.g. `clearState()` before starting fixture session after pre-screen).
- **Resume modal:** When `fixture` or `debug` query is present and user lands after agreeing to pre-screen, skip offering resume for **that** load (implementation detail: document in code comment).

**`?fixture=<id>`**

1. Load `test-personas.js` before inline assessment script (or bundle in one place if refactor is minimal).
2. After demographics (`renderPre` completion), initialize state for assessment with fixture’s `defaultAge` / `defaultGender` (or fixed neutral defaults documented in fixture table if you prefer one row for all).
3. Enter `renderAssessment()` and start **autoplay**: for each page, for each visible item in DOM order, click the `.option-btn` whose `data-value` equals `answers[item.num]`. Then wait 1 s, click `#next`, repeat until **Finish** triggers existing `renderCalculating()` flow.

**`?debug=1`**

1. After pre-screen, normal shuffle and **`renderAssessment`**, **first page only** shows **five** questions (items `shuffleOrder[0]` … `shuffleOrder[4]` — five distinct `item.num` values). Layout and components match production (progress bar, option buttons, typography).
2. User answers all five manually; **Next** enabled per existing rules adapted for five items.
3. On **Next**, switch to autoplay: for remaining indices `shuffleOrder[5..119]`, for each page render, programmatic clicks fill options with a **neutral** value (recommend **3** for all auto items unless a seeded variance is specified later), **1 s** dwell per page, then Next/Finish until completion.

**Query co-occurrence:** If both `fixture` and `debug` appear, implementation should define precedence (recommend **`fixture` wins** and `debug` is ignored).

## Verification (human)

**Persona run:** Complete run ends on `results.html`; radar and domain copy load; spot-check against fixture table; no `NaN` / broken layout in primary UI.

**Short manual:** Answer five items; observe auto-advance; results load.

**Regression:** Normal `assessment.html` without query params unchanged for real users.

## Documentation updates (with implementation)

- `ARCHITECTURE.md` or `CONTRIBUTING.md`: short “Developer testing” subsection — `debug.html`, `?fixture=`, `?debug=1`, disclaimer.
- Optional link from `index.html` footer (“Testing tools”) — product decision; not required by this spec.

## Future (optional, non-blocking)

- Second dwell preset (e.g. ~2 s per question) for deep review.
- `package.json` + Playwright that only drives the same URLs and checks canvas + no console error — **after** manual workflow is stable.

## Open point for implementation plan

- **Demographics:** Whether each fixture specifies `age` / `gender` for norms on `results.html` or a single default (e.g. `26–30`, `male`) is chosen for all fixtures to reduce authoring noise. Pick one approach in `plan.md` and keep fixtures consistent.
