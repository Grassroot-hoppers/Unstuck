/**
 * UNSTUCK — Scoring Module
 * 
 * Takes raw facet scores (4-20), converts to percentiles using
 * z-score transformation against published normative data.
 * 
 * No LLM. No API calls. Pure math.
 */

import { NORMS, DOMAIN_NORMS, REJECTED_FACETS, DOMAIN_FACETS } from './normative-data.js';

/**
 * Standard normal CDF approximation (Abramowitz & Stegun)
 * Converts z-score to percentile (0-100)
 */
function normalCDF(z) {
  if (z < -6) return 0;
  if (z > 6) return 1;
  
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return Math.round(50 * (1.0 + sign * y));
}

/**
 * Convert a single raw score to percentile using z-score method
 * @param {string} facet - Facet code (e.g., 'N1')
 * @param {number} raw - Raw score (4-20)
 * @returns {number|null} Percentile (1-99) or null if rejected
 */
export function rawToPercentile(facet, raw) {
  if (REJECTED_FACETS.has(facet)) return null;
  
  const norm = NORMS[facet];
  if (!norm) return null;
  
  const z = (raw - norm.mean) / norm.sd;
  let pct = normalCDF(z);
  
  // Clamp to 1-99 (never show 0th or 100th — those aren't meaningful)
  return Math.max(1, Math.min(99, pct));
}

/**
 * Score a complete profile
 * @param {Object} rawScores - { N1: 18, N2: 10, ... } all 30 facets
 * @returns {Object} Full scored profile
 */
export function scoreProfile(rawScores) {
  // 1. Convert all valid facets to percentiles
  const percentiles = {};
  const allFacets = Object.keys(NORMS);
  
  for (const facet of allFacets) {
    if (REJECTED_FACETS.has(facet)) {
      percentiles[facet] = null; // explicitly null for rejected
    } else {
      percentiles[facet] = rawToPercentile(facet, rawScores[facet]);
    }
  }
  
  // 2. Compute domain percentiles (mean of valid facet percentiles)
  const domains = {};
  for (const [dom, facets] of Object.entries(DOMAIN_FACETS)) {
    const validPcts = facets.map(f => percentiles[f]).filter(p => p !== null);
    domains[dom] = Math.round(validPcts.reduce((a, b) => a + b, 0) / validPcts.length);
  }
  
  // 3. Compute within-domain scatter (max - min of valid facet percentiles)
  const scatter = {};
  for (const [dom, facets] of Object.entries(DOMAIN_FACETS)) {
    const validPcts = facets.map(f => percentiles[f]).filter(p => p !== null);
    scatter[dom] = Math.max(...validPcts) - Math.min(...validPcts);
  }
  
  // 4. Compute domain percentile from domain mean raw score
  //    (alternative: use z-score on domain mean)
  const domainRaw = {};
  for (const [dom, facets] of Object.entries(DOMAIN_FACETS)) {
    const allDomFacets = dom === 'N' ? ['N1','N2','N3','N4','N5','N6'] :
                         dom === 'E' ? ['E1','E2','E3','E4','E5','E6'] :
                         dom === 'O' ? ['O1','O2','O3','O4','O5','O6'] :
                         dom === 'A' ? ['A1','A2','A3','A4','A5','A6'] :
                                       ['C1','C2','C3','C4','C5','C6'];
    const mean = allDomFacets.reduce((sum, f) => sum + rawScores[f], 0) / allDomFacets.length;
    domainRaw[dom] = mean;
  }
  
  // Domain percentiles using domain-level norms
  const domainPercentiles = {};
  for (const [dom, raw] of Object.entries(domainRaw)) {
    const norm = DOMAIN_NORMS[dom];
    const z = (raw - norm.mean) / norm.sd;
    domainPercentiles[dom] = Math.max(1, Math.min(99, normalCDF(z)));
  }
  
  return {
    percentiles,        // { N1: 87, N2: 38, ... null for rejected }
    domains: domainPercentiles,  // { N: 63, E: 92, ... }
    scatter,            // { N: 68, E: 55, ... }
    rejected: [...REJECTED_FACETS],
  };
}
