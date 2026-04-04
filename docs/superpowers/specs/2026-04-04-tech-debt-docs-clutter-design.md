# Design: Tech debt — documentation, ROADMAP truth, dead paywall CSS

**Date:** 2026-04-04  
**Status:** Implemented (2026-04-04)  
**Scope:** Single cohesive change set (docs + one stylesheet deletion + one HTML token fix)

## Problem

Contributor-facing docs and the roadmap describe an older product snapshot (v0.1-era: no server, hash-only sharing, `file://` local use). The shipped product includes Supabase persistence, `?id=` result URLs, research opt-in, and a **module-based** results page. That mismatch erodes trust and misleads local setup.

Separately, **~164 lines** of v0.4 paywall UI CSS remain in `styles.css` with **no** HTML or JS references — pure weight and confusion.

A small **UI bug** on the results page uses a non-existent CSS variable `--bg-cream-dark` with a fallback hex that does not match the design token `--cream-dark` (`#EDE8DF` in `styles.css`).

## Goals

1. **Remove dead paywall-era CSS** from `styles.css` and clean up dependent rules (e.g. print stylesheet selector list).
2. **Fix the research opt-in container background** in `results.html` to use the real design token.
3. **Rewrite `README.md`** so “what it does / doesn’t do,” tech stack, project structure, and “run locally” match reality — including that **ES modules on `results.html` require HTTP** (browser security blocks `file://` module imports), so the **full user flow** (assessment → results with engine) requires serving `src/` over HTTP.
4. **Update `ROADMAP.md`** so shipped work is visible, future work is accurate, and narration matches product decisions below.

## Non-goals (defer unless a follow-up spec)

- Moving the large inline `<style>` block from `results.html` into `styles.css`.
- Consolidating duplicate facet labels across assessment / results / norms.
- Radar chart data source (raw linear map vs engine percentiles).
- Nav standardization across pages, Perplexity meta tag cleanup, `docs/paywall-setup.md` archival, `.gitignore` for IDE config.
- Any behavioral change to scoring, engine, or Supabase.

## ROADMAP narration (product decisions)

### v0.2 through v0.3

Mark as **shipped** where the codebase already reflects: Supabase-backed results, short URLs, `results.html` loading from `?id=` (and hash fallback where still implemented), research opt-in on the results page, and supporting docs (e.g. `docs/supabase-setup.md`). Adjust section headers from “Next/Then” to past tense or “Shipped” where appropriate so readers see a chronological truth.

### v0.4 — Paywall (payment + access codes)

Label this milestone **deferred**, not cancelled: it was **deliberately shelved** to ship and validate v0.5 without paywall friction. Keep original task ideas if useful, but make clear it is **not** committed as the immediate next step — the door stays open without implying “paywall is next.”

### v0.5 — What actually shipped

Replace the old framing (“90 facet interpretation texts — 30 facets × 3 levels”) with the **implemented architecture**:

- **Cross-facet pattern engine** — **25 priority rules** in `src/engine/rules.js` (15 cross-connection rules, 10 single-facet flag rules, per module header).
- **Domain-level interpretive templates** wired through the engine orchestrator.
- **Research blocks** and calibrated interpretive layers as documented in the existing interpretive engine design/plan (`docs/superpowers/specs/2026-04-04-calibrated-interpretive-engine-design.md` and related plan).

v0.6 and beyond should be edited only where they still assume the old “90 facet texts” prerequisite — align wording with the new interpretation model without ballooning scope.

### v0.1 historical section

Either fold v0.1 into a short “history” blurb or clearly mark it as superseded so “current” is not read as “still the only shipped state.” Implementation can choose minimal edit (e.g. one line: “Superseded by v0.2+; kept for context”) vs fuller restructure.

## File-level specification

### `src/styles.css`

- **Delete** the block from the comment `PAYWALL — v0.4 Teaser/Unlock System` through the end of the paywall responsive `@media (max-width: 600px)` subsection (approximately lines 991–1154 in the 2026-04-04 tree). This includes `.interp-locked`, `.paywall-*`, `.btn--disabled`, `.unlock-banner`, `.interp-unlocking`, and related `@keyframes`.
- **Update** `@media print` rule: remove `.paywall-card` from the selector list that sets `display: none !important`.
- **Confirm** via search: no remaining references to removed classes in HTML/JS (baseline: none today).

### `src/results.html`

- In the research opt-in section (inline `style` on the container `id="research-section"` wrapper or equivalent): replace `var(--bg-cream-dark, #F0EBE3)` with **`var(--cream-dark, #EDE8DF)`** to match `:root` in `styles.css`.

### `README.md`

- **Privacy / data:** Clarify optional Supabase persistence (short result IDs), what is stored, and that the project still minimizes tracking relative to typical products. Remove or qualify blanket claims like “no data sent to any server” if Supabase is enabled in the shipped flow.
- **Storage / sharing:** Describe `?id=` permalinks (and any remaining hash fallback if still true) instead of “Base64 URL hash only.”
- **Tech stack table:** Include Supabase client, note Chart.js from CDN, and that **`results.html` uses ES modules** (`<script type="module">`).
- **Run locally:** State that **`file://` is insufficient for the full assessment → results path** because module imports require HTTP; recommend `python -m http.server` or equivalent from `src/` (or repo root with correct path), and optionally note that opening landing page alone via file may still work but is not the supported dev path.
- **Project structure:** List substantial files under `src/` today (e.g. `debug.html`, `supabase-results.js`, `test-personas.js`, `engine/` directory) so the tree matches the repo.

### `ROADMAP.md`

- Apply **ROADMAP narration** section above; checkbox and heading edits should leave the document internally consistent with `README.md` and the codebase.

## Verification

- Grep: no `paywall-`, `interp-locked`, `unlock-banner`, `btn--disabled` in `styles.css` after deletion (except if reintroduced elsewhere — should be none).
- Manual: serve `src/` over HTTP; run assessment through to results; visually confirm research opt-in panel background matches cream-dark token.
- Read-through: README and ROADMAP do not contradict each other on Supabase, URLs, or module/`file://` requirements.

## Risks

- **Over-editing ROADMAP:** Keep v1.0 / beyond sections honest; defer paywall without rewriting long-term vision unrelated to this task.
- **README legal/privacy tone:** Favor accurate minimal disclosure; avoid implying clinical or analytics claims the product does not make.

---

## Spec self-review (2026-04-04)

- **Placeholders:** None; rule count grounded in `rules.js` module header.
- **Consistency:** Deferred v0.4 and shipped v0.5 wording aligned with user approval; token fix matches `:root --cream-dark`.
- **Scope:** Single PR scope; non-goals listed to prevent scope creep.
- **Ambiguity:** “Approximate” paywall line range noted; implementer should delete by section markers, not blind line numbers.
