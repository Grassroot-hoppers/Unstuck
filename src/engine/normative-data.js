/**
 * UNSTUCK — Normative Data Module
 * 
 * Means and SDs from Kajonius & Johnson (2019), N=320,128
 * Source: Table A1, "Assessing the Structure of the Five Factor Model 
 * of Personality (IPIP-NEO-120) in the public domain"
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC7871748/
 * 
 * Scale: 4 (min) to 20 (max) per facet
 * 
 * NOTE: These are overall norms (combined age/gender).
 * v0.6 should use age×gender stratified norms from Johnson's 619K OSF dataset.
 * For v0.5, we use overall norms + z-score → percentile conversion.
 */

export const NORMS = {
  // Neuroticism facets
  N1: { mean: 12.07, sd: 3.77, alpha: 0.79, label: 'Anxiety' },
  N2: { mean: 11.51, sd: 4.11, alpha: 0.87, label: 'Anger' },
  N3: { mean:  9.35, sd: 3.87, alpha: 0.85, label: 'Depression' },
  N4: { mean: 11.69, sd: 3.64, alpha: 0.72, label: 'Self-Consciousness' },
  N5: { mean: 11.94, sd: 3.44, alpha: 0.72, label: 'Immoderation' },
  N6: { mean: 10.07, sd: 3.63, alpha: 0.78, label: 'Vulnerability' },

  // Extraversion facets
  E1: { mean: 14.48, sd: 3.60, alpha: 0.81, label: 'Friendliness' },
  E2: { mean: 12.36, sd: 4.02, alpha: 0.80, label: 'Gregariousness' },
  E3: { mean: 14.56, sd: 3.43, alpha: 0.86, label: 'Assertiveness' },
  E4: { mean: 12.84, sd: 3.15, alpha: 0.71, label: 'Activity Level' },
  E5: { mean: 13.45, sd: 3.58, alpha: 0.77, label: 'Excitement-Seeking' },
  E6: { mean: 14.40, sd: 3.49, alpha: 0.81, label: 'Cheerfulness' },

  // Openness facets
  O1: { mean: 14.02, sd: 3.53, alpha: 0.76, label: 'Imagination' },
  O2: { mean: 14.56, sd: 3.78, alpha: 0.76, label: 'Artistic Interests' },
  O3: { mean: 14.73, sd: 3.10, alpha: 0.69, label: 'Emotionality' },
  O4: { mean: 13.49, sd: 3.38, alpha: 0.72, label: 'Adventurousness' },
  O5: { mean: 14.42, sd: 3.43, alpha: 0.75, label: 'Intellect' },
  O6: { mean: 12.06, sd: 3.40, alpha: 0.64, label: 'Liberalism' },

  // Agreeableness facets
  A1: { mean: 13.67, sd: 3.60, alpha: 0.86, label: 'Trust' },
  A2: { mean: 14.52, sd: 3.16, alpha: 0.76, label: 'Morality' },
  A3: { mean: 15.45, sd: 2.91, alpha: 0.76, label: 'Altruism' },
  A4: { mean: 14.09, sd: 3.11, alpha: 0.73, label: 'Cooperation' },
  A5: { mean: 12.40, sd: 3.44, alpha: 0.76, label: 'Modesty' },
  A6: { mean: 15.34, sd: 2.84, alpha: 0.72, label: 'Sympathy' },

  // Conscientiousness facets
  C1: { mean: 14.62, sd: 2.89, alpha: 0.77, label: 'Self-Efficacy' },
  C2: { mean: 13.23, sd: 4.31, alpha: 0.85, label: 'Orderliness' },
  C3: { mean: 16.32, sd: 2.57, alpha: 0.67, label: 'Dutifulness' },
  C4: { mean: 16.06, sd: 3.09, alpha: 0.78, label: 'Achievement-Striving' },
  C5: { mean: 14.07, sd: 3.16, alpha: 0.72, label: 'Self-Discipline' },
  C6: { mean: 13.68, sd: 4.09, alpha: 0.88, label: 'Cautiousness' },
};

// Domain norms (computed from facet means/SDs in the paper)
// Domain score = mean of 6 facet raw scores (range 4-20)
export const DOMAIN_NORMS = {
  N: { mean: 11.10, sd: 2.66, label: 'Neuroticism' },
  E: { mean: 13.69, sd: 2.36, label: 'Extraversion' },
  O: { mean: 13.88, sd: 2.15, label: 'Openness to Experience' },
  A: { mean: 14.25, sd: 2.09, label: 'Agreeableness' },
  C: { mean: 14.66, sd: 2.36, label: 'Conscientiousness' },
};

// Rejected facets: alpha < .70
export const REJECTED_FACETS = new Set(['O6', 'O3', 'C3', 'E4', 'N5']);

// Confidence tiers based on alpha
export function getConfidenceTier(facet) {
  const a = NORMS[facet]?.alpha || 0;
  if (a >= 0.83) return 'gold';
  if (a >= 0.75) return 'silver';
  if (a >= 0.70) return 'bronze';
  return 'rejected';
}

// Valid facets grouped by domain
export const DOMAIN_FACETS = {
  N: ['N1', 'N2', 'N3', 'N4', 'N6'],        // N5 rejected
  E: ['E1', 'E2', 'E3', 'E5', 'E6'],        // E4 rejected
  O: ['O1', 'O2', 'O4', 'O5'],              // O3, O6 rejected
  A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],  // none rejected
  C: ['C1', 'C2', 'C4', 'C5', 'C6'],        // C3 rejected
};
