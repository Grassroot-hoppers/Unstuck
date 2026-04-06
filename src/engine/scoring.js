/**
 * UNSTUCK — Scoring Module
 *
 * Raw facet scores (4–20) → percentiles via z-score vs normative data.
 */

import {
  NORMS,
  DOMAIN_NORMS,
  DOMAIN_FACETS,
  getConfidenceTier,
} from './normative-data.js';

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
  const y =
    1.0 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));

  return Math.round(50 * (1.0 + sign * y));
}

/**
 * @param {string} facet
 * @param {number} raw
 * @returns {number|null} Percentile 1–99, or null if facet unknown / bad raw
 */
export function rawToPercentile(facet, raw) {
  const norm = NORMS[facet];
  if (!norm || raw === undefined || raw === null) return null;

  const z = (raw - norm.mean) / norm.sd;
  let pct = normalCDF(z);
  return Math.max(1, Math.min(99, pct));
}

/**
 * @param {Object} rawScores — { N1..C6 } all 30 facets
 */
export function scoreProfile(rawScores) {
  const percentiles = {};
  for (const facet of Object.keys(NORMS)) {
    percentiles[facet] = rawToPercentile(facet, rawScores[facet]);
  }

  const scatter = {};
  const domainRaw = {};

  for (const [dom, facets] of Object.entries(DOMAIN_FACETS)) {
    const mean =
      facets.reduce((sum, f) => sum + rawScores[f], 0) / facets.length;
    domainRaw[dom] = mean;

    const validPcts = facets
      .map((f) => percentiles[f])
      .filter((p) => p !== null && p !== undefined);
    scatter[dom] =
      validPcts.length > 0
        ? Math.max(...validPcts) - Math.min(...validPcts)
        : 0;
  }

  const domainPercentiles = {};
  for (const [dom, raw] of Object.entries(domainRaw)) {
    const norm = DOMAIN_NORMS[dom];
    const z = (raw - norm.mean) / norm.sd;
    domainPercentiles[dom] = Math.max(1, Math.min(99, normalCDF(z)));
  }

  const lowReliabilityFacets = Object.keys(NORMS).filter(
    (code) => getConfidenceTier(code) === 'caution',
  );

  return {
    percentiles,
    domains: domainPercentiles,
    scatter,
    lowReliabilityFacets,
  };
}
