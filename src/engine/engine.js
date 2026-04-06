/**
 * UNSTUCK — Engine Orchestrator
 *
 * Ties together: scoring → rules → selection → templates → output
 *
 * Input: raw facet scores + age + gender
 * Output: structured data ready for rendering
 *
 * No LLM. No API calls. Deterministic.
 */

import { scoreProfile } from './scoring.js';
import { evaluateRules, selectTeasers } from './rules.js';
import { getDomainText, getTeaserParts, getFullText } from './templates.js';
import { NORMS, getConfidenceTier } from './normative-data.js';
import { buildInterpretiveReport } from './interpretive/build-report.js';
import { getInstrumentConfig } from './instruments/ipip-neo-120.config.js';

/**
 * Run the full interpretation engine
 * @param {Object} rawScores - { N1: 18, N2: 10, ... } all 30 facets
 * @param {string} ageGroup - e.g., '26-30'
 * @param {string} gender - 'male' or 'female'
 * @returns {Object} Complete interpretation data
 */
export function runEngine(rawScores, ageGroup, gender) {
  const profile = scoreProfile(rawScores);
  const { percentiles: P, domains: D, scatter: S } = profile;

  const firedRules = evaluateRules(profile);

  const interpretive = buildInterpretiveReport({
    profile,
    rawScores,
    instrumentConfig: getInstrumentConfig(),
    firedRules,
  });

  const teasers = selectTeasers(firedRules);

  const domainTexts = {};
  for (const [dom, pct] of Object.entries(D)) {
    domainTexts[dom] = getDomainText(dom, pct, P, D, S, interpretive);
  }

  const teaserTexts = teasers
    .map((rule) => {
      const ruleId = rule.template || rule.id;
      const { behavioral, research } = getTeaserParts(ruleId, P, D, S);
      return {
        id: rule.id,
        confidence: rule.confidence,
        text: behavioral,
        researchText: research,
      };
    })
    .filter((t) => t.text != null);

  const allRuleTexts = firedRules.map((rule) => {
    const ruleId = rule.template || rule.id;
    const parts = getTeaserParts(ruleId, P, D, S);
    return {
      id: rule.id,
      confidence: rule.confidence,
      category: rule.category,
      score: rule.score,
      source: rule.source,
      teaserText: parts.behavioral,
      researchText: parts.research,
      fullText: getFullText(ruleId, P, D, S),
    };
  });

  const facetTable = [];
  const allFacetCodes = [
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6',
    'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
    'O1', 'O2', 'O3', 'O4', 'O5', 'O6',
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
  ];

  for (const f of allFacetCodes) {
    const pct = P[f];
    const raw = rawScores[f];
    const norm = NORMS[f];
    const tier = getConfidenceTier(f);
    const isLowReliability = tier === 'caution';

    let roomOf100 = '';
    if (pct == null) {
      roomOf100 = '';
    } else if (pct >= 85) {
      roomOf100 = `only ${100 - pct} in 100 score higher`;
    } else if (pct <= 15) {
      roomOf100 = `only ${pct} in 100 score lower`;
    } else if (pct > 50) {
      roomOf100 = `${100 - pct} in 100 score higher`;
    } else if (pct < 50) {
      roomOf100 = `${100 - pct} in 100 score higher`;
    } else {
      roomOf100 = 'exactly at the midpoint';
    }

    facetTable.push({
      code: f,
      domain: f[0],
      label: norm?.label || f,
      raw,
      percentile: pct,
      roomOf100,
      tier,
      isLowReliability,
      isHigh: pct != null && pct >= 85,
      isLow: pct != null && pct <= 15,
    });
  }

  return {
    input: { rawScores, ageGroup, gender },
    scoring: {
      percentiles: P,
      domains: D,
      scatter: S,
      lowReliabilityFacets: profile.lowReliabilityFacets,
    },
    domainTexts,
    facetTable,
    teasers: teaserTexts,
    firedRules: allRuleTexts,
    stats: {
      totalRulesFired: firedRules.length,
      crossConnectionsFired: firedRules.filter((r) => r.category === 'cross').length,
      flagsFired: firedRules.filter((r) => r.category === 'flag').length,
      highFacets: facetTable.filter((f) => f.isHigh).length,
      lowFacets: facetTable.filter((f) => f.isLow).length,
      lowReliabilityFacets: facetTable.filter((f) => f.isLowReliability).length,
      maxScatter: Math.max(...Object.values(S)),
      maxScatterDomain: Object.entries(S).sort((a, b) => b[1] - a[1])[0][0],
    },
    interpretive,
  };
}
