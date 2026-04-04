# Calibrated interpretive engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an instrument-scoped interpretive layer that emits a typed `InterpretiveReport` (nested `domains[*].facets`, confidence-aware `proseRegister`, v1 `ContextTag` enum, Openness channel model per spec), migrate Agreeableness + Openness template copy first, extract pattern-level `researchBlock` from default narrative, and ship results UI (invariant footer + session/research toggle).

**Architecture:** New modules under `src/engine/interpretive/` and `src/engine/instruments/` sit **between** existing `scoreProfile` / `evaluateRules` and template renderers. `runEngine` (and the duplicate inline engine in `results.html`) gains an **`interpretive`** (or top-level) field on the return object without breaking existing `domainTexts` / `teasers` until templates consume slots. `templates.js` gradually reads from the report + `researchMode` flag instead of baking PD language into default strings. **`results.html` duplicates engine code today** — any change to `engine.js` must be **ported** to the inline block (or the plan’s final tasks should extract a single `<script type="module">` source) so production results stay consistent.

**Tech stack:** Static HTML/CSS/JS; ES modules in `src/engine/`. Tests: **Node.js** built-in `node:test` + `node:assert/strict` (no `package.json` required). Spec: `docs/superpowers/specs/2026-04-04-calibrated-interpretive-engine-design.md`.

---

## File map

| File | Responsibility |
|------|------------------|
| `src/engine/instruments/ipip-neo-120.config.js` | `instrumentId`, v1 context tag list, Openness channel facet sets (aesthetic O1+O2, cognitive O5, values O6), O4 as non-channel note, O3 ambiguous metadata, observer-vulnerable facet set, balance tier floor constant |
| `src/engine/interpretive/context-tags.js` | Export frozen `CONTEXT_TAGS_V1` tuple + `isValidContextTag(x)` |
| `src/engine/interpretive/tiers.js` | `confidenceTier(facet, instrumentConfig)`, `ruleConfidenceTier(facets[])`, `isEligibleBalanceFacet(tier)` (silver+ only) |
| `src/engine/interpretive/signal.js` | `rhetoricalSignalClass(...)`, `proseRegister(...)` per spec (domain scatter aware) |
| `src/engine/interpretive/build-report.js` | `buildInterpretiveReport({ profile, rawScores, instrumentConfig, firedRules })` → `InterpretiveReport` shape |
| `src/engine/interpretive/build-report.test.js` | Node tests: nested facets, balance floor, O channels exclude O4, determinism |
| `src/engine/engine.js` | Call builder; attach report to return value |
| `src/engine/templates.js` | Migrate A + O domains; pattern `researchBlock` keys; default non-clinical copy |
| `src/engine/research-blocks.js` *(new)* | Optional: keyed strings for `researchBlock.correlations` / citations refs |
| `src/results.html` | Footer chrome; research toggle + `sessionStorage`/`localStorage` remember; pass `researchMode` into render path; **sync engine changes** |
| `docs/scoring.md` or `ARCHITECTURE.md` | Short subsection: interpretive layer + how to run `node --test` |

---

### Task 1: Instrument config + context tags

**Files:**
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\instruments\ipip-neo-120.config.js`
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\context-tags.js`
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\engine\normative-data.js` *(only if re-exporting imports become cleaner; prefer config importing from normative-data)*

- [ ] **Step 1: Add `context-tags.js` with frozen v1 enum**

```javascript
/** @type {readonly ['under_pressure','in_groups','in_conflict','intimate_settings','at_work','in_close_relationships']} */
export const CONTEXT_TAGS_V1 = Object.freeze([
  'under_pressure',
  'in_groups',
  'in_conflict',
  'intimate_settings',
  'at_work',
  'in_close_relationships',
]);

export function isValidContextTag(tag) {
  return CONTEXT_TAGS_V1.includes(tag);
}
```

- [ ] **Step 2: Add `ipip-neo-120.config.js`** importing `NORMS`, `REJECTED_FACETS`, `DOMAIN_FACETS` from `../normative-data.js` and defining:

```javascript
export const INSTRUMENT_ID = 'ipip-neo-120';

/** Facets that may show observer / self-presentation divergence notes (v1 list from spec). */
export const OBSERVER_VULNERABLE_FACETS = new Set([
  'A1', 'A2', 'A3', 'A5', 'A6', 'N2', 'C5', 'E3',
]);

/** Openness: named multi-facet channels only. O4 is domain-level facet, not a channel. */
export const OPENNESS_CHANNELS = {
  aesthetic: ['O1', 'O2'],
  cognitive: ['O5'],
  values: ['O6'],
};

/** Facets interpreted as weak/ambiguous vs broad O (still show facet row, exploratory register). */
export const OPENNESS_AMBIGUOUS_FACETS = new Set(['O3']);

export const BALANCE_FACET_MIN_CONFIDENCE = 'silver'; // gold|silver eligible; bronze|rejected never

export function getInstrumentConfig() {
  return {
    id: INSTRUMENT_ID,
    norms: NORMS,
    rejectedFacets: REJECTED_FACETS,
    domainFacets: DOMAIN_FACETS,
    opennessChannels: OPENNESS_CHANNELS,
    opennessAmbiguousFacets: OPENNESS_AMBIGUOUS_FACETS,
    observerVulnerableFacets: OBSERVER_VULNERABLE_FACETS,
    balanceFacetMinConfidence: BALANCE_FACET_MIN_CONFIDENCE,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/interpretive/context-tags.js src/engine/instruments/ipip-neo-120.config.js
git commit -m "feat(engine): add IPIP-120 interpretive instrument config and v1 context tags"
```

---

### Task 2: Tier floor + classification helpers + tests

**Files:**
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\tiers.js`
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\signal.js`
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\tiers.test.js`

- [ ] **Step 1: Implement `tiers.js`**

Reuse alpha thresholds from `getConfidenceTier` logic (import from `normative-data.js` or duplicate the numeric cuts to avoid circular deps — prefer importing `getConfidenceTier` from `normative-data.js`).

```javascript
import { getConfidenceTier } from '../normative-data.js';

export function confidenceTierForFacet(facetCode) {
  return getConfidenceTier(facetCode);
}

export function ruleWeakestTier(facetCodes) {
  const order = { gold: 3, silver: 2, bronze: 1, rejected: 0 };
  let worst = 'gold';
  for (const f of facetCodes) {
    const t = confidenceTierForFacet(f);
    if (t === 'rejected') return 'rejected';
    if (order[t] < order[worst]) worst = t;
  }
  return worst;
}

export function isEligibleBalanceFacet(tier) {
  return tier === 'gold' || tier === 'silver';
}
```

- [ ] **Step 2: Write failing tests for balance floor**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEligibleBalanceFacet, ruleWeakestTier } from './tiers.js';

test('balance facet eligibility requires silver or gold', () => {
  assert.equal(isEligibleBalanceFacet('gold'), true);
  assert.equal(isEligibleBalanceFacet('silver'), true);
  assert.equal(isEligibleBalanceFacet('bronze'), false);
  assert.equal(isEligibleBalanceFacet('rejected'), false);
});
```

- [ ] **Step 3: Implement minimal `signal.js`** with `proseRegisterFromTiers({ rhetoricalSignalClass, confidenceTier })` mapping core+gold → `direct`, etc., **stub** until golden cases emerge from Task 3 (acceptable to implement a conservative table in Task 2).

- [ ] **Step 4: Run tests**

Run:

```text
node --test src/engine/interpretive/tiers.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/interpretive/tiers.js src/engine/interpretive/signal.js src/engine/interpretive/tiers.test.js
git commit -m "feat(engine): interpretive tier helpers and balance eligibility tests"
```

---

### Task 3: `buildInterpretiveReport` skeleton + structural tests

_Files:_
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\build-report.js`
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\build-report.test.js`
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\engine\engine.js`

- [ ] **Step 1: Implement builder that returns object matching spec sketch**

Minimum for this task (YAGNI):

- `instrumentId`, `domains.N..C` each with `domainPercentile`, `facets` array (one entry per facet in that domain from raw score keys or `NORMS`), each facet with `facetCode`, `confidenceTier`, `proseRegister`, `observerVulnerable` boolean.
- Populate `opennessChannels` only on O: `aesthetic`, `cognitive`, `values` — **no** experiential channel; confirm **O4** appears under `domains.O.facets` but **not** inside channel aggregates.
- `patterns`: map each fired rule to `{ ruleId, ingredientFacetCodes, confidenceTier: ruleWeakestTier(rule.facets), researchBlock: undefined }` placeholder (content in Task 5).
- `facetByCode`: optional `Record` built from nested facets.

- [ ] **Step 2: Test O4 not in any openness channel bucket**

```javascript
test('O4 is not grouped into opennessChannels aggregates', async (t) => {
  const { buildInterpretiveReport } = await import('./build-report.js');
  const { scoreProfile } = await import('../scoring.js');
  const { evaluateRules } = await import('../rules.js');
  const { getInstrumentConfig } = await import('../instruments/ipip-neo-120.config.js');
  const raw = {};
  for (const code of [
    'N1','N2','N3','N4','N5','N6','E1','E2','E3','E4','E5','E6',
    'O1','O2','O3','O4','O5','O6','A1','A2','A3','A4','A5','A6',
    'C1','C2','C3','C4','C5','C6',
  ]) raw[code] = 14;
  const profile = scoreProfile(raw);
  const fired = evaluateRules(profile);
  const report = buildInterpretiveReport({
    profile,
    rawScores: raw,
    instrumentConfig: getInstrumentConfig(),
    firedRules: fired,
  });
  assert.ok(report.opennessChannels);
  assert.ok(!('experiential' in report.opennessChannels));
  const ch = report.opennessChannels;
  assert.deepEqual(ch.aesthetic?.facetCodes?.sort(), ['O1', 'O2']);
  assert.deepEqual(ch.cognitive?.facetCodes?.sort(), ['O5']);
});
```

Adjust property names (`facetCodes` vs spec’s internal naming) to match implementation but keep assertion intent.

- [ ] **Step 3: Test determinism**

Same inputs → `JSON.stringify(report)` stable (sort keys if needed before compare, or compare selected fields).

- [ ] **Step 4: Wire `engine.js`**

After existing pipeline steps, set `interpretive: buildInterpretiveReport({ profile, rawScores, instrumentConfig: getInstrumentConfig(), firedRules: firedRules })` (use the same `firedRules` array variable names as in file).

- [ ] **Step 5: Copy changes into `results.html` inline engine**

Search for `function runEngine` in `results.html` and merge the same `interpretive` attachment so hash-driven results match module tests.

- [ ] **Step 6: Run tests**

```text
node --test src/engine/interpretive/build-report.test.js src/engine/interpretive/tiers.test.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/engine/interpretive/build-report.js src/engine/interpretive/build-report.test.js src/engine/engine.js src/results.html
git commit -m "feat(engine): build InterpretiveReport with nested domain facets and O channels"
```

---

### Task 4: Template migration — Agreeableness + Openness domains

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\engine\templates.js`
- Reference: `interpretive` output from `engine.js` when available *(or thread `report` into `getDomainText` — minimal invasive: read from a module-level `setInterpretiveContext(report)` only if cleaner than signature change; prefer explicit parameters `getDomainText(dom, pct, P, D, S, report)`)*

- [ ] **Step 1: Extend `getDomainText` signature** in `templates.js` and `engine.js` call site: add optional `report` as last argument; when absent, keep legacy wording path for domains not yet migrated.

- [ ] **Step 2: Rewrite `A` and `O` domain copy** to:
  - use `report.domains.A.proseRegister` / `report.domains.O.proseRegister` to pick hedge strength,
  - remove PD-first sentences from default `very_low` / `very_high` **A** blocks (move strings to Task 5 `researchBlock` registry keyed by domain-level is **out of scope** — only pattern-level v1; for **domain** migration, **delete or neutralize** PD sentences entirely from default layer rather than moving to domain researchBlock),
  - for **O**, describe aesthetic vs cognitive vs values channels when `opennessChannels` shows divergence; never claim O3 = “Openness” same as O5.

- [ ] **Step 3: Manually open `results.html`** with a fixture hash or `debug.html` persona that stresses low A and high O scatter; verify default text contains no personality-disorder-forward phrasing in opening sentences.

- [ ] **Step 4: Commit**

```bash
git add src/engine/templates.js src/engine/engine.js src/results.html
git commit -m "fix(copy): narratives for Agreeableness and Openness use interpretive report"
```

---

### Task 5: Extract pattern-level `researchBlock` from templates

**Files:**
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\engine\research-blocks.js`
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\engine\templates.js`
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\engine\interpretive\build-report.js`

- [ ] **Step 1: Create registry** exporting `getResearchBlock(ruleId)` returning `{ correlations, citations }` string refs (or plain strings) **only** for rules that currently cite Samuel & Widiger / OCPD / PD features in `templates.js`.

- [ ] **Step 2: Default teaser/full** renders **without** those paragraphs; when `researchMode === true`, renderer appends research block below fold.

- [ ] **Step 3: Implement balance line** for selected cross-rules: curated `balanceHint` in registry; `balanceFacetRefs` filled in builder only when `isEligibleBalanceFacet` holds for candidates **and** ingredient tiers meet spec (silver+ for augment).

- [ ] **Step 4: Commit**

```bash
git add src/engine/research-blocks.js src/engine/templates.js src/engine/interpretive/build-report.js src/results.html
git commit -m "feat(engine): pattern researchBlock behind researchMode + balance hints"
```

---

### Task 6: Results UI — invariant footer + research toggle

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\results.html`
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\styles.css` *(footer styling — if results use print styles, ensure footer appears once)*

- [ ] **Step 1: Add non-dismissable footer element** outside dynamic interpretation containers with fixed copy aligned to spec “descriptive not diagnostic.”

- [ ] **Step 2: Add toggle** “Show research framing (correlations, not diagnosis)” default off; store in `sessionStorage`; optional “Remember on this device” → `localStorage` overrides on load.

- [ ] **Step 3: Pass `researchMode` boolean** into the function that renders teasers / full texts so `researchBlock` sections appear only when true.

- [ ] **Step 4: Commit**

```bash
git add src/results.html src/styles.css
git commit -m "feat(results): invariant disclaimer footer and research mode toggle"
```

---

### Task 7: Documentation + test command

- [ ] **Step 1: Add to `ARCHITECTURE.md`** under engine: interpretive layer file map + `node --test src/engine/interpretive/*.test.js`.

- [ ] **Step 2: Commit**

```bash
git add ARCHITECTURE.md
git commit -m "docs: document interpretive engine modules and node tests"
```

---

## Spec coverage checklist (self-review)

| Spec section | Task |
|--------------|------|
| Instrument-scoped config | Task 1 |
| v1 ContextTag enum | Task 1 |
| Openness channels (O4 domain-level, O3 ambiguous) | Task 1, 3 |
| Nested `domains[*].facets` | Task 3 |
| `facetByCode` optional | Task 3 |
| Silver+ balance floor | Task 2, 5 |
| Derived augment only when silver+ ingredients | Task 5 |
| `proseRegister` no inheritance (facet vs domain) | Task 3–4 |
| Pattern-only `researchBlock` v1 | Task 5 |
| Observer list includes E3 | Task 1 |
| Invariant footer DOM | Task 6 |
| Session + remember research mode | Task 6 |
| Non-clinical default A/O copy | Task 4 |

**Placeholder scan:** No TBD steps; open work is explicitly “stub prose table” in Task 2 with refinement in Task 4.

---

**Plan complete and saved to** `docs/superpowers/plans/2026-04-04-calibrated-interpretive-engine-plan.md`.

**Execution options:**

1. **Subagent-driven (recommended)** — Fresh subagent per task, review between tasks.
2. **Inline execution** — Run tasks in this session with checkpoints between tasks.

Which approach do you want?
