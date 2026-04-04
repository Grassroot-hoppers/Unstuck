# Browser fixture testing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `debug.html`, `src/test-personas.js`, and `assessment.html` changes so named fixtures replay all 120 items via real DOM clicks (~1 s dwell per page), and `?debug=1` runs five manual items then auto-fills the rest the same way.

**Architecture:** Split `assessment.html` into **three consecutive script blocks**: (1) defines `window.UNSTUCK_ITEMS` (same data as today’s `ITEMS`), `window.buildFixtureAnswersFromFacetMeans`, and any tiny helpers; (2) loads `test-personas.js`, which registers fixture metadata + **facet mean maps** (30 values per persona) and resolves full `{ itemNum → 1..5 }` answers via `buildFixtureAnswersFromFacetMeans`; (3) main app uses `const ITEMS = window.UNSTUCK_ITEMS` (or equivalent) so the rest of the file stays unchanged aside from explicit `ITEMS` → source. **Autoplay** is a small scheduler that only uses `.click()` on `.option-btn` and `#next-btn`. **Demographics:** all fixtures use `defaultAge: '26-30'`, `defaultGender: 'male'` for normed results unless you later add per-fixture overrides in `test-personas.js`.

**Tech stack:** Static HTML/CSS/JS only (no `package.json`, no Playwright). Matches `docs/superpowers/specs/2026-04-04-browser-fixture-testing-design.md`.

---

## File map

| File | Responsibility |
|------|------------------|
| `src/assessment.html` | Three-script layout; URL flags `fixture`, `debug`; resume/init guards; `renderPre` auto-fill for fixture mode; `renderAssessment` debug first page + completion of page 0; autoplay scheduler |
| `src/test-personas.js` | `window.UnstuckTestPersonas` registry, facet `facetMeans` per fixture (keys `N1`…`C6`), disclaimers / blurbs |
| `src/debug.html` | Hub UI + links to `assessment.html?fixture=*` and `assessment.html?debug=1` |
| `docs/superpowers/specs/2026-04-04-browser-fixture-testing-design.md` | Spec (read-only reference) |
| `ARCHITECTURE.md` or `CONTRIBUTING.md` | Short “Developer testing” subsection |

**Spec note:** Each fixture’s **answers** object always has keys `1..120` — they are **computed at runtime** from `facetMeans` + `UNSTUCK_ITEMS` keying. That satisfies the spec’s “full mapping” requirement; facet tables are the **authored** surface you tune when a persona looks wrong on results.

---

### Task 1: Split scripts and expose `UNSTUCK_ITEMS` + `buildFixtureAnswersFromFacetMeans`

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\assessment.html`

- [ ] **Step 1: Close the first script block right after the `ITEMS` array**

Today `ITEMS` ends before `OPTIONS`. After the closing `];` of `ITEMS`, add the helper (still in the same first block for clarity):

```javascript
function normalizeFacetKey(domain, facetNum) {
  return domain + String(facetNum);
}

function clampLikert(n) {
  return Math.max(1, Math.min(5, Math.round(Number(n))));
}

window.UNSTUCK_ITEMS = ITEMS;

window.buildFixtureAnswersFromFacetMeans = function (facetMeans) {
  const answers = {};
  for (const item of ITEMS) {
    const code = normalizeFacetKey(item.domain, item.facet);
    const T = facetMeans[code];
    if (T === undefined) {
      throw new Error('Missing facet mean for ' + code);
    }
    const r =
      item.keyed === 'minus'
        ? clampLikert(6 - T)
        : clampLikert(T);
    answers[item.num] = r;
  }
  return answers;
};
```

Insert `</script>` after the above.

- [ ] **Step 2: Add `<script src="test-personas.js"></script>`**

Place the tag immediately after the first `</script>`.

- [ ] **Step 3: Open a new `<script>` and re-bridge `ITEMS` for the rest of the file**

At the top of the third script block:

```javascript
const ITEMS = window.UNSTUCK_ITEMS;
```

Leave all following code (`OPTIONS`, `FACET_NAMES`, state, render functions) in this third block unchanged except for additions in later tasks.

- [ ] **Step 4: Open `assessment.html` in a browser with no query params**

Run through pre-screen and confirm the assessment still renders page 1 (smoke).

Expected: Same behavior as before Task 1.

- [ ] **Step 5: Commit**

```bash
git add src/assessment.html src/test-personas.js
git commit -m "refactor(assessment): split script; expose UNSTUCK_ITEMS and facet answer builder"
```

(If `test-personas.js` does not exist yet, create an empty placeholder in Step 1 or add the file in Task 2 — prefer adding minimal `test-personas.js` with `window.UnstuckTestPersonas = { listFixtures() { return []; } };` before Step 5.)

---

### Task 2: Add `src/test-personas.js` with five fixtures (facet means)

**Files:**
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\test-personas.js`

- [ ] **Step 1: Create the registry**

Facet keys must cover all 30: `N1`…`N6`, `E1`…`E6`, `O1`…`O6`, `A1`…`A6`, `C1`…`C6`. Values are **targets on the scored 1–5 facet scale** (after item keying); integers 1–5 are fine.

```javascript
(function () {
  const DEFAULT_AGE = '26-30';
  const DEFAULT_GENDER = 'male';

  const FIXTURES = [
    {
      id: 'trump',
      displayName: 'Trump',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect strong Extraversion/assertiveness flavor, very low Agreeableness, lower Openness, reactive Neuroticism possible.',
      facetMeans: {
        N1: 4, N2: 4, N3: 3, N4: 3, N5: 3, N6: 4,
        E1: 5, E2: 5, E3: 5, E4: 5, E5: 4, E6: 4,
        O1: 2, O2: 2, O3: 2, O4: 3, O5: 2, O6: 2,
        A1: 1, A2: 1, A3: 1, A4: 1, A5: 2, A6: 1,
        C1: 2, C2: 3, C3: 2, C4: 3, C5: 2, C6: 2,
      },
    },
    {
      id: 'jobs',
      displayName: 'Steve Jobs',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Openness + Conscientiousness, very low Agreeableness.',
      facetMeans: {
        N1: 3, N2: 4, N3: 3, N4: 3, N5: 2, N6: 3,
        E1: 4, E2: 3, E3: 5, E4: 4, E5: 3, E6: 3,
        O1: 5, O2: 5, O3: 4, O4: 5, O5: 5, O6: 4,
        A1: 1, A2: 2, A3: 1, A4: 2, A5: 2, A6: 2,
        C1: 5, C2: 5, C3: 5, C4: 5, C5: 4, C6: 5,
      },
    },
    {
      id: 'tyson',
      displayName: 'Mike Tyson',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect high Neuroticism + Extraversion; lower Agreeableness + Conscientiousness.',
      facetMeans: {
        N1: 5, N2: 5, N3: 4, N4: 4, N5: 4, N6: 5,
        E1: 4, E2: 4, E3: 3, E4: 5, E5: 5, E6: 3,
        O1: 3, O2: 3, O3: 3, O4: 3, O5: 2, O6: 2,
        A1: 2, A2: 1, A3: 2, A4: 1, A5: 2, A6: 2,
        C1: 2, C2: 2, C3: 2, C4: 2, C5: 1, C6: 2,
      },
    },
    {
      id: 'ross',
      displayName: 'Bob Ross',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Agreeableness + Openness, very low Neuroticism.',
      facetMeans: {
        N1: 1, N2: 1, N3: 1, N4: 1, N5: 1, N6: 1,
        E1: 3, E2: 3, E3: 3, E4: 2, E5: 2, E6: 4,
        O1: 5, O2: 4, O3: 4, O4: 4, O5: 4, O6: 3,
        A1: 5, A2: 5, A3: 5, A4: 5, A5: 4, A6: 5,
        C1: 4, C2: 3, C3: 4, C4: 4, C5: 4, C6: 3,
      },
    },
    {
      id: 'cobain',
      displayName: 'Kurt Cobain',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Neuroticism + Openness; lower Extraversion + Conscientiousness.',
      facetMeans: {
        N1: 5, N2: 5, N3: 5, N4: 5, N5: 4, N6: 5,
        E1: 2, E2: 1, E3: 2, E4: 1, E5: 2, E6: 2,
        O1: 5, O2: 5, O3: 5, O4: 4, O5: 4, O6: 3,
        A1: 2, A2: 2, A3: 3, A4: 2, A5: 3, A6: 2,
        C1: 2, C2: 2, C3: 2, C4: 1, C5: 1, C6: 2,
      },
    },
  ];

  function getFixture(id) {
    return FIXTURES.find((f) => f.id === id) || null;
  }

  function listFixtures() {
    return FIXTURES.slice();
  }

  function getFixtureAnswers(id) {
    const f = getFixture(id);
    if (!f) throw new Error('Unknown fixture: ' + id);
    const builder = window.buildFixtureAnswersFromFacetMeans;
    if (typeof builder !== 'function') {
      throw new Error('buildFixtureAnswersFromFacetMeans not loaded');
    }
    return builder(f.facetMeans);
  }

  window.UnstuckTestPersonas = {
    listFixtures,
    getFixture,
    getFixtureAnswers,
  };
})();
```

- [ ] **Step 2: Sanity-check in DevTools (optional)**

On a throwaway HTML that loads block 1 + `test-personas.js`, run:

```javascript
Object.keys(UnstuckTestPersonas.getFixtureAnswers('trump')).length === 120
```

Expected: `true` (after Task 1 wiring exists on `assessment.html` you can use that page).

- [ ] **Step 3: Commit**

```bash
git add src/test-personas.js
git commit -m "feat(test): add persona facet fixtures and registry"
```

---

### Task 3: URL flags, init guards, and `renderPre` prefill

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\assessment.html` (third script block)

- [ ] **Step 1: Parse query flags once**

Near the top of the third script (after `const ITEMS = window.UNSTUCK_ITEMS`):

```javascript
const __qs = new URLSearchParams(window.location.search);
const __fixtureId = __qs.get('fixture');
const __debugShort =
  __qs.has('debug') &&
  __qs.get('debug') !== '0' &&
  __qs.get('debug') !== 'false';
const __activeFixtureId =
  __fixtureId && window.UnstuckTestPersonas && UnstuckTestPersonas.getFixture(__fixtureId)
    ? __fixtureId
    : null;
const __debugMode = !__activeFixtureId && __debugShort;
```

- [ ] **Step 2: Adjust `init()` resume rule**

When `__activeFixtureId || __debugMode`, do **not** show the resume modal — start fresh:

```javascript
function init() {
  if (__activeFixtureId || __debugMode) {
    clearState();
    state = {
      phase: 'pre',
      age: '',
      gender: '',
      currentPage: 0,
      answers: {},
      shuffleOrder: [],
      startTime: null,
      fixtureId: __activeFixtureId,
      debugShort: __debugMode,
      debugManualDone: false,
    };
    renderPre();
    return;
  }

  const saved = loadState();
  if (saved && saved.phase === 'assess' && Object.keys(saved.answers || {}).length > 0) {
    renderResumeModal(saved);
  } else {
    renderPre();
  }
}
```

Extend the initial `let state = { ... }` with `fixtureId: null, debugShort: false, debugManualDone: false` for documentation; `init` will overwrite when needed.

- [ ] **Step 3: `renderPre` — fixture demographics prefill**

Inside `renderPre`, after wiring `ageSelect` / `genderSelect` / `beginBtn`, add:

```javascript
if (state.fixtureId && window.UnstuckTestPersonas) {
  const fx = UnstuckTestPersonas.getFixture(state.fixtureId);
  if (fx) {
    ageSelect.value = fx.defaultAge;
    genderSelect.value = fx.defaultGender;
    checkReady();
  }
}
```

- [ ] **Step 4: Manual check**

Open `assessment.html?fixture=ross`. Expect age 26–30 and gender male pre-selected; Begin enabled.

- [ ] **Step 5: Commit**

```bash
git add src/assessment.html
git commit -m "feat(assessment): fixture/debug query flags and resume bypass"
```

---

### Task 4: `renderAssessment` — debug first page + page-0 completion

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\assessment.html`

- [ ] **Step 1: Compute `pageItems` then `visibleItems`**

Replace use of `pageItems` in template with:

```javascript
const pageItems = pageItemIndices.map((i) => ITEMS[i]);
const debugManualPhase =
  state.debugShort && !state.debugManualDone && pageIndex === 0;
const visibleItems = debugManualPhase ? pageItems.slice(0, 5) : pageItems;
```

Use `visibleItems` everywhere the template iterates questions (`.map` for question blocks). Keep progress math based on `pageIndex` and `TOTAL_PAGES` unchanged.

- [ ] **Step 2: Fix `checkPageComplete`**

Use `visibleItems` instead of `pageItems`:

```javascript
function checkPageComplete() {
  const allAnswered = visibleItems.every(
    (item) => state.answers[item.num] !== undefined
  );
  document.getElementById('next-btn').disabled = !allAnswered;
}
```

- [ ] **Step 3: Next-button handler — debug handoff on page 0**

Inside the existing `next-btn` listener, before advancing `currentPage`:

```javascript
if (debugManualPhase) {
  state.debugManualDone = true;
  saveState();
  renderAssessment();
  return;
}
```

After this render, `visibleItems` becomes full `pageItems` (10 items); the first five retain `state.answers`.

- [ ] **Step 4: Manual check (`?debug=1`)**

Start assessment, answer five items, Next → expect same page to show ten items with first five still selected.

- [ ] **Step 5: Commit**

```bash
git add src/assessment.html
git commit -m "feat(assessment): debug mode first screen (5 items) then full page 0"
```

---

### Task 5: Autoplay scheduler (DOM clicks, 1 s dwell)

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\src\assessment.html`

- [ ] **Step 1: Add helpers**

In the third script block (near other utilities):

```javascript
const AUTOPLAY_CLICK_GAP_MS = 40;
const PAGE_DWELL_MS = 1000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getAnswersForAutoplay() {
  if (state.fixtureId) {
    return UnstuckTestPersonas.getFixtureAnswers(state.fixtureId);
  }
  const neutral = 3;
  const map = {};
  for (const it of ITEMS) {
    map[it.num] = neutral;
  }
  return map;
}

async function runAutoplayForVisiblePage(answersMap) {
  const container = document.getElementById('questions-container');
  if (!container) return;

  const blocks = container.querySelectorAll('.question-block');
  for (const block of blocks) {
    const itemNum = parseInt(block.getAttribute('data-item-num'), 10);
    const target = answersMap[itemNum];
    const btn = block.querySelector(
      `.option-btn[data-item="${itemNum}"][data-value="${target}"]`
    );
    if (btn) {
      btn.click();
      await sleep(AUTOPLAY_CLICK_GAP_MS);
    }
  }

  await sleep(PAGE_DWELL_MS);

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn && !nextBtn.disabled) {
    nextBtn.click();
  }
}

function startAutoplayIfNeeded() {
  const shouldRunFixture =
    state.fixtureId && state.phase === 'assess' && state.currentPage === 0;
  const page0Auto =
    state.debugShort &&
    state.debugManualDone &&
    state.phase === 'assess' &&
    state.currentPage === 0;
  const pageAuto =
    state.debugShort &&
    state.debugManualDone &&
    state.phase === 'assess' &&
    state.currentPage > 0;
  const fixtureRest =
    state.fixtureId && state.phase === 'assess' && state.currentPage > 0;

  if (!(shouldRunFixture || page0Auto || pageAuto || fixtureRest)) return;

  const answersMap = getAnswersForAutoplay();
  runAutoplayForVisiblePage(answersMap).catch((e) =>
    console.error('Autoplay failed', e)
  );
}
```

- [ ] **Step 2: Call `startAutoplayIfNeeded()` at end of `renderAssessment`**

After back/next listeners are attached and `checkPageComplete()` has run:

```javascript
startAutoplayIfNeeded();
```

- [ ] **Step 3: Fixture end-to-end**

Open `assessment.html?fixture=jobs`, click Begin, watch ~12 pages advance, land on results.

- [ ] **Step 4: Debug end-to-end**

`?debug=1` → answer five → Next → remainder of page 0 auto → subsequent pages auto → results.

- [ ] **Step 5: Commit**

```bash
git add src/assessment.html
git commit -m "feat(assessment): DOM autoplay for fixture and debug remainder"
```

---

### Task 6: `src/debug.html` hub

**Files:**
- Create: `c:\Users\julien\Documents\dev\Unstuck\src\debug.html`

- [ ] **Step 1: Page skeleton**

Use `styles.css`, match nav pattern from `index.html` / `assessment.html` (minimal). Include:

- Title: “Testing tools”
- Disclaimer paragraph (spec wording)
- Primary list: each fixture → `assessment.html?fixture=<id>` (button or link)
- Secondary: `assessment.html?debug=1` with description
- Link `index.html` home

Load `test-personas.js` is **optional** for static links; you can hardcode the five IDs or call `UnstuckTestPersonas.listFixtures()` if you add a tiny script block **after** `test-personas.js` — but `test-personas.js` requires `buildFixtureAnswersFromFacetMeans` unless you only use metadata. **Simplest hub:** hardcoded five links, no JS. Alternatively include script block 1 from assessment — too heavy.

**Recommended:** hardcoded links for the five IDs + `debug=1`; duplicate names in HTML or copy strings from spec.

- [ ] **Step 2: Open `debug.html` locally**

Click each fixture link; confirm query opens assessment with prefill (Task 3).

- [ ] **Step 3: Commit**

```bash
git add src/debug.html
git commit -m "feat: add debug.html testing hub"
```

---

### Task 7: Documentation

**Files:**
- Modify: `c:\Users\julien\Documents\dev\Unstuck\CONTRIBUTING.md` (preferred) or `ARCHITECTURE.md`

- [ ] **Step 1: Add “Developer testing” subsection**

Document:

- `src/debug.html` hub
- `assessment.html?fixture=<id>` and `?debug=1`
- Demographics defaults (`26–30` / `male`)
- That fixtures are illustrative only, not claims about real people
- Manual checks: results load, no NaN in primary UI

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: developer testing (debug hub and query flags)"
```

---

### Task 8: Final verification gate

- [ ] **Regression:** `assessment.html` with **no** query params — full 120 flow, resume modal if applicable, completion → results.

- [ ] **Fixture:** each of the five fixtures completes without console errors (ignore benign extension noise).

- [ ] **Debug:** `?debug=1` five-question path completes.

- [ ] **Commit** (if only checklist / no code):

```bash
git commit --allow-empty -m "chore: verify browser fixture testing rollout"
```

---

## Plan self-review

| Spec section | Task coverage |
|--------------|---------------|
| Hub + disclaimer | Task 6 |
| `?fixture=` DOM replay, 1 s / page | Tasks 1–2, 5 |
| `?debug=1` five manual + neutral auto | Tasks 4–5 |
| Real clicks only | Task 5 |
| No Playwright / package.json | Scope omitted intentionally |
| Ethics copy | Task 6–7 |
| Demographics default decision | Task 2 + Task 3 |
| `fixture` wins over `debug` | Task 3 `__activeFixtureId` Short-circuits `__debugMode` |

**Placeholder scan:** None intentional; facet numbers are concrete (tunable after visual review).

**Type consistency:** Facet keys use strings `N1`…`C6` matching `normalizeFacetKey` usage.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-04-browser-fixture-testing-plan.md`.

**Two execution options:**

1. **Subagent-driven (recommended)** — Fresh subagent per task, review between tasks, fast iteration.
2. **Inline execution** — Run tasks in this session with checkpoints.

Which approach do you want?

<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Shell