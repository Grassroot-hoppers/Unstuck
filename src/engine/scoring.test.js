import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreProfile, rawToPercentile } from './scoring.js';

test('all normed facets get numeric percentiles when raw present', () => {
  const raw = {};
  for (let i = 1; i <= 6; i++) {
    raw[`N${i}`] = 12;
    raw[`E${i}`] = 12;
    raw[`O${i}`] = 12;
    raw[`A${i}`] = 14;
    raw[`C${i}`] = 14;
  }
  const p = scoreProfile(raw);
  assert.ok(p.percentiles.N5 != null);
  assert.ok(p.percentiles.E4 != null);
  assert.ok(p.percentiles.O3 != null && p.percentiles.O6 != null);
  assert.ok(p.percentiles.C3 != null);
  assert.ok(p.percentiles.A4 != null);
});

test('domain raw is mean of six facets', () => {
  const raw = {};
  for (const k of [
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6',
    'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
    'O1', 'O2', 'O3', 'O4', 'O5', 'O6',
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
  ]) {
    raw[k] = 12;
  }
  raw.N1 = 18;
  raw.N2 = 18;
  raw.N3 = 18;
  raw.N4 = 18;
  raw.N5 = 18;
  raw.N6 = 6;
  const p = scoreProfile(raw);
  assert.equal(p.scatter.N > 0, true);
  assert.ok(typeof p.domains.N === 'number');
});

test('rawToPercentile returns null for unknown facet', () => {
  assert.equal(rawToPercentile('XX', 12), null);
});
