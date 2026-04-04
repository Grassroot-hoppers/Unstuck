# Contributing to Unstuck

Thanks for wanting to help.

## What we welcome

- **Bug fixes** — if something's broken, fix it
- **Accessibility improvements** — screen readers, keyboard navigation, contrast
- **Translations** — the IPIP-NEO-120 items exist in 27+ languages already. Help us integrate them.
- **Mobile UX improvements** — most users are on phones
- **Documentation** — help others understand how to fork and deploy

## What needs discussion first

- **Interpretation texts** — the vitality-framed descriptions are a core part of Unstuck's identity. Changes to these should be discussed in an issue before submitting a PR.
- **New features** — open an issue first. Unstuck is intentionally simple. We'd rather do less, better.
- **Design changes** — the visual identity is deliberate. Discuss before redesigning.

## How to contribute

1. Fork the repo
2. Create a branch (`git checkout -b fix/your-fix`)
3. Make your changes in `src/`
4. Test locally (open `index.html` in a browser)
5. Submit a pull request with a clear description of what and why

## Developer testing

For manual QA of the assessment shell and results UI without Playwright:

- Open **`src/debug.html`** for a small hub with links to named fixtures and the short manual path.
- **`assessment.html?fixture=<id>`** — runs the real assessment with preset demographics (defaults **26–30** / **male** for normed results) and DOM replay through all 120 items. Valid ids: `trump`, `jobs`, `tyson`, `ross`, `cobain`. If both `fixture` and `debug` are present, **fixture wins**.
- **`assessment.html?debug=1`** — answer five items on page 1, then the remainder auto-fills with neutral (3) clicks and continues through results.

Fixtures are **illustrative** eyeball checks only, not claims about real people. After a run, confirm results load and the primary UI shows no `NaN` or broken layout.

## Code style

- Vanilla HTML, CSS, JavaScript. No frameworks. No build tools.
- If you can open `index.html` in a browser and it works, it's correct.
- Keep it simple. Every line of complexity is a line someone has to understand.

## The rule

From the [Grassroots Hoppers hackathon](https://grassroothopper.com):

> "Design products that finish before the plateau."

If a contribution adds complexity without clear user benefit, it won't be merged. Simplicity is a feature.

## License

By contributing, you agree that your contributions will be licensed under AGPL-3.0.
