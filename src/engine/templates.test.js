import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreProfile } from './scoring.js';
import { getDomainText } from './templates.js';

function profileWithN(rawN) {
  const base = {};
  for (const d of ['N', 'E', 'O', 'A', 'C']) {
    for (let i = 1; i <= 6; i++) base[d + i] = 12;
  }
  Object.assign(base, rawN);
  return scoreProfile(base);
}

test('N domain surfaces low Self-Consciousness vs elevated other N facets', () => {
  const profile = profileWithN({ N1: 13, N2: 13, N3: 13, N4: 7, N6: 13 });
  const text = getDomainText(
    'N',
    profile.domains.N,
    profile.percentiles,
    profile.domains,
    profile.scatter,
    null,
  );
  assert.match(text, /Self-Consciousness/i);
  assert.match(text, /only about 10 out of 100/i);
  assert.match(text, /social-evaluative/i);
  assert.ok(!/across the board/i.test(text));
});

test('N domain shape note does not fire when all N facets are uniformly low', () => {
  const profile = profileWithN({ N1: 8, N2: 8, N3: 8, N4: 7, N6: 8 });
  const text = getDomainText(
    'N',
    profile.domains.N,
    profile.percentiles,
    profile.domains,
    profile.scatter,
    null,
  );
  assert.ok(!text.includes('The facet breakdown sharpens this'));
});
