/**
 * UNSTUCK — Normative Data Module
 *
 * Means, SDs, and α from Kajonius & Johnson (2019), N=320,128
 * Source: Appendix Table A1, "Assessing the Structure of the Five Factor Model
 * of Personality (IPIP-NEO-120) in the public domain"
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC7871748/
 *
 * Scale: 4 (min) to 20 (max) per facet
 *
 * NOTE: Overall norms (combined age/gender). v0.6: age×gender stratified norms.
 */

export const NORMS = {
  N1: { mean: 12.07, sd: 3.77, alpha: 0.79, label: 'Anxiety' },
  N2: { mean: 11.51, sd: 4.11, alpha: 0.87, label: 'Anger' },
  N3: { mean: 9.35, sd: 3.87, alpha: 0.85, label: 'Depression' },
  N4: { mean: 11.69, sd: 3.64, alpha: 0.72, label: 'Self-Consciousness' },
  N5: { mean: 11.94, sd: 3.44, alpha: 0.72, label: 'Immoderation' },
  N6: { mean: 10.07, sd: 3.63, alpha: 0.78, label: 'Vulnerability' },

  E1: { mean: 14.48, sd: 3.6, alpha: 0.81, label: 'Friendliness' },
  E2: { mean: 12.36, sd: 4.02, alpha: 0.8, label: 'Gregariousness' },
  E3: { mean: 14.56, sd: 3.43, alpha: 0.86, label: 'Assertiveness' },
  E4: { mean: 12.84, sd: 3.15, alpha: 0.71, label: 'Activity Level' },
  E5: { mean: 12.52, sd: 3.32, alpha: 0.74, label: 'Excitement-Seeking' },
  E6: { mean: 15.35, sd: 3.2, alpha: 0.8, label: 'Cheerfulness' },

  O1: { mean: 14.6, sd: 3.41, alpha: 0.75, label: 'Imagination' },
  O2: { mean: 14.67, sd: 3.58, alpha: 0.75, label: 'Artistic Interests' },
  O3: { mean: 15.2, sd: 3.01, alpha: 0.66, label: 'Emotionality' },
  O4: { mean: 12.28, sd: 3.26, alpha: 0.71, label: 'Adventurousness' },
  O5: { mean: 14.5, sd: 3.55, alpha: 0.74, label: 'Intellect' },
  O6: { mean: 11.03, sd: 3.67, alpha: 0.69, label: 'Liberalism' },

  A1: { mean: 13.43, sd: 3.54, alpha: 0.86, label: 'Trust' },
  A2: { mean: 16.63, sd: 2.88, alpha: 0.74, label: 'Morality' },
  A3: { mean: 16.72, sd: 2.56, alpha: 0.73, label: 'Altruism' },
  A4: { mean: 15.1, sd: 3.49, alpha: 0.69, label: 'Cooperation' },
  A5: { mean: 12.34, sd: 3.35, alpha: 0.72, label: 'Modesty' },
  A6: { mean: 15.03, sd: 3.1, alpha: 0.73, label: 'Sympathy' },

  C1: { mean: 16.32, sd: 2.4, alpha: 0.77, label: 'Self-Efficacy' },
  C2: { mean: 13.23, sd: 4.31, alpha: 0.85, label: 'Orderliness' },
  C3: { mean: 16.32, sd: 2.57, alpha: 0.67, label: 'Dutifulness' },
  C4: { mean: 16.06, sd: 3.09, alpha: 0.78, label: 'Achievement-Striving' },
  C5: { mean: 14.07, sd: 3.16, alpha: 0.72, label: 'Self-Discipline' },
  C6: { mean: 13.68, sd: 4.09, alpha: 0.88, label: 'Cautiousness' },
};

/** Domain score = mean of 6 facet raw scores (4–20 each); M and SD from Table A1 domain rows. */
export const DOMAIN_NORMS = {
  N: { mean: 11.1, sd: 2.66, label: 'Neuroticism' },
  E: { mean: 13.69, sd: 2.36, label: 'Extraversion' },
  O: { mean: 13.71, sd: 2.06, label: 'Openness to Experience' },
  A: { mean: 14.87, sd: 2.01, label: 'Agreeableness' },
  C: { mean: 14.95, sd: 2.34, label: 'Conscientiousness' },
};

export const DOMAIN_FACETS = {
  N: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'],
  E: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
  O: ['O1', 'O2', 'O3', 'O4', 'O5', 'O6'],
  A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
  C: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
};

/** α &lt; 0.70 — lowest tier; facets still scored and used everywhere. */
export function getConfidenceTier(facet) {
  const a = NORMS[facet]?.alpha || 0;
  if (a >= 0.83) return 'gold';
  if (a >= 0.75) return 'silver';
  if (a >= 0.7) return 'bronze';
  return 'caution';
}

export function getLowReliabilityFacetCodes() {
  return Object.keys(NORMS).filter((code) => getConfidenceTier(code) === 'caution');
}
