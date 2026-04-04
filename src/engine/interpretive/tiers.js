/**
 * Measurement tiers and rule-wide weakest tier (interpretive layer).
 */

import { getConfidenceTier } from '../normative-data.js';

const TIER_ORDER = { gold: 3, silver: 2, bronze: 1, rejected: 0 };

export function confidenceTierForFacet(facetCode) {
  return getConfidenceTier(facetCode);
}

/** Weakest measurement tier among rule ingredients (same spirit as rules.js ruleTier). */
export function ruleWeakestTier(facetCodes) {
  let worst = 'gold';
  for (const f of facetCodes) {
    const t = getConfidenceTier(f);
    if (t === 'rejected') return 'rejected';
    if (TIER_ORDER[t] < TIER_ORDER[worst]) worst = t;
  }
  return worst;
}

/** Silver or gold facets may appear in balanceFacetRefs; bronze/rejected may not. */
export function isEligibleBalanceFacet(tier) {
  return tier === 'gold' || tier === 'silver';
}
