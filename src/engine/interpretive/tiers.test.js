import test from 'node:test';
import assert from 'node:assert/strict';
import { ruleWeakestTier, isEligibleBalanceFacet } from './tiers.js';

test('isEligibleBalanceFacet excludes bronze and caution', () => {
  assert.equal(isEligibleBalanceFacet('gold'), true);
  assert.equal(isEligibleBalanceFacet('silver'), true);
  assert.equal(isEligibleBalanceFacet('bronze'), false);
  assert.equal(isEligibleBalanceFacet('caution'), false);
});

test('ruleWeakestTier returns caution if any ingredient is caution-tier', () => {
  assert.equal(ruleWeakestTier(['N2', 'C3']), 'caution');
});
