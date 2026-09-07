const test = require('node:test');
const assert = require('node:assert/strict');
const { sum } = require('./math');
test('sum adds positive and negative numbers', () => {
  assert.equal(sum(2, 3), 5);
  assert.equal(sum(-2, 3), 1);
  assert.equal(sum(0, 0), 0);
});
