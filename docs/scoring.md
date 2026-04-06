# Scoring Methodology

## The Assessment

Unstuck uses the IPIP-NEO-120 (Johnson, 2014), a 120-item measure of the Five Factor Model of personality. All items are from the International Personality Item Pool (IPIP) — public domain.

## Response Scale

5-point Likert:
1. Very Inaccurate
2. Moderately Inaccurate
3. Neither Accurate Nor Inaccurate
4. Moderately Accurate
5. Very Accurate

## Reverse Scoring

Items are either "plus-keyed" or "minus-keyed":
- **Plus-keyed:** score = response value (1-5)
- **Minus-keyed:** score = 6 - response value (1→5, 2→4, 3→3, 4→2, 5→1)

71 items are plus-keyed. 49 items are minus-keyed.

## Score Calculation

### Facet scores (30 facets)
Each facet has 4 items. Facet score = sum of scored items.
- Range: 4 (minimum) to 20 (maximum)
- Average: facet score / 4 (range: 1.0 to 5.0)

### Domain scores (5 domains)
Each domain has 6 facets × 4 items = 24 items. Domain score = sum of scored items.
- Range: 24 (minimum) to 120 (maximum)
- Average: domain score / 24 (range: 1.0 to 5.0)

## Result Descriptors (current version)

Based on the average score per domain or facet:
- **High:** average > 3.5
- **Average:** average 2.5 – 3.5
- **Low:** average < 2.5

## Percentile norms (engine / results UI)

Facet and domain percentiles use **z-scores** against **Kajonius & Johnson (2019), N = 320,128**, Appendix Table A1 (PMC7871748). Domain percentiles use the **mean of the six facet raw scores** in that domain, compared to the domain **M** and **SD** in the same table.

**Reliability tiers** (from facet Cronbach’s **α** in Table A1): gold / silver / bronze / **caution** (α &lt; .70). Facets in the **caution** tier are **still scored and included** in domain means, rules, and scatter; the UI flags them for **cautious interpretation**, not exclusion.

## Future: stratified norms

A later version may add stratified norms (e.g. Johnson IPIP repository, age × gender). Until then, the overall Table A1 norms apply to all respondents.

## Domain Structure

| Domain | Code | Facets |
|---|---|---|
| Neuroticism | N | 1: Anxiety, 2: Anger, 3: Depression, 4: Self-Consciousness, 5: Immoderation, 6: Vulnerability |
| Extraversion | E | 1: Friendliness, 2: Gregariousness, 3: Assertiveness, 4: Activity Level, 5: Excitement-Seeking, 6: Cheerfulness |
| Openness | O | 1: Imagination, 2: Artistic Interests, 3: Emotionality, 4: Adventurousness, 5: Intellect, 6: Liberalism |
| Agreeableness | A | 1: Trust, 2: Morality, 3: Altruism, 4: Cooperation, 5: Modesty, 6: Sympathy |
| Conscientiousness | C | 1: Self-Efficacy, 2: Orderliness, 3: Dutifulness, 4: Achievement-Striving, 5: Self-Discipline, 6: Cautiousness |

## References

- Johnson, J.A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory. Journal of Research in Personality, 51, 78-89.
- IPIP: https://ipip.ori.org
- Scoring instructions: https://ipip.ori.org/newScoringInstructions.htm
