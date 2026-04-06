/**
 * Rhetorical signal class + prose register (domain scatter aware).
 * Spec: within-domain scatter >= threshold forces domain copy to hedged minimum
 * so lumpy profiles never read as flat "direct" summaries.
 */

import { getConfidenceTier } from '../normative-data.js';

/** Matches rules like `domain_scatter_O` (ACER / Costa & McCrae scatter callouts). */
export const DOMAIN_SCATTER_HEDGE_THRESHOLD = 45;

export function domainRhetoricalSignalClass(scatter) {
  if (scatter >= DOMAIN_SCATTER_HEDGE_THRESHOLD) return 'supporting';
  return 'core';
}

/**
 * Maps rhetorical signal to default prose register (domain-level).
 */
export function proseRegisterForRhetorical(rhetoricalSignalClass) {
  if (rhetoricalSignalClass === 'core') return 'direct';
  if (rhetoricalSignalClass === 'supporting') return 'hedged';
  return 'exploratory';
}

/**
 * Domain paragraph register from scatter (no facet inheritance).
 */
export function domainProseRegisterFromScatter(scatter) {
  const rhet = domainRhetoricalSignalClass(scatter);
  return proseRegisterForRhetorical(rhet);
}

/**
 * Facet row register — independent from domain (no inheritance).
 */
export function facetProseRegister(facetCode, confidenceTier, instrumentConfig) {
  if (confidenceTier === 'caution') return 'exploratory';
  if (instrumentConfig.opennessAmbiguousFacets?.has(facetCode)) return 'exploratory';
  if (confidenceTier === 'bronze') return 'hedged';
  return 'direct';
}

const TIER_RANK = { gold: 3, silver: 2, bronze: 1, caution: 0 };

/**
 * Channel-specific rhetorical class: e.g. cognitive (O5) can stay `core` while
 * the Openness domain stays hedged due to high scatter across other facets.
 */
export function channelRhetoricalSignalClass(facetCodes, percentiles) {
  let minRank = 99;
  for (const f of facetCodes) {
    const t = getConfidenceTier(f);
    minRank = Math.min(minRank, TIER_RANK[t] ?? 0);
    if (t === 'caution') return 'tentative';
    const p = percentiles[f];
    if (p === null || p === undefined) return 'tentative';
  }
  const anyExtreme = facetCodes.some((f) => {
    const p = percentiles[f];
    return p >= 85 || p <= 15;
  });
  if (minRank >= TIER_RANK.silver && anyExtreme) return 'core';
  if (minRank >= TIER_RANK.bronze) return 'supporting';
  return 'tentative';
}
