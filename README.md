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
- Shareable results URL (no server needed)
- PDF download
- English + French (items pre-translated)

## What it doesn't do

- No tracking. No analytics. No cookies.
- No accounts required.
- No data sent to any server.
- Everything runs in your browser.

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

This is a **static site**. No backend. No database. No build step.

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| Charts | [Chart.js](https://www.chartjs.org/) (CDN) |
| Fonts | Google Fonts (DM Serif Display, Inter, JetBrains Mono) |
| Scoring | Client-side JavaScript |
| Storage | localStorage (browser) |
| Results sharing | Base64-encoded URL hash |
| PDF | Browser print / `@media print` stylesheet |
| Hosting | Any static hosting (Vercel, Netlify, GitHub Pages, etc.) |

Zero dependencies. Zero build tools. Open `index.html` in a browser and it works.

---

## Project structure

```
unstuck/
├── README.md
├── LICENSE              (AGPL-3.0)
├── CONTRIBUTING.md
├── src/
│   ├── index.html       (Landing page)
│   ├── assessment.html  (The 120-question assessment)
│   ├── results.html     (Results page with radar chart)
│   └── styles.css       (Shared design system)
└── docs/
    ├── scoring.md       (How scoring works)
    └── items.md         (All 120 items with scoring keys)
```

---

## Run locally

```bash
git clone https://github.com/Grassroot-hoppers/unstuck.git
cd unstuck/src
# Open in browser — that's it
open index.html
# Or use any local server
python3 -m http.server 8000
```

---

## Deploy

This is a static site. Deploy to any static hosting:

**Vercel:**
```bash
cd src && vercel --prod
```

**Netlify:**
Drag the `src/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

**GitHub Pages:**
Enable Pages on the repo, set source to `src/` folder.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Translations, bug fixes, and accessibility improvements are welcome. The interpretation texts (the vitality-framed descriptions for each domain/facet) are a core part of the project's identity — please discuss changes to these in an issue first.

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
