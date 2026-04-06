/**
 * UNSTUCK — Rule Engine Module
 * 
 * 25 priority rules for v0.5:
 * - 15 cross-connection rules (facet-level combinations)
 * - 10 single-facet flag rules (extreme individual scores)
 * 
 * Each rule: id, facets used, condition, priority, category, source
 *
 * All sources documented. No extrapolation.
 */

import { getConfidenceTier } from './normative-data.js';

const TIER_RANK = { gold: 3, silver: 2, bronze: 1, caution: 0 };

/**
 * Compute the confidence tier for a rule (= weakest facet tier)
 */
function ruleTier(facets) {
  let worst = 'gold';
  for (const f of facets) {
    const t = getConfidenceTier(f);
    if ((TIER_RANK[t] ?? -1) < TIER_RANK[worst]) worst = t;
  }
  return worst;
}

/**
 * Compute rule score for ranking
 * Higher = more impactful, more confident, more extreme
 */
function computeScore(rule, percentiles) {
  const priority = rule.priority || 5;
  const conf = ruleTier(rule.facets);
  const confBonus = { gold: 20, silver: 10, bronze: 0, caution: 0 }[conf] ?? 0;
  
  // Max deviation from 50 across the rule's facets
  const deviations = rule.facets
    .map(f => percentiles[f])
    .filter(p => p !== null)
    .map(p => Math.abs(p - 50));
  const maxDev = deviations.length > 0 ? Math.max(...deviations) : 0;
  const devBonus = Math.min(30, maxDev);
  
  // Type bonus: cross-connections are most valuable for teasers
  const typeBonus = { cross: 25, flag: 15, style: 10, conditional: 5 }[rule.category] || 0;
  
  return (10 - priority) * 10 + confBonus + devBonus + typeBonus;
}

// ============================================================
// RULE DEFINITIONS
// ============================================================

export const RULES = [

  // ──────────────────────────────────────────────
  // CROSS-CONNECTION RULES (15 rules)
  // ──────────────────────────────────────────────

  {
    id: 'engine_no_steering',
    facets: ['C4', 'C2', 'C6'],
    category: 'cross',
    priority: 1,
    source: 'Johnson 2014 (C4 extreme warning); ACER N×C Style Graph',
    condition: (P) => P.C4 >= 90 && P.C2 <= 35 && P.C6 <= 20,
    template: 'engine_no_steering',
  },
  {
    id: 'confident_worrier',
    facets: ['N1', 'N4'],
    category: 'cross',
    priority: 2,
    source: 'Costa & McCrae 1995; NEO PI-3 Problems in Living',
    condition: (P) => P.N1 >= 75 && P.N4 <= 30,
  },
  {
    id: 'pragmatic_idealist',
    facets: ['A3', 'A2'],
    category: 'cross',
    priority: 2,
    source: 'NEO PI-3 Problems in Living; Coker et al. 2002',
    condition: (P) => P.A3 >= 75 && P.A2 <= 25,
  },
  {
    id: 'opposing_forces',
    facets: ['N1', 'E5'],
    category: 'cross',
    priority: 3,
    source: 'PMC6838776 Fearless Dominance study',
    condition: (P) => P.N1 >= 75 && P.E5 >= 75,
  },
  {
    id: 'disagreeable_leader',
    facets: ['E3', 'A4', 'A2'],
    category: 'cross',
    priority: 3,
    source: 'Peterson Understand Myself; ACER E×A Style Graph; Coker et al. 2002',
    condition: (P) => P.E3 >= 80 && P.A4 <= 35 && P.A2 <= 25,
  },
  {
    id: 'burnout_setup',
    facets: ['C5', 'N1'],
    category: 'cross',
    priority: 3,
    source: 'PMC8980698 — burnout vs work engagement meta-analysis',
    condition: (P) => P.C5 >= 75 && P.N1 >= 75,
  },
  {
    id: 'altruism_breaks_pattern',
    facets: ['A3', 'A2', 'A4'],
    category: 'cross',
    priority: 4,
    source: 'Samuel & Widiger 2008 narcissistic PD profile',
    condition: (P) => P.A3 >= 75 && P.A2 <= 30 && P.A4 <= 35,
  },
  {
    id: 'hypersensitive_to_adaptive',
    facets: ['N1', 'O1', 'O5'],
    category: 'cross',
    priority: 2,
    source: 'ACER N×O Style Graph (Hypersensitive → Adaptive)',
    condition: (P, D) => P.N1 >= 70 && D.O >= 70,
  },
  {
    id: 'domain_scatter_C',
    facets: ['C4', 'C5', 'C2', 'C6'],
    category: 'cross',
    priority: 4,
    source: 'Costa & McCrae 1995 — within-domain scatter',
    condition: (P, D, S) => S.C >= 45,
  },
  {
    id: 'domain_scatter_N',
    facets: ['N1', 'N2', 'N3', 'N4', 'N6'],
    category: 'cross',
    priority: 4,
    source: 'Costa & McCrae 1995 — within-domain scatter',
    condition: (P, D, S) => S.N >= 45,
  },
  {
    id: 'domain_scatter_A',
    facets: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
    category: 'cross',
    priority: 4,
    source: 'Costa & McCrae 1995 — within-domain scatter',
    condition: (P, D, S) => S.A >= 45,
  },
  {
    id: 'doormat_risk',
    facets: ['A4', 'E3', 'A5'],
    category: 'cross',
    priority: 3,
    source: 'NEO PI-3 Problems in Living; Coker et al. 2002 (dependent features)',
    condition: (P) => P.A4 >= 80 && P.E3 <= 25 && P.A5 >= 75,
  },
  {
    id: 'social_withdrawal',
    facets: ['E2', 'E1', 'N4'],
    category: 'cross',
    priority: 3,
    source: 'Samuel & Widiger 2008 (avoidant profile); ACER Style Graph',
    condition: (P) => P.E2 <= 20 && P.E1 <= 25 && P.N4 >= 75,
  },
  {
    id: 'underachiever',
    facets: ['O5', 'C2', 'C6'],
    category: 'cross',
    priority: 3,
    source: 'Peterson: "Open, unconscientious people tend to be underachievers"',
    condition: (P, D) => D.O >= 70 && P.C2 <= 30 && P.C6 <= 30,
  },
  {
    id: 'creative_interactor',
    facets: ['E3', 'O5'],
    category: 'cross',
    priority: 5,
    source: 'ACER E×O Style Graph; Peterson conditional',
    condition: (P, D) => D.E >= 65 && D.O >= 65,
  },

  // ──────────────────────────────────────────────
  // SINGLE-FACET FLAG RULES (10 rules)
  // Fire when ANY facet is extreme (≥85th or ≤15th)
  // These are the "classics" — always relevant
  // ──────────────────────────────────────────────

  {
    id: 'flag_N1_high',
    facets: ['N1'],
    category: 'flag',
    priority: 3,
    source: 'Johnson IPIP-NEO; NEO PI-3 Problems in Living',
    condition: (P) => P.N1 >= 85,
  },
  {
    id: 'flag_N3_high',
    facets: ['N3'],
    category: 'flag',
    priority: 2,
    source: 'Johnson IPIP-NEO; NEO PI-3 Problems in Living',
    condition: (P) => P.N3 >= 85,
  },
  {
    id: 'flag_E3_low',
    facets: ['E3'],
    category: 'flag',
    priority: 3,
    source: 'Johnson IPIP-NEO; NEO PI-3 Problems in Living',
    condition: (P) => P.E3 <= 15,
  },
  {
    id: 'flag_C5_low',
    facets: ['C5'],
    category: 'flag',
    priority: 2,
    source: 'Johnson IPIP-NEO; NEO PI-3 Problems in Living',
    condition: (P) => P.C5 <= 15,
  },
  {
    id: 'flag_C2_low',
    facets: ['C2'],
    category: 'flag',
    priority: 4,
    source: 'Johnson IPIP-NEO; Coker et al. 2002',
    condition: (P) => P.C2 <= 15,
  },
  {
    id: 'flag_A2_low',
    facets: ['A2'],
    category: 'flag',
    priority: 3,
    source: 'NEO PI-3 Problems in Living; Coker et al. 2002',
    condition: (P) => P.A2 <= 15,
  },
  {
    id: 'flag_A1_low',
    facets: ['A1'],
    category: 'flag',
    priority: 4,
    source: 'NEO PI-3 Problems in Living; Samuel & Widiger 2008',
    condition: (P) => P.A1 <= 15,
  },
  {
    id: 'flag_N6_high',
    facets: ['N6'],
    category: 'flag',
    priority: 3,
    source: 'NEO PI-3 Problems in Living',
    condition: (P) => P.N6 >= 85,
  },
  {
    id: 'flag_C4_high',
    facets: ['C4'],
    category: 'flag',
    priority: 4,
    source: 'Johnson 2014 (explicit extreme warning)',
    condition: (P) => P.C4 >= 90,
  },
  {
    id: 'flag_E5_high',
    facets: ['E5'],
    category: 'flag',
    priority: 4,
    source: 'Johnson IPIP-NEO; NEO PI-3 Problems in Living',
    condition: (P) => P.E5 >= 85,
  },
];

/**
 * Evaluate all rules against a scored profile
 * @param {Object} profile - Output from scoreProfile()
 * @returns {Array} Fired rules, sorted by score descending
 */
export function evaluateRules(profile) {
  const { percentiles: P, domains: D, scatter: S } = profile;
  const fired = [];
  
  for (const rule of RULES) {
    // Skip if any required facet has null percentile
    if (rule.facets.some(f => P[f] === null || P[f] === undefined)) continue;
    
    // Evaluate condition
    try {
      if (rule.condition(P, D, S)) {
        const conf = ruleTier(rule.facets);
        const score = computeScore(rule, P);
        fired.push({
          id: rule.id,
          facets: rule.facets,
          category: rule.category,
          priority: rule.priority,
          confidence: conf,
          score: score,
          source: rule.source,
          template: rule.template || rule.id,
        });
      }
    } catch (e) {
      // Rule condition error — skip silently
      console.warn(`Rule ${rule.id} condition error:`, e);
    }
  }
  
  // Sort by score descending
  fired.sort((a, b) => b.score - a.score);
  
  return fired;
}

/**
 * Select top 3 teasers from fired rules
 * - Prefer cross-connections over single flags
 * - Diversity: max 2 from same primary domain
 * - If fewer than 3 cross-connections, fill with flags
 */
export function selectTeasers(firedRules, maxTeasers = 3) {
  const teasers = [];
  const domainCount = {};
  
  // First pass: cross-connections only
  for (const rule of firedRules) {
    if (teasers.length >= maxTeasers) break;
    if (rule.category !== 'cross') continue;
    
    const primaryDom = rule.facets[0][0]; // 'N', 'E', 'O', 'A', 'C'
    domainCount[primaryDom] = (domainCount[primaryDom] || 0) + 1;
    
    if (domainCount[primaryDom] <= 2) {
      teasers.push(rule);
    }
  }
  
  // Second pass: fill with flags if needed
  if (teasers.length < maxTeasers) {
    for (const rule of firedRules) {
      if (teasers.length >= maxTeasers) break;
      if (rule.category !== 'flag') continue;
      if (teasers.some(t => t.id === rule.id)) continue;
      
      const primaryDom = rule.facets[0][0];
      domainCount[primaryDom] = (domainCount[primaryDom] || 0) + 1;
      
      if (domainCount[primaryDom] <= 2) {
        teasers.push(rule);
      }
    }
  }
  
  return teasers;
}
