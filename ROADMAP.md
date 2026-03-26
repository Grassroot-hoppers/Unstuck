# Roadmap

## Current: v0.1 — The Assessment Works

**Status: SHIPPED** ✓

What's live:
- 120-question IPIP-NEO-120 assessment
- Client-side scoring (5 domains, 30 facets)
- Radar chart + domain interpretations (15 texts)
- Shareable results via URL hash
- PDF download via print stylesheet
- GitHub Pages deployment
- Zero backend, zero cost

What's not:
- Results not permanently stored (URL hash only)
- No Supabase
- No accounts
- No payment/access codes
- Facet-level interpretation texts (30 facets × 3 levels = 90 texts) not written yet
- No French interpretation texts

---

## Next: v0.2 — Permanent Results

**Goal:** Results saved to Supabase. Short, clean URLs. Retrievable anytime.

Tasks:
- [ ] Set up Supabase project (free tier)
- [ ] Create `results` table (see [docs/supabase-setup.md](docs/supabase-setup.md))
- [ ] Add Supabase client to assessment.html and results.html
- [ ] Generate short IDs on completion, save to Supabase
- [ ] results.html loads from `?id=` parameter OR falls back to hash
- [ ] Test: complete assessment → get short URL → open in different browser → results load

Estimated effort: 1-2 days

---

## Then: v0.3 — Research Pool + Opt-in Data

**Goal:** Anonymized aggregate personality data for survival bias research.

Tasks:
- [ ] Add opt-in toggle on results page: "Help improve Unstuck — share your anonymized scores"
- [ ] Create `research_pool` view in Supabase (anonymized, no user link)
- [ ] Build a simple admin dashboard or SQL query to view aggregate distributions
- [ ] First analysis: "What does the personality distribution of Unstuck users look like?"

Estimated effort: 1 day

---

## Then: v0.4 — Payment + Access Codes

**Goal:** €5 one-time payment via Stripe OR free access code.

Tasks:
- [ ] Set up Stripe account, create "Unstuck Assessment" product (€5 one-time)
- [ ] Add Stripe Checkout redirect before assessment starts
- [ ] Create `access_codes` table in Supabase
- [ ] Build code-entry UI: "I have a code" → validate → grant access
- [ ] Stripe success webhook → mark as paid (or handle client-side via redirect)
- [ ] Generate first batch of access codes for friends/workshops

Decision needed: Assessment free + Steps 2-5 paid? Or assessment itself behind paywall?

Estimated effort: 2-3 days

---

## Then: v0.5 — Facet Interpretation Texts

**Goal:** Full interpretation for all 30 facets, not just 5 domains.

Tasks:
- [ ] Write 90 facet interpretation texts (30 facets × 3 levels)
- [ ] In the Unstuck voice — warm, direct, energy-framed
- [ ] Add to results.html under each facet card
- [ ] Review with test users — do the texts resonate?

Estimated effort: 3-5 days (mostly writing, not code)

---

## Then: v0.6 — French Translation

**Goal:** Full site in French (Belgium audience).

Tasks:
- [ ] French items already exist in the IPIP-NEO package — integrate them
- [ ] Translate all 15 domain interpretation texts
- [ ] Translate all 90 facet interpretation texts (if done)
- [ ] Translate landing page, assessment UI, results page chrome
- [ ] Language toggle (EN/FR) that persists

Estimated effort: 3-5 days

---

## v1.0 — The Full Product

**Goal:** The complete first version — assessment + permanent results + payment + full interpretations + French.

What v1.0 includes:
- Everything from v0.1-v0.6
- Professional, polished results page
- Smooth payment/code flow
- Email receipt of results (Supabase Edge Function + Resend)
- "What's Next" section pointing to Steps 2-5 (coming in v2)

---

## Beyond v1: The Journey

These are future phases. Not committed. Noted for direction.

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
2. **One feature at a time.** Never build v0.3 and v0.4 simultaneously.
3. **Stay before the wall.** If the codebase gets complex enough that AI can't reason about it, stop and simplify.
4. **Paper before code.** Each version has a plan written before building starts.
5. **Test with real users.** Ship v0.2 and get 10 people to use it before starting v0.3.
