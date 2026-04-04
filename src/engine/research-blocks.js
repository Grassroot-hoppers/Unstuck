/**
 * Research-mode appendix copy (correlational, not diagnostic).
 * Default / behavioral teasers live in templates.js; this module holds opt-in depth.
 */

/** @typedef {{ correlations: string, citations?: string[] }} ResearchBlock */

/** @type {Record<string, ResearchBlock>} */
export const PATTERN_RESEARCH_BLOCKS = {
  disagreeable_leader: {
    correlations:
      'Meta-analytic work links very low Agreeableness facets to elevations on NPD-relevant profiles (e.g., low modesty, low straightforwardness, low compliance). High assertiveness combined with low cooperation is also the "Leader" quadrant on some NEO interpretive style graphs. None of this is a diagnosis — it situates a common pattern in the research literature.',
    citations: ['Samuel & Widiger 2008', 'ACER E×A style graphs', 'Speed 2017 (assertiveness intervention)'],
  },
  flag_A1_low: {
    correlations:
      'Low trust is the Agreeableness facet most strongly correlated with paranoid personality features in meta-analysis (r ≈ −.45). Again: the test measures typical-range self-reported trust, not clinical status.',
    citations: ['Samuel & Widiger 2008'],
  },
  flag_A2_low: {
    correlations:
      'Low straightforwardness correlates negatively with traits tapped in narcissistic, antisocial, and paranoid personality constructs in meta-analytic work (e.g., r ≈ −.31 to −.37). These are statistical associations in research samples, not labels for individuals.',
    citations: ['Samuel & Widiger 2008'],
  },
  flag_C4_high: {
    correlations:
      'Very high achievement-striving is a facet-level feature in profiles associated with obsessive–compulsive personality style in some taxometric work (e.g., correlation with OCPD-relevant scores around r ≈ .25 in a meta-analytic frame). The IPIP-NEO manual itself warns that extreme C4 can reflect work preoccupation.',
    citations: ['Samuel & Widiger 2008', 'Johnson 2014 (IPIP-NEO)'],
  },
};

/** v1 balance hints (curated) — see implementation plan */
export const PATTERN_BALANCE_HINTS = {
  disagreeable_leader:
    'What often balances this pattern: explicit agreements up front, slowing down to hear disagreement, and choosing moments to be overtly collaborative when stakes are relationship-heavy.',
  flag_A1_low:
    'What often helps: testing mistrust against real data (small experiments, debriefs with trusted colleagues), and separating prudent caution from story-making.',
  flag_A2_low:
    'What often helps: naming trade-offs early, owning self-interest transparently, and building relationships where directness is safe.',
  flag_C4_high:
    'What often helps: scheduling recovery and relationships as first-class commitments, and delegating or lowering the bar where "good enough" truly is.',
};

/**
 * @param {string} ruleId
 * @returns {ResearchBlock | null}
 */
export function getPatternResearchBlock(ruleId) {
  return PATTERN_RESEARCH_BLOCKS[ruleId] ?? null;
}

/**
 * @param {string} ruleId
 * @returns {string | null}
 */
export function getPatternBalanceHint(ruleId) {
  return PATTERN_BALANCE_HINTS[ruleId] ?? null;
}

/**
 * Flat research paragraph for UI (correlations + optional citations line).
 * @param {string} ruleId
 * @returns {string | null}
 */
export function formatResearchAppendix(ruleId) {
  const b = getPatternResearchBlock(ruleId);
  if (!b) return null;
  const cite =
    b.citations && b.citations.length > 0 ? ` Sources: ${b.citations.join('; ')}.` : '';
  return `${b.correlations}${cite}`;
}
