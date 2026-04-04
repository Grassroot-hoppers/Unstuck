# Roadmap

## Shipped through v0.5

**Current stack:** static HTML/CSS/JS, Supabase for persistent result rows and short `?id=` links, hash fallback for in-URL payloads, and a **module-based interpretation engine** on `results.html`.

---

## v0.1 — The Assessment Works

**Status: SHIPPED** ✓ — **Historical baseline** (superseded by v0.2+; kept for context).

What that release established:
- 120-question IPIP-NEO-120 assessment
- Client-side scoring (5 domains, 30 facets)
- Radar chart + early domain-level copy
- Shareable results via URL hash
- PDF via print stylesheet
- Zero backend in the original sense (before Supabase)

---

## v0.2 — Permanent Results

**Status: SHIPPED** ✓

**Goal:** Results saved to Supabase. Short, clean URLs. Retrievable anytime.

Tasks:
- [x] Set up Supabase project (free tier)
- [x] Create `results` table (see [docs/supabase-setup.md](docs/supabase-setup.md))
- [x] Add Supabase client to assessment.html and results.html
- [x] Generate short IDs on completion, save to Supabase
- [x] results.html loads from `?id=` parameter OR falls back to hash
- [x] Test: complete assessment → get short URL → open in different browser → results load

---

## v0.3 — Research Pool + Opt-in Data

**Status: SHIPPED** ✓ (core); optional analytics UX can grow over time

**Goal:** Anonymized aggregate personality data for survival bias research.

Tasks:
- [x] Add opt-in UI on results page for sharing anonymized scores with the research pool
- [x] Document `research_pool` view in Supabase (see [docs/supabase-setup.md](docs/supabase-setup.md))
- [ ] Simple admin dashboard or saved SQL reports for aggregate distributions (operators can use Supabase SQL today)
- [ ] First published analysis: "What does the personality distribution of Unstuck users look like?"

---

## v0.4 — Payment + Access Codes

**Status: DEFERRED** ⏸ (not cancelled)

**Why:** Shelved deliberately so v0.5 (interpretation engine) could ship and be validated **without** paywall friction. Stripe/access-code work remains a plausible future milestone but is **not** committed as the immediate next step.

**Original direction:** €5 one-time payment via OR access code; assessment vs steps paid TBD.

Reference: [docs/paywall-setup.md](docs/paywall-setup.md) describes an older integration sketch — treat as archival if the feature returns.

---

## v0.5 — Interpretation Engine (cross-facet patterns)

**Status: SHIPPED** ✓

**Goal:** Rich, deterministic interpretation beyond five domain blurbs — without hand-writing 90 independent facet blurbs.

**What shipped:**
- **Cross-facet pattern engine** — 25 priority rules in `src/engine/rules.js` (15 cross-connection rules, 10 single-facet flags)
- **Domain-level interpretive templates** orchestrated from `src/engine/engine.js` (`runEngine`)
- **Research blocks** and calibrated interpretive layers (see [docs/superpowers/specs/2026-04-04-calibrated-interpretive-engine-design.md](docs/superpowers/specs/2026-04-04-calibrated-interpretive-engine-design.md))

The earlier plan (“30 facets × 3 levels = 90 static texts”) was superseded by this architecture.

---

## v0.6 — French Translation

**Goal:** Full site in French (Belgium audience).

Tasks:
- [ ] French items already exist in the IPIP-NEO package — integrate end-to-end if gaps remain
- [ ] Translate domain-level interpretation / engine-facing copy as needed for FR
- [ ] Translate landing page, assessment UI, results page chrome
- [ ] Language toggle (EN/FR) that persists

Estimated effort: 3–5 days

---

## v1.0 — The Full Product

**Goal:** A cohesive “1.0” story: assessment, permanent results, full interpretation experience, French, and optional monetization **if** product priorities bring back v0.4-class flows.

What v1.0 may include:
- Everything intentionally kept from v0.1–v0.6 above
- Polished results experience and onboarding
- If paywall returns: smooth payment/code flow (revisit deferred v0.4)
- Email receipt of results (Supabase Edge Function + provider such as Resend)
- “What's Next” section pointing to Steps 2–5 (directionally v2)

---

## Beyond v1: The Journey

Future phases — not committed; direction only.

**v1.5 — Steps 2-5 (The Journey)**
- Step 2: Past Audit (Pennebaker writing exercises, Hollis questions)
- Step 3: Cross-Examination (Big Five × Past = what's not serving you)
- Step 4: Future Audit (worst-case / best-case writing)
- Step 5: Toolbox (links to modules)
- Each step saves progress in Supabase (JSONB)
- Requires user accounts (Supabase Auth — magic link)

**v2.0 — The Toolbox Modules (Interactive)**
- Athlete Mindset, Antifragility, CEO Mindset, Journaling, Tiny Experiments, Core System Planning
- Currently static HTML pages — convert to interactive tools
- Energy P&L as a fillable form, Tiny Experiments as a digital log, etc.

**v2.5 — Workshops Integration**
- Workshop scheduling and prerequisites check
- Integration with Social Network V2 (grassroothopper.com) for community features

---

## Principles

From the [Grassroots Hoppers hackathon](https://grassroothopper.com):

1. **Ship before extending.** Each version must work completely before the next starts.
2. **One feature at a time.** Avoid parallelizing unrelated product surfaces.
3. **Stay before the wall.** If the codebase gets complex enough that AI can't reason about it, stop and simplify.
4. **Paper before code.** Each version has a plan written before building starts.
5. **Test with real users.** Ship, observe, then plan the next slice.
