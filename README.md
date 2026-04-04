# Unstuck

**Free, open-source personality assessment. Know yourself. Free your energy.**

Unstuck is a science-backed personality assessment based on the [IPIP-NEO-120](https://ipip.ori.org) (Johnson, 2014) — the most validated open framework in personality psychology. 120 questions, 5 domains, 30 facets, ~10 minutes.

**[Take the test →](https://grassroothopper.com/unstuck)** *(deployment URL TBD)*

---

## What it does

- 120 self-report questions from the IPIP-NEO-120
- Scores across 5 personality domains and 30 facets
- Results framed through an energy/vitality lens
- Radar chart visualization
- Shareable results via short permalink (`results.html?id=…`) backed by optional [Supabase](https://supabase.com/) storage, with **URL hash fallback** (base64-encoded payload) when loading without a saved ID
- Deterministic **interpretation engine** on the results page (cross-facet rules, domain templates, research framing — see [ROADMAP](ROADMAP.md))
- PDF download (browser print)
- English + French (items pre-translated)

## What it doesn't do

- No accounts, no passwords, no marketing analytics stack.
- No clinical diagnosis — self-discovery only.
- **Supabase:** When configured, completing the assessment sends score payloads to your Supabase project so results can be reopened via `?id=`. That is intentional, optional to disable for a fork (see `src/supabase-results.js` and [docs/supabase-setup.md](docs/supabase-setup.md)).
- Third-party CDNs: Chart.js, Google Fonts, and (when used) Supabase client JS load from the network.

---

## The science

| | |
|---|---|
| **Assessment** | IPIP-NEO-120 (Johnson, 2014) |
| **Items** | 120 self-report, 5-point Likert scale |
| **Domains** | Neuroticism, Extraversion, Openness, Agreeableness, Conscientiousness |
| **Facets** | 30 (6 per domain) |
| **Source** | International Personality Item Pool — [ipip.ori.org](https://ipip.ori.org) |
| **Items license** | Public domain — free to use without permission |
| **Reliability** | α = .81–.90 across domains (Johnson, 2014) |

### References

- Johnson, J.A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory. *Journal of Research in Personality*, 51, 78-89.
- Goldberg, L.R. et al. (1999). The International Personality Item Pool. [ipip.ori.org](https://ipip.ori.org)

---

## Tech stack

This is a **static site**: **no build step**, **no `package.json`**. Pages are plain HTML, CSS, and JavaScript.

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| Charts | [Chart.js](https://www.chartjs.org/) (CDN UMD bundle) |
| Fonts | Google Fonts (DM Serif Display, Inter, JetBrains Mono) |
| Scoring & interpretation | Client-side JS; **results** load `src/engine/*` via **ES modules** (`<script type="module">` in `results.html`) |
| Persistence | [Supabase](https://supabase.com/) (optional; anon key + URL in `src/supabase-results.js`); **hash fallback** still decodes in-page results |
| Results sharing | Primary: `?id=` short ID; **fallback:** long base64 fragment in the URL hash |
| PDF | Browser print / `@media print` stylesheet |
| Hosting | Any static host (Vercel, Netlify, GitHub Pages, etc.) |

**Local development:** The **full path** (assessment → **results with the engine**) must be served over **HTTP** or **HTTPS**. Browsers block ES module imports from `file://`, so opening `results.html` directly from disk will not load the engine. Use a local static server (see below).

---

## Project structure

```
unstuck/
├── README.md
├── ROADMAP.md
├── LICENSE                  (AGPL-3.0)
├── CONTRIBUTING.md
├── ARCHITECTURE.md
├── src/
│   ├── index.html           Landing page
│   ├── assessment.html      120-question flow
│   ├── results.html         Results + interpretation engine (ES modules)
│   ├── debug.html           Testing tools / fixtures
│   ├── styles.css           Shared design system
│   ├── supabase-results.js  Supabase URL/key + small helpers
│   ├── test-personas.js     Fixture helpers for browser testing
│   └── engine/              Interpretation engine (scoring, rules, templates, norms, interpretive/)
└── docs/
    ├── supabase-setup.md
    ├── scoring.md
    ├── paywall-setup.md     (deferred product — see ROADMAP)
    └── superpowers/         Design specs & implementation plans
```

---

## Run locally

```bash
git clone https://github.com/Grassroot-hoppers/unstuck.git
cd unstuck/src
python -m http.server 8000
# Open http://localhost:8000/index.html — use the assessment through to results.html
```

Opening HTML files via `file://` may work for **some** pages, but it is **not supported** for the complete assessment → results flow because **`results.html` imports `./engine/engine.js` as a module**.

---

## Deploy

Static hosting only: deploy the **`src/`** directory (or equivalent).

**Vercel:**
```bash
cd src && vercel --prod
```

**Netlify:**  
Drag the `src/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

**GitHub Pages:**  
Enable Pages and set the publish source to the `src/` folder (or your host’s equivalent).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Translations, bug fixes, and accessibility improvements are welcome. Interpretation copy and rule logic are core to the product — please open an issue before large changes there.

---

## License

**AGPL-3.0** — [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.html)

You can fork, modify, and deploy this project. If you modify it and serve it to users, you must publish your changes under the same license.

The IPIP items themselves are **public domain** — they can be used by anyone for any purpose without permission.

---

## Part of Grassroots Hoppers

Unstuck is a [Grassroots Hoppers](https://grassroothopper.com) project.

Community-owned software, built in the open.

**GPFC srl** (BCE BE0545849385) · Brussels, Belgium

---

*This is a self-discovery tool, not a clinical diagnostic instrument.*
