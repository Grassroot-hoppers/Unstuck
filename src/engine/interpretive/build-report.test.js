import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildInterpretiveReport } from './build-report.js';
import { scoreProfile } from '../scoring.js';
import { evaluateRules } from '../rules.js';
import { getInstrumentConfig } from '../instruments/ipip-neo-120.config.js';

function uniformRaw(value) {
  const raw = {};
  for (const code of [
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6',
    'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
    'O1', 'O2', 'O3', 'O4', 'O5', 'O6',
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
  ]) {
    raw[code] = value;
  }
  return raw;
}

test('O4 is not placed inside any opennessChannels bucket', () => {
  const raw = uniformRaw(14);
  const profile = scoreProfile(raw);
  const fired = evaluateRules(profile);
  const report = buildInterpretiveReport({
    profile,
    rawScores: raw,
    instrumentConfig: getInstrumentConfig(),
    firedRules: fired,
  });
  assert.ok(report.opennessChannels);
  assert.ok(!('experiential' in report.opennessChannels));
  assert.deepEqual(report.opennessChannels.aesthetic.facetCodes.slice().sort(), ['O1', 'O2']);
  assert.deepEqual(report.opennessChannels.cognitive.facetCodes.slice().sort(), ['O5']);
  assert.deepEqual(report.opennessChannels.values.facetCodes.slice().sort(), ['O6']);
  const oFacets = report.domains.O.facets.map((f) => f.facetCode);
  assert.ok(oFacets.includes('O4'));
});

test('high Openness scatter: cognitive channel signal + hedged domain prose', () => {
  const raw = uniformRaw(14);
  raw.O1 = 4;
  raw.O2 = 4;
  raw.O3 = 4;
  raw.O4 = 4;
  raw.O5 = 20;
  raw.O6 = 10;
  const profile = scoreProfile(raw);
  const scatterO = profile.scatter.O;
  assert.ok(
    scatterO >= 45,
    `expected O scatter >= 45 for regression guard, got ${scatterO}`,
  );
  const fired = evaluateRules(profile);
  const report = buildInterpretiveReport({
    profile,
    rawScores: raw,
    instrumentConfig: getInstrumentConfig(),
    firedRules: fired,
  });
  // O5 α = .74 (Table A1) → bronze tier; channel class is supporting unless minRank ≥ silver
  assert.equal(report.opennessChannels.cognitive.signalClass, 'supporting');
  assert.equal(report.domains.O.proseRegister, 'hedged');
});

test('determinism: same inputs yield identical JSON for stable fields', () => {
  const raw = uniformRaw(14);
  raw.A1 = 4;
  raw.E3 = 20;
  const profile = scoreProfile(raw);
  const fired = evaluateRules(profile);
  const a = buildInterpretiveReport({
    profile,
    rawScores: raw,
    instrumentConfig: getInstrumentConfig(),
    firedRules: fired,
  });
  const b = buildInterpretiveReport({
    profile,
    rawScores: raw,
    instrumentConfig: getInstrumentConfig(),
    firedRules: fired,
  });
  assert.deepEqual(a, b);
});
