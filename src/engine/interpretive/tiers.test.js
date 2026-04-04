import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEligibleBalanceFacet, ruleWeakestTier } from './tiers.js';

test('balance facet eligibility requires silver or gold', () => {
  assert.equal(isEligibleBalanceFacet('gold'), true);
  assert.equal(isEligibleBalanceFacet('silver'), true);
  assert.equal(isEligibleBalanceFacet('bronze'), false);
  assert.equal(isEligibleBalanceFacet('rejected'), false);
});

test('ruleWeakestTier returns rejected if any ingredient is rejected-tier', () => {
  assert.equal(ruleWeakestTier(['N2', 'C3']), 'rejected');
});
