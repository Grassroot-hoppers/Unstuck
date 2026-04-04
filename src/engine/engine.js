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
import { getDomainText, getTeaserText, getFullText } from './templates.js';
import { NORMS, REJECTED_FACETS, DOMAIN_FACETS, getConfidenceTier } from './normative-data.js';
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
  
  // 1. SCORE
  const profile = scoreProfile(rawScores);
  const { percentiles: P, domains: D, scatter: S } = profile;
  
  // 2. EVALUATE RULES
  const firedRules = evaluateRules(profile);
  
  // 3. SELECT TEASERS
  const teasers = selectTeasers(firedRules);
  
  // 4. GENERATE DOMAIN TEXTS
  const domainTexts = {};
  for (const [dom, pct] of Object.entries(D)) {
    domainTexts[dom] = getDomainText(dom, pct, P, D, S);
  }
  
  // 5. GENERATE TEASER TEXTS
  const teaserTexts = teasers.map(rule => ({
    id: rule.id,
    confidence: rule.confidence,
    text: getTeaserText(rule.template || rule.id, P, D, S),
  })).filter(t => t.text !== null);
  
  // 6. GENERATE ALL FIRED RULE TEXTS (for paid layer)
  const allRuleTexts = firedRules.map(rule => ({
    id: rule.id,
    confidence: rule.confidence,
    category: rule.category,
    score: rule.score,
    source: rule.source,
    teaserText: getTeaserText(rule.template || rule.id, P, D, S),
    fullText: getFullText(rule.template || rule.id, P, D, S),
  }));
  
  // 7. BUILD FACET TABLE DATA
  const facetTable = [];
  const allFacetCodes = [
    'N1','N2','N3','N4','N5','N6',
    'E1','E2','E3','E4','E5','E6',
    'O1','O2','O3','O4','O5','O6',
    'A1','A2','A3','A4','A5','A6',
    'C1','C2','C3','C4','C5','C6',
  ];
  
  for (const f of allFacetCodes) {
    const isRejected = REJECTED_FACETS.has(f);
    const pct = P[f];
    const raw = rawScores[f];
    const norm = NORMS[f];
    const tier = isRejected ? 'rejected' : getConfidenceTier(f);
    
    let roomOf100 = '';
    if (isRejected) {
      roomOf100 = 'below confidence threshold';
    } else if (pct >= 85) {
      roomOf100 = `only ${100-pct} in 100 score higher`;
    } else if (pct <= 15) {
      roomOf100 = `only ${pct} in 100 score lower`;
    } else if (pct > 50) {
      roomOf100 = `${100-pct} in 100 score higher`;
    } else if (pct < 50) {
      roomOf100 = `${100-pct} in 100 score higher`;
    } else {
      roomOf100 = `exactly at the midpoint`;
    }
    
    facetTable.push({
      code: f,
      domain: f[0],
      label: norm?.label || f,
      raw,
      percentile: pct,
      roomOf100,
      tier,
      isRejected,
      isHigh: !isRejected && pct >= 85,
      isLow: !isRejected && pct <= 15,
    });
  }
  
  return {
    // Input echo
    input: { rawScores, ageGroup, gender },
    
    // Scoring results
    scoring: {
      percentiles: P,
      domains: D,
      scatter: S,
      rejected: profile.rejected,
    },
    
    // Domain texts (free layer)
    domainTexts,
    
    // Facet table data (free layer)
    facetTable,
    
    // Teasers (free layer — top 3)
    teasers: teaserTexts,
    
    // All fired rules (paid layer)
    firedRules: allRuleTexts,
    
    // Stats
    stats: {
      totalRulesFired: firedRules.length,
      crossConnectionsFired: firedRules.filter(r => r.category === 'cross').length,
      flagsFired: firedRules.filter(r => r.category === 'flag').length,
      highFacets: facetTable.filter(f => f.isHigh).length,
      lowFacets: facetTable.filter(f => f.isLow).length,
      rejectedFacets: facetTable.filter(f => f.isRejected).length,
      maxScatter: Math.max(...Object.values(S)),
      maxScatterDomain: Object.entries(S).sort((a,b) => b[1]-a[1])[0][0],
    },

    interpretive: buildInterpretiveReport({
      profile,
      rawScores,
      instrumentConfig: getInstrumentConfig(),
      firedRules,
    }),
  };
}
