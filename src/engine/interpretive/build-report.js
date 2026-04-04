/**
 * Builds the typed InterpretiveReport object (deterministic).
 */

import { confidenceTierForFacet } from './tiers.js';
import {
  domainRhetoricalSignalClass,
  domainProseRegisterFromScatter,
  facetProseRegister,
  channelRhetoricalSignalClass,
} from './signal.js';
import { getInstrumentConfig } from '../instruments/ipip-neo-120.config.js';

const DOMAIN_CODES = ['N', 'E', 'O', 'A', 'C'];

const FACETS_BY_DOMAIN = {
  N: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'],
  E: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
  O: ['O1', 'O2', 'O3', 'O4', 'O5', 'O6'],
  A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
  C: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
};

/**
 * @param {object} opts
 * @param {object} opts.profile - output of scoreProfile()
 * @param {Record<string, number>} opts.rawScores
 * @param {ReturnType<typeof getInstrumentConfig>} [opts.instrumentConfig]
 * @param {Array<{id: string, facets: string[], category: string, confidence: string}>} opts.firedRules
 */
export function buildInterpretiveReport({
  profile,
  rawScores,
  instrumentConfig = getInstrumentConfig(),
  firedRules,
}) {
  const { percentiles: P, domains: D, scatter: S } = profile;

  const domains = {};
  const facetByCode = {};

  for (const dom of DOMAIN_CODES) {
    const scatter = S[dom] ?? 0;
    const signalClass = domainRhetoricalSignalClass(scatter);
    const proseRegister = domainProseRegisterFromScatter(scatter);

    const facets = FACETS_BY_DOMAIN[dom].map((facetCode) => {
      const confidenceTier = confidenceTierForFacet(facetCode);
      const fProse = facetProseRegister(facetCode, confidenceTier, instrumentConfig);
      const row = {
        facetCode,
        confidenceTier,
        proseRegister: fProse,
        observerVulnerable: instrumentConfig.observerVulnerableFacets.has(facetCode),
        percentile: P[facetCode],
      };
      facetByCode[facetCode] = row;
      return row;
    });

    domains[dom] = {
      domainCode: dom,
      domainPercentile: Math.round(D[dom]),
      scatter,
      signalClass,
      proseRegister,
      contexts: [],
      tradeOff: { upside: null, cost: null },
      narrativeSlots: {},
      facets,
    };
  }

  const opennessChannels = {};
  for (const [channelName, facetCodes] of Object.entries(instrumentConfig.opennessChannels)) {
    opennessChannels[channelName] = {
      key: channelName,
      facetCodes: [...facetCodes],
      signalClass: channelRhetoricalSignalClass(facetCodes, P),
    };
  }

  const patterns = firedRules.map((rule) => ({
    ruleId: rule.id,
    category: rule.category,
    confidenceTier: rule.confidence,
    ingredientFacetCodes: [...rule.facets],
    rhetoricalSignalClass: 'supporting',
    proseRegister: 'hedged',
    behavioral: {
      helps: '',
      backfires: '',
      balanceHint: '',
    },
    researchBlock: undefined,
  }));

  return {
    instrumentId: instrumentConfig.id,
    invariantDisclaimer: { textKey: 'big_five_descriptive_not_diagnostic' },
    facetByCode,
    domains,
    opennessChannels,
    patterns,
  };
}
