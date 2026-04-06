/**
 * IPIP-NEO-120 interpretive metadata (instrument-scoped).
 */

import {
  NORMS,
  DOMAIN_FACETS,
  getLowReliabilityFacetCodes,
} from '../normative-data.js';

export const INSTRUMENT_ID = 'ipip-neo-120';

/** Facets that may show observer / self-presentation divergence notes (v1). */
export const OBSERVER_VULNERABLE_FACETS = new Set([
  'A1', 'A2', 'A3', 'A5', 'A6', 'N2', 'C5', 'E3',
]);

/**
 * Named Openness channels: multi-facet or interpretively grouped only.
 * O4 (Adventurousness) is a strong domain-level facet, not a channel bucket.
 */
export const OPENNESS_CHANNELS = {
  aesthetic: ['O1', 'O2'],
  cognitive: ['O5'],
  values: ['O6'],
};

/** Weak / ambiguous vs broad Openness — exploratory facet register. */
export const OPENNESS_AMBIGUOUS_FACETS = new Set(['O3']);

/** balanceFacetRefs eligibility: silver or gold only. */
export const BALANCE_FACET_MIN_CONFIDENCE = 'silver';

export function getInstrumentConfig() {
  return {
    id: INSTRUMENT_ID,
    norms: NORMS,
    lowReliabilityFacets: new Set(getLowReliabilityFacetCodes()),
    domainFacets: DOMAIN_FACETS,
    opennessChannels: OPENNESS_CHANNELS,
    opennessAmbiguousFacets: OPENNESS_AMBIGUOUS_FACETS,
    observerVulnerableFacets: OBSERVER_VULNERABLE_FACETS,
    balanceFacetMinConfidence: BALANCE_FACET_MIN_CONFIDENCE,
  };
}
