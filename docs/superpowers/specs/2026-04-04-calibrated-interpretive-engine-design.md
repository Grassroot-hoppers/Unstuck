# Design: Calibrated interpretive engine (IPIP-NEO-120)

**Status:** Approved for implementation planning  
**Date:** 2026-04-04  
**Context:** Unstuck already scores the IPIP-NEO-120 deterministically (`scoring.js`), fires rules (`rules.js`), and renders copy from templates (`templates.js`). Reliability is partially encoded (`alpha`, `REJECTED_FACETS`, `getConfidenceTier`, `DOMAIN_FACETS`). The **voice** of the product still over-asserts (“profiler”) and buries uncertainty. This design adds an **interpretive layer** that turns scores into a **typed, confidence-aware narrative contract**, with **non-clinical default** copy and **opt-in research framing**.

## Goals

1. **Probabilistic interpreter, not profiler** — Lead with “this pattern often shows up as…,” strongest signal, and context (work / intimacy / stress) instead of type labels and absolute claims when measurement does not support them.
2. **Reliability as prose, not only warnings** — Domain-led interpretation; facets tiered into **core / supporting / tentative** rhetorical classes derived from **measurement tier + role + within-domain scatter**, not conflated with gold/silver/bronze alone.
3. **Trade-offs over verdicts** — Each domain (and strong patterns) frames **upside vs cost**; patterns add **where it helps / where it backfires / what tends to balance it**.
4. **Stop pseudo-clinical overreach by default** — Describe **behavioral costs** before any analogy; avoid disorder-forward lead sentences. **Opt-in (A)** exposes correlation-level “research framing” for users who want it.
5. **Openness without over-claim** — Use **named channels** only where multi-facet grouping adds interpretive meaning (aesthetic, cognitive/intellect, value flexibility); treat **O4 (Adventurousness)** as a **strong domain-level facet** outside those channels; treat **O3** as **ambiguous** vs the broad O factor; **per-channel confidence** and **uneven channel** callouts remain first-class.
6. **Informant / self-report honesty** — Surface **observer-vulnerable** notes on selected facets (no second questionnaire required).
7. **Richer language model by default** — Encode **frequency**, **context**, **expression channel** (felt vs expressed), and **regulation** (impulse vs action) as first-class slots so apparent contradictions are normal, not edge cases.

## Non-goals

- Replacing the 120-item instrument or re-norming in this phase (age×gender stratified norms remain a separate track per `docs/scoring.md`).
- LLM-generated narrative in v1 (engine stays deterministic).
- Clinical diagnosis, treatment advice, or presenting the Big Five as explanatory of motives/pathology in the default layer.

## Product stance: default vs research mode

| Mode | Narrative | PD / correlation language |
|------|-----------|----------------------------|
| **Default** (`researchMode: false`) | Behavioral, hedged by `proseRegister`, trade-off framed | Omitted from primary reading |
| **Research** (`researchMode: true`) | Same behavioral spine | Additional **handles** (e.g. `researchBlock`) rendered in a **separate, clearly labeled** region — collapsed by default is recommended |

**Opt-in UX (delivery, not engine core):**

- **Default:** session-level preference (e.g. `sessionStorage`).
- **Remember:** optional persistence (e.g. `localStorage`); **account-level** settings deferred until auth is a hard requirement.

**Engine contract:** `runInterpretation(profile, rawScores, options)` (name TBD at implementation) receives **`researchMode: boolean`** at render time. **Where** the boolean is read is a UI/adapter concern.

## Invariant disclaimer (DOM chrome)

One **non-dismissable** line (short, fixed copy) must render on **every results surface** in a **dedicated footer region** **outside** paragraph templates — e.g. “The Big Five summarizes typical patterns in self-reported behavior; it does not diagnose conditions or explain causes.”

**Rationale:** If this string lives inside a template slot, copy edits and regressions will eventually drop or contradict it.

## Internal interpretive rule (authoring)

Authoring and review should enforce:

- Do not **infer pathology** or **motive** in the default layer.
- Do not use a **type label** when a **behavioral description** suffices.
- Do not speak with **more certainty** than the **facet or domain** supports (`proseRegister`).

## Architecture: interpretive layer (recommended shape)

Keep **rule conditions** and **scoring** as today. Add a module (or cohesive submodule set) that:

1. Consumes **`scoreProfile` output** (`percentiles`, `domains`, `scatter`, …) plus **instrument config** and **`researchMode`**.
2. Emits an **`InterpretiveReport`** object (typed contract below).
3. Leaves **`templates.js`** as **renderers** that fill copy from slots (migrate incrementally from monolithic string functions).

**Alternative approaches rejected for this product:** template-only dual strings (duplication, drift); string post-processing (brittle).

## Q1 — Instrument ownership

All **facet → measurement tier**, **rejection sets**, **domain facet lists**, **Openness channel membership**, and **observer-vulnerable facet lists** are **`instrumentId`-scoped** (e.g. `ipip-neo-120`). The interpreter accepts a config bundle so a future questionnaire can reuse the same layer without global constants hard-coding IPIP-120 only.

**Note:** Today’s `normative-data.js` implicitly defines IPIP-120; implementation may start by wrapping that file’s exports as the default instrument config.

## Q2 — Openness channels

**Chosen mapping (IPIP-120):** Named channels are reserved for groupings where **multiple facets** support divergence logic inside the channel. **O4 (Adventurousness)** is treated as an **unclassified but reliable domain-representative facet** (consistent loadings on the broad O factor rather than a sub-cluster); copy addresses it in the **domain narrative or facet row**, not inside a single-facet “channel.”

- **Aesthetic channel:** O1, O2  
- **Cognitive / intellect channel:** O5  
- **Value flexibility channel:** O6 (today O6 is rejected for rules/domain mean in `normative-data.js`; **facet table** may still show raw with **tentative** interpretation)  
- **Domain-level facet (not a channel):** O4 — interpret like other strong facets, without forcing a channel wrapper  
- **Ambiguous vs broad Openness:** O3 (Emotionality) — low **domain coherence**; narrative must not assume O3 tracks “Openness” like O5 or O4

**Per-channel confidence** is **derived** from measurement tiers of facets in that channel, domain scatter on **O**, and rejection flags. Templates **suppress or soften** a channel when confidence is low.

## Q3 — Action-oriented “balance”

Pattern objects carry:

- **`balanceHint`** (curated string or template key) per **`ruleId`** for v1 voice control.
- **`balanceFacetRefs`** (optional ranked `FacetCode[]`) when a **deterministic heuristic** finds a plausible offsetting facet.

**Tier floor (normative):** A facet code is **eligible** to appear in `balanceFacetRefs` only if its **`confidenceTier` is `silver` or `gold`**. **`bronze` and `rejected` candidates are never surfaced** in balance copy. If no candidate meets the floor, **omit `balanceFacetRefs` entirely** (curated `balanceHint` may still appear).

**Policy (resolved):** **Curated default** + **derived augment** when **both** (a) at least one balance candidate is **silver or above**, and (b) the pattern’s **ingredient** facets used for the derived logic are also **silver or above** where they participate in the augment. If derived logic would only produce **bronze** (or weaker) candidates, **suppress derived augment completely** — do not weaken the floor to “not rejected.”

## Signal classification (rhetorical vs measurement)

Keep **two orthogonal axes**:

| Concept | Meaning |
|---------|---------|
| **`confidenceTier`** | Gold / silver / bronze / rejected — from **reliability** (`alpha` thresholds), same spirit as today’s `getConfidenceTier`. |
| **`signalClass`** | **Core / supporting / tentative** — **where** the claim sits in the hierarchy (domain-first; strong facet second; weak facet cautious; cross-facet patterns only when **ingredients** meet a minimum bar). |

**Pure functions (conceptual contract):**

- `confidenceTier(facetCode, instrumentConfig) → 'gold' | 'silver' | 'bronze' | 'rejected'`
- `rhetoricalSignalClass({ role, confidenceTier, domainScatter, ... }) → 'core' | 'supporting' | 'tentative'`
- `proseRegister(signalClass, confidenceTier, maybeAudienceVariance) → 'direct' | 'hedged' | 'exploratory'`

Exact inputs for `rhetoricalSignalClass` are implementation details but **must** incorporate **within-domain scatter** (`S` from `scoreProfile`) so lumpy domains default to “uneven profile” language.

### `proseRegister` — domain vs facet (no inheritance)

- **`domains[*].proseRegister`** governs **only** the domain-level paragraph(s) for that domain.
- **`facets[*].proseRegister`** (on each facet interpretation row) governs **only** that facet’s copy.
- **No inheritance** between domain and facet: a domain may be **`direct`** while a constituent facet is **`exploratory`** (e.g. high O domain summary vs tentative O3 row). Template authors **must not** copy domain register onto facet rows by default.

## `InterpretiveReport` — structural sketch

The engine produces **one object**. UI and template renderers consume it. **`researchMode` is not stored** on the object; it filters **which optional fields** are turned into DOM.

**Facet placement:** The **authoritative** facet interpretations for rendering a domain section live under **`domains[code].facets`** (`FacetInterpretation[]`). An optional **top-level index** (e.g. `facetByCode: Map` or `Record`) may duplicate references for **lookup by code** only — domain-scoped arrays are the source of truth for section rendering (avoids filter-by-domain at every call site).

### `ContextTag` — v1 enum (closed set)

Template and engine code **must** use **only** these literals in v1; anything else waits for v2:

- `under_pressure`
- `in_groups`
- `in_conflict`
- `intimate_settings`
- `at_work`
- `in_close_relationships`

```text
InterpretiveReport {
  instrumentId: string

  invariantDisclaimer: { textKey: 'big_five_descriptive_not_diagnostic' }
    // Renderer maps textKey to fixed string; engine does not embed locale strings if you later i18n.

  facetByCode?: Record<FacetCode, FacetInterpretation>
    // Optional convenience index; if present, entries should match domain-nested facets.

  domains: {
    N | E | O | A | C: {
      domainCode
      domainPercentile       // aligns with D[code] today
      signalClass: 'core' | 'supporting' | 'tentative'
      proseRegister: 'direct' | 'hedged' | 'exploratory'
      tradeOff: { upside: SlotRef | string, cost: SlotRef | string }
      contexts: ContextTag[]   // v1: only the six literals above
      narrativeSlots: { ... }   // implementation: refs into template registry
      facets: FacetInterpretation[]
        // Authoritative list for this domain; includes observer flags, facet proseRegister, etc.
      // TODO(v2): researchBlock on domain narratives — deferred; v1 uses pattern-level researchBlock only.
    }
  }

  opennessChannels?: {         // present when instrument + domain O; O4 is NOT a channel
    aesthetic: ChannelInterpretation
    cognitive: ChannelInterpretation
    values?: ChannelInterpretation
    // Each: { scoreSummary, proseRegister, signalClass, unevenAgainstDomain: boolean }
  }

  patterns: {
    ruleId: string              // mirrors rules.js `id`
    category: 'cross' | 'flag' | ...
    confidenceTier: 'gold' | 'silver' | 'bronze'   // legacy: same as rule’s weakest facet tier
    ingredientFacetCodes: string[]
    rhetoricalSignalClass: 'core' | 'supporting' | 'tentative'
    proseRegister: 'direct' | 'hedged' | 'exploratory'
    behavioral: {
      helps: SlotRef | string
      backfires: SlotRef | string
      balanceHint: SlotRef | string
      balanceFacetRefs?: string[]
    }
    observerNotes?: { facetCode: string, noteKey: string }[]
    researchBlock?: {
      correlations: SlotRef | string
      citations: CitationRef[]
    }
  }[]
}
```

**`SlotRef` / `CitationRef`:** indirection into a template or content registry so copy can be edited without changing classification logic.

### Alignment with current `rules.js`

- **`ingredientFacetCodes`** ↔ `rule.facets`. Rules that reference rejected facets are skipped today — **patterns array** only contains fired rules; interpretive layer **must not** reintroduce O3/O6/E4/N5/C3 into cross-pattern **claims** unless product explicitly changes rejection policy.
- **`confidenceTier` on pattern** ↔ today’s `ruleTier(rule.facets)` output (gold/silver/bronze).
- **`researchBlock`** ↔ new home for PD-adjacent / correlation copy currently embedded in `templates.js` strings.
- **Domain narratives** ↔ today’s `getDomainText(dom, …)` but refactored to **slot-based** rendering from `domains[dom]`.

## Observer-vulnerable facets (IPIP-120 initial set)

Authoring list for “self-report may diverge from how others see you” notes (exact wording in template registry):

- A1 Trust, A2 Morality, A3 Altruism, A6 Sympathy, A5 Modesty, N2 Anger, C5 Self-Discipline, **E3 Assertiveness** — self–observer agreement on assertiveness is often weak; high Neuroticism can track “felt assertiveness” vs perceived dominance, and low N the reverse. E3 is also a **frequent pattern driver** (`disagreeable_leader`, etc.), so a divergence note here has high product value.
- (Extend list in v2 as evidence warrants.)

Implementation attaches **`observerNotes`** on **facet** entries and/or **patterns** that lean heavily on those facets.

## Section 3 (follow-on spec): UI and data flow

Out of scope for this document’s **core contract**, but expected:

- Toggle location on `results.html` (or equivalent).
- Session vs remembered `researchMode` plumbing into the engine call.
- Placement of **research** appendix (sidebar, accordion, secondary column).
- Non-dismissable **footer** for `invariantDisclaimer`.

## Verification (before claiming “done”)

1. **Fixture personas** — Jobs / Trump / etc.: default mode shows **no PD-first leads**; research mode shows appendix only when enabled.
2. **Synthetic profiles** — High domain scatter on O triggers **uneven Openness** channel copy, not a single sweeping Openness paragraph.
3. **Rejected facets** — O6/O3 rows (if shown) never drive **core** claims; prose stays **exploratory**.
4. **Regression** — Same `rawScores` → same `InterpretiveReport` object (determinism); only renderer differs by `researchMode`.

## Resolved decisions (implementation plan)

| Topic | Resolution |
|-------|------------|
| **Balance copy** | Curated **`balanceHint` default** + **derived augment** only when **silver+** candidates exist for `balanceFacetRefs` **and** participating ingredient facets for that augment are **silver+**. Otherwise derived augment **omitted**; bronze never drives balance text. |
| **Domain `researchBlock`** | **v1:** **pattern-level `researchBlock` only.** Domain-level research blocks deferred to **v2** (would imply 5×2 clinical summary scope before research-mode UX is validated). Schema comment: `// TODO(v2): domain-level researchBlock` on `domains[*]` (see sketch above). |

## Suggested implementation tranche order

1. **Instrument config wrapper** + facet **tier / classification pure functions** (isolate IPIP-120 constants behind `instrumentId`).
2. **`InterpretiveReport` builder** + **fixture-backed tests** (determinism, tier floors, nested `domains[*].facets`).
3. **Template migration** starting with **Agreeableness** and **Openness** (highest over-assertion today).
4. **`researchBlock` extraction** from `templates.js` into registry + pattern-only research rendering.
5. **UI:** invariant footer + **researchMode** toggle wiring (session + remember).

---

**Next step:** Use the **writing-plans** protocol to break the above into tasks with file paths and verification steps.
